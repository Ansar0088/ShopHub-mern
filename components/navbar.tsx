"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-context"
import { Menu, X } from "lucide-react"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"

export function Navbar() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  if (!mounted) return null

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl font-bold sm:text-2xl text-primary">ShopHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/shop" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            {user && user.role === "admin" && (
              <Link href="/admin" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Admin Panel
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {items.length > 0 && (
                  <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>

            {/* Desktop Auth Buttons */}
            <div className="hidden items-center gap-2 sm:flex">
              {user ? (
                <>

                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-blue-700
             dark:bg-blue-900/40 dark:text-blue-200"
                  >
                    <Avatar className="h-7 w-7 rounded-md border border-blue-200 dark:border-blue-700">
                      <AvatarImage
                        src="/avatar.jpg"
                        alt={user.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xs font-medium">
                        {user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {user.name}
                    </span>
                  </Badge>


                  <Button size="sm" variant="ghost" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button size="sm" variant="ghost">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border mt-3 pt-3 pb-3">
            <div className="space-y-2">
              <Link href="/shop">
                <button
                  onClick={closeMobileMenu}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Shop
                </button>
              </Link>
              <Link href="/about">
                <button
                  onClick={closeMobileMenu}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  About
                </button>
              </Link>
              <Link href="/contact">
                <button
                  onClick={closeMobileMenu}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Contact
                </button>
              </Link>
              {user && user.role === "admin" && (
                <Link href="/admin">
                  <button
                    onClick={closeMobileMenu}
                    className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                  >
                    Admin Panel
                  </button>
                </Link>
              )}

              {/* Mobile Auth Section */}
              <div className="border-t border-border pt-3 mt-3 space-y-2">
                {user ? (
                  <>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-blue-700
             dark:bg-blue-900/40 dark:text-blue-200"
                    >
                      <Avatar className="h-7 w-7 rounded-md border border-blue-200 dark:border-blue-700">
                        <AvatarImage
                          src="/avatar.jpg"
                          alt={user.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-xs font-medium">
                          {user.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm font-medium truncate max-w-[120px]">
                        {user.name}
                      </span>
                    </Badge>
                    <button
                      onClick={() => {
                        logout()
                        closeMobileMenu()
                      }}
                      className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <button
                        onClick={closeMobileMenu}
                        className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        Login
                      </button>
                    </Link>
                    <Link href="/auth/register">
                      <button
                        onClick={closeMobileMenu}
                        className="block w-full px-3 py-2 rounded-lg text-sm font-medium text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        Sign Up
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
