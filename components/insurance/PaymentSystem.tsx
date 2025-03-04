"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "react-hot-toast"

export default function PaymentSystem() {
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 10000,
    transactionId: "",
    paymentDate: "",
    smsAlertText: "",
  })
  const [subscriberId, setSubscriberId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchSubscriberId = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const { data, error } = await supabase
            .from("insurance_subscribers")
            .select("id")
            .eq("email", user.email)
            .single()

          if (error) throw error
          if (data) setSubscriberId(data.id)
        }
      } catch (error) {
        console.error("Error fetching subscriber ID:", error)
        toast.error("Failed to fetch subscriber information. Please try signing out and in again.")
      }
    }

    fetchSubscriberId()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPaymentDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!subscriberId) {
      toast.error("Please sign in to make a payment.")
      setIsLoading(false)
      return
    }

    if (!paymentDetails.smsAlertText.trim()) {
      toast.error("Please provide the bank SMS alert text for verification.")
      setIsLoading(false)
      return
    }

    try {
      // Process payment
      const { data, error } = await supabase.rpc("process_payment", {
        p_subscriber_id: subscriberId,
        p_amount: Number.parseFloat(paymentDetails.amount),
        p_transaction_id: paymentDetails.transactionId,
        p_payment_date: paymentDetails.paymentDate,
        p_sms_alert_text: paymentDetails.smsAlertText,
      })

      if (error) throw error

      toast.success("Payment processed successfully!")
      setPaymentDetails({
        amount: 10000,
        transactionId: "",
        paymentDate: "",
        smsAlertText: "",
      })
    } catch (error) {
      console.error("Error in payment process:", error)
      toast.error(`Error processing payment: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={paymentDetails.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="transactionId">Transaction ID</Label>
            <Input
              id="transactionId"
              name="transactionId"
              value={paymentDetails.transactionId}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="paymentDate">Payment Date</Label>
            <Input
              id="paymentDate"
              name="paymentDate"
              type="date"
              value={paymentDetails.paymentDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="smsAlertText">Bank SMS Alert Text</Label>
            <Textarea
              id="smsAlertText"
              name="smsAlertText"
              value={paymentDetails.smsAlertText}
              onChange={handleInputChange}
              placeholder="Paste the full text of the bank SMS alert here"
              rows={4}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading || !subscriberId} className="w-full">
            {isLoading ? "Processing..." : "Submit Payment Details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

