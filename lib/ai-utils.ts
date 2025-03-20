export async function generateWallpaper(prompt: string, style: string, colorIntensity: number) {
  try {
    // Call our internal API route
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        style,
        colorIntensity,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "Failed to generate image")
    }

    return {
      success: true,
      url: data.url,
    }
  } catch (error) {
    console.error("Error generating image:", error)
    return {
      success: false,
      error: "Failed to generate image. Please try again.",
      url: "/placeholder.svg?height=1024&width=1024",
    }
  }
}

