"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { InstructorLayout } from "@/components/instructor/instructor-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Search, Send, Clock, CheckCheck } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Message {
  id: string
  student_id: string
  student_name: string
  student_avatar?: string
  subject: string
  last_message: string
  created_at: string
  updated_at: string
  status: "unread" | "read" | "replied"
  message_count: number
}

interface Conversation {
  id: string
  messages: Array<{
    id: string
    sender: "student" | "instructor"
    content: string
    created_at: string
  }>
}

export default function InstructorMessages() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [replyText, setReplyText] = useState("")
  const [sendingReply, setSendingReply] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== "instructor")) {
      router.push(user ? "/dashboard" : "/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === "instructor") {
      fetchMessages()
    }
  }, [user])

  const fetchMessages = async () => {
    try {
      setLoadingData(true)
      const response = await fetch("/api/instructor/messages", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      } else {
        // Mock data fallback
        setMessages([
          {
            id: "1",
            student_id: "1",
            student_name: "Sarah Johnson",
            student_avatar: "/placeholder.svg?height=40&width=40",
            subject: "Question about hair styling technique",
            last_message: "Hi Betty, I'm having trouble with the curling technique from lesson 3. Could you help?",
            created_at: "2024-06-20T10:30:00Z",
            updated_at: "2024-06-20T10:30:00Z",
            status: "unread",
            message_count: 1,
          },
          {
            id: "2",
            student_id: "2",
            student_name: "Emily Chen",
            student_avatar: "/placeholder.svg?height=40&width=40",
            subject: "Thank you for the amazing course!",
            last_message: "Thank you so much for your detailed feedback on my practice photos!",
            created_at: "2024-06-19T14:20:00Z",
            updated_at: "2024-06-19T16:45:00Z",
            status: "replied",
            message_count: 3,
          },
          {
            id: "3",
            student_id: "3",
            student_name: "Jessica Martinez",
            student_avatar: "/placeholder.svg?height=40&width=40",
            subject: "Makeup product recommendations",
            last_message: "Could you recommend some affordable brushes for beginners?",
            created_at: "2024-06-18T09:15:00Z",
            updated_at: "2024-06-18T11:30:00Z",
            status: "read",
            message_count: 2,
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const fetchConversation = async (messageId: string) => {
    try {
      const response = await fetch(`/api/instructor/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setConversation(data)
      } else {
        // Mock conversation data
        setConversation({
          id: messageId,
          messages: [
            {
              id: "1",
              sender: "student",
              content: "Hi Betty, I'm having trouble with the curling technique from lesson 3. Could you help?",
              created_at: "2024-06-20T10:30:00Z",
            },
            {
              id: "2",
              sender: "instructor",
              content: "Hi Sarah! I'd be happy to help. Can you tell me specifically what part you're struggling with?",
              created_at: "2024-06-20T11:15:00Z",
            },
          ],
        })
      }
    } catch (error) {
      console.error("Error fetching conversation:", error)
      toast({
        title: "Error",
        description: "Failed to load conversation.",
        variant: "destructive",
      })
    }
  }

  const handleMessageSelect = (message: Message) => {
    setSelectedMessage(message)
    fetchConversation(message.id)

    // Mark as read if unread
    if (message.status === "unread") {
      setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, status: "read" } : m)))
    }
  }

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return

    try {
      setSendingReply(true)
      const response = await fetch(`/api/instructor/messages/${selectedMessage.id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: replyText }),
      })

      if (response.ok) {
        // Add message to conversation
        const newMessage = {
          id: Date.now().toString(),
          sender: "instructor" as const,
          content: replyText,
          created_at: new Date().toISOString(),
        }

        setConversation((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, newMessage],
              }
            : null,
        )

        // Update message status
        setMessages((prev) =>
          prev.map((m) =>
            m.id === selectedMessage.id
              ? { ...m, status: "replied", last_message: replyText, updated_at: new Date().toISOString() }
              : m,
          ),
        )

        setReplyText("")
        toast({
          title: "Success",
          description: "Reply sent successfully!",
        })
      } else {
        throw new Error("Failed to send reply")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSendingReply(false)
    }
  }

  if (loading || !user || user.role !== "instructor") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // Filter messages
  const filteredMessages = messages.filter(
    (message) =>
      message.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.last_message.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "read":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "replied":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  return (
    <InstructorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground">Communicate with your students</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              <MessageSquare className="mr-1 h-3 w-3" />
              {messages.filter((m) => m.status === "unread").length} Unread
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[500px] overflow-y-auto">
                  {loadingData ? (
                    <div className="space-y-2 p-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="flex items-center space-x-3 p-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-full"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredMessages.length > 0 ? (
                    <div className="space-y-1">
                      {filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 ${
                            selectedMessage?.id === message.id
                              ? "bg-muted border-l-amber-500"
                              : message.status === "unread"
                                ? "border-l-red-500"
                                : "border-l-transparent"
                          }`}
                          onClick={() => handleMessageSelect(message)}
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={message.student_avatar || "/placeholder.svg"}
                                alt={message.student_name}
                              />
                              <AvatarFallback className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                                {message.student_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-sm truncate">{message.student_name}</h4>
                                <div className="flex items-center gap-1">
                                  <Badge className={`${getStatusColor(message.status)} text-xs`}>
                                    {message.status}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(message.updated_at)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm font-medium text-muted-foreground truncate mb-1">
                                {message.subject}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{message.last_message}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {message.message_count} message{message.message_count !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No messages found</h3>
                      <p className="text-muted-foreground text-center">
                        {searchQuery ? "Try adjusting your search" : "Messages from students will appear here"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversation View */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              {selectedMessage ? (
                <>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={selectedMessage.student_avatar || "/placeholder.svg"}
                          alt={selectedMessage.student_name}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                          {selectedMessage.student_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{selectedMessage.student_name}</CardTitle>
                        <CardDescription>{selectedMessage.subject}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col h-[400px]">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {conversation?.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === "instructor" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.sender === "instructor" ? "bg-amber-500 text-white" : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <div className="flex items-center justify-end mt-2 gap-1">
                              <Clock className="h-3 w-3 opacity-70" />
                              <span className="text-xs opacity-70">{formatDate(msg.created_at)}</span>
                              {msg.sender === "instructor" && <CheckCheck className="h-3 w-3 opacity-70" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reply Input */}
                    <div className="border-t pt-4">
                      <div className="flex space-x-2">
                        <Textarea
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 min-h-[80px]"
                        />
                        <Button
                          onClick={handleSendReply}
                          disabled={!replyText.trim() || sendingReply}
                          className="self-end"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground text-center">
                    Choose a message from the list to start reading and replying
                  </p>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </InstructorLayout>
  )
}
