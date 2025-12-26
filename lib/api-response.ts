export const ApiResponse = {
  success<T>(data: T, message = "Operation successful", statusCode = 200) {
    return Response.json(
      {
        success: true,
        message,
        data,
      },
      { status: statusCode },
    )
  },

  error(message: string, statusCode = 400) {
    return Response.json(
      {
        success: false,
        message,
      },
      { status: statusCode },
    )
  },

  validationError(errors: Record<string, string>) {
    return Response.json(
      {
        success: false,
        message: "Validation failed",
        errors,
      },
      { status: 400 },
    )
  },
}

// Keep individual exports for backward compatibility
export function successResponse<T>(data: T, message?: string) {
  return {
    success: true,
    message: message || "Operation successful",
    data,
  }
}

export function errorResponse(message: string, statusCode = 400) {
  return {
    success: false,
    message,
    statusCode,
  }
}

export function validationError(errors: Record<string, string>) {
  return {
    success: false,
    message: "Validation failed",
    errors,
  }
}
