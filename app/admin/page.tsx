"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Package,
  ShoppingCart,
  BarChart3,
  Plus,
  ChevronRight,
  LayoutDashboard,
  Bell,
  ArrowLeft,
  Layers,
  Globe,
  ExternalLink,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, token } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalRevenue: 0,
    totalStock: 0,
  })

  useEffect(() => {
    if (!token) return

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/products?limit=1000", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) throw new Error("Failed")

        const result = await response.json()
        const products = result.data?.products || []
        const categoriesSet = new Set(products.map((p: any) => p.category))

        setData({
          totalProducts: result.data?.pagination?.total || products.length,
          totalCategories: categoriesSet.size,
          totalRevenue: products.reduce(
            (acc: number, p: any) => acc + (p.discountPrice || p.price) * (p.stock || 1),
            0
          ),
          totalStock: products.reduce((acc: number, p: any) => acc + (p.stock || 0), 0),
        })
      } catch (error) {
        console.error("[Admin Stats Error]", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [token])

  const statsConfig = [
    { title: "Products", value: data.totalProducts, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Categories", value: data.totalCategories, icon: Layers, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Stock", value: data.totalStock, icon: BarChart3, color: "text-green-600", bg: "bg-green-50" },
    { title: "Revenue", value: `PKR ${data.totalRevenue.toLocaleString()}`, icon: ShoppingCart, color: "text-orange-600", bg: "bg-orange-50" },
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24 lg:pb-10 relative">
      {/* HEADER */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur-md lg:h-20 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white shadow-lg lg:h-11 lg:w-11">
            <LayoutDashboard size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tighter text-slate-900 lg:text-xl">
              Panel<span className="text-slate-400">.</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop Version of Home Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push("/")}
            className="hidden sm:flex items-center gap-2 border-slate-200 hover:bg-black hover:text-white transition-all rounded-full px-4 h-8 text-[10px] font-bold uppercase tracking-widest"
          >
            <Globe size={14} />
            Live Store
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-500">
            <Bell size={20} />
          </Button>
        </div>
      </header>

      <main className="p-4 lg:p-8 space-y-6">
        {/* MOBILE WELCOME */}
        <div className="lg:hidden mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Admin Dashboard</p>
            <h2 className="text-xl font-black text-slate-900">Hi, {user?.name?.split(' ')[0] || "Manager"}</h2>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
          {statsConfig.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm ring-1 ring-slate-200/50">
              <CardHeader className="flex flex-row items-center justify-between pb-1 p-4">
                <CardTitle className="text-[9px] uppercase tracking-widest font-bold text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bg} ${stat.color} p-1.5 rounded-md`}>
                  <stat.icon className="h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <div className="text-base font-black tracking-tighter">
                    {stat.value}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* QUICK MANAGEMENT */}
        <Card className="border-none shadow-sm ring-1 ring-slate-200/50 overflow-hidden">
          <CardHeader className="border-b bg-white p-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">Store Controls</CardTitle>
              <Link href="/admin/products/new">
                <Button className="bg-black text-white rounded-full h-9 px-4 text-[10px] font-bold uppercase tracking-widest">
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {[
              { name: "Inventory", desc: "Manage stock & pricing", href: "/admin/products", icon: Package },
              { name: "Collections", desc: "Manage categories", href: "/admin/categories", icon: Layers },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-center justify-between p-5 border-b last:border-0 active:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-slate-100 rounded-xl">
                     <item.icon size={18} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-tight">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </main>

      {/* --- MOBILE FLOATING HOME BUTTON --- */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 bg-black text-white px-5 py-4 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] active:scale-95 transition-transform animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <Globe size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Exit to Store</span>
          <ExternalLink size={12} className="opacity-50" />
        </button>
      </div>
    </div>
  )
}