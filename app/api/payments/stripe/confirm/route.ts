import { type NextRequest, NextResponse } from "next/server"
import stripe from "@/lib/stripe"
import connectToDatabase from "@/lib/db"
import type { Order } from "@/lib/models"
import { successResponse, errorResponse } from "@/lib/api-response"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, orderId } = await request.json()

    if (!paymentIntentId || !orderId) {
      return NextResponse.json(errorResponse("Missing required fields"), { status: 400 })
    }

    // Verify payment intent status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(errorResponse("Payment not completed"), { status: 400 })
    }

    // Update order payment status
    const { db } = await connectToDatabase()
    await db.collection<Order>("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          paymentStatus: "completed",
          status: "processing",
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json(successResponse({ message: "Payment confirmed" }))
  } catch (error) {
    console.error("[Stripe Confirm Error]", error)
    return NextResponse.json(errorResponse("Payment confirmation failed"), { status: 500 })
  }
}
