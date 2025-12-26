import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import type { Order, Cart } from "@/lib/models"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(errorResponse("User ID required"), { status: 400 })
    }

    const { db } = await connectToDatabase()
    const orders = await db.collection<Order>("orders").find({ userId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(successResponse(orders))
  } catch (error) {
    console.error("[Orders GET Error]", error)
    return NextResponse.json(errorResponse("Failed to fetch orders"), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(errorResponse("User ID required"), { status: 400 })
    }

    const { shippingAddress, paymentMethod } = await request.json()

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(errorResponse("Missing required fields"), { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Get user's cart
    const cart = await db.collection<Cart>("carts").findOne({ userId })
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(errorResponse("Cart is empty"), { status: 400 })
    }

    // Create order
    const result = await db.collection<Order>("orders").insertOne({
      userId,
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shippingCost: 10,
      total: cart.total + 10,
      status: "pending",
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Clear cart
    await db.collection<Cart>("carts").deleteOne({ userId })

    return NextResponse.json(
      successResponse(
        {
          orderId: result.insertedId,
          message: "Order created successfully",
        },
        "Order created",
      ),
      { status: 201 },
    )
  } catch (error) {
    console.error("[Orders POST Error]", error)
    return NextResponse.json(errorResponse("Failed to create order"), { status: 500 })
  }
}
