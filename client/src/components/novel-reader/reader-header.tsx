"use client"

import React from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  List,
  SlidersHorizontal,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FlattenedChapterItem } from "@/data/mock-novel-data"

export interface ReaderHeaderProps {
  novelId: number | string
  novelTitle: string
  chapterTitle: string
  prevChapter: FlattenedChapterItem | null
  nextChapter: FlattenedChapterItem | null
  onOpenQuickJump: () => void
  onOpenSettings: () => void
}

export function ReaderHeader({
  novelId,
  novelTitle,
  chapterTitle,
  prevChapter,
  nextChapter,
  onOpenQuickJump,
  onOpenSettings,
}: ReaderHeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors select-none"
      style={{
        backgroundColor: "var(--reader-header)",
        borderColor: "var(--reader-border)",
        color: "var(--reader-text)",
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-13 flex items-center justify-between gap-3">
        {/* Left: Back to Novel Detail & Novel Title */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href={`/novel/${novelId}`}
            className="p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
            style={{ color: "var(--reader-muted)" }}
            title="Quay lại trang chi tiết truyện"
          >
            <ArrowLeft size={16} />
            <span className="hidden md:inline">Quay về</span>
          </Link>

          <div
            className="hidden sm:block w-px h-4 mx-1"
            style={{ backgroundColor: "var(--reader-border)" }}
          />

          <div className="min-w-0">
            <h1
              className="text-xs font-bold truncate max-w-50 sm:max-w-xs md:max-w-md"
              style={{ color: "var(--reader-text)" }}
            >
              {novelTitle}
            </h1>
            <p
              className="text-[11px] truncate hidden sm:block"
              style={{ color: "var(--reader-muted)" }}
            >
              {chapterTitle}
            </p>
          </div>
        </div>

        {/* Right: Chapter Navigation & Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Previous Chapter */}
          {prevChapter ? (
            <Link
              href={`/novel/${novelId}/chapter/${prevChapter.id}`}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "var(--reader-muted)" }}
              title={`Chương trước: ${prevChapter.title}`}
            >
              <ChevronLeft size={18} />
            </Link>
          ) : (
            <button
              disabled
              className="p-1.5 rounded-lg cursor-not-allowed opacity-30"
              style={{ color: "var(--reader-muted)" }}
              title="Đã là chương đầu tiên"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Chapter Quick Jump Modal Trigger */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenQuickJump}
            className="h-8 px-2.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer border"
            style={{
              borderColor: "var(--reader-border)",
              backgroundColor: "transparent",
              color: "var(--reader-text)",
            }}
            title="Mở danh sách chương"
          >
            <List size={14} />
            <span className="hidden md:inline">Mục lục</span>
          </Button>

          {/* Next Chapter */}
          {nextChapter ? (
            <Link
              href={`/novel/${novelId}/chapter/${nextChapter.id}`}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "var(--reader-muted)" }}
              title={`Chương tiếp: ${nextChapter.title}`}
            >
              <ChevronRight size={18} />
            </Link>
          ) : (
            <button
              disabled
              className="p-1.5 rounded-lg cursor-not-allowed opacity-30"
              style={{ color: "var(--reader-muted)" }}
              title="Đã là chương mới nhất"
            >
              <ChevronRight size={18} />
            </button>
          )}

          <div
            className="w-px h-4 mx-1"
            style={{ backgroundColor: "var(--reader-border)" }}
          />

          {/* Reader Settings Modal Trigger */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="h-8 px-2.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            style={{ color: "var(--reader-muted)" }}
            title="Tùy chỉnh giao diện đọc"
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Cài đặt</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
