import { Skeleton } from "@/components/ui/skeleton"
import Logo from "@/components/logo"

export default function MarketplaceSkeleton() {
  return (
    <div className="flex flex-col pt-6 pb-16 relative z-10">
      <Logo className="mb-6" />

      {/* Search bar skeleton */}
      <Skeleton className="h-10 w-full mb-6 rounded-md" />

      {/* Tabs skeleton */}
      <Skeleton className="h-10 w-full mb-6 rounded-md" />

      {/* Wallpaper grid skeleton */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <Skeleton className="h-40 w-full mb-2" />
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-8 w-full rounded-full" />
            </div>
          ))}
      </div>

      {/* Featured section skeleton */}
      <Skeleton className="h-7 w-64 mb-4" />
      <div className="grid grid-cols-2 gap-4">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-60 w-full rounded-lg" />
          ))}
      </div>
    </div>
  )
}

