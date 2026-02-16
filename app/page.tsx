"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { 
  ArrowRight, 
  ChevronUp, 
  Truck,
  Sparkles,
  Search,
  Zap,
  Star,
  Globe,
  ShoppingBag
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    fetchCategories()
    const handleScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
        
        {/* --- 1. HERO SECTION: THE STATEMENT --- */}
        <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-48 overflow-hidden">
          {/* High-End Background Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[150px] opacity-60 -z-10" />
          <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[150px] opacity-60 -z-10" />
          
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 mb-8 bg-slate-50 border border-slate-100 rounded-full px-4 py-1.5 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Sparkles size={14} className="text-blue-600" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                  Global Release — Edition 2026
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-medium tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
                Refined <span className="font-serif italic text-blue-600">Objects</span> <br className="hidden md:block" /> for Daily Life.
              </h1>
              
              <p className="max-w-xl text-lg md:text-xl text-slate-500 font-light leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                A curation of timeless essentials designed with precision, sourced ethically, and delivered with care.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                <Link href="/shop">
                  <Button className="h-16 px-10 bg-black text-white rounded-full text-base font-bold hover:scale-[1.02] transition-transform active:scale-95">
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
              </div>
            </div>
          </div>
        </section>

        {/* --- 2. BENTO TRUST GRID: THE SOCIAL PROOF --- */}
        <section className="px-6 py-12">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Featured Bento Item */}
                    <div className="md:col-span-2 lg:col-span-3 bg-slate-900 rounded-[2rem] p-10 text-white flex flex-col justify-end min-h-[400px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Globe size={120} strokeWidth={1} />
                        </div>
                        <h2 className="text-4xl font-light tracking-tight mb-4">Carbon Neutral <br/><span className="font-bold">Shipping.</span></h2>
                        <p className="text-slate-400 text-sm max-w-xs font-light leading-relaxed">Every delivery is 100% carbon offset. Premium shopping that respects the planet.</p>
                    </div>

                    {/* Service Cards */}
                    <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-blue-500 rounded-[2rem] p-8 text-white flex flex-col justify-between items-start transition-all hover:bg-blue-600">
                            <Zap className="h-10 w-10 fill-white" />
                            <div>
                                <h3 className="text-2xl font-bold mb-1 tracking-tight">Express</h3>
                                <p className="text-blue-100 text-xs font-medium uppercase tracking-widest">Next-Day Worldwide</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 flex flex-col justify-between items-start transition-all hover:border-blue-200">
                            <div className="flex gap-1 text-blue-600">
                                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">4.9/5</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Customer Rating</p>
                            </div>
                        </div>
                        <div className="sm:col-span-2 bg-[#F9F9F9] rounded-[2rem] p-8 flex items-center justify-between border border-slate-100">
                            <div className="flex items-center gap-4">
                                <Truck className="h-6 w-6 text-slate-400" />
                                <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Live Track Orders</p>
                            </div>
                            <Button size="icon" variant="outline" className="rounded-full border-slate-200">
                                <ArrowRight size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- 3. CATEGORIES: EDITORIAL LAYOUT --- */}
        {!isLoading && categories.length > 0 && (
          <section className="px-6 py-24 bg-[#FAFAFA]">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-2">
                <div>
                    <span className="text-blue-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Catalog</span>
                    <h2 className="text-4xl md:text-6xl font-medium tracking-tighter">Department.</h2>
                </div>
                <Link href="/shop" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest pb-2 border-b-2 border-slate-900">
                  All Collections
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <Link 
                    key={category._id} 
                    href={`/shop?category=${category.slug}`} 
                    className="group relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-white transition-all shadow-sm hover:shadow-2xl hover:-translate-y-2 duration-500"
                  >
                    {/* Product Image Holder */}
                    <div className="absolute inset-0 bg-slate-200 group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                    
                    {/* Elegant Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
                    
                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                      <h3 className="text-2xl font-bold text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{category.name}</h3>
                      <div className="h-[2px] w-0 bg-blue-500 group-hover:w-full transition-all duration-500" />
                      <p className="text-[9px] text-white/50 uppercase tracking-[0.3em] font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">Explore</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* --- 4. NEWSLETTER: MINIMALIST BLOCK --- */}
        <section className="px-6 py-24 border-t border-slate-100">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-4xl font-medium tracking-tight mb-6">Never miss a drop.</h2>
                <p className="text-slate-500 font-light mb-10 leading-relaxed">Join 50k+ members. Get early access to new collections and exclusive member pricing.</p>
                <div className="flex flex-col sm:flex-row gap-2 p-1 bg-slate-50 rounded-full border border-slate-200 focus-within:border-blue-400 transition-all">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="h-14 bg-transparent flex-1 px-8 text-slate-900 text-sm font-medium outline-none" 
                    />
                    <Button className="h-14 px-8 rounded-full bg-black hover:bg-slate-800 font-bold text-sm tracking-widest uppercase">Join Now</Button>
                </div>
                <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">Unsubscribe at any time.</p>
            </div>
        </section>

        {/* --- 5. FOOTER: THE SIGN-OFF --- */}
        <footer className="bg-white border-t border-slate-100 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-2">
                    <h3 className="text-2xl font-black tracking-tighter italic mb-6">SHOPHUB.</h3>
                    <p className="text-slate-400 text-sm font-light max-w-xs leading-relaxed">Redefining the digital shopping experience through curated excellence and sustainable logistics.</p>
                </div>
                <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Explore</span>
                    <Link href="/shop" className="text-sm font-medium hover:text-blue-600 transition-colors">Catalog</Link>
                    <Link href="/featured" className="text-sm font-medium hover:text-blue-600 transition-colors">Featured</Link>
                    <Link href="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">Philosophy</Link>
                </div>
                <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Legal</span>
                    <Link href="/terms" className="text-sm font-medium hover:text-blue-600 transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="text-sm font-medium hover:text-blue-600 transition-colors">Terms of Service</Link>
                    <Link href="/shipping" className="text-sm font-medium hover:text-blue-600 transition-colors">Shipping Info</Link>
                </div>
            </div>
            
            <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  &copy; 2026 SHOPHUB GLOBAL INC. 
                </p>
                <div className="flex gap-8">
                    <Search size={16} className="text-slate-300 hover:text-slate-900 cursor-pointer" />
                    <ShoppingBag size={16} className="text-slate-300 hover:text-slate-900 cursor-pointer" />
                </div>
            </div>
          </div>
        </footer>

        {/* FLOATING ACTION */}
        {showBackToTop && (
          <Button onClick={scrollToTop} className="fixed bottom-10 right-10 z-50 h-14 w-14 rounded-full shadow-2xl bg-black text-white hover:bg-slate-800 animate-in fade-in zoom-in" size="icon">
            <ChevronUp size={24} />
          </Button>
        )}
      </main>
    </>
  )
}