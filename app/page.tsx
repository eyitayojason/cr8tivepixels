import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-8 pb-16 relative z-10">
      <Logo className="mb-8" />

      <div className="w-full max-w-md mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold font-playfair mb-4">Create Stunning AI Wallpapers</h1>
        <p className="text-gray-300 mb-6">
          Generate unique wallpapers inspired by Nigerian culture and your imagination
        </p>

        <Link href="/generate">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-poppins font-bold text-lg px-8 py-6 rounded-full hover-glow">
            Generate Wallpaper
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto mb-8">
        <FeaturedWallpaper
          src="/placeholder.svg?height=400&width=300"
          alt="Nigerian Cultural Art"
          title="Cultural Art"
          isPremium
        />
        <FeaturedWallpaper src="/placeholder.svg?height=400&width=300" alt="Lagos Skyline" title="Lagos Skyline" />
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-playfair">Trending Wallpapers</h2>
          <Link href="/marketplace" className="text-primary flex items-center hover:underline">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TrendingWallpaper
            src="/placeholder.svg?height=300&width=200"
            alt="Igbo Masquerade"
            title="Igbo Masquerade"
            downloads="1.2k"
          />
          <TrendingWallpaper
            src="/placeholder.svg?height=300&width=200"
            alt="Yoruba Patterns"
            title="Yoruba Patterns"
            downloads="980"
          />
          <TrendingWallpaper
            src="/placeholder.svg?height=300&width=200"
            alt="Abuja Monument"
            title="Abuja Monument"
            downloads="850"
          />
          <TrendingWallpaper
            src="/placeholder.svg?height=300&width=200"
            alt="Pixel Nigeria"
            title="Pixel Nigeria"
            downloads="720"
          />
        </div>
      </div>
    </div>
  )
}

interface FeaturedWallpaperProps {
  src: string
  alt: string
  title: string
  isPremium?: boolean
}

function FeaturedWallpaper({ src, alt, title, isPremium }: FeaturedWallpaperProps) {
  return (
    <div className="relative rounded-lg overflow-hidden group">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={300}
        height={400}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium text-sm truncate">{title}</h3>
          {isPremium && (
            <span className="bg-pixelGold text-black text-xs px-2 py-0.5 rounded-full font-bold">Premium</span>
          )}
        </div>
      </div>
    </div>
  )
}

interface TrendingWallpaperProps {
  src: string
  alt: string
  title: string
  downloads: string
}

function TrendingWallpaper({ src, alt, title, downloads }: TrendingWallpaperProps) {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <Image src={src || "/placeholder.svg"} alt={alt} width={200} height={300} className="w-full h-32 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
        <h3 className="text-white font-medium text-xs truncate">{title}</h3>
        <div className="flex items-center text-gray-300 text-xs">
          <span>{downloads} downloads</span>
        </div>
      </div>
    </div>
  )
}

