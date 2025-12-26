"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PaymentSelectorProps {
  orderId: string
  totalAmount: number
  phoneNumber: string
  onPaymentMethodSelect: (method: "stripe" | "whatsapp") => void
}

export function PaymentSelector({ orderId, totalAmount, phoneNumber, onPaymentMethodSelect }: PaymentSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<"stripe" | "whatsapp" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleStripePayment = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/payments/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: totalAmount,
        }),
      })

      if (response.ok) {
        onPaymentMethodSelect("stripe")
      }
    } catch (error) {
      console.error("[Stripe Setup Error]", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleWhatsAppPayment = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/payments/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          phoneNumber,
          totalAmount,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        window.open(data.data.whatsappLink, "_blank")
        onPaymentMethodSelect("whatsapp")
      }
    } catch (error) {
      console.error("[WhatsApp Setup Error]", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
        <CardDescription>Choose how you'd like to pay for your order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full"
          variant={selectedMethod === "stripe" ? "default" : "outline"}
          onClick={handleStripePayment}
          disabled={isProcessing}
        >
          {isProcessing && selectedMethod === "stripe" ? "Processing..." : "Pay with Card (Stripe)"}
        </Button>

        <Button
          className="w-full"
          variant={selectedMethod === "whatsapp" ? "default" : "outline"}
          onClick={handleWhatsAppPayment}
          disabled={isProcessing}
        >
          {isProcessing && selectedMethod === "whatsapp" ? "Processing..." : "Pay via WhatsApp"}
        </Button>

        <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
          <p>
            <strong>Stripe:</strong> Secure card payment processed instantly
          </p>
          <p className="mt-2">
            <strong>WhatsApp:</strong> Send order details to our support team for manual processing
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
