import { Skeleton } from "@/components/ui/skeleton"
import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function ProfileSkeleton() {
  return (
    <div className="flex flex-col pt-6 pb-16">
      <div className="flex items-center justify-between mb-6">
        <Logo />
        <Button variant="ghost" size="icon" disabled>
          <LogOut className="h-5 w-5 opacity-50" />
        </Button>
      </div>

      <div className="flex flex-col items-center mb-6 relative z-10">
        {/* Avatar skeleton */}
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Username skeleton */}
        <Skeleton className="h-7 w-40 mb-1" />

        {/* Email skeleton */}
        <Skeleton className="h-5 w-48 mb-3" />

        {/* Premium button skeleton */}
        <Skeleton className="h-8 w-48 rounded-full" />
      </div>

      {/* Tabs skeleton */}
      <div className="w-full relative z-10">
        <Skeleton className="h-10 w-full mb-4 rounded-md" />

        <div className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>

          {/* Content skeleton */}
          <Skeleton className="h-60 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

