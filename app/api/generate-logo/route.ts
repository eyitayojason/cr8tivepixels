import { NextResponse } from "next/server"
import { createCanvas } from "canvas"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Check if the logo already exists
    const publicDir = path.join(process.cwd(), "public")
    const logoPath = path.join(publicDir, "logo.png")

    if (fs.existsSync(logoPath)) {
      return NextResponse.json({ success: true, message: "Logo already exists" })
    }

    // Create a canvas
    const canvas = createCanvas(200, 50)
    const ctx = canvas.getContext("2d")

    // Background
    ctx.fillStyle = "transparent"
    ctx.fillRect(0, 0, 200, 50)

    // Draw text
    ctx.font = "bold 24px Arial"
    ctx.fillStyle = "#F5A623" // Primary color
    ctx.fillText("Cr8tive", 10, 30)

    ctx.fillStyle = "#FF5722" // Secondary color
    ctx.fillText("Pixels", 100, 30)

    // Save the canvas to a file
    const buffer = canvas.toBuffer("image/png")
    fs.writeFileSync(logoPath, buffer)

    return NextResponse.json({ success: true, message: "Logo generated successfully" })
  } catch (error) {
    console.error("Error generating logo:", error)
    return NextResponse.json({ success: false, error: "Failed to generate logo" }, { status: 500 })
  }
}

