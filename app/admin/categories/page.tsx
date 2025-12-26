"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Trash2, Plus } from "lucide-react"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  active: boolean
}

export default function CategoriesPage() {
  const { user, token } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", slug: "", description: "" })

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
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          fetchCategories()
        }
      } catch (error) {
        console.error("[Delete Category Error]", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-6 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manage Categories</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Create and manage product categories</p>
      </header>

      <main className="px-4 py-8 sm:px-6">
        {/* Create Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Create New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Category Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Electronics"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., electronics"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto text-sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Category
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-sm">Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="text-muted-foreground text-sm">No categories found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-foreground">Name</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-foreground">Slug</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-foreground hidden sm:table-cell">
                        Description
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category._id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-2 sm:px-4">{category.name}</td>
                        <td className="py-3 px-2 sm:px-4 text-muted-foreground">{category.slug}</td>
                        <td className="py-3 px-2 sm:px-4 text-muted-foreground hidden sm:table-cell line-clamp-1">
                          {category.description || "-"}
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="p-1 sm:p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
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
