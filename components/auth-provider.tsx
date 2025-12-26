"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

interface AuthUser {
  id: string
  email: string
  name: string
  role: "customer" | "admin"
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  verifyAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken")
    if (savedToken) {
      setToken(savedToken)
      verifyAuth(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyAuth = useCallback(
    async (authToken?: string) => {
      const tokenToUse = authToken || token
      if (!tokenToUse) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.data.user)
        } else {
          localStorage.removeItem("authToken")
          setToken(null)
          setUser(null)
        }
      } catch (error) {
        console.error("[Auth Verify Error]", error)
      } finally {
        setIsLoading(false)
      }
    },
    [token],
  )

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }

    const data = await response.json()
    setToken(data.data.token)
    setUser(data.data.user)
    localStorage.setItem("authToken", data.data.token)
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }

    const data = await response.json()
    setToken(data.data.token)
    setUser(data.data.user)
    localStorage.setItem("authToken", data.data.token)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("authToken")
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, verifyAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
