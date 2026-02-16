"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { ArrowLeft, ShoppingBag, Eye, EyeOff, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(formData.email, formData.password)
      router.push("/")
    } catch (err) {
      setError((err as Error).message || "Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] selection:bg-black selection:text-white">
      {/* MOBILE BACK BUTTON */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/">
          <Button variant="ghost" size="sm" className="group text-slate-500 hover:text-black rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Store</span>
          </Button>
        </Link>
      </div>

      <div className="flex w-full items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[400px] space-y-8">
          {/* BRANDING */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-xl shadow-slate-200">
              <ShoppingBag size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">
              Welcome back.
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-400">
              Please enter your details to sign in.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="animate-in fade-in slide-in-from-top-2 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-600 border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="name@example.com"
                className="h-12 rounded-xl border-slate-200 bg-white px-4 text-sm transition-all focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Password
                </Label>
                <Link href="#" className="text-[11px] font-bold text-blue-600 hover:underline underline-offset-4">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-slate-200 bg-white px-4 pr-12 text-sm transition-all focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="h-12 w-full rounded-xl bg-black text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* REGISTER LINK */}
          <div className="text-center">
            <p className="text-sm font-medium text-slate-400">
              Don't have an account?{" "}
              <Link 
                href="/auth/register" 
                className="text-black font-bold hover:underline underline-offset-4"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* VISUAL SIDEBAR (Hidden on Mobile) */}
      <div className="relative hidden w-1/2 bg-slate-900 lg:block overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
        
        <div className="relative z-10 flex h-full flex-col items-start justify-end p-16 text-white">
          <Badge className="mb-6 bg-white/10 text-white border-none px-4 py-1 backdrop-blur-md">
            The Hub Experience
          </Badge>
          <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tighter">
            Join the most exclusive <br/>shopping community.
          </h2>
          <p className="mt-4 max-w-sm text-lg text-slate-400">
            Get early access to drops, member-only pricing, and personalized recommendations.
          </p>
          <div className="mt-12 flex gap-8">
            <div className="flex flex-col">
              <span className="text-2xl font-bold italic">24h</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Support</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold italic">100%</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}