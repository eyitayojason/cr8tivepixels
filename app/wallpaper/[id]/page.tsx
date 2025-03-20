"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Heart, Share2, Crown } from "lucide-react"
import Link from "next/link"
import Logo from "@/components/logo"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

export default function WallpaperDetailPage() {
  const params = useParams()
  const wallpaperId = params.id as string
  const router = useRouter()
  const { user } = useAuth()

  const [wallpaper, setWallpaper] = useState<any>(null)
  const [creator, setCreator] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWallpaper() {
      try {
        // For a real app, fetch from Firestore
        // const wallpaperDoc = await getDoc(doc(db, 'wallpapers', wallpaperId))

        // For demo purposes, create a placeholder
        const demoWallpaper = {
          id: wallpaperId,
          title: "Nigerian Cultural Art",
          description:
            "A beautiful wallpaper featuring Nigerian cultural elements with vibrant colors and traditional patterns.",
          imageUrl: "/placeholder.svg?height=1024&width=768",
          creatorId: "demo-creator",
          price: 500,
          resolution: "ultra-hd",
          style: "realistic",
          downloads: 1250,
          createdAt: new Date().toISOString(),
          isPremium: true,
          category: "cultural",
        }

        setWallpaper(demoWallpaper)

        // For a real app, fetch creator info
        // const creatorDoc = await getDoc(doc(db, 'users', demoWallpaper.creatorId))

        // For demo purposes, create a placeholder creator
        const demoCreator = {
          id: "demo-creator",
          username: "NigerianArtist",
          photoURL: "/placeholder.svg?height=100&width=100",
          totalWallpapers: 24,
          totalDownloads: "5.2k",
        }

        setCreator(demoCreator)
      } catch (err) {
        console.error("Error fetching wallpaper:", err)
        setError("Failed to load wallpaper details")
      } finally {
        setLoading(false)
      }
    }

    fetchWallpaper()
  }, [wallpaperId])

  function handlePurchase() {
    if (!user) {
      router.push("/auth/login")
      return
    }

    router.push(`/checkout?wallpaperId=${wallpaperId}`)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Loading wallpaper...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.push("/marketplace")} className="mt-4">
          Return to Marketplace
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-6 pb-16 relative z-10">
      <div className="flex items-center mb-6">
        <Link href="/marketplace" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Logo />
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="relative rounded-lg overflow-hidden mb-4">
          <Image
            src={wallpaper?.imageUrl || "/placeholder.svg"}
            alt={wallpaper?.title || "Wallpaper"}
            width={768}
            height={1024}
            className="w-full h-auto"
          />

          {wallpaper?.isPremium && (
            <div className="absolute top-4 right-4 bg-pixelGold/90 text-black px-3 py-1 rounded-full flex items-center">
              <Crown className="h-4 w-4 mr-1" />
              <span className="font-medium text-sm">Premium</span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold font-playfair mb-2">{wallpaper?.title || "Wallpaper"}</h1>

          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-700 mr-2 overflow-hidden">
              <Image
                src={creator?.photoURL || "/placeholder.svg"}
                alt={creator?.username || "Creator"}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{creator?.username || "Creator"}</p>
              <p className="text-xs text-gray-400">
                {creator?.totalWallpapers || 0} wallpapers • {creator?.totalDownloads || "0"} downloads
              </p>
            </div>
          </div>

          <p className="text-gray-300 mb-4">{wallpaper?.description || "No description available."}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-charcoal/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Resolution</p>
              <p className="font-medium">{wallpaper?.resolution || "Standard"}</p>
            </div>
            <div className="bg-charcoal/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Style</p>
              <p className="font-medium">{wallpaper?.style || "Default"}</p>
            </div>
            <div className="bg-charcoal/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Downloads</p>
              <p className="font-medium">{wallpaper?.downloads || 0}</p>
            </div>
            <div className="bg-charcoal/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Price</p>
              <p className="font-bold">₦{wallpaper?.price || 0}</p>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <Button
              onClick={handlePurchase}
              className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-poppins font-medium py-6 rounded-full secondary-glow"
            >
              Buy Now
              <Download className="ml-2 h-5 w-5" />
            </Button>

            <Button variant="outline" className="w-12 h-12 p-0 rounded-full border-gray-700">
              <Heart className="h-5 w-5" />
            </Button>

            <Button variant="outline" className="w-12 h-12 p-0 rounded-full border-gray-700">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="bg-charcoal/30 rounded-lg p-4 border border-gray-800">
            <h3 className="font-bold mb-2">About Premium Wallpapers</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>High-resolution quality with no watermarks</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Exclusive rights to use the wallpaper</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Support Nigerian digital artists</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

