import Image from "next/image"
import React, { Suspense } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn, keytoUrl } from "@/lib/utils"

import { DocumentType, gql } from "@/gql"
import Link from "next/link"
import { Rating } from "../ui/rating"

import { BadgeType } from "@/lib/supabase/schema"
import { Badge } from "../ui/badge"

import AddToCartButton from "../cart/AddToCartButton"
import AddToWishListButton from "../wishList/AddToWishListButton"

type CardProps = React.ComponentProps<typeof Card>

export type ProductCardProps = CardProps & {
  product: DocumentType<typeof ProductCardFragment>
}

export const ProductCardFragment = gql(/* GraphQL */ `
  fragment ProductCardFragment on products {
    id
    name
    description
    rating
    slug
    badge
    price
    featuredImage: medias {
      id
      key
      alt
    }
    collections {
      id
      label
      slug
    }
  }
`)

export function ProductCard({
  className,
  product,
  ...props
}: ProductCardProps) {
  const { id, name, slug, featuredImage, badge, price } = product

  return (
    <Card
      className={cn("w-full border-0 rounded-lg py-3 ", className)}
      {...props}
    >
      <CardContent className="relative p-0 mb-5 overflow-hidden">
        <Link href={`/shop/${slug}`}>
          <Image
            src={keytoUrl(featuredImage.key)}
            alt={featuredImage.alt}
            width={400}
            height={400}
            className="aspect-[1/1] object-cover object-center hover:scale-[1.02] hover:opacity-70 transition-all duration-500"
          />
        </Link>
        {badge && (
          <Badge className="absolute top-0 left-0" variant={badge as BadgeType}>
            {badge}
          </Badge>
        )}
      </CardContent>

      <CardHeader className="p-0 mb-3 md:mb-5">
        <CardTitle>
          <Link href={`/shop/${slug}`} className="hover:underline">
            {name}
          </Link>
        </CardTitle>

        <div className="hidden md:block">
          <CardDescription className="max-w-[240px] line-clamp-2">
            {product.description}
          </CardDescription>
        </div>

        <div className="">${price}</div>

        <div className="hidden md:block">
          <Rating value={product.rating} precision={0.5} readOnly />
        </div>
      </CardHeader>

      <CardFooter className="gap-x-2 md:gap-x-5 p-0 ">
        <Suspense fallback={<></>}>
          <AddToCartButton productId={id} />
          <AddToWishListButton productId={product.id} />
        </Suspense>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
