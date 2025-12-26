"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useCart } from "@/components/cart-context"
import { ShoppingCart } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  rating: number
  image?: string
}

export function ProductCard({ id, name, description, price, rating, image }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      productId: id,
      name,
      price,
      quantity: 1,
      image,
    })
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary">
      <Link href={`/products/${id}`}>
        <div className="relative bg-muted overflow-hidden aspect-square">
          {image ? (
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs sm:text-sm text-muted-foreground">No image</span>
            </div>
          )}
        </div>
      </Link>

      <CardHeader className="pb-2">
        <h3 className="line-clamp-2 text-sm sm:text-base font-semibold text-foreground">{name}</h3>
        <p className="line-clamp-2 text-xs sm:text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-base sm:text-lg font-bold text-primary">${price.toFixed(2)}</span>
          <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {rating}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full text-xs sm:text-sm" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

import { Star } from "lucide-react"
