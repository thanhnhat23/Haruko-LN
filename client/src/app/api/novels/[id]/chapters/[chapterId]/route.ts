import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { MOCK_NOVEL_DETAILS, getNovelById } from "@/data/mock-novel-data"

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const { id, chapterId } = await params
    const body = await req.json()
    const targetChapId = Number(chapterId)

    const filePath = getNovelsJsonPath()
    let data: Record<string, any> = {}
    if (fs.existsSync(filePath)) {
      const raw = await fs.promises.readFile(filePath, "utf-8")
      data = JSON.parse(raw)
    }

    let novel = data[id]
    if (!novel) {
      const fallbackNovel = getNovelById(id)
      data[id] = JSON.parse(JSON.stringify(fallbackNovel))
      novel = data[id]
    }
    if (!novel || !Array.isArray(novel.volumes)) {
      return NextResponse.json({ error: "Không tìm thấy tiểu thuyết" }, { status: 404 })
    }

    let found = false
    let updatedChapter = null

    for (const vol of novel.volumes) {
      if (!Array.isArray(vol.chapters)) continue
      const idx = vol.chapters.findIndex((c: any) => c.id === targetChapId)
      if (idx !== -1) {
        const current = vol.chapters[idx]
        const newContent = body.content !== undefined ? body.content : current.content
        const trimmed = typeof newContent === "string" ? newContent.trim() : ""
        const calculatedWords = trimmed ? trimmed.split(/\s+/).length : 0

        vol.chapters[idx] = {
          ...current,
          title: body.title !== undefined ? body.title : current.title,
          chapterNumber: body.chapterNumber !== undefined ? body.chapterNumber : current.chapterNumber,
          orderIndex: body.orderIndex !== undefined ? Number(body.orderIndex) : current.orderIndex,
          content: newContent,
          wordCount: calculatedWords,
          hasIllustration: body.hasIllustration !== undefined ? body.hasIllustration : current.hasIllustration,
          images: body.images !== undefined ? body.images : current.images,
          updatedAt: "Vừa xong",
        }
        found = true
        updatedChapter = vol.chapters[idx]
        break
      }
    }

    if (!found) {
      return NextResponse.json({ error: "Không tìm thấy chương này trong tiểu thuyết" }, { status: 404 })
    }

    // Recalculate novel wordCount
    let totalWords = 0
    novel.volumes.forEach((vol: any) => {
      vol.chapters?.forEach((c: any) => {
        totalWords += c.wordCount || 0
      })
    })
    novel.wordCount = totalWords
    novel.lastUpdate = "Vừa xong"

    // Write back to JSON
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")

    // Update in-memory singleton
    const numericId = Number(id)
    if (MOCK_NOVEL_DETAILS[numericId]) {
      MOCK_NOVEL_DETAILS[numericId].volumes = novel.volumes
      MOCK_NOVEL_DETAILS[numericId].wordCount = totalWords
      MOCK_NOVEL_DETAILS[numericId].lastUpdate = "Vừa xong"
    }

    return NextResponse.json({
      success: true,
      message: "Đã lưu chương vào file novels-data.json thành công",
      chapter: updatedChapter,
    })
  } catch (err: any) {
    console.error("Error saving chapter to JSON:", err)
    return NextResponse.json({ error: err.message || "Lỗi lưu file JSON" }, { status: 500 })
  }
}
