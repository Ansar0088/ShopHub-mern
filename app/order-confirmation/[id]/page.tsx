"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderConfirmationPage() {
  const params = useParams()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center py-20">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-center">
                <div className="text-4xl">✓</div>
              </div>
              <CardTitle className="text-center">Order Confirmed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">Thank you for your purchase!</p>
              <p className="text-sm text-foreground">
                Order ID: <strong>{params.id}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                You'll receive a confirmation email with order details shortly.
              </p>
              <p className="text-sm text-muted-foreground">
                Our support team will contact you via WhatsApp to confirm delivery details.
              </p>

              <div className="space-y-2 pt-4">
                <Link href="/shop">
                  <Button className="w-full">Continue Shopping</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
