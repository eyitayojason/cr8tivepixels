import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("h-full w-full animate-pulse rounded-md bg-gray-700/50", className)} />
}

