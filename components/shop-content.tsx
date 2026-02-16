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
  const categoryParam = searchParams.get("category")

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
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
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* MINIMAL STICKY HEADER */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="mx-auto max-w-[1600px] px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 group text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          {/* CATEGORY NAV: Scrollable on mobile */}
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar px-4 md:px-0 uppercase text-[10px] font-bold tracking-[0.3em]">
            <button 
              onClick={() => setSelectedCategory("")}
              className={`whitespace-nowrap hover:text-gray-400 transition-colors ${selectedCategory === "" ? "underline underline-offset-8 decoration-2" : ""}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button 
                key={cat._id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`whitespace-nowrap hover:text-gray-400 transition-colors ${selectedCategory === cat.slug ? "underline underline-offset-8 decoration-2" : ""}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5">
             <ShoppingBag size={20} strokeWidth={1.5} />
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="px-6 pt-16 pb-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-4">Collection 2026</p>
              <h1 className="text-6xl md:text-8xl font-medium tracking-tighter leading-[0.85]">
                {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : "Essentials"}<span className="text-gray-300">.</span>
              </h1>
            </div>

            {/* DISABLED SORT & FILTER WITH TOOLTIP */}
            <div className="relative group cursor-not-allowed border-b border-gray-200 pb-2 mb-2 opacity-50">
               <div className="flex items-center gap-4">
                  <SlidersHorizontal size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">Sort & Filter</span>
               </div>
               {/* Tooltip */}
               <span className="absolute -top-8 right-0 bg-black text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest uppercase">
                  Feature Coming Soon
               </span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-[1600px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Spinner className="w-8 h-8 text-black" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 animate-pulse">Loading Catalog</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 border border-dashed border-gray-200">
               <h2 className="text-2xl font-light italic">No pieces found in this category.</h2>
               <Button variant="link" onClick={() => setSelectedCategory("")} className="mt-4 uppercase text-xs tracking-widest font-bold">View all items</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-16">
              {products.map((product) => (
                <div key={product._id} className="group cursor-pointer">
                  {/* PREMIUM CARD IMAGE */}
                  <div className="relative aspect-[3/4] bg-[#F7F7F7] overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    />
                    
                    <div className="absolute top-4 left-4">
                       <span className="bg-white px-3 py-1 text-[9px] font-black uppercase tracking-tighter shadow-sm">New Arrival</span>
                    </div>

                    <button className="absolute bottom-0 left-0 w-full bg-black text-white py-5 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                      <Plus size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Add to Bag</span>
                    </button>
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div className="mt-6 flex flex-col gap-1 px-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star size={10} className="fill-black" />
                        <span className="text-[10px] font-bold">{product.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-[12px] text-gray-400 font-medium line-clamp-1 italic">
                      {product.description}
                    </p>
                    
                    <p className="text-[15px] font-black mt-2">
                      PKR {product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LUXURY NEWSLETTER */}
      <footer className="bg-black text-white py-24 px-6 mt-20">
        <div className="mx-auto max-w-xl text-center">
           <h2 className="text-4xl font-medium tracking-tight mb-4">Join the Inner Circle</h2>
           <p className="text-gray-400 text-sm mb-10 font-light">Be the first to receive access to new releases and exclusive events.</p>
           <div className="flex border-b border-gray-800 pb-2 focus-within:border-white transition-colors">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent flex-1 outline-none text-[10px] font-bold tracking-widest placeholder:text-gray-600 uppercase" 
              />
              <button className="text-[10px] font-bold tracking-widest hover:text-gray-400 transition-colors">SIGN UP</button>
           </div>
        </div>
      </footer>
    </main>
  )
}