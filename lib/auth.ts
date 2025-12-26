import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import connectToDatabase from "./db"
import type { User } from "./models"

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    return decoded
  } catch {
    return null
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const { db } = await connectToDatabase()
  const user = await db.collection<User>("users").findOne({ email })
  return user
}

export async function createUser(email: string, password: string, name: string): Promise<User> {
  const { db } = await connectToDatabase()
  const hashedPassword = await hashPassword(password)

  const result = await db.collection<User>("users").insertOne({
    email,
    password: hashedPassword,
    name,
    role: "customer",
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return {
    _id: result.insertedId,
    email,
    password: hashedPassword,
    name,
    role: "customer",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
