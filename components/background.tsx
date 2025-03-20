"use client"

import { useEffect, useState, useRef } from "react"

export default function Background() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current

    if (video) {
      // Handle video load success
      const handleLoadedData = () => {
        setIsVideoLoaded(true)
      }

      // Handle video load error
      const handleError = () => {
        console.error("Video failed to load")
        setVideoError(true)
      }

      video.addEventListener("loadeddata", handleLoadedData)
      video.addEventListener("error", handleError)

      // Try to play the video (needed for some browsers)
      video.play().catch((err) => {
        console.error("Video play failed:", err)
        setVideoError(true)
      })

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData)
        video.removeEventListener("error", handleError)
      }
    }
  }, [])

  return (
    <>
      {/* Static gradient background is always visible as fallback */}
      <div className="fixed inset-0 bg-gradient-to-b from-charcoal to-midnight -z-20"></div>

      {/* Video background */}
      <video
        ref={videoRef}
        className={`fixed inset-0 object-cover w-full h-full -z-10 ${isVideoLoaded ? "opacity-100" : "opacity-0"}`}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/28860-372055467_medium.mp4" type="video/mp4" />
      </video>

      {/* Overlay to darken the video */}
      <div className="fixed inset-0 bg-black/60 -z-5"></div>
    </>
  )
}

