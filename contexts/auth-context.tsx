"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
} from "firebase/auth"
import { getRandomProfileImage } from "@/lib/image-utils"
import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase only on client side
let auth: ReturnType<typeof getAuth> | undefined
let db: ReturnType<typeof getFirestore> | undefined
let storage: ReturnType<typeof getStorage> | undefined
let firebaseInitialized = false

// Only initialize Firebase once
function initializeFirebase() {
  if (typeof window !== "undefined" && !firebaseInitialized && !getApps().length) {
    try {
      const app = initializeApp(firebaseConfig)
      auth = getAuth(app)
      db = getFirestore(app)
      storage = getStorage(app)
      firebaseInitialized = true
      console.log("Firebase initialized successfully")
      return { auth, db, storage }
    } catch (error) {
      console.error("Error initializing Firebase:", error)
      console.warn("Falling back to demo mode due to Firebase initialization error")
      return { auth: undefined, db: undefined, storage: undefined }
    }
  }
  return { auth, db, storage }
}

// Initialize Firebase services
const { auth: initializedAuth, db: initializedDb, storage: initializedStorage } = initializeFirebase()

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  authError: string | null
  isUsingDemoMode: boolean
  activateDemoMode: (email: string) => void
  displayName?: string | null
  photoURL?: string | null
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {
    throw new Error("Auth context not initialized")
  },
  signIn: async () => {
    throw new Error("Auth context not initialized")
  },
  signInWithGoogle: async () => {
    throw new Error("Auth context not initialized")
  },
  logout: async () => {
    throw new Error("Auth context not initialized")
  },
  authError: null,
  isUsingDemoMode: false,
  activateDemoMode: () => {},
})

// Use a single instance of the context provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isUsingDemoMode, setIsUsingDemoMode] = useState(false)

  useEffect(() => {
    // Check for demo user on mount
    if (typeof window !== "undefined") {
      const demoUser = localStorage.getItem("demoUser")
      if (demoUser) {
        setIsUsingDemoMode(true)
        setLoading(false)
      } else if (!initializedAuth) {
        // If Firebase is not initialized, activate demo mode
        setIsUsingDemoMode(true)
        setLoading(false)
      } else {
        // Set up auth state listener
        const unsubscribe = onAuthStateChanged(
          initializedAuth,
          (user) => {
            setUser(user)
            setLoading(false)
          },
          (error) => {
            console.error("Auth state change error:", error)
            setLoading(false)
          },
        )

        // Cleanup subscription
        return () => unsubscribe()
      }
    }
  }, [])

  const handleAuthError = (error: any) => {
    console.error("Authentication error:", error)
    const errorMessage = error.code ? `Authentication error: ${error.code}` : error.message || "An authentication error occurred."
    setAuthError(errorMessage)

    // Only activate demo mode for specific errors
    if (
      error.code === "auth/operation-not-allowed" ||
      error.code === "auth/unauthorized-domain" ||
      error.code === "auth/configuration-not-found"
    ) {
      setIsUsingDemoMode(true)
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!initializedAuth) {
      setIsUsingDemoMode(true)
      return
    }
    setAuthError(null)

    try {
      await createUserWithEmailAndPassword(initializedAuth, email, password)
    } catch (error) {
      handleAuthError(error)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!initializedAuth) {
      setIsUsingDemoMode(true)
      return
    }
    setAuthError(null)

    try {
      await signInWithEmailAndPassword(initializedAuth, email, password)
    } catch (error) {
      handleAuthError(error)
    }
  }

  const signInWithGoogle = async () => {
    if (!initializedAuth) {
      setIsUsingDemoMode(true)
      return
    }
    setAuthError(null)

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(initializedAuth, provider)
    } catch (error) {
      handleAuthError(error)
    }
  }

  const logout = async () => {
    if (isUsingDemoMode) {
      localStorage.removeItem("demoUser")
      setIsUsingDemoMode(false)
      return
    }

    if (!initializedAuth) {
      setIsUsingDemoMode(true)
      return
    }
    setAuthError(null)

    try {
      await signOut(initializedAuth)
    } catch (error) {
      handleAuthError(error)
    }
  }

  const activateDemoMode = async (email: string) => {
    // Get a random profile image
    const photoURL = await getRandomProfileImage(email.split("@")[0])
    
    // Create a demo user in localStorage
    const demoUser = {
      email,
      displayName: email.split("@")[0],
      photoURL,
      uid: `demo-${Date.now()}`,
      isDemo: true,
    }

    localStorage.setItem("demoUser", JSON.stringify(demoUser))
    setIsUsingDemoMode(true)
    setLoading(false)
  }

  const value = {
    user: isUsingDemoMode ? JSON.parse(localStorage.getItem("demoUser") || "{}") : user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    authError,
    isUsingDemoMode,
    activateDemoMode,
    displayName: isUsingDemoMode ? JSON.parse(localStorage.getItem("demoUser") || "{}").displayName : user?.displayName,
    photoURL: isUsingDemoMode ? JSON.parse(localStorage.getItem("demoUser") || "{}").photoURL : user?.photoURL,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)

// Export Firebase services
export { initializedAuth as auth, initializedDb as db, initializedStorage as storage }

