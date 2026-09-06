"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Volume2,
  VolumeX,
  Pause,
  List,
  Bookmark,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import type { FlattenedChapterItem } from "@/data/mock-novel-data"
import { cn } from "@/lib/utils"

export interface ReaderFloatingToolbarProps {
  novelId: number | string
  novelTitle: string
  chapterId: number | string
  chapterTitle: string
  prevChapter: FlattenedChapterItem | null
  nextChapter: FlattenedChapterItem | null
  isTtsPlaying: boolean
  isTtsPaused: boolean
  onToggleTTS: () => void
  onOpenTtsSettings: () => void
  onOpenQuickJump: () => void
  onOpenSettings: () => void
}

export function ReaderFloatingToolbar({
  novelId,
  novelTitle,
  chapterId,
  chapterTitle,
  prevChapter,
  nextChapter,
  isTtsPlaying,
  isTtsPaused,
  onToggleTTS,
  onOpenTtsSettings,
  onOpenQuickJump,
  onOpenSettings,
}: ReaderFloatingToolbarProps) {
  // Collapsed / Expanded state
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Bookmark state
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Initialize Bookmark state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const savedBookmarks = localStorage.getItem("haruko_reader_bookmarks")
      if (savedBookmarks) {
        const bookmarks = JSON.parse(savedBookmarks)
        const bookmarkKey = `${novelId}:${chapterId}`
        setIsBookmarked(Boolean(bookmarks[bookmarkKey]))
      }
    } catch (e) {
      // Ignore localStorage error
    }
  }, [novelId, chapterId])

  // Toggle Bookmark handler
  const handleToggleBookmark = () => {
    if (typeof window === "undefined") return
    try {
      const savedBookmarks = localStorage.getItem("haruko_reader_bookmarks")
      const bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : {}
      const bookmarkKey = `${novelId}:${chapterId}`

      if (bookmarks[bookmarkKey]) {
        delete bookmarks[bookmarkKey]
        setIsBookmarked(false)
      } else {
        bookmarks[bookmarkKey] = {
          novelId,
          novelTitle,
          chapterId,
          chapterTitle,
          bookmarkedAt: new Date().toISOString(),
        }
        setIsBookmarked(true)
      }
      localStorage.setItem("haruko_reader_bookmarks", JSON.stringify(bookmarks))
    } catch (e) {
      // Ignore write error
    }
  }

  return (
    <aside
      aria-label="Thanh điều hướng nổi"
      className="fixed bottom-10 right-4 sm:right-6 z-40 flex flex-col items-center select-none animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {/* Main Glassmorphic Vertical Toolbar */}
      <div
        className={cn(
          "flex flex-col items-center rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 overflow-hidden",
          isCollapsed ? "max-h-0 opacity-0 py-0 pointer-events-none scale-95" : "max-h-125 opacity-100 p-1.5 scale-100"
        )}
        style={{
          backgroundColor: "var(--reader-card)",
          borderColor: "var(--reader-border)",
          color: "var(--reader-text)",
          boxShadow: "0 20px 35px -10px rgba(0, 0, 0, 0.35), 0 0 1px 1px var(--reader-border)",
        }}
      >
        {/* Prev Chapter */}
        {prevChapter ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href={`/novel/${novelId}/chapter/${prevChapter.id}`}
                  className="group relative p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
                  style={{ color: "var(--reader-text)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--reader-btn-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                />
              }
            >
              <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
              <span className="sr-only">Chương trước</span>
            </TooltipTrigger>
            <TooltipContent side="left">
              Chương trước: {prevChapter.title}
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger
              disabled
              className="p-2.5 rounded-xl opacity-30 cursor-not-allowed flex items-center justify-center"
              style={{ color: "var(--reader-muted)" }}
            >
              <ChevronLeft size={18} />
            </TooltipTrigger>
            <TooltipContent side="left">Đã là chương đầu</TooltipContent>
          </Tooltip>
        )}

        <div className="w-5 h-px my-1 opacity-40" style={{ backgroundColor: "var(--reader-border)" }} />

        {/* Home / Novel Details */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href={`/novel/${novelId}`}
                className="group relative p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
                style={{ color: "var(--reader-text)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--reader-btn-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              />
            }
          >
            <Home size={18} className="transition-transform group-hover:scale-110" />
            <span className="sr-only">Trang truyện</span>
          </TooltipTrigger>
          <TooltipContent side="left">
            Về trang chi tiết truyện
          </TooltipContent>
        </Tooltip>

        {/* Settings */}
        <Tooltip>
          <TooltipTrigger
            type="button"
            onClick={onOpenSettings}
            className="group relative p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
            style={{ color: "var(--reader-text)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--reader-btn-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <span className="font-serif font-black text-base leading-none group-hover:scale-110 transition-transform">
              A
            </span>
            <span className="sr-only">Cài đặt đọc</span>
          </TooltipTrigger>
          <TooltipContent side="left">
            Cài đặt giao diện đọc (Font, cỡ chữ, màu nền)
          </TooltipContent>
        </Tooltip>

        {/* TTS */}
        <div className="relative group/tts flex items-center justify-center">
          <Tooltip>
            <TooltipTrigger
              type="button"
              onClick={() => {
                if (isTtsPlaying || isTtsPaused) {
                  onToggleTTS()
                } else {
                  onOpenTtsSettings()
                }
              }}
              className={cn(
                "p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer",
                isTtsPlaying && "text-emerald-500 bg-emerald-500/15"
              )}
              style={{
                color: isTtsPlaying ? "#10b981" : isTtsPaused ? "#f59e0b" : "var(--reader-text)",
              }}
              onMouseEnter={(e) => {
                if (!isTtsPlaying) e.currentTarget.style.backgroundColor = "var(--reader-btn-hover)"
              }}
              onMouseLeave={(e) => {
                if (!isTtsPlaying) e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              {isTtsPlaying ? (
                <div className="relative flex items-center justify-center">
                  <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-ping" />
                  <Pause size={18} className="text-emerald-500" />
                </div>
              ) : isTtsPaused ? (
                <VolumeX size={18} className="text-amber-500" />
              ) : (
                <Volume2 size={18} className="transition-transform group-hover/tts:scale-110" />
              )}
              <span className="sr-only">Đọc giọng nói</span>
            </TooltipTrigger>
            <TooltipContent side="left">
              {isTtsPlaying
                ? "Tạm dừng đọc giọng nói"
                : isTtsPaused
                ? "Tiếp tục đọc giọng nói"
                : "Đọc truyện bằng giọng nói (TTS)"}
            </TooltipContent>
          </Tooltip>

          {/* Quick Setting Tooltip Trigger for TTS */}
          <Tooltip>
            <TooltipTrigger
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onOpenTtsSettings()
              }}
              className="absolute -left-8 opacity-0 group-hover/tts:opacity-100 p-1.5 rounded-lg border backdrop-blur-md transition-all hover:scale-110 cursor-pointer shadow-md"
              style={{
                backgroundColor: "var(--reader-card)",
                borderColor: "var(--reader-border)",
                color: "var(--reader-muted)",
              }}
            >
              <SlidersHorizontal size={12} />
            </TooltipTrigger>
            <TooltipContent side="left">
              Cài đặt giọng đọc (Gemini AI / Web Speech)
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Table of Contents */}
        <Tooltip>
          <TooltipTrigger
            type="button"
            onClick={onOpenQuickJump}
            className="group relative p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
            style={{ color: "var(--reader-text)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--reader-btn-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <List size={18} className="transition-transform group-hover:scale-110" />
            <span className="sr-only">Mục lục</span>
          </TooltipTrigger>
          <TooltipContent side="left">
            Danh sách chương (Mục lục)
          </TooltipContent>
        </Tooltip>

        {/* Bookmark */}
        <Tooltip>
          <TooltipTrigger
            type="button"
            onClick={handleToggleBookmark}
            className={cn(
              "group relative p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer",
              isBookmarked && "text-amber-500"
            )}
            style={{
              color: isBookmarked ? "#f59e0b" : "var(--reader-text)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--reader-btn-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Bookmark
              size={18}
              className={cn(
                "transition-transform group-hover:scale-110",
                isBookmarked && "fill-amber-500"
              )}
            />
            <span className="sr-only">Đánh dấu</span>
          </TooltipTrigger>
          <TooltipContent side="left">
            {isBookmarked ? "Đã đánh dấu chương này (Nhấn để bỏ)" : "Đánh dấu chương này"}
          </TooltipContent>
        </Tooltip>

        <div className="w-5 h-px my-1 opacity-40" style={{ backgroundColor: "var(--reader-border)" }} />

        {/* Next Chapter */}
        {nextChapter ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href={`/novel/${novelId}/chapter/${nextChapter.id}`}
                  className="group relative p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
                  style={{ color: "var(--reader-text)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--reader-btn-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                />
              }
            >
              <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              <span className="sr-only">Chương tiếp</span>
            </TooltipTrigger>
            <TooltipContent side="left">
              Chương tiếp: {nextChapter.title}
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger
              disabled
              className="p-2.5 rounded-xl opacity-30 cursor-not-allowed flex items-center justify-center"
              style={{ color: "var(--reader-muted)" }}
            >
              <ChevronRight size={18} />
            </TooltipTrigger>
            <TooltipContent side="left">Đã là chương mới nhất</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Collapse / Expand Toggle Button */}
      <Tooltip>
        <TooltipTrigger
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mt-2 p-2 rounded-full border backdrop-blur-md shadow-md transition-all hover:scale-110 active:scale-90 cursor-pointer opacity-70 hover:opacity-100"
          style={{
            backgroundColor: "var(--reader-card)",
            borderColor: "var(--reader-border)",
            color: "var(--reader-muted)",
          }}
        >
          {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </TooltipTrigger>
        <TooltipContent side="left">
          {isCollapsed ? "Mở thanh điều hướng nhanh" : "Thu gọn thanh điều hướng"}
        </TooltipContent>
      </Tooltip>
    </aside>
  )
}
