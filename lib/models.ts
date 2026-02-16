import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password: string
  name: string
  role: "customer" | "admin"
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  _id?: ObjectId
  name: string
  slug: string
  description?: string
  image?: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  _id?: ObjectId
  name: string
  description: string
  price: number
  discountPrice?: number
  stock: number
  category: string
  images: string[]
  rating: number
  reviews: number
  specifications?: Record<string, string>
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
}

export interface Cart {
  _id?: ObjectId
  userId: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  _id?: ObjectId
  userId: string
  items: CartItem[]
  subtotal: number
  tax: number
  shippingCost: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  paymentMethod: "stripe" | "whatsapp"
  paymentStatus: "pending" | "completed" | "failed"
  trackingNumber?: string
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  _id?: ObjectId
  productId: string
  userId: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}
