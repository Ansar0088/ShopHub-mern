import connectToDatabase from "./db"
import type { Product } from "./models"
import { ObjectId } from "mongodb"

export async function getProducts(category?: string, skip = 0, limit = 12) {
  const { db } = await connectToDatabase()
  const query: Record<string, unknown> = {}
  if (category) query.category = category

  const products = await db.collection<Product>("products").find(query).skip(skip).limit(limit).toArray()

  const total = await db.collection<Product>("products").countDocuments(query)
  return { products, total }
}

export async function getProductById(id: string) {
  const { db } = await connectToDatabase()
  return db.collection<Product>("products").findOne({
    _id: new ObjectId(id),
  })
}

export async function searchProducts(query: string) {
  const { db } = await connectToDatabase()
  return db
    .collection<Product>("products")
    .find({
      $or: [{ name: { $regex: query, $options: "i" } }, { description: { $regex: query, $options: "i" } }],
    })
    .toArray()
}

export async function getCategories() {
  const { db } = await connectToDatabase()
  return db.collection<Product>("products").distinct("category")
}
