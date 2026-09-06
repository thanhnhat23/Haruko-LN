"use client"

import React from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FlattenedChapterItem } from "@/data/mock-novel-data"

export interface ReaderNavigationFooterProps {
  novelId: number | string
  prevChapter: FlattenedChapterItem | null
  nextChapter: FlattenedChapterItem | null
  onOpenQuickJump: () => void
}

export function ReaderNavigationFooter({
  novelId,
  prevChapter,
  nextChapter,
  onOpenQuickJump,
}: ReaderNavigationFooterProps) {
  return (
    <div
      className="space-y-4 pt-8 border-t select-none"
      style={{ borderColor: "var(--reader-border)" }}
    >
      {/* 3 Main Action Buttons */}
      <div className="flex items-center justify-between gap-3">
        {/* Previous Chapter Button */}
        {prevChapter ? (
          <Link href={`/novel/${novelId}/chapter/${prevChapter.id}`} className="flex-1">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 px-3 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer rounded-xl transition-all shadow-xs border"
              style={{
                borderColor: "var(--reader-border)",
                backgroundColor: "transparent",
                color: "var(--reader-text)",
              }}
            >
              <ChevronLeft size={16} />
              <span className="truncate">
                Chương trước
              </span>
            </Button>
          </Link>
        ) : (
          <Button
            type="button"
            variant="outline"
            disabled
            className="flex-1 h-11 px-3 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed rounded-xl opacity-30 border"
            style={{
              borderColor: "var(--reader-border)",
              color: "var(--reader-muted)",
            }}
          >
            <ChevronLeft size={16} />
            <span>Chương đầu</span>
          </Button>
        )}

        {/* Quick Jump Index Button */}
        <Button
          type="button"
          variant="outline"
          onClick={onOpenQuickJump}
          className="h-11 px-4 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer rounded-xl transition-all shadow-xs border"
          style={{
            borderColor: "var(--reader-border)",
            backgroundColor: "transparent",
            color: "var(--reader-text)",
          }}
          title="Mở danh sách chương"
        >
          <List size={16} />
          <span className="hidden sm:inline">Mục lục</span>
        </Button>

        {/* Next Chapter Button */}
        {nextChapter ? (
          <Link href={`/novel/${novelId}/chapter/${nextChapter.id}`} className="flex-1">
            <Button
              type="button"
              className="w-full h-11 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-98"
            >
              <span className="truncate">
                Chương tiếp
              </span>
              <ChevronRight size={16} />
            </Button>
          </Link>
        ) : (
          <Button
            type="button"
            disabled
            className="flex-1 h-11 px-3 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed rounded-xl opacity-40 border"
            style={{
              borderColor: "var(--reader-border)",
              backgroundColor: "var(--reader-card)",
              color: "var(--reader-muted)",
            }}
          >
            <span>Hết chương</span>
            <ChevronRight size={16} />
          </Button>
        )}
      </div>

      {/* Keyboard Shortcut Hint */}
      <div
        className="hidden md:flex items-center justify-center gap-2 text-[11px] font-medium"
        style={{ color: "var(--reader-muted)" }}
      >
        <span>Mẹo phím tắt: Nhấn</span>
        <kbd
          className="px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold border"
          style={{
            borderColor: "var(--reader-border)",
            backgroundColor: "var(--reader-card)",
            color: "var(--reader-text)",
          }}
        >
          ←
        </kbd>
        <span>để lùi chương,</span>
        <kbd
          className="px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold border"
          style={{
            borderColor: "var(--reader-border)",
            backgroundColor: "var(--reader-card)",
            color: "var(--reader-text)",
          }}
        >
          →
        </kbd>
        <span>để chuyển chương tiếp theo.</span>
      </div>
    </div>
  )
}
