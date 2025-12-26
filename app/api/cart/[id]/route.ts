import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import type { Cart } from "@/lib/models"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(errorResponse("User ID required"), { status: 400 })
    }

    const { id: productId } = await params
    const { db } = await connectToDatabase()

    const cart = await db.collection<Cart>("carts").findOne({ userId })
    if (!cart) {
      return NextResponse.json(errorResponse("Cart not found"), { status: 404 })
    }

    cart.items = cart.items.filter((item) => item.productId !== productId)

    // Recalculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.1
    const total = subtotal + tax

    await db.collection<Cart>("carts").updateOne(
      { userId },
      {
        $set: {
          items: cart.items,
          subtotal,
          tax,
          total,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json(successResponse({ items: cart.items, subtotal, tax, total }))
  } catch (error) {
    console.error("[Cart DELETE Error]", error)
    return NextResponse.json(errorResponse("Failed to remove item"), { status: 500 })
  }
}
