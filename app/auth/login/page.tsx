"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import Logo from "@/components/logo"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import AuthFallback from "@/components/auth-fallback"
import { Spinner } from "@/components/ui/spinner"
import Background from "@/components/background"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [useAuthFallback, setUseAuthFallback] = useState(false)
  const { signIn, signInWithGoogle, authError, isUsingDemoMode, firebaseInitError } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If already in demo mode, redirect to home
    if (isUsingDemoMode) {
      router.push("/")
    }

    // If Firebase failed to initialize, use fallback
    if (firebaseInitError) {
      setUseAuthFallback(true)
    }

    // If we get an auth error that suggests we should use demo mode
    if (
      authError &&
      (authError.includes("not enabled") ||
        authError.includes("not authorized") ||
        authError.includes("unauthorized-domain"))
    ) {
      setUseAuthFallback(true)
    }
  }, [authError, isUsingDemoMode, router, firebaseInitError])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      router.push("/")
    } catch (error: any) {
      console.error("Login error:", error)
      // If we get an error that suggests we should use demo mode
      if (error.code === "auth/operation-not-allowed" || error.code === "auth/unauthorized-domain") {
        setUseAuthFallback(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)

    try {
      await signInWithGoogle()
      router.push("/")
    } catch (error: any) {
      console.error("Google login error:", error)
      // If we get an error that suggests we should use demo mode
      if (error.code === "auth/operation-not-allowed" || error.code === "auth/unauthorized-domain") {
        setUseAuthFallback(true)
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <>
      <Background />
      <div className="flex flex-col pt-6 pb-16 relative z-10">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Logo />
        </div>

        <div className="w-full max-w-md mx-auto">
          {useAuthFallback ? (
            <AuthFallback />
          ) : (
            <>
              <h1 className="text-2xl font-bold font-playfair mb-6 text-center">Log In to Your Account</h1>

              {authError && (
                <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900/50">
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
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
                    disabled={loading || googleLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-charcoal/50 border-gray-700"
                    disabled={loading || googleLoading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-poppins font-bold py-6 rounded-full hover-glow"
                >
                  {loading ? (
                    <>
                      <Spinner className="mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-gray-700 w-full"></div>
                  <div className="bg-background px-4 text-gray-400 text-sm">OR</div>
                  <div className="border-t border-gray-700 w-full"></div>
                </div>

                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading || googleLoading}
                  variant="outline"
                  className="w-full border-gray-700 text-white font-poppins font-medium py-6 rounded-full"
                >
                  {googleLoading ? (
                    <>
                      <Spinner className="mr-2" />
                      Connecting to Google...
                    </>
                  ) : (
                    "Continue with Google"
                  )}
                </Button>

                <div className="text-center text-gray-400 text-sm">
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-primary hover:underline">
                    Sign Up
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}

