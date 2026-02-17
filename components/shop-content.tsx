"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Spinner } from "./ui/spinner"
import { ArrowLeft, SlidersHorizontal, ShoppingBag, Plus, Star } from "lucide-react"

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
  const router = useRouter()
  const searchParams = useSearchParams()

  const categoryParam = searchParams.get("category") || ""
  const pageParam = Number(searchParams.get("page")) || 1

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [page, setPage] = useState(pageParam)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const LIMIT = 8

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, page])

  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory) params.set("category", selectedCategory)
    if (page > 1) params.set("page", page.toString())
    router.push(`/shop?${params.toString()}`)
  }, [selectedCategory, page])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data.data?.categories || [])
    } catch (e) {
      console.error(e)
    }
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("limit", LIMIT.toString())
      params.set("page", page.toString())
      if (selectedCategory) params.set("category", selectedCategory)

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()

      setProducts(data.data.products)
      setTotalPages(data.data.pagination.totalPages)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">

      {/* HEADER */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex justify-between items-center">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex gap-6 overflow-x-auto text-[10px] font-bold tracking-[0.3em] uppercase">
            <button
              onClick={() => { setSelectedCategory(""); setPage(1) }}
              className={!selectedCategory ? "underline underline-offset-8" : ""}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => { setSelectedCategory(cat.slug); setPage(1) }}
                className={selectedCategory === cat.slug ? "underline underline-offset-8" : ""}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <ShoppingBag size={20} />
        </div>
      </nav>

      {/* GRID */}
      <section className="px-6 py-12">
        <div className="max-w-[1600px] mx-auto">

          {isLoading ? (
            <div className="flex justify-center py-40">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-16">
                {products.map((product) => (
  <div
    key={product._id}
    className="group cursor-pointer flex flex-col"
  >
    {/* IMAGE CONTAINER */}
    <div className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden">

      {/* IMAGE */}
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
      />

      {/* SOFT GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* TOP BADGE */}
      <div className="absolute top-4 left-4">
        <span className="bg-white/90 backdrop-blur px-3 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm">
          New
        </span>
      </div>

      {/* QUICK VIEW BUTTON */}
      <button
        className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm hover:scale-105"
      >
        <ShoppingBag size={14} />
      </button>

      {/* ADD TO BAG */}
      <button
        className="absolute bottom-0 left-0 w-full bg-black text-white py-4 
        flex items-center justify-center gap-2 
        translate-y-full group-hover:translate-y-0 
        transition-all duration-500 ease-in-out"
      >
        <Plus size={14} />
        <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
          Add to Bag
        </span>
      </button>
    </div>

    {/* PRODUCT DETAILS */}
    <div className="mt-5 flex flex-col gap-1 px-1">

      {/* NAME + RATING */}
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-gray-900 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1">
          <Star size={11} className="fill-black" />
          <span className="text-[10px] font-semibold">
            {product.rating?.toFixed(1) || "4.8"}
          </span>
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="text-[12px] text-gray-400 font-medium line-clamp-1 italic">
        {product.description}
      </p>

      {/* PRICE */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-[15px] font-black tracking-tight">
          PKR {product.price.toLocaleString()}
        </p>

        {/* OPTIONAL STOCK BADGE */}
        <span className="text-[9px] uppercase tracking-widest text-gray-400">
          In Stock
        </span>
      </div>
    </div>
  </div>
))}

              </div>

              {/* PAGINATION */}
              <div className="flex justify-center items-center gap-6 mt-20 text-xs font-bold uppercase tracking-widest">
                <Button
                  variant="ghost"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Prev
                </Button>

                <span className="opacity-50">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="ghost"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
