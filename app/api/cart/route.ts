import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import type { Cart } from "@/lib/models"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(errorResponse("User ID required"), { status: 400 })
    }

    const { db } = await connectToDatabase()
    const cart = await db.collection<Cart>("carts").findOne({ userId })

    if (!cart) {
      return NextResponse.json(
        successResponse({
          items: [],
          subtotal: 0,
          tax: 0,
          total: 0,
        }),
      )
    }

    return NextResponse.json(successResponse(cart))
  } catch (error) {
    console.error("[Cart GET Error]", error)
    return NextResponse.json(errorResponse("Failed to fetch cart"), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(errorResponse("User ID required"), { status: 400 })
    }

    const { productId, quantity, price } = await request.json()

    if (!productId || !quantity || !price) {
      return NextResponse.json(errorResponse("Missing required fields"), { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Get existing cart or create new one
    let cart = await db.collection<Cart>("carts").findOne({ userId })

    if (!cart) {
      const result = await db.collection<Cart>("carts").insertOne({
        userId,
        items: [{ productId, quantity, price }],
        subtotal: price * quantity,
        tax: price * quantity * 0.1,
        total: price * quantity + price * quantity * 0.1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      cart = {
        _id: result.insertedId,
        userId,
        items: [{ productId, quantity, price }],
        subtotal: price * quantity,
        tax: price * quantity * 0.1,
        total: price * quantity + price * quantity * 0.1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find((item) => item.productId === productId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.items.push({ productId, quantity, price })
      }

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

      cart.subtotal = subtotal
      cart.tax = tax
      cart.total = total
      cart.updatedAt = new Date()
    }

    return NextResponse.json(successResponse(cart, "Item added to cart"))
  } catch (error) {
    console.error("[Cart POST Error]", error)
    return NextResponse.json(errorResponse("Failed to add to cart"), { status: 500 })
  }
}
