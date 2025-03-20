"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Logo from "@/components/logo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Crown, Download, Upload, DollarSign, LogOut } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import ProfileSkeleton from "@/components/profile-skeleton"

interface UserProfile {
  username: string
  email: string
  isPremium: boolean
  earnings: number
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    const fetchUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.email || ""))
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile)
        } else {
          // Create a default profile if none exists
          setProfile({
            username: user.displayName || "User",
            email: user.email || "",
            isPremium: false,
            earnings: 0,
          })
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [user, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const navigateToGenerate = () => {
    router.push("/generate")
  }

  if (loading) {
    return <ProfileSkeleton />
  }

  return (
    <div className="flex flex-col pt-6 pb-16 relative z-10">
      <div className="flex items-center justify-between mb-6">
        <Logo />
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-3">
          {user?.photoURL ? (
            <Image
              src={user.photoURL || "/placeholder.svg"}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <span className="text-2xl">👤</span>
          )}
        </div>
        <h1 className="text-xl font-bold font-playfair mb-1">{profile?.username || "User"}</h1>
        <p className="text-gray-400 text-sm mb-3">{profile?.email}</p>

        {!profile?.isPremium ? (
          <Button className="bg-pixelGold hover:bg-pixelGold/90 text-black font-poppins font-medium text-sm py-1 h-8 rounded-full flex items-center">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        ) : (
          <div className="flex items-center bg-pixelGold/20 text-pixelGold px-3 py-1 rounded-full">
            <Crown className="h-4 w-4 mr-2" />
            <span className="font-medium text-sm">Premium Member</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="creations" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-charcoal/50">
          <TabsTrigger value="creations">My Creations</TabsTrigger>
          <TabsTrigger value="purchased">Purchased</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="creations" className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold font-playfair">Your Creations</h2>
            <Button
              variant="outline"
              className="border-gray-700 text-white font-poppins text-sm py-1 h-8 rounded-full flex items-center"
              onClick={navigateToGenerate}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New
            </Button>
          </div>

          {/* Empty state */}
          <div className="text-center py-10 bg-charcoal/30 rounded-lg border border-gray-800">
            <div className="flex justify-center mb-4">
              <Image
                src="/placeholder.svg?height=100&width=100"
                alt="No creations"
                width={100}
                height={100}
                className="opacity-50"
              />
            </div>
            <h3 className="text-lg font-medium mb-2">No creations yet</h3>
            <p className="text-gray-400 text-sm mb-4">Generate your first wallpaper to see it here</p>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-poppins font-medium"
              onClick={navigateToGenerate}
            >
              Generate Wallpaper
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="purchased" className="pt-4">
          <h2 className="text-lg font-bold font-playfair mb-4">Purchased Wallpapers</h2>

          <div className="grid grid-cols-2 gap-4">
            <PurchasedWallpaperCard
              src="/placeholder.svg?height=400&width=300"
              alt="Lagos Skyline"
              title="Lagos Skyline"
              date="Mar 15, 2025"
            />
            <PurchasedWallpaperCard
              src="/placeholder.svg?height=400&width=300"
              alt="Tribal Patterns"
              title="Tribal Patterns"
              date="Mar 10, 2025"
            />
          </div>
        </TabsContent>

        <TabsContent value="earnings" className="pt-4">
          <div className="bg-charcoal/30 rounded-lg border border-gray-800 p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold font-playfair">Total Earnings</h2>
              <span className="text-xl font-poppins font-bold">₦0.00</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-charcoal/50 rounded-lg p-3">
                <div className="text-gray-400 text-sm mb-1">Wallpapers Sold</div>
                <div className="text-lg font-bold">0</div>
              </div>
              <div className="bg-charcoal/50 rounded-lg p-3">
                <div className="text-gray-400 text-sm mb-1">This Month</div>
                <div className="text-lg font-bold">₦0.00</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold font-playfair">Recent Transactions</h2>
          </div>

          {/* Empty state */}
          <div className="text-center py-10 bg-charcoal/30 rounded-lg border border-gray-800">
            <div className="flex justify-center mb-4">
              <DollarSign className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">No earnings yet</h3>
            <p className="text-gray-400 text-sm mb-4">Start selling your creations to earn money</p>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-poppins font-medium"
              onClick={navigateToGenerate}
            >
              List a Wallpaper
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PurchasedWallpaperCardProps {
  src: string
  alt: string
  title: string
  date: string
}

function PurchasedWallpaperCard({ src, alt, title, date }: PurchasedWallpaperCardProps) {
  return (
    <div className="relative rounded-lg overflow-hidden bg-charcoal/50 border border-gray-800">
      <Image src={src || "/placeholder.svg"} alt={alt} width={300} height={400} className="w-full h-40 object-cover" />

      <div className="p-3">
        <h3 className="font-playfair font-bold text-sm truncate">{title}</h3>
        <p className="text-gray-400 text-xs mb-2">Purchased on {date}</p>

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-poppins text-sm py-1 h-8 rounded-full hover-glow">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  )
}

