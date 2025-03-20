"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/ui/spinner"

export default function AuthFallback() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { activateDemoMode, firebaseInitError } = useAuth()

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate email format
      if (!email.includes("@") || !email.includes(".")) {
        throw new Error("Please enter a valid email address")
      }

      // Simulate login delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Activate demo mode
      activateDemoMode(email)

      // Redirect to home
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Failed to login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold font-playfair mb-2 text-center">Demo Mode</h1>
      <p className="text-gray-400 text-center mb-6">
        {firebaseInitError ? 
          "Using demo mode because Firebase initialization failed." : 
          "Using demo mode because Firebase authentication is not available on this domain."}
      </p>

      {error && (
        <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900/50">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleDemoLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="bg-charcoal/50 border-gray-700"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-poppins font-bold py-6 rounded-full hover-glow"
        >
          {loading ? (
            <>
              <Spinner className="mr-2" />
              Logging in...
            </>
          ) : (
            "Continue with Demo Mode"
          )}
        </Button>

        <div className="text-center text-gray-400 text-sm mt-4">
          <p>This is a demo mode with limited functionality.</p>
          <p>No actual authentication is performed.</p>
        </div>
      </form>
    </div>
  )
}

