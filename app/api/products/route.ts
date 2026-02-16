import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import type { Product } from "@/lib/models"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const skip = Number.parseInt(searchParams.get("skip") || "0")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    const { db } = await connectToDatabase()

    const query: Record<string, unknown> = {}
    if (category) query.category = category

    const products = await db.collection<Product>("products").find(query).skip(skip).limit(limit).toArray()

    const total = await db.collection<Product>("products").countDocuments(query)

    return NextResponse.json(
      successResponse({
        products,
        total,
        skip,
        limit,
      }),
    )
  } catch (error) {
    console.error("[Products GET Error]", error)
    return NextResponse.json(errorResponse("Failed to fetch products"), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, stock, category, images,} = body

    if (!name || !description || !price || stock === undefined || !category ) {
      return NextResponse.json(errorResponse("Missing required fields"), { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection<Product>("products").insertOne({
      name,
      description,
      price,
      stock,
      category,
      images: images || [],
      rating: 0,
      reviews: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      successResponse(
        {
          id: result.insertedId,
          message: "Product created successfully",
        },
        "Product created",
      ),
      { status: 201 },
    )
  } catch (error) {
    console.error("[Products POST Error]", error)
    return NextResponse.json(errorResponse("Failed to create product"), { status: 500 })
  }
}
