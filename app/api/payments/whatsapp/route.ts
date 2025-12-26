import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import type { Order } from "@/lib/models"
import { successResponse, errorResponse } from "@/lib/api-response"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { orderId, phoneNumber, totalAmount } = await request.json()

    if (!orderId || !phoneNumber || !totalAmount) {
      return NextResponse.json(errorResponse("Missing required fields"), { status: 400 })
    }

    // Generate WhatsApp payment link/message
    const businessPhoneNumber = process.env.WHATSAPP_BUSINESS_PHONE || "1234567890"
    const encodedMessage = encodeURIComponent(
      `Hi, I'd like to pay for order ${orderId}. Total amount: $${totalAmount}. Please confirm payment details.`,
    )

    const whatsappLink = `https://wa.me/${businessPhoneNumber}?text=${encodedMessage}`

    // Update order status
    const { db } = await connectToDatabase()
    await db.collection<Order>("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          paymentStatus: "pending",
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json(
      successResponse({
        whatsappLink,
        message: "WhatsApp payment link generated",
      }),
    )
  } catch (error) {
    console.error("[WhatsApp Payment Error]", error)
    return NextResponse.json(errorResponse("WhatsApp payment initiation failed"), { status: 500 })
  }
}
