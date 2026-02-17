'use client'

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Trash2,
  Edit3,
  Package,
  AlertCircle,
  ArrowLeft,
  Upload,
  ImageIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  images: string[]
}

const PAGE_SIZE = 5

export default function ProductsPage() {
  const router = useRouter()
  const { token } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [token])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/products")
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      // Defensive check for product list
      setProducts(data?.data?.products || [])
    } catch (err) {
      console.error("[Fetch Products]", err)
    } finally {
      setIsLoading(false)
    }
  }

  const openEditModal = (product: Product) => {
    setEditingProduct({ ...product })
    setPreviewUrl(product.images?.[0] || null)
    setSelectedFile(null)
    setIsModalOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert("File too large (max 2MB)")
      return
    }
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleUpdate = async () => {
    if (!editingProduct) return
    setIsUpdating(true)
    try {
      let finalImage = editingProduct.images?.[0] || ""
      if (selectedFile) {
        finalImage = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(selectedFile)
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = (err) => reject(err)
        })
      }

      const payload = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        category: editingProduct.category,
        image: finalImage,
      }

      const res = await fetch(`/api/products/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const result = await res.json()

      if (!res.ok || !result.success) {
        alert(result.message || "Failed to update product")
        return
      }

      // FIX: Check multiple possible data paths to avoid 'undefined'
      const updatedItem = result.data?.product || result.data;

      if (!updatedItem) {
        throw new Error("Update successful but no data returned")
      }

      setProducts((prev) =>
        prev.map((p) => (p._id === editingProduct._id ? updatedItem : p))
      )
      setIsModalOpen(false)
       
    } catch (err) {
      console.error("[Update Product]", err)
      alert("Something went wrong during update.")
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const result = await res.json()
      if (!res.ok || !result.success) {
        alert(result.message || "Failed to delete product")
        return
      }
      setProducts((prev) => prev.filter((p) => p && p._id !== id))
    } catch (err) {
      console.error("[Delete Product]", err)
    }
  }

  // --- SAFE CALCULATIONS (Prevents Crashing) ---
  
  const filteredProducts = products.filter(p =>
    p && p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE) || 1
  
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 hover:text-black">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Inventory</h1>
            <p className="text-muted-foreground text-sm">Manage products and stock levels.</p>
          </div>
          <div className="text-sm text-slate-500">Total Products: {products.length}</div>
        </div>

        {/* STAT CARDS - Now with defensive filtering */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <StatCard title="Total Items" value={products.filter(Boolean).length} icon={<Package className="h-4 w-4" />} />
          <StatCard
            title="Low Stock"
            value={products.filter(p => p && typeof p.stock === 'number' && p.stock < 10).length}
            icon={<AlertCircle className="h-4 w-4 text-orange-500" />}
            color="text-orange-600"
          />
        </div>

        {/* SEARCH + TABLE */}
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-white flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search inventory..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              />
            </div>
          </div>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center gap-2">
                <Spinner className="h-6 w-6" />
                <p className="text-sm text-muted-foreground">Syncing catalog...</p>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="py-20 text-center text-sm text-gray-400">No products found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left">Product</th>
                      <th className="px-6 py-4 text-left hidden md:table-cell">Category</th>
                      <th className="px-6 py-4 text-left">Price</th>
                      <th className="px-6 py-4 text-left">Stock</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {paginatedProducts.map(product => (
                      <tr key={product._id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 rounded bg-slate-100 border overflow-hidden">
                              {product.images?.[0] ? (
                                <img src={product.images[0]} className="h-full w-full object-cover" alt="" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center"><ImageIcon className="h-4 w-4 text-slate-400" /></div>
                              )}
                            </div>
                            <div className="font-medium truncate max-w-[200px]">{product.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <Badge variant="secondary">{product.category}</Badge>
                        </td>
                        <td className="px-6 py-4 font-medium">${product.price}</td>
                        <td className="px-6 py-4">{product.stock}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEditModal(product)} disabled={isUpdating}><Edit3 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteProduct(product._id)} disabled={isUpdating}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>

          {/* PAGINATION */}
          <div className="flex justify-end gap-2 px-4 py-2 bg-slate-50 border-t">
            <Button size="sm" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>Prev</Button>
            <span className="flex items-center px-2 font-bold text-xs">{currentPage} / {totalPages}</span>
            <Button size="sm" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
          </div>
        </Card>
      </div>

      {/* EDIT MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[600px] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0"><DialogTitle>Edit Product</DialogTitle></DialogHeader>
          {editingProduct && (
            <div className="p-6 pt-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
                <div className="flex flex-col items-center gap-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group h-40 w-40 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-black transition-all"
                  >
                    {previewUrl ? (
                      <img src={previewUrl} className="h-full w-full object-cover" alt="preview" />
                    ) : (
                      <Upload className="h-6 w-6 text-slate-300" />
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
                <div className="space-y-4">
                  <div className="grid gap-1.5">
                    <Label>Product Name</Label>
                    <Input value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Description</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={editingProduct.description}
                      onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                      <Label>Price ($)</Label>
                      <Input type="number" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Stock</Label>
                      <Input type="number" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Category</Label>
                    <Input value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="bg-slate-50 p-4 border-t">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isUpdating} className="bg-black text-white px-8">
              {isUpdating ? <Spinner className="h-4 w-4 mr-2 text-white" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatCard({ title, value, icon, color = "text-black" }: any) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-medium text-slate-500 uppercase">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent><div className={`text-2xl font-bold ${color}`}>{value}</div></CardContent>
    </Card>
  )
}