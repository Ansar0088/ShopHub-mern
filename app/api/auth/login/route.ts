import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail, verifyPassword, generateToken } from "@/lib/auth"
import { validationError, errorResponse, successResponse } from "@/lib/api-response"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(validationError({ message: "Email and password are required" }), {
        status: 400,
      })
    }

    // Find user
    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json(errorResponse("Invalid credentials"), { status: 401 })
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(errorResponse("Invalid credentials"), { status: 401 })
    }

    // Generate token
    const token = generateToken(user._id?.toString() || "", user.role)

    return NextResponse.json(
      successResponse(
        {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
        "Login successful",
      ),
    )
  } catch (error) {
    console.error("[Auth Login Error]", error)
    return NextResponse.json(errorResponse("Login failed"), { status: 500 })
  }
}
