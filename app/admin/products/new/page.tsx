"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import {
  ImageIcon,
  PackagePlus,
  ArrowLeft,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react"

export default function NewProductPage() {
  const router = useRouter()
  const { token } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    // sku: "",
    images: [] as string[],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (file: File) => {
    try {
      setIsUploading(true)

      const fd = new FormData()
      fd.append("image", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      })

      const json = await res.json()
      if (!res.ok) throw new Error("Upload failed")

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, json.data.url],
      }))
    } catch (err) {
      alert("Image upload failed")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        }),
      })

      if (response.ok) {
        router.push("/admin/products")
      } else {
        alert("Failed to create product")
      }
    } catch (error) {
      console.error("[Create Product Error]", error)
      alert("Error creating product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="-ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/admin/products")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">New Product</h1>
            <p className="text-muted-foreground">
              Fill in the details to list a new item in your store.
            </p>
          </div>
          <PackagePlus className="h-10 w-10 text-primary opacity-20" />
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Main Information */}
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">General Information</CardTitle>
                <CardDescription>Basic details about your product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Title</Label>
                  <Input
                    id="name"
                    name="name"
                    className="h-11"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    className="min-h-[180px] resize-none leading-relaxed"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* MEDIA CARD — SAME UI */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Media</CardTitle>
                <CardDescription>
                  Add high-quality images to attract buyers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) =>
                    e.target.files && handleFileChange(e.target.files[0])
                  }
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 transition-colors hover:bg-slate-50 cursor-pointer"
                >
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <div className="rounded-full bg-white p-3 shadow-sm border">
                        <UploadCloud className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium mt-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        SVG, PNG, JPG or GIF
                      </p>
                    </>
                  )}
                </div>

                {/* PREVIEW (does not break UI) */}
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img}
                          className="h-20 w-full rounded-md object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, idx) => idx !== i),
                            }))
                          }
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardContent className="space-y-4 pt-6">
                <Input name="category" value={formData.category} onChange={handleInputChange} placeholder="Category" />
                {/* <Input name="sku" value={formData.sku} onChange={handleInputChange} placeholder="SKU" /> */}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-primary/[0.02]">
              <CardContent className="space-y-4 pt-6">
                <Input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Price" />
                <Input name="stock" type="number" value={formData.stock} onChange={handleInputChange} placeholder="Stock" />
              </CardContent>
            </Card>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? "Saving Product..." : "Publish Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
