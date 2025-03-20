import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { prompt, style, colorIntensity } = await request.json()

    // Validate inputs
    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 })
    }

    console.log("Generating image with prompt:", prompt, "style:", style, "colorIntensity:", colorIntensity)

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key is not configured. Using placeholder image.")
      return NextResponse.json({
        success: true,
        url: "/placeholder.svg?height=1024&width=1024",
        message: "Image generated successfully (placeholder - OpenAI API key not configured)",
      })
    }

    try {
      // Enhanced prompt with style and color intensity
      const enhancedPrompt = `Create a wallpaper with ${style} style and ${colorIntensity}% color intensity based on: ${prompt}. Make it visually striking and suitable as a mobile wallpaper with Nigerian cultural elements.`

      // Call OpenAI API to generate image
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
      })

      const imageUrl = response.data[0].url

      if (!imageUrl) {
        throw new Error("Failed to generate image URL")
      }

      return NextResponse.json({
        success: true,
        url: imageUrl,
        message: "Image generated successfully",
      })
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError)

      // Fallback to placeholder for demo
      return NextResponse.json({
        success: true,
        url: "/placeholder.svg?height=1024&width=1024",
        message: "Using placeholder image due to OpenAI API error",
      })
    }
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ success: false, error: "Failed to generate image" }, { status: 500 })
  }
}

