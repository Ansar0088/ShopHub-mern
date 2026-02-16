"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Trash2, Plus, ArrowLeft } from "lucide-react"
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
        setCategories(data.data.categories)
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
    <div className="min-h-screen bg-background">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-border bg-card px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">

          {/* BACK BUTTON (MOBILE ONLY) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="lg:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Manage Categories
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Create and manage product categories
            </p>
          </div>
        </div>
      </header>

      <main className="px-4 py-8 sm:px-6 space-y-8">

        {/* CREATE FORM */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Create New Category
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category Name
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Slug
                  </label>
                  <input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" />
                Create Category
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* CATEGORY LIST */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              All Categories
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <Spinner className="size-6 text-blue-500" />
            ) : categories.length === 0 ? (
              <p className="text-muted-foreground">No categories found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3">Name</th>
                      <th className="text-left py-3">Slug</th>
                      <th className="hidden sm:table-cell py-3">
                        Description
                      </th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat._id} className="border-b">
                        <td className="py-3">{cat.name}</td>
                        <td className="py-3 text-muted-foreground">
                          {cat.slug}
                        </td>
                        <td className="hidden sm:table-cell py-3">
                          {cat.description || "-"}
                        </td>
                        <td className="py-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(cat._id)}
                            className="text-destructive"
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
