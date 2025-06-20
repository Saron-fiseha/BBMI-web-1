"use client"

import type React from "react"
import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Download, Plus } from "lucide-react"

export default function BillingPage() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentMethods = [
    {
      id: "pm-1",
      type: "card",
      brand: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
      isDefault: true,
    },
  ]

  const invoices = [
    {
      id: "inv-1",
      courseTitle: "Advanced Hair Styling Techniques",
      amount: 299,
      date: "May 10, 2025",
      status: "paid",
    },
    {
      id: "inv-2",
      courseTitle: "Professional Makeup Artistry",
      amount: 349,
      date: "April 15, 2025",
      status: "paid",
    },
  ]

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "Payment method added",
        description: "Your payment method has been added successfully.",
      })
      setIsProcessing(false)
    } catch (error) {
      toast({
        title: "Error adding payment method",
        description: "There was an error adding your payment method. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const handleDownloadInvoice = (id: string) => {
    toast({
      title: "Invoice downloaded",
      description: "Your invoice has been downloaded successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <DashboardHeader heading="Billing & Payments" text="Manage your payment methods and view your invoices." />
      <Tabs defaultValue="payment-methods" className="space-y-6">
        <TabsList>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="payment-methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods.</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-muted p-2 rounded-md mr-4">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expMonth}/{method.expYear}
                            {method.isDefault && " • Default"}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">You don't have any payment methods saved yet.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Invoices</CardTitle>
              <CardDescription>View and download your payment history.</CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Course</th>
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Amount</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-right py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b">
                          <td className="py-3 px-2">{invoice.courseTitle}</td>
                          <td className="py-3 px-2">{invoice.date}</td>
                          <td className="py-3 px-2">${invoice.amount}</td>
                          <td className="py-3 px-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadInvoice(invoice.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">You don't have any invoices yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
