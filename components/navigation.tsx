"use client"

import type React from "react"

import { Home, ShoppingBag, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function Navigation() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-charcoal border-t border-gray-800 py-2 z-20">
      <div className="container mx-auto flex justify-around items-center">
        <NavItem href="/" icon={<Home className="w-6 h-6" />} label="Home" isActive={pathname === "/"} />
        <NavItem
          href="/marketplace"
          icon={<ShoppingBag className="w-6 h-6" />}
          label="Marketplace"
          isActive={pathname === "/marketplace"}
        />
        <NavItem
          href={user ? "/profile" : "/auth/login"}
          icon={<User className="w-6 h-6" />}
          label={user ? "Profile" : "Login"}
          isActive={pathname === "/profile" || pathname.startsWith("/auth/")}
        />
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
        isActive ? "text-primary" : "text-gray-400 hover:text-gray-200"
      }`}
    >
      <div className={`pixelated ${isActive ? "pixel-burst" : ""}`}>{icon}</div>
      <span className="text-xs mt-1">{label}</span>
    </Link>
  )
}

