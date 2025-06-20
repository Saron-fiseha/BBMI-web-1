"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Search, Send } from "lucide-react"

export default function MessagesPage() {
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [activeContact, setActiveContact] = useState<string | null>("1")

  const contacts = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Instructor",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Let me know if you have any questions about the hair styling techniques.",
      time: "10:30 AM",
      unread: 0,
      online: true,
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Instructor",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Your makeup progress is looking great! Keep practicing.",
      time: "Yesterday",
      unread: 2,
      online: false,
    },
  ]

  const conversations: Record<string, Array<{ id: string; sender: string; text: string; time: string }>> = {
    "1": [
      { id: "m1", sender: "them", text: "Hi there! How are you enjoying the course so far?", time: "10:00 AM" },
      {
        id: "m2",
        sender: "me",
        text: "It's been great! I'm learning a lot about advanced hair styling techniques.",
        time: "10:05 AM",
      },
    ],
    "2": [
      {
        id: "m1",
        sender: "them",
        text: "Hello! I noticed your submission for the makeup assignment.",
        time: "Yesterday",
      },
      { id: "m2", sender: "them", text: "Your makeup progress is looking great! Keep practicing.", time: "Yesterday" },
    ],
  }

  const handleSendMessage = () => {
    if (!message.trim() || !activeContact) return
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    })
    setMessage("")
  }

  const activeContactData = contacts.find((contact) => contact.id === activeContact)
  const activeConversation = activeContact ? conversations[activeContact] || [] : []

  return (
    <div className="space-y-6">
      <DashboardHeader heading="Messages" text="Chat with instructors and support team." />
      <Card className="h-[calc(100vh-13rem)]">
        <CardContent className="p-0 h-full">
          <div className="grid md:grid-cols-[280px_1fr] h-full">
            <div className="border-r h-full flex flex-col">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search messages..." className="pl-8" />
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-start p-4 gap-3 cursor-pointer hover:bg-muted/50 ${
                      activeContact === contact.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setActiveContact(contact.id)}
                  >
                    <div className="relative">
                      <img
                        src={contact.avatar || "/placeholder.svg"}
                        alt={contact.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">{contact.name}</h3>
                        <span className="text-xs text-muted-foreground">{contact.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {activeContact ? (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b flex items-center">
                  <div className="relative mr-3">
                    <img
                      src={activeContactData?.avatar || "/placeholder.svg"}
                      alt={activeContactData?.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{activeContactData?.name}</h3>
                    <p className="text-xs text-muted-foreground">{activeContactData?.role}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 space-y-4">
                  {activeConversation.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${msg.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        <p>{msg.text}</p>
                        <p
                          className={`text-xs mt-1 ${msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button size="icon" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="font-medium mb-1">No conversation selected</h3>
                  <p className="text-sm text-muted-foreground">Choose a contact to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
