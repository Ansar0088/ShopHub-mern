"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/cart-context"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, subtotal, tax, total, removeItem, updateQuantity } = useCart()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-2xl font-bold text-foreground">Your Cart is Empty</h1>
            <p className="mt-2 text-muted-foreground">Add some products to get started!</p>
            <Link href="/shop" className="mt-6">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="border-b border-border bg-card px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        </div>

        <div className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="space-y-4 lg:col-span-2">
                {items.map((item) => (
                  <Card key={item.productId}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            −
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>

                        <span className="w-20 text-right font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>

                        <Button variant="destructive" size="sm" onClick={() => removeItem(item.productId)}>
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-foreground">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-lg font-bold text-foreground">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => router.push("/checkout")}>
                      Proceed to Checkout
                    </Button>

                    <Link href="/shop">
                      <Button variant="outline" className="w-full bg-transparent">
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
