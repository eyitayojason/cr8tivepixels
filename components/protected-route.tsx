"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isUsingDemoMode } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (user || isUsingDemoMode) {
        setIsAuthorized(true)
      } else {
        router.push("/auth/login")
      }
    }
  }, [user, loading, router, isUsingDemoMode])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return isAuthorized ? <>{children}</> : null
}

