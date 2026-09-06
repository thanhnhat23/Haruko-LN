"use client"

import { useState } from "react"
import type { Volume, Chapter, ChapterImage } from "@/data/mock-novel-data"

export interface VolumeModalState {
  isOpen: boolean
  mode: "add" | "edit"
  volId?: number
  number: number
  title: string
  cover: string
}

export interface ChapterModalState {
  isOpen: boolean
  mode: "add" | "edit"
  volId: number
  chapterId?: number
  chapterNumber: number | string
  title: string
  orderIndex: number
  content: string
  hasIllustration: boolean
  images?: ChapterImage[]
}

// Count words in text
export const countWords = (text: string) => {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

export function useVolumes(initialVolumes: Volume[], novelId: number | string = 1) {
  const [volumes, setVolumes] = useState<Volume[]>(() =>
    initialVolumes.map((vol) => ({
      ...vol,
      chapters: [...vol.chapters]
        .map((chap, idx) => ({
          ...chap,
          orderIndex: chap.orderIndex ?? idx + 1,
        }))
        .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)),
    }))
  )

  const [expandedVolumes, setExpandedVolumes] = useState<Record<number, boolean>>({
    101: true,
  })

  const [volModal, setVolModal] = useState<VolumeModalState>({
    isOpen: false,
    mode: "add",
    number: 1,
    title: "",
    cover: "",
  })

  const [chapModal, setChapModal] = useState<ChapterModalState>({
    isOpen: false,
    mode: "add",
    volId: 0,
    chapterNumber: 1,
    title: "",
    orderIndex: 1,
    content: "",
    hasIllustration: false,
    images: [],
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  // Helper to persist updated volumes to novels-data.json via server API
  const persistToDisk = async (newVolumes: Volume[]) => {
    try {
      setIsSaving(true)
      setSaveStatus("saving")
      const res = await fetch(`/api/novels/${novelId}/volumes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volumes: newVolumes }),
      })
      if (res.ok) {
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 3000)
      } else {
        setSaveStatus("error")
        console.error("Failed to save volumes to JSON:", await res.text())
      }
    } catch (err) {
      setSaveStatus("error")
      console.error("Network error saving volumes to JSON:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleVolumeExpand = (volId: number) => {
    setExpandedVolumes((prev) => ({
      ...prev,
      [volId]: !prev[volId],
    }))
  }

  // Volume Modal handlers
  const openAddVolume = () => {
    setVolModal({
      isOpen: true,
      mode: "add",
      number: volumes.length + 1,
      title: "",
      cover: "",
    })
  }

  const openEditVolume = (volume: Volume) => {
    setVolModal({
      isOpen: true,
      mode: "edit",
      volId: volume.id,
      number: volume.number,
      title: volume.title,
      cover: volume.cover,
    })
  }

  const closeVolumeModal = () => {
    setVolModal((prev) => ({ ...prev, isOpen: false }))
  }

  const saveVolume = (number: number, title: string, cover: string) => {
    const finalTitle = title.trim() || `Tập ${number}`
    const finalCover = cover || "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif"

    let updatedVolumes: Volume[] = []
    if (volModal.mode === "add") {
      const newVolId = Date.now()
      const newVol: Volume = {
        id: newVolId,
        number,
        title: finalTitle,
        cover: finalCover,
        chapters: [],
      }
      updatedVolumes = [...volumes, newVol]
      setVolumes(updatedVolumes)
      setExpandedVolumes((prev) => ({ ...prev, [newVolId]: true }))
    } else if (volModal.mode === "edit" && volModal.volId) {
      updatedVolumes = volumes.map((v) =>
        v.id === volModal.volId
          ? { ...v, number, title: finalTitle, cover: finalCover }
          : v
      )
      setVolumes(updatedVolumes)
    }
    persistToDisk(updatedVolumes)
    closeVolumeModal()
  }

  const deleteVolume = (volId: number) => {
    const updated = volumes.filter((v) => v.id !== volId)
    setVolumes(updated)
    persistToDisk(updated)
  }

  // Chapter Modal handlers
  const openAddChapter = (volId: number) => {
    const vol = volumes.find((v) => v.id === volId)
    const nextOrder = vol ? vol.chapters.length + 1 : 1
    const nextChapNum = vol ? vol.chapters.length + 1 : 1
    setChapModal({
      isOpen: true,
      mode: "add",
      volId,
      chapterNumber: nextChapNum,
      title: "",
      orderIndex: nextOrder,
      content: "",
      hasIllustration: false,
      images: [],
    })
  }

  const openEditChapter = (volId: number, chapter: Chapter) => {
    setChapModal({
      isOpen: true,
      mode: "edit",
      volId,
      chapterId: chapter.id,
      chapterNumber: chapter.chapterNumber ?? 1,
      title: chapter.title,
      orderIndex: chapter.orderIndex ?? 1,
      content: chapter.content ?? "",
      hasIllustration: !!chapter.hasIllustration,
      images: chapter.images || [],
    })
  }

  const closeChapterModal = () => {
    setChapModal((prev) => ({ ...prev, isOpen: false }))
  }

  const saveChapter = (data: {
    chapterNumber: number | string
    title: string
    orderIndex: number
    content: string
    hasIllustration: boolean
    images?: ChapterImage[]
  }) => {
    const calculatedWords = data.content.trim() ? countWords(data.content) : 0
    const chapNum = Number(data.chapterNumber) || data.chapterNumber
    const finalTitle = data.title.trim() || `Chương ${chapNum}`

    let updatedVolumes: Volume[] = []
    if (chapModal.mode === "add") {
      const newChap: Chapter = {
        id: Date.now(),
        volumeId: chapModal.volId,
        chapterNumber: chapNum,
        title: finalTitle,
        orderIndex: Number(data.orderIndex) || 1,
        content: data.content,
        wordCount: calculatedWords,
        isLocked: false,
        hasIllustration: data.hasIllustration,
        images: data.hasIllustration ? data.images || [] : [],
        createdAt: "Vừa xong",
      }
      updatedVolumes = volumes.map((v) => {
        if (v.id !== chapModal.volId) return v
        const newChaps = [...v.chapters, newChap].sort(
          (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
        )
        const reindexed = newChaps.map((c, idx) => ({
          ...c,
          orderIndex: idx + 1,
        }))
        return { ...v, chapters: reindexed }
      })
      setVolumes(updatedVolumes)
      setExpandedVolumes((prev) => ({ ...prev, [chapModal.volId]: true }))
    } else if (chapModal.mode === "edit" && chapModal.chapterId) {
      const editedOrder = Number(data.orderIndex) || 1
      updatedVolumes = volumes.map((v) => {
        if (v.id !== chapModal.volId) return v
        const updated = v.chapters.map((c) =>
          c.id === chapModal.chapterId
            ? {
                ...c,
                chapterNumber: chapNum,
                title: finalTitle,
                orderIndex: editedOrder,
                content: data.content,
                wordCount: calculatedWords,
                hasIllustration: data.hasIllustration,
                images: data.hasIllustration ? data.images || [] : [],
                updatedAt: "Vừa xong",
              }
            : c
        )
        const sorted = [...updated].sort(
          (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
        )
        const reindexed = sorted.map((c, idx) => ({
          ...c,
          orderIndex: idx + 1,
        }))
        return { ...v, chapters: reindexed }
      })
      setVolumes(updatedVolumes)
    }

    persistToDisk(updatedVolumes)
    closeChapterModal()
  }

  const deleteChapter = (volId: number, chapterId: number) => {
    const updated = volumes.map((v) => {
      if (v.id !== volId) return v
      const remaining = v.chapters
        .filter((c) => c.id !== chapterId)
        .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
        .map((c, idx) => ({
          ...c,
          orderIndex: idx + 1,
        }))
      return { ...v, chapters: remaining }
    })
    setVolumes(updated)
    persistToDisk(updated)
  }

  // Toggle chapter lock status
  const toggleLockChapter = (volId: number, chapterId: number) => {
    const updated = volumes.map((v) => {
      if (v.id !== volId) return v
      return {
        ...v,
        chapters: v.chapters.map((c) =>
          c.id === chapterId ? { ...c, isLocked: !c.isLocked } : c
        ),
      }
    })
    setVolumes(updated)
    persistToDisk(updated)
  }

  // Reorder chapter up / down
  const moveChapter = (
    volId: number,
    chapterId: number,
    direction: "up" | "down"
  ) => {
    const updated = volumes.map((v) => {
      if (v.id !== volId) return v

      const sorted = [...v.chapters].sort(
        (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
      )
      const currentIndex = sorted.findIndex((c) => c.id === chapterId)
      if (currentIndex === -1) return v
      if (direction === "up" && currentIndex === 0) return v
      if (direction === "down" && currentIndex === sorted.length - 1) return v

      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

      const newChapters = [...sorted]
      const temp = newChapters[currentIndex]
      newChapters[currentIndex] = newChapters[targetIndex]
      newChapters[targetIndex] = temp

      const reindexed = newChapters.map((c, idx) => ({
        ...c,
        orderIndex: idx + 1,
      }))

      return { ...v, chapters: reindexed }
    })
    setVolumes(updated)
    persistToDisk(updated)
  }

  return {
    volumes,
    expandedVolumes,
    volModal,
    chapModal,
    isSaving,
    saveStatus,
    toggleVolumeExpand,
    openAddVolume,
    openEditVolume,
    closeVolumeModal,
    saveVolume,
    deleteVolume,
    openAddChapter,
    openEditChapter,
    closeChapterModal,
    saveChapter,
    deleteChapter,
    toggleLockChapter,
    moveChapter,
  }
}
