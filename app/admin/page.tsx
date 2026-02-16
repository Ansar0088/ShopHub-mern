"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Plus,
  ChevronRight,
  LayoutDashboard,
  Search,
  Bell,
  ArrowLeft,
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
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const result = await response.json()
          setData({
            totalProducts: result.data.total || 0,
            totalOrders: 1332,
            totalRevenue: result.data.products.reduce(
              (acc: number, p: any) => acc + p.price,
              0
            ),
            totalCustomers: 8,
          })
        }
      } catch (error) {
        console.error("[Admin Stats Error]", error)
      } finally {
        setIsLoading(false)
      }
    } 

    fetchStats()
  }, [token])

  const statsConfig = [
    { title: "Inventory", value: data.totalProducts, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 lg:pb-0">

      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur-md lg:h-20 lg:px-8">
        <div className="flex items-center gap-2">

          {/* BACK TO HOME (MOBILE ONLY) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="lg:hidden"
          >
            <ArrowLeft size={18} />
          </Button>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white lg:h-10 lg:w-10">
            <LayoutDashboard size={20} />
          </div>

          <div>
            <h1 className="text-sm font-bold text-slate-900 lg:text-xl">
              Admin Panel
            </h1>
            <p className="hidden text-xs text-slate-500 lg:block">
              Welcome back, {user?.name || "Manager"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell size={18} />
          </Button>
        </div>
      </header>

      <main className="p-4 lg:p-8 space-y-6 lg:space-y-8">

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
          {statsConfig.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm ring-1 ring-slate-200/50">
              <CardHeader className="flex flex-row items-center justify-between pb-1 p-3 lg:p-6">
                <CardTitle className="text-[10px] uppercase tracking-wider font-bold text-slate-400 lg:text-sm">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0 lg:p-6 lg:pt-0">
                {isLoading ? (
                  <Skeleton className="h-7 w-16 lg:h-9 lg:w-24" />
                ) : (
                  <div className="text-lg font-bold lg:text-3xl">
                    {stat.value}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* QUICK MANAGEMENT */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-slate-200/50">
            <CardHeader className="border-b p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Quick Management</CardTitle>
                  <CardDescription className="text-xs">
                    Direct access to your store tools.
                  </CardDescription>
                </div>
                <Link href="/admin/products/new">
                  <Button size="sm" className="bg-black text-white">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Product
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-2 borer">
              {[
                { name: "Inventory Management", desc: "Edit prices and stock", href: "/admin/products" },
                // { name: "Order Tracking", desc: "View and ship orders", href: "/admin/orders" },
                { name: "Collections", desc: "Manage product categories", href: "/admin/categories" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <ChevronRight size={16} />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 justify-around border-t bg-white lg:hidden">
        <Link href="/admin" className="flex flex-col items-center text-black">
          <LayoutDashboard size={20} />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link href="/admin/products" className="flex flex-col items-center text-slate-400">
          <Package size={20} />
          <span className="text-[10px]">Items</span>
        </Link>
        <Link href="/admin/orders" className="flex flex-col items-center text-slate-400">
          <ShoppingCart size={20} />
          <span className="text-[10px]">Orders</span>
        </Link>
        <Link href="/admin/settings" className="flex flex-col items-center text-slate-400">
          <Users size={20} />
          <span className="text-[10px]">Users</span>
        </Link>
      </nav>
    </div>
  )
}
