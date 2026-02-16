"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { ArrowLeft, UserPlus, CheckCircle2, X, Eye, EyeOff, Loader2, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const passwordStrength = formData.password.length >= 8
  const passwordMatch = formData.password && formData.confirmPassword === formData.password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!passwordMatch) {
      setError("Passwords do not match")
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
    <div className="flex min-h-screen bg-[#FDFDFD] selection:bg-black selection:text-white">
      {/* BACK NAVIGATION */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm" className="group text-slate-500 hover:text-black rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Sign In</span>
          </Button>
        </Link>
      </div>

      <div className="flex w-full items-center justify-center p-6 lg:p-12 lg:w-1/2">
        <div className="w-full max-w-[420px] space-y-8">
          {/* HEADER */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">
              Create an account.
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-400">
              Join ShopHub and start your premium journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="animate-in fade-in slide-in-from-top-1 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-600 border border-red-100 flex items-center gap-2">
                <X size={14} /> {error}
              </div>
            )}

            {/* NAME FIELD */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
                className="h-12 rounded-xl border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-black transition-all"
              />
            </div>

            {/* EMAIL FIELD */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="name@example.com"
                className="h-12 rounded-xl border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-black transition-all"
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-slate-200 bg-white px-4 pr-12 text-sm focus:ring-2 focus:ring-black transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* STRENGTH INDICATOR */}
              {formData.password && (
                <div className={`mt-2 h-1 w-full rounded-full bg-slate-100 overflow-hidden`}>
                   <div className={`h-full transition-all duration-500 ${passwordStrength ? 'w-full bg-emerald-500' : 'w-1/3 bg-orange-400'}`} />
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  className={`h-12 rounded-xl border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-black transition-all ${formData.confirmPassword && !passwordMatch ? 'border-red-200 bg-red-50/30' : ''}`}
                />
                {formData.confirmPassword && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {passwordMatch ? <CheckCircle2 size={18} className="text-emerald-500" /> : <X size={18} className="text-red-400" />}
                    </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="h-14 w-full rounded-xl bg-black text-sm font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50"
              disabled={isLoading || !passwordStrength || !passwordMatch}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-slate-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-black font-black hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* DESKTOP VISUAL SIDEBAR */}
      <div className="relative hidden w-1/2 bg-slate-900 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        
        <div className="relative z-10 flex h-full flex-col items-start justify-center p-20 text-white">
          <Badge className="mb-8 bg-blue-500 text-white border-none px-4 py-1.5 rounded-full font-bold tracking-widest text-[10px] uppercase">
            Exclusive Perks
          </Badge>
          <h2 className="max-w-md text-5xl font-black leading-[1.1] tracking-tighter mb-8">
            Start your <span className="text-blue-400 italic font-serif">premium</span> <br/>experience today.
          </h2>
          
          <div className="space-y-6">
            {[
                "Early access to seasonal drops",
                "Member-only pricing and rewards",
                "Priority 24/7 concierge support",
                "Personalized style recommendations"
            ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                    </div>
                    <span className="text-slate-300 font-medium">{text}</span>
                </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-sm">
             <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-slate-700 border border-white/20" />
                <div>
                    <p className="text-sm font-bold">Verified Member</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black">Join 50k+ others</p>
                </div>
             </div>
             <p className="text-sm text-slate-400 italic">"The best shopping experience I've ever had. Quality is unmatched."</p>
          </div>
        </div>
      </div>
    </div>
  )
}