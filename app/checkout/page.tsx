"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-provider"
import { PaymentSelector } from "@/components/payment-selector"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user, token } = useAuth()
  const [step, setStep] = useState(1)
  const [shippingData, setShippingData] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<"stripe" | "whatsapp" | null>(null)

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateOrder = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify({
          shippingAddress: shippingData,
          paymentMethod: "pending",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setOrderId(data.data.orderId)
        setStep(2)
      }
    } catch (error) {
      console.error("[Create Order Error]", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentComplete = async () => {
    clearCart()
    router.push(`/order-confirmation/${orderId}`)
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-foreground">Please log in to checkout</p>
            <Button className="mt-4" onClick={() => router.push("/auth/login")}>
              Go to Login
            </Button>
          </div>
        </div>
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-foreground">Your cart is empty</p>
            <Button className="mt-4" onClick={() => router.push("/shop")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="border-b border-border bg-card px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
        </div>

        <div className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        name="street"
                        value={shippingData.street}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={shippingData.city} onChange={handleShippingChange} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingData.state}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" name="zip" value={shippingData.zip} onChange={handleShippingChange} required />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={shippingData.country}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleCreateOrder} disabled={isSubmitting}>
                    {isSubmitting ? "Creating Order..." : "Continue to Payment"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <PaymentSelector
                  orderId={orderId}
                  totalAmount={total}
                  phoneNumber={user.phone || ""}
                  onPaymentMethodSelect={async (method) => {
                    setSelectedPayment(method)
                    setTimeout(handlePaymentComplete, 1000)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
