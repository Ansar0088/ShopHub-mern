import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error("MONGODB_URI is not defined")
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI is not defined")
  }

  const client = new MongoClient(uri)
  await client.connect()

  const db = client.db("EcommerceTest")
  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function db() {
  const { db: database } = await connectToDatabase()
  return database
}

export default connectToDatabase
