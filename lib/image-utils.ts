import { NextResponse } from "next/server"

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || "demo"
const FALLBACK_DIMENSIONS = { width: 1024, height: 1024 }

export async function getRandomImage(query: string = "abstract art", width: number = FALLBACK_DIMENSIONS.width, height: number = FALLBACK_DIMENSIONS.height) {
  try {
    // If no Unsplash API key, return static placeholder
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === "demo") {
      return `/placeholder.svg?width=${width}&height=${height}`
    }

    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=squarish`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const data = await response.json()
    const imageUrl = data.urls?.regular

    if (!imageUrl) {
      throw new Error("No image URL in response")
    }

    // Add dimensions and optimize image
    return `${imageUrl}&w=${width}&h=${height}&fit=crop&q=80`
  } catch (error) {
    console.error("Error fetching random image:", error)
    return `/placeholder.svg?width=${width}&height=${height}`
  }
}

export async function getRandomProfileImage(name: string = "user") {
  try {
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === "demo") {
      return "/placeholder.svg?width=100&height=100"
    }

    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=portrait&orientation=squarish`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const data = await response.json()
    const imageUrl = data.urls?.thumb

    if (!imageUrl) {
      throw new Error("No image URL in response")
    }

    return `${imageUrl}&w=100&h=100&fit=crop&q=80`
  } catch (error) {
    console.error("Error fetching random profile image:", error)
    return "/placeholder.svg?width=100&height=100"
  }
}