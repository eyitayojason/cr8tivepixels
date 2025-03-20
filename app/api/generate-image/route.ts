import { NextResponse } from "next/server"
import OpenAI from "openai"
import { getRandomImage } from "@/lib/image-utils"

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
      console.warn("OpenAI API key is not configured. Using random image fallback.")
      const fallbackUrl = await getRandomImage(prompt)
      return NextResponse.json({
        success: true,
        url: fallbackUrl,
        message: "Image generated successfully (using random image - OpenAI API key not configured)",
      })
    }

    try {
      // Validate style and colorIntensity
      if (!style || !colorIntensity) {
        return NextResponse.json({ 
          success: false, 
          error: "Style and color intensity are required" 
        }, { status: 400 })
      }

      // Enhanced prompt with style and color intensity
      const enhancedPrompt = `Create a wallpaper with ${style} style and ${colorIntensity}% color intensity based on: ${prompt}. Make it visually striking and suitable as a mobile wallpaper with Nigerian cultural elements.`

      // Call OpenAI API to generate image
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        response_format: "url"
      })

      const imageUrl = response.data[0]?.url

      if (!imageUrl) {
        throw new Error("Failed to generate image URL")
      }

      return NextResponse.json({
        success: true,
        url: imageUrl,
        message: "Image generated successfully",
      })
    } catch (openaiError: any) {
      console.error("OpenAI API error:", openaiError)

      // Handle rate limits and specific OpenAI errors
      if (openaiError?.status === 429) {
        return NextResponse.json({
          success: false,
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: openaiError.headers?.get("retry-after") || 60
        }, { status: 429 })
      }

      // Handle content policy violations
      if (openaiError?.code === "content_policy_violation") {
        return NextResponse.json({
          success: false,
          error: "Content policy violation. Please modify your prompt."
        }, { status: 400 })
      }

      // Fallback to placeholder for other errors
      const fallbackUrl = await getRandomImage(prompt)
      return NextResponse.json({
        success: true,
        url: fallbackUrl,
        message: "Using random image due to API error: " + (openaiError.message || "Unknown error")
      })
    }
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ success: false, error: "Failed to generate image" }, { status: 500 })
  }
}

