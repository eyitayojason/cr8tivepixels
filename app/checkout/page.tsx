"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import Logo from "@/components/logo"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { purchaseWallpaper } from "@/lib/wallpaper-service"
import ProtectedRoute from "@/components/protected-route"

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  )
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const wallpaperId = searchParams.get("wallpaperId")
  const router = useRouter()
  const { user } = useAuth()

  const [wallpaper, setWallpaper] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!wallpaperId) {
      router.push("/marketplace")
      return
    }

    async function fetchWallpaper() {
      try {
        const wallpaperDoc = await getDoc(doc(db, "wallpapers", wallpaperId))

        if (!wallpaperDoc.exists()) {
          throw new Error("Wallpaper not found")
        }

        setWallpaper({
          id: wallpaperDoc.id,
          ...wallpaperDoc.data(),
        })
      } catch (err) {
        console.error("Error fetching wallpaper:", err)
        setError("Failed to load wallpaper details")
      } finally {
        setLoading(false)
      }
    }

    fetchWallpaper()
  }, [wallpaperId, router])

  async function handlePayment() {
    if (!user || !wallpaper) return

    setProcessing(true)
    setError(null)

    try {
      // In a real app, you'd integrate with Paystack or Flutterwave here
      // For demo purposes, we'll simulate a successful payment

      // Record the purchase in Firebase
      await purchaseWallpaper(user.uid, wallpaper.id, wallpaper.price)

      // Redirect to success page
      router.push(`/checkout/success?wallpaperId=${wallpaper.id}`)
    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.message || "Payment failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Loading checkout...</p>
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
        <Link href="/generate" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Logo />
      </div>

      <h1 className="text-2xl font-bold font-playfair mb-6 text-center">Complete Your Purchase</h1>

      <div className="w-full max-w-md mx-auto">
        <div className="bg-charcoal/50 rounded-lg overflow-hidden border border-gray-800 mb-6">
          <div className="p-4">
            <h2 className="text-lg font-bold font-playfair mb-2">{wallpaper?.title || "Wallpaper"}</h2>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Resolution: {wallpaper?.resolution || "Standard"}</p>
                <p className="text-gray-400 text-sm">Style: {wallpaper?.style || "Default"}</p>
              </div>
              <div className="text-xl font-poppins font-bold">₦{wallpaper?.price || 0}</div>
            </div>

            <div className="relative rounded-lg overflow-hidden mb-4">
              <Image
                src={wallpaper?.imageUrl || "/placeholder.svg"}
                alt={wallpaper?.title || "Wallpaper"}
                width={400}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <div className="bg-charcoal/50 rounded-lg border border-gray-800 p-4 mb-6">
          <h3 className="text-lg font-bold font-playfair mb-4">Payment Summary</h3>

          <div className="flex justify-between mb-2">
            <span>Wallpaper Price</span>
            <span>₦{wallpaper?.price || 0}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Platform Fee (30%)</span>
            <span>₦{Math.round((wallpaper?.price || 0) * 0.3)}</span>
          </div>

          <div className="border-t border-gray-700 my-2"></div>

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₦{wallpaper?.price || 0}</span>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-poppins font-bold py-6 rounded-full secondary-glow"
        >
          {processing ? "Processing..." : "Pay with Paystack"}
          <CreditCard className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-center text-gray-400 text-sm mt-4">
          By completing this purchase, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

