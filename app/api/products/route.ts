import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import type { Product } from "@/lib/models"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10

    const skip = (page - 1) * limit

    const { db } = await connectToDatabase()

    let filter: any = {}

    if (category) {
      filter.category = category
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" }
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    const products = await db
      .collection<Product>("products")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection<Product>("products").countDocuments(filter)

    return NextResponse.json(
      successResponse({
        products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      })
    )
  } catch (error) {
    console.error("[Products GET Error]", error)
    return NextResponse.json(errorResponse("Failed to fetch products"), {
      status: 500,
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { db } = await connectToDatabase()

    const newProduct: Product = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      discountPrice: body.discountPrice
        ? Number(body.discountPrice)
        : undefined,
      stock: Number(body.stock),
      category: body.category,
      images: body.images || [],
      rating: 0,
      reviews: 0,
      specifications: body.specifications || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db
      .collection<Product>("products")
      .insertOne(newProduct)

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: result,
    })
  } catch (error) {
    console.error("[Product POST Error]", error)
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    )
  }
}
