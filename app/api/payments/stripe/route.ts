import { type NextRequest, NextResponse } from "next/server"
import stripe from "@/lib/stripe"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount } = await request.json()

    if (!orderId || !amount) {
      return NextResponse.json(errorResponse("Missing required fields"), { status: 400 })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        orderId,
      },
    })

    return NextResponse.json(
      successResponse({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
    )
  } catch (error) {
    console.error("[Stripe Payment Error]", error)
    return NextResponse.json(errorResponse("Payment initiation failed"), { status: 500 })
  }
}
