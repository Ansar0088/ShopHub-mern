import { ObjectId } from "mongodb"
import { db } from "@/lib/db"
import { ApiResponse } from "@/lib/api-response"
import type { Category } from "@/lib/models"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, description, slug, active } = await request.json()

    const database = await db()
    const categoriesCollection = database.collection<Category>("categories")

    const result = await categoriesCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          slug,
          description,
          active,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return ApiResponse.error("Category not found", 404)
    }

    return ApiResponse.success(null, "Category updated successfully")
  } catch (error) {
    console.error("[Update Category Error]", error)
    return ApiResponse.error("Failed to update category", 500)
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const database = await db()
    const categoriesCollection = database.collection<Category>("categories")

    const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return ApiResponse.error("Category not found", 404)
    }

    return ApiResponse.success(null, "Category deleted successfully")
  } catch (error) {
    console.error("[Delete Category Error]", error)
    return ApiResponse.error("Failed to delete category", 500)
  }
}
