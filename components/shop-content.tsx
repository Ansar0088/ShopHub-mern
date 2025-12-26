"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  rating: number
  images: string[]
}

interface Category {
  _id: string
  name: string
  slug: string
}

export function ShopContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.data?.categories || [])
      }
    } catch (error) {
      console.error("[Fetch Categories Error]", error)
    }
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const query = selectedCategory ? `?category=${selectedCategory}` : ""
      const response = await fetch(`/api/products${query}`)
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

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Shop</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Browse our collection of premium products</p>
        </div>
      </div>

      <div className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          {categories.length > 0 && (
            <div className="mb-8">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-3">Filter by Category</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("")}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  All Products
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category._id}
                    variant={selectedCategory === category.slug ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.slug)}
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  rating={product.rating}
                  image={product.images[0]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
