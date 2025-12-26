import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import type { Product } from "@/lib/models"
import { successResponse, errorResponse } from "@/lib/api-response"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    const product = await db.collection<Product>("products").findOne({
      _id: new ObjectId(id),
    })

    if (!product) {
      return NextResponse.json(errorResponse("Product not found"), { status: 404 })
    }

    return NextResponse.json(successResponse(product))
  } catch (error) {
    console.error("[Product GET Error]", error)
    return NextResponse.json(errorResponse("Failed to fetch product"), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const { db } = await connectToDatabase()

    const result = await db.collection<Product>("products").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json(errorResponse("Product not found"), { status: 404 })
    }

    return NextResponse.json(successResponse(result, "Product updated"))
  } catch (error) {
    console.error("[Product PUT Error]", error)
    return NextResponse.json(errorResponse("Failed to update product"), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 })
    }

    const { id } = await params
    const { db } = await connectToDatabase()

    const result = await db.collection<Product>("products").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(errorResponse("Product not found"), { status: 404 })
    }

    return NextResponse.json(successResponse({ message: "Product deleted" }))
  } catch (error) {
    console.error("[Product DELETE Error]", error)
    return NextResponse.json(errorResponse("Failed to delete product"), { status: 500 })
  }
}
