"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Crown, Download } from "lucide-react"
import Image from "next/image"
import { getWallpapersByCategory, getTrendingWallpapers } from "@/lib/wallpaper-service"
import { useAuth } from "@/contexts/auth-context"
import MarketplaceSkeleton from "@/components/marketplace-skeleton"

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [culturalWallpapers, setCulturalWallpapers] = useState<any[]>([])
  const [landmarksWallpapers, setLandmarksWallpapers] = useState<any[]>([])
  const [abstractWallpapers, setAbstractWallpapers] = useState<any[]>([])
  const [trendingWallpapers, setTrendingWallpapers] = useState<any[]>([])
  const [featuredWallpapers, setFeaturedWallpapers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchWallpapers() {
      try {
        // Fetch wallpapers for each category
        const cultural = await getWallpapersByCategory("cultural")
        const landmarks = await getWallpapersByCategory("landmarks")
        const abstract = await getWallpapersByCategory("abstract")
        const trending = await getTrendingWallpapers(4)

        // For demo purposes, if we don't have data, use placeholders
        setCulturalWallpapers(cultural.length > 0 ? cultural : generatePlaceholders(4, "cultural"))
        setLandmarksWallpapers(landmarks.length > 0 ? landmarks : generatePlaceholders(4, "landmarks"))
        setAbstractWallpapers(abstract.length > 0 ? abstract : generatePlaceholders(4, "abstract"))
        setTrendingWallpapers(trending.length > 0 ? trending : generatePlaceholders(4, "trending"))
        setFeaturedWallpapers(generatePlaceholders(2, "featured"))
      } catch (error) {
        console.error("Error fetching wallpapers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWallpapers()
  }, [])

  // Helper function to generate placeholder wallpapers for demo
  function generatePlaceholders(count: number, category: string) {
    return Array.from({ length: count }, (_, i) => {
      const titles: Record<string, string[]> = {
        cultural: ["Igbo Masquerade", "Yoruba Patterns", "Hausa Designs", "Calabar Festival"],
        landmarks: ["Zuma Rock", "Lagos Skyline", "Olumo Rock", "Niger Bridge"],
        abstract: ["Nigerian Colors", "Pixel Nigeria", "Neon Lagos", "Abstract Naija"],
        trending: ["Lagos Night", "Abuja Sunset", "Tribal Patterns", "Naija Pride"],
        featured: ["Nigerian Festival", "Lagos Aerial"],
      }

      const creators: Record<string, string[]> = {
        cultural: ["NigerianArtist", "CreativeNaija", "NorthernArt", "EasternCreator"],
        landmarks: ["AbujaPics", "LagosCreator", "AbeokutaArt", "EasternVibes"],
        abstract: ["AbstractNaija", "PixelArtist", "NeonCreator", "ModernArtNG"],
        trending: ["NightlifeNG", "CapitalArt", "TribalNG", "ProudNigerian"],
        featured: ["FestivalArt", "AerialShots"],
      }

      const prices: Record<string, number[]> = {
        cultural: [500, 350, 400, 450],
        landmarks: [400, 550, 350, 450],
        abstract: [300, 450, 500, 400],
        trending: [600, 450, 500, 400],
        featured: [750, 800],
      }

      const downloads: Record<string, string[]> = {
        trending: ["1.5k", "1.2k", "980", "850"],
        featured: ["2.3k", "1.8k"],
      }

      return {
        id: `placeholder-${category}-${i}`,
        title: titles[category][i % titles[category].length],
        creator: creators[category][i % creators[category].length],
        price: prices[category][i % prices[category].length],
        imageUrl: "/placeholder.svg?height=400&width=300",
        isPremium: i % 2 === 0,
        downloads: downloads[category] ? downloads[category][i % downloads[category].length] : undefined,
      }
    })
  }

  function handleWallpaperClick(wallpaper: any) {
    router.push(`/wallpaper/${wallpaper.id}`)
  }

  if (loading) {
    return <MarketplaceSkeleton />
  }

  return (
    <div className="flex flex-col pt-6 pb-16 relative z-10">
      <Logo className="mb-6" />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search wallpapers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-charcoal/50 border-gray-700"
        />
      </div>

      <Tabs defaultValue="cultural" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-4 bg-charcoal/50">
          <TabsTrigger value="cultural">Cultural</TabsTrigger>
          <TabsTrigger value="landmarks">Landmarks</TabsTrigger>
          <TabsTrigger value="abstract">Abstract</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="cultural" className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            {culturalWallpapers.map((wallpaper) => (
              <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} onClick={() => handleWallpaperClick(wallpaper)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="landmarks" className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            {landmarksWallpapers.map((wallpaper) => (
              <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} onClick={() => handleWallpaperClick(wallpaper)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="abstract" className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            {abstractWallpapers.map((wallpaper) => (
              <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} onClick={() => handleWallpaperClick(wallpaper)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            {trendingWallpapers.map((wallpaper) => (
              <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} onClick={() => handleWallpaperClick(wallpaper)} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="w-full">
        <h2 className="text-xl font-bold font-playfair mb-4">Featured Premium Wallpapers</h2>

        <div className="grid grid-cols-2 gap-4">
          {featuredWallpapers.map((wallpaper) => (
            <FeaturedPremiumCard
              key={wallpaper.id}
              wallpaper={wallpaper}
              onClick={() => handleWallpaperClick(wallpaper)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface WallpaperCardProps {
  wallpaper: any
  onClick: () => void
}

function WallpaperCard({ wallpaper, onClick }: WallpaperCardProps) {
  return (
    <div
      className="relative rounded-lg overflow-hidden bg-charcoal/50 border border-gray-800 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <Image
          src={wallpaper.imageUrl || "/placeholder.svg"}
          alt={wallpaper.title}
          width={300}
          height={400}
          className="w-full h-40 object-cover"
        />
        {wallpaper.isPremium && (
          <div className="absolute top-2 right-2">
            <Crown className="h-5 w-5 text-pixelGold" />
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-playfair font-bold text-sm truncate">{wallpaper.title}</h3>
        <p className="text-gray-400 text-xs mb-2">by {wallpaper.creator}</p>

        <div className="flex items-center justify-between">
          <span className="font-poppins font-bold text-sm">₦{wallpaper.price}</span>
          {wallpaper.downloads && (
            <div className="flex items-center text-gray-400 text-xs">
              <Download className="h-3 w-3 mr-1" />
              {wallpaper.downloads}
            </div>
          )}
        </div>

        <Button className="w-full mt-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-poppins text-sm py-1 h-8 rounded-full secondary-glow">
          Buy Now
        </Button>
      </div>
    </div>
  )
}

interface FeaturedPremiumCardProps {
  wallpaper: any
  onClick: () => void
}

function FeaturedPremiumCard({ wallpaper, onClick }: FeaturedPremiumCardProps) {
  return (
    <div className="relative rounded-lg overflow-hidden group cursor-pointer" onClick={onClick}>
      <Image
        src={wallpaper.imageUrl || "/placeholder.svg"}
        alt={wallpaper.title}
        width={300}
        height={500}
        className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent/20 flex flex-col justify-end p-4">
        <div className="flex items-center mb-1">
          <Crown className="h-4 w-4 text-pixelGold mr-2" />
          <span className="text-pixelGold font-medium text-sm">Premium</span>
        </div>

        <h3 className="font-playfair font-bold text-lg text-white mb-1">{wallpaper.title}</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="font-poppins font-bold text-white">₦{wallpaper.price}</span>
        </div>

        <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-poppins font-medium py-1 rounded-full secondary-glow">
          Buy Now
        </Button>
      </div>
    </div>
  )
}

