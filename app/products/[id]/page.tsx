"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-context"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  rating: number
  reviews: number
  images: string[]
  category: string
  specifications?: Record<string, string>
}

export default function ProductPage() {
  const params = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data.data)
        }
      } catch (error) {
        console.error("[Fetch Product Error]", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (product) {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0],
      })
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex h-screen items-center justify-center">Loading...</div>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="flex h-screen items-center justify-center">Product not found</div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/shop" className="text-primary hover:underline">
            ← Back to Shop
          </Link>

          <div className="mx-auto mt-8 max-w-4xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Image */}
              <div className="relative h-96 bg-muted">
                {product.images[0] ? (
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No image available
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  <span className="text-lg text-muted-foreground">
                    {product.rating} ⭐ ({product.reviews} reviews)
                  </span>
                </div>

                <p className="text-foreground">{product.description}</p>

                <div>
                  <p className="text-sm font-semibold text-foreground">Quantity</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      −
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full" size="lg" onClick={handleAddToCart} disabled={product.stock === 0}>
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>

                <div className="rounded-lg border border-border bg-muted p-4">
                  <p className="text-sm text-foreground">
                    <strong>Stock:</strong> {product.stock} available
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">Free shipping on orders over $50</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
