import { type NextRequest, NextResponse } from "next/server"
import { createUser, findUserByEmail, generateToken } from "@/lib/auth"
import { validationError, errorResponse, successResponse } from "@/lib/api-response"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(validationError({ message: "All fields are required" }), {
        status: 400,
      })
    }

    if (password.length < 8) {
      return NextResponse.json(validationError({ password: "Password must be at least 8 characters" }), { status: 400 })
    }

    // Check if user exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(errorResponse("User already exists"), { status: 409 })
    }

    // Create user
    const user = await createUser(email, password, name)
    const token = generateToken(user._id?.toString() || "", "customer")

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
        "Registration successful",
      ),
      { status: 201 },
    )
  } catch (error) {
    console.error("[Auth Register Error]", error)
    return NextResponse.json(errorResponse("Registration failed"), { status: 500 })
  }
}
