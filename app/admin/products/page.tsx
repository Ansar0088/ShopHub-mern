"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
}

export default function ProductsPage() {
  const { token } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [token])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data.products)
      }
    } catch (error) {
      console.error("[Fetch Products Error]", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== id))
      }
    } catch (error) {
      console.error("[Delete Product Error]", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
          <Link href="/admin/products/new">
            <Button>Add New Product</Button>
          </Link>
        </div>
      </header>

      <main className="p-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product._id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>{product.category}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${product.price}</p>
                      <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">{product.description}</p>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/admin/products/${product._id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => deleteProduct(product._id)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
