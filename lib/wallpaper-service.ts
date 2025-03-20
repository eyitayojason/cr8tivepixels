import { db, storage } from "@/lib/firebase"
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore"

// Helper function to check if Firebase is initialized
function checkFirebaseInitialized() {
  if (!db || !storage) {
    throw new Error("Firebase not initialized")
  }
}

// Generate a wallpaper and save it to Firebase
export async function generateAndSaveWallpaper(
  prompt: string,
  style: string,
  colorIntensity: number,
  resolution: string,
  userId: string,
) {
  try {
    checkFirebaseInitialized()

    // Call our API to generate the image
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        style,
        colorIntensity,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "Failed to generate image")
    }

    // For demo purposes, we're using a placeholder
    // In a real app, we'd get the base64 image from the API
    const imageUrl = data.url

    // In a real implementation, we would:
    // 1. Upload the image to Firebase Storage
    // const storageRef = ref(storage, `wallpapers/${userId}/${Date.now()}.png`)
    // await uploadString(storageRef, imageBase64, 'data_url')
    // const downloadURL = await getDownloadURL(storageRef)

    // 2. Save the wallpaper metadata to Firestore
    const wallpaperRef = await addDoc(collection(db, "wallpapers"), {
      title: prompt,
      description: `Generated with ${style} style and ${colorIntensity}% color intensity`,
      imageUrl: imageUrl, // In a real app, this would be downloadURL
      thumbnailUrl: imageUrl, // In a real app, we'd create a thumbnail
      creatorId: userId,
      price: resolution === "standard" ? 0 : resolution === "hd" ? 350 : 500,
      resolution,
      style,
      colorIntensity,
      downloads: 0,
      createdAt: new Date().toISOString(),
      isPublished: true,
      category: "custom",
    })

    return {
      id: wallpaperRef.id,
      imageUrl: imageUrl,
    }
  } catch (error) {
    console.error("Error generating and saving wallpaper:", error)
    throw error
  }
}

// Get trending wallpapers
export async function getTrendingWallpapers(limit = 4) {
  try {
    checkFirebaseInitialized()

    const q = query(
      collection(db, "wallpapers"),
      where("isPublished", "==", true),
      orderBy("downloads", "desc"),
      limit(limit),
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting trending wallpapers:", error)
    return []
  }
}

// Get wallpapers by category
export async function getWallpapersByCategory(category: string, limit = 10) {
  try {
    checkFirebaseInitialized()

    const q = query(
      collection(db, "wallpapers"),
      where("category", "==", category),
      where("isPublished", "==", true),
      orderBy("createdAt", "desc"),
      limit(limit),
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error(`Error getting ${category} wallpapers:`, error)
    return []
  }
}

// Get user's created wallpapers
export async function getUserWallpapers(userId: string) {
  try {
    checkFirebaseInitialized()

    const q = query(collection(db, "wallpapers"), where("creatorId", "==", userId), orderBy("createdAt", "desc"))

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting user wallpapers:", error)
    return []
  }
}

// Get user's purchased wallpapers
export async function getUserPurchases(userId: string) {
  try {
    checkFirebaseInitialized()

    const q = query(collection(db, "purchases"), where("userId", "==", userId), orderBy("timestamp", "desc"))

    const snapshot = await getDocs(q)
    const purchases = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Get the actual wallpaper data for each purchase
    const wallpapers = await Promise.all(
      purchases.map(async (purchase) => {
        const wallpaperDoc = await getDoc(doc(db, "wallpapers", purchase.wallpaperId))
        return {
          ...purchase,
          wallpaper: {
            id: wallpaperDoc.id,
            ...wallpaperDoc.data(),
          },
        }
      }),
    )

    return wallpapers
  } catch (error) {
    console.error("Error getting user purchases:", error)
    return []
  }
}

// Purchase a wallpaper
export async function purchaseWallpaper(userId: string, wallpaperId: string, amount: number) {
  try {
    checkFirebaseInitialized()

    // Create a purchase record
    const purchaseRef = await addDoc(collection(db, "purchases"), {
      userId,
      wallpaperId,
      amount,
      timestamp: new Date().toISOString(),
      transactionId: `tr_${Date.now()}`,
    })

    // Update the wallpaper download count
    await updateDoc(doc(db, "wallpapers", wallpaperId), {
      downloads: increment(1),
    })

    // Get the wallpaper creator
    const wallpaperDoc = await getDoc(doc(db, "wallpapers", wallpaperId))
    const creatorId = wallpaperDoc.data()?.creatorId

    // Update the creator's earnings (70% of the amount)
    if (creatorId) {
      const creatorEarnings = amount * 0.7
      await updateDoc(doc(db, "users", creatorId), {
        earnings: increment(creatorEarnings),
      })
    }

    return {
      success: true,
      purchaseId: purchaseRef.id,
    }
  } catch (error) {
    console.error("Error purchasing wallpaper:", error)
    throw error
  }
}

