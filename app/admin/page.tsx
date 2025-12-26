"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Package, ShoppingCart, Users, BarChart3 } from "lucide-react"

export default function AdminDashboard() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // TODO: Create stats endpoints
        setStats({
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          totalCustomers: 0,
        })
      } catch (error) {
        console.error("[Admin Stats Error]", error)
      }
    }

    fetchStats()
  }, [token])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-6 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Welcome, {user?.name}</p>
      </header>

      <main className="px-4 py-8 sm:px-6">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Products in catalog</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Orders placed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Revenue</CardTitle>
                <BarChart3 className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">${stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">Total sales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/products">
                <Button variant="outline" className="w-full justify-start bg-transparent text-sm sm:text-base">
                  Manage Products
                </Button>
              </Link>
              <Link href="/admin/products/new">
                <Button variant="outline" className="w-full justify-start bg-transparent text-sm sm:text-base">
                  Add New Product
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full justify-start bg-transparent text-sm sm:text-base">
                  Manage Categories
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline" className="w-full justify-start bg-transparent text-sm sm:text-base">
                  View Orders
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-foreground">Database Connection</span>
                <span className="text-xs sm:text-sm font-medium text-green-600">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-foreground">API Status</span>
                <span className="text-xs sm:text-sm font-medium text-green-600">Operational</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
