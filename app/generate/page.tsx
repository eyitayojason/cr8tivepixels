"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sparkles, Download, ArrowLeft, Share2 } from "lucide-react"
import Logo from "@/components/logo"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function GeneratePage() {
  return (
    <ProtectedRoute>
      <GenerateContent />
    </ProtectedRoute>
  )
}

function GenerateContent() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("realistic")
  const [resolution, setResolution] = useState("standard")
  const [colorIntensity, setColorIntensity] = useState([50])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [wallpaperId, setWallpaperId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  async function handleGenerate() {
    if (!prompt) {
      setError("Please enter a prompt")
      return
    }

    if (!user) {
      router.push("/auth/login")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Call our API to generate the image
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style,
          colorIntensity: colorIntensity[0],
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to generate image")
      }

      const imageUrl = data.url
      const wallpaperId = `generated-${Date.now()}`

      setGeneratedImage(imageUrl)
      setWallpaperId(wallpaperId)
    } catch (err: any) {
      console.error("Error generating image:", err)
      setError(err.message || "Failed to generate image. Please try again.")
      // Fallback to placeholder for demo purposes
      setGeneratedImage("/placeholder.svg?height=1024&width=1024")
    } finally {
      setIsGenerating(false)
    }
  }

  async function handlePurchase() {
    if (!user || !wallpaperId) return

    setDownloadLoading(true)

    try {
      // For premium resolutions, redirect to payment
      if (resolution !== "standard") {
        router.push(`/checkout?wallpaperId=${wallpaperId}`)
      } else {
        // For standard resolution, just download
        // In a real app, you'd implement the download functionality
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate download
        alert("Downloading standard resolution wallpaper...")
      }
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setDownloadLoading(false)
    }
  }

  async function handleShare() {
    setShareLoading(true)

    try {
      // Simulate share functionality
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (navigator.share) {
        await navigator.share({
          title: "My Generated Wallpaper",
          text: "Check out this wallpaper I created with Cr8tivePixels!",
          url: window.location.href,
        })
      } else {
        alert("Sharing functionality is not available on this device")
      }
    } catch (err) {
      console.error("Error sharing:", err)
    } finally {
      setShareLoading(false)
    }
  }

  return (
    <div className="flex flex-col pt-6 pb-16 relative z-10">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Logo />
      </div>

      <h1 className="text-2xl font-bold font-playfair mb-6 text-center">Generate Your Wallpaper</h1>

      <div className="w-full max-w-md mx-auto mb-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe your wallpaper</Label>
            <Input
              id="prompt"
              placeholder="e.g., Igbo masquerade in vibrant colors"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-charcoal/50 border-gray-700"
              disabled={isGenerating}
            />
          </div>

          <Tabs defaultValue="style" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-charcoal/50">
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="resolution">Resolution</TabsTrigger>
            </TabsList>
            <TabsContent value="style" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Select Style</Label>
                <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
                  <SelectTrigger className="bg-charcoal/50 border-gray-700">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="abstract">Abstract</SelectItem>
                    <SelectItem value="pixel-art">Pixel Art</SelectItem>
                    <SelectItem value="watercolor">Watercolor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color Intensity: {colorIntensity}%</Label>
                <Slider
                  value={colorIntensity}
                  onValueChange={setColorIntensity}
                  max={100}
                  step={1}
                  disabled={isGenerating}
                />
              </div>
            </TabsContent>
            <TabsContent value="resolution" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Select Resolution</Label>
                <Select value={resolution} onValueChange={setResolution} disabled={isGenerating}>
                  <SelectTrigger className="bg-charcoal/50 border-gray-700">
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (Free)</SelectItem>
                    <SelectItem value="hd">HD (₦350)</SelectItem>
                    <SelectItem value="ultra-hd">Ultra HD (₦500)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <div className="flex items-center text-sm text-gray-400">
                  <span className="mr-2">•</span>
                  <span>Standard: Free with watermark</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="mr-2">•</span>
                  <span>HD/Ultra HD: Premium quality, no watermark</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900/50">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-poppins font-bold py-6 rounded-full hover-glow"
          >
            {isGenerating ? (
              <>
                <Spinner className="mr-2" />
                Generating...
              </>
            ) : (
              <>
                Generate Wallpaper
                <Sparkles className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>

      {generatedImage && (
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-xl font-bold font-playfair mb-4 text-center">Your Wallpaper</h2>

          <div className="relative rounded-lg overflow-hidden mb-4">
            <Image
              src={generatedImage || "/placeholder.svg"}
              alt="Generated wallpaper"
              width={1024}
              height={1024}
              className="w-full h-auto"
            />
            {resolution === "standard" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-opacity-50 font-bold text-2xl rotate-45">PREVIEW</div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handlePurchase}
              disabled={downloadLoading}
              className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-poppins font-medium py-6 rounded-full secondary-glow"
            >
              {downloadLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  {resolution === "standard" ? "Download Free" : "Buy Full Version"}
                  <Download className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleShare}
              disabled={shareLoading}
              className="flex-1 border-gray-700 text-white font-poppins font-medium py-6 rounded-full"
            >
              {shareLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Sharing...
                </>
              ) : (
                <>
                  Share
                  <Share2 className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

