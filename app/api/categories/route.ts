import { db } from "@/lib/db"
import { ApiResponse } from "@/lib/api-response"
import type { Category } from "@/lib/models"

export async function GET() {
  try {
    const database = await db()
    const categoriesCollection = database.collection<Category>("categories")

    const categories = await categoriesCollection.find({ active: true }).sort({ createdAt: -1 }).toArray()

    return ApiResponse.success({ categories })
  } catch (error) {
    console.error("[Get Categories Error]", error)
    return ApiResponse.error("Failed to fetch categories", 500)
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, slug } = await request.json()

    const database = await db()
    const categoriesCollection = database.collection<Category>("categories")

    // Check if category with same slug exists
    const existing = await categoriesCollection.findOne({ slug })
    if (existing) {
      return ApiResponse.error("Category with this slug already exists", 400)
    }

    const newCategory: Category = {
      name,
      slug,
      description,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await categoriesCollection.insertOne(newCategory)

    return ApiResponse.success(
      { category: { _id: result.insertedId, ...newCategory } },
      "Category created successfully",
      201,
    )
  } catch (error) {
    console.error("[Create Category Error]", error)
    return ApiResponse.error("Failed to create category", 500)
  }
}
