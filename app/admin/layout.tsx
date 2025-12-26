"use client"

import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation"
import type React from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    redirect("/")
  }

  return <>{children}</>
}
