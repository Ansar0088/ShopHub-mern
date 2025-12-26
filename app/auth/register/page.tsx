"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { UserPlus, CheckCircle2, X } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const passwordStrength = formData.password.length > 0 ? formData.password.length >= 8 : null
  const passwordMatch =
    formData.password && formData.confirmPassword ? formData.password === formData.confirmPassword : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      await register(formData.email, formData.password, formData.name)
      router.push("/")
    } catch (err) {
      setError((err as Error).message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">ShopHub</h1>
        <p className="text-sm text-muted-foreground">Join millions of happy shoppers</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-center mb-2">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center text-xs sm:text-sm">Join ShopHub to start shopping</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs sm:text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your@email.com"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs sm:text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
                className="text-sm"
              />
              {formData.password && (
                <div className="flex items-center gap-2 text-xs">
                  {passwordStrength ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                  <span className={passwordStrength ? "text-green-600" : "text-destructive"}>
                    {passwordStrength ? "Strong password" : "Minimum 8 characters"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs sm:text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
                className="text-sm"
              />
              {formData.confirmPassword && (
                <div className="flex items-center gap-2 text-xs">
                  {passwordMatch ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                  <span className={passwordMatch ? "text-green-600" : "text-destructive"}>
                    {passwordMatch ? "Passwords match" : "Passwords do not match"}
                  </span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full text-sm sm:text-base"
              disabled={isLoading || !passwordStrength || !passwordMatch}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">Already have an account?</span>
              </div>
            </div>

            <Link href="/auth/login">
              <Button variant="outline" className="w-full text-xs sm:text-sm bg-transparent">
                Login
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-center text-xs sm:text-sm text-muted-foreground">
            <Link href="/" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Back to Shopping
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
