"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { ArrowRight, Star, Zap, Shield, Clock } from "lucide-react"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.data?.categories || [])
      }
    } catch (error) {
      console.error("[Fetch Categories Error]", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-16 sm:py-24 md:py-32">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              Premium Shopping Made Easy
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-base sm:text-lg text-muted-foreground md:mt-6">
              Discover quality products with secure checkout, fast shipping, and dedicated support
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {!isLoading && categories.length > 0 && (
          <section className="border-b border-border px-4 py-16 sm:py-20 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">Shop by Category</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Browse our carefully curated collections</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {categories.map((category) => (
                  <Link key={category._id} href={`/shop?category=${category.slug}`} className="group">
                    <div className="rounded-lg border border-border bg-card p-6 sm:p-8 hover:border-primary hover:shadow-md transition-all duration-300 cursor-pointer">
                      <div className="text-center">
                        <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground">{category.description}</p>
                        )}
                        <div className="mt-4 inline-block text-primary font-medium text-sm group-hover:gap-2 transition-all">
                          Browse
                          <ArrowRight className="inline-block ml-1 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="border-b border-border px-4 py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">Why Choose ShopHub?</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                Experience shopping like never before with our premium features
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="rounded-lg border border-border bg-card p-6 sm:p-8 hover:shadow-md transition-shadow">
                <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-accent mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Fast Delivery</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Quick processing and reliable delivery to your doorstep
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 sm:p-8 hover:shadow-md transition-shadow">
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-accent mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Secure Payment</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Multiple payment options with encrypted transactions
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 sm:p-8 hover:shadow-md transition-shadow">
                <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-accent mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">24/7 Support</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">WhatsApp and email support available anytime</p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 sm:p-8 hover:shadow-md transition-shadow">
                <Star className="h-8 w-8 sm:h-10 sm:w-10 text-accent mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Quality Assured</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Premium products verified for quality and authenticity
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 via-background to-accent/10 px-4 py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-8">
              Join thousands of happy customers discovering amazing products
            </p>
            <Link href="/shop">
              <Button size="lg" className="w-full sm:w-auto">
                Start Browsing Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card px-4 py-8 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Shop</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>
                    <Link href="/shop" className="hover:text-foreground transition-colors">
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop" className="hover:text-foreground transition-colors">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop" className="hover:text-foreground transition-colors">
                      Best Sellers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Support</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>
                    <Link href="/contact" className="hover:text-foreground transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-foreground transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Legal</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Returns
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Follow</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Facebook
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-xs sm:text-sm text-muted-foreground">
              <p>&copy; 2025 ShopHub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
