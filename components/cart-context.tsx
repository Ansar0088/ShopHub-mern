"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)

  const calculateTotals = useCallback((cartItems: CartItem[]) => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const newTax = newSubtotal * 0.1
    const newTotal = newSubtotal + newTax

    setSubtotal(newSubtotal)
    setTax(newTax)
    setTotal(newTotal)
  }, [])

  const addItem = useCallback((item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.productId === item.productId)
      if (existingItem) {
        existingItem.quantity += item.quantity
        return [...prevItems]
      }
      return [...prevItems, item]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }, [])

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId)
        return
      }

      setItems((prevItems) => prevItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
    },
    [removeItem],
  )

  const clearCart = useCallback(() => {
    setItems([])
    setSubtotal(0)
    setTax(0)
    setTotal(0)
  }, [])

  // Calculate totals whenever items change
  useEffect(() => {
    calculateTotals(items)
  }, [items, calculateTotals])

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        tax,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
