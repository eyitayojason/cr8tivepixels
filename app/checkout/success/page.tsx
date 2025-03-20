"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Home } from "lucide-react"
import Logo from "@/components/logo"
import Image from "next/image"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import ProtectedRoute from "@/components/protected-route"

export default function CheckoutSuccessPage() {
  return (
    <ProtectedRoute>
      <SuccessContent />
    </ProtectedRoute>
  )
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const wallpaperId = searchParams.get("wallpaperId")
  const router = useRouter()

  const [wallpaper, setWallpaper] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!wallpaperId) {
      router.push("/marketplace")
      return
    }

    async function fetchWallpaper() {
      try {
        const wallpaperDoc = await getDoc(doc(db, "wallpapers", wallpaperId))

        if (wallpaperDoc.exists()) {
          setWallpaper({
            id: wallpaperDoc.id,
            ...wallpaperDoc.data(),
          })
        }
      } catch (err) {
        console.error("Error fetching wallpaper:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchWallpaper()
  }, [wallpaperId, router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-6 pb-16 relative z-10">
      <Logo className="mb-6" />

      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold font-playfair mb-2">Payment Successful!</h1>

        <p className="text-gray-300 mb-6">Thank you for your purchase. Your wallpaper is ready to download.</p>

        {wallpaper && (
          <div className="bg-charcoal/50 rounded-lg overflow-hidden border border-gray-800 mb-6">
            <div className="relative">
              <Image
                src={wallpaper.imageUrl || "/placeholder.svg"}
                alt={wallpaper.title || "Wallpaper"}
                width={400}
                height={400}
                className="w-full h-auto"
              />
            </div>

            <div className="p-4">
              <h2 className="text-lg font-bold font-playfair mb-2">{wallpaper.title || "Wallpaper"}</h2>

              <p className="text-gray-400 text-sm mb-4">Resolution: {wallpaper.resolution || "Standard"}</p>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-poppins font-medium py-2 rounded-full hover-glow">
                Download Wallpaper
                <Download className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            onClick={() => router.push("/profile")}
            variant="outline"
            className="flex-1 border-gray-700 text-white font-poppins font-medium py-6 rounded-full"
          >
            View My Purchases
          </Button>

          <Button
            onClick={() => router.push("/")}
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-poppins font-medium py-6 rounded-full secondary-glow"
          >
            Back to Home
            <Home className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

