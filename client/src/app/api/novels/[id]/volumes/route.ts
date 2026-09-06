import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { MOCK_NOVEL_DETAILS, getNovelById } from "@/data/mock-novel-data"
import type { Volume } from "@/data/mock-novel-data"

function getNovelsJsonPath(): string {
  const possiblePaths = [
    path.join(process.cwd(), "src", "data", "novels-data.json"),
    path.join(process.cwd(), "client", "src", "data", "novels-data.json"),
  ]
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p
  }
  return possiblePaths[0]
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const filePath = getNovelsJsonPath()
    let data: Record<string, any> = {}
    if (fs.existsSync(filePath)) {
      const raw = await fs.promises.readFile(filePath, "utf-8")
      data = JSON.parse(raw)
    }
    const novel = data[id] || getNovelById(id)
    return NextResponse.json({ volumes: novel?.volumes || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { volumes } = body as { volumes: Volume[] }

    if (!Array.isArray(volumes)) {
      return NextResponse.json({ error: "Dữ liệu tập không hợp lệ" }, { status: 400 })
    }

    const filePath = getNovelsJsonPath()
    const raw = await fs.promises.readFile(filePath, "utf-8")
    const data = JSON.parse(raw)

    if (!data[id]) {
      const fallbackNovel = getNovelById(id)
      data[id] = {
        ...JSON.parse(JSON.stringify(fallbackNovel)),
        volumes: volumes,
      }
    } else {
      data[id].volumes = volumes
    }

    // Recalculate total novel wordCount across all chapters
    let totalWordCount = 0
    volumes.forEach((vol) => {
      vol.chapters?.forEach((chap) => {
        totalWordCount += chap.wordCount || 0
      })
    })
    data[id].wordCount = totalWordCount
    data[id].lastUpdate = "Vừa xong"

    // Write formatted JSON back to file
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")

    // Update in-memory singleton
    const numericId = Number(id)
    if (MOCK_NOVEL_DETAILS[numericId]) {
      MOCK_NOVEL_DETAILS[numericId].volumes = volumes
      MOCK_NOVEL_DETAILS[numericId].wordCount = totalWordCount
      MOCK_NOVEL_DETAILS[numericId].lastUpdate = "Vừa xong"
    }

    return NextResponse.json({
      success: true,
      message: "Đã lưu thay đổi vào file novels-data.json thành công",
      volumes,
      totalWordCount,
    })
  } catch (err: any) {
    console.error("Error saving volumes to JSON:", err)
    return NextResponse.json({ error: err.message || "Lỗi lưu file JSON" }, { status: 500 })
  }
}
