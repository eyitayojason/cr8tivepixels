import Image from "next/image"
import Link from "next/link"

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`block ${className}`}>
      <div className="flex items-center justify-center">
        <Image src="/logo.png" alt="Cr8tivePixels Logo" width={200} height={50} className="h-10 w-auto" priority />
      </div>
    </Link>
  )
}

