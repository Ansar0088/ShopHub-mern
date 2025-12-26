import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import connectToDatabase from "@/lib/db"
import type { User } from "@/lib/models"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(errorResponse("Missing or invalid token"), { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(errorResponse("Invalid token"), { status: 401 })
    }

    // Fetch user from database
    const { db } = await connectToDatabase()
    const user = await db.collection<User>("users").findOne({ _id: decoded.userId })

    if (!user) {
      return NextResponse.json(errorResponse("User not found"), { status: 404 })
    }

    return NextResponse.json(
      successResponse({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      }),
    )
  } catch (error) {
    console.error("[Auth Verify Error]", error)
    return NextResponse.json(errorResponse("Verification failed"), { status: 500 })
  }
}
