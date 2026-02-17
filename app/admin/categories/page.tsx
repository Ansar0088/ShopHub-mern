"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Trash2, Plus, ArrowLeft, LayoutDashboard } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  active: boolean
}

export default function CategoriesPage() {
  const router = useRouter()
  const { token } = useAuth()

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  })

  useEffect(() => {
    fetchCategories()
  }, [token])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.data.categories || [])
      }
    } catch (error) {
      console.error("[Fetch Categories Error]", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: "", slug: "", description: "" })
        fetchCategories()
      }
    } catch (error) {
      console.error("[Create Category Error]", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) fetchCategories()
    } catch (error) {
      console.error("[Delete Category Error]", error)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-10">
      {/* HEADER */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur-md lg:h-20 lg:px-8">
        <div className="flex items-center gap-4">
          {/* BACK BUTTON (Works on Desktop & Mobile) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin")}
            className="group flex items-center gap-2 text-slate-500 hover:text-black hover:bg-slate-100 rounded-full px-3"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">Dashboard</span>
          </Button>

          <div className="h-6 w-[1px] bg-slate-200" />

          <div>
            <h1 className="text-sm font-black uppercase tracking-tighter text-slate-900 lg:text-xl">
              Categories<span className="text-slate-400">.</span>
            </h1>
            <p className="hidden text-[10px] font-bold uppercase tracking-widest text-slate-400 lg:block">
              Structure your catalog
            </p>
          </div>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white shadow-lg lg:h-11 lg:w-11">
          <LayoutDashboard size={20} strokeWidth={2.5} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* CREATE FORM */}
        <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
          <CardHeader>
            <CardTitle className="text-base font-bold uppercase tracking-tight">
              Create New Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Category Name
                  </label>
                  <input
                    value={formData.name}
                    placeholder="e.g., Summer Collection"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Slug (URL Key)
                  </label>
                  <input
                    value={formData.slug}
                    placeholder="e.g., summer-collection"
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the aesthetic of this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all resize-none"
                />
              </div>
              <Button type="submit" className="bg-black text-white hover:bg-zinc-800 rounded-full px-8 h-11 text-[10px] font-bold uppercase tracking-widest">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* CATEGORY LIST */}
        <Card className="border-none shadow-sm ring-1 ring-slate-200/50 overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100">
            <CardTitle className="text-base font-bold uppercase tracking-tight">
              Active Collections
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Spinner className="size-6 text-black" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 animate-pulse">Syncing Categories</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm font-medium text-slate-400">No categories found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Name</th>
                      <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Slug</th>
                      <th className="hidden sm:table-cell px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</th>
                      <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {categories.map((cat) => (
                      <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{cat.name}</td>
                        <td className="px-6 py-4">
                          <code className="bg-slate-100 px-2 py-1 rounded text-[11px] text-slate-600 uppercase font-bold tracking-tight">
                            {cat.slug}
                          </code>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 text-slate-400 italic font-medium">
                          {cat.description || "No description provided"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(cat._id)}
                            className="text-slate-300 hover:text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}