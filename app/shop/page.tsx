"use client"

import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { ShopContent } from "@/components/shop-content"

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <ShopContent />
      </Suspense>
    </>
  )
}
