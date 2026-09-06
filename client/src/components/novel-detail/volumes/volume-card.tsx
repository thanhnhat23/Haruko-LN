"use client"

import React from "react"
import Image from "next/image"
import { FilePlus, Edit3, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { ChapterItem } from "../chapters/chapter-item"
import type { Volume, Chapter } from "@/data/mock-novel-data"

export interface VolumeCardProps {
  volume: Volume
  novelId: number
  isExpanded: boolean
  onToggleExpand: (volId: number) => void
  onOpenAddChapter: (volId: number) => void
  onOpenEditVolume: (volume: Volume) => void
  onDeleteVolume: (volId: number, num: number) => void
  onMoveChapter: (volId: number, chapId: number, direction: "up" | "down") => void
  onToggleLockChapter: (volId: number, chapId: number) => void
  onOpenEditChapter: (volId: number, chapter: Chapter) => void
  onDeleteChapter: (volId: number, chapId: number, title: string) => void
}

export function VolumeCard({
  volume,
  novelId,
  isExpanded,
  onToggleExpand,
  onOpenAddChapter,
  onOpenEditVolume,
  onDeleteVolume,
  onMoveChapter,
  onToggleLockChapter,
  onOpenEditChapter,
  onDeleteChapter,
}: VolumeCardProps) {
  const sortedChapters = [...volume.chapters].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
  )
  const displayedChapters = isExpanded
    ? sortedChapters
    : sortedChapters.slice(0, 5)
  const remainingCount = sortedChapters.length - 5

  return (
    <div
      id={`volume-${volume.id}`}
      className="border border-border/80 bg-card/60 rounded-2xl overflow-hidden shadow-md transition-all hover:border-border"
    >
      {/* Volume Header & Actions Toolbar */}
      <div className="bg-accent/20 px-4 sm:px-6 py-3 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <h3 className="text-sm sm:text-base font-black text-foreground tracking-wide flex items-center gap-2 min-w-0">
          <span className="text-emerald-500 font-extrabold shrink-0">
            Vol {volume.number}:
          </span>
          <span className="text-foreground/90 font-bold truncate max-w-[calc(100%-60px)] md:max-w-md">
            {volume.title}
          </span>
        </h3>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold tracking-wider mr-2">
            {volume.chapters.length} chương
          </span>

          <button
            type="button"
            onClick={() => onOpenAddChapter(volume.id)}
            className="px-2 py-1 rounded-md bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-500 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
            title="Thêm chương mới vào tập này"
          >
            <FilePlus size={13} />
            <span>Thêm chap</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenEditVolume(volume)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/30 cursor-pointer transition-colors"
            title="Sửa thông tin tập"
          >
            <Edit3 size={14} />
          </button>

          <button
            type="button"
            onClick={() => onDeleteVolume(volume.id, volume.number)}
            className="p-1 rounded-md text-muted-foreground hover:text-rose-500 hover:bg-accent/30 cursor-pointer transition-colors"
            title="Xóa tập này"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Volume Body: Left Cover + Right Chapters List */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
        {/* Volume Cover */}
        <div className="relative w-24 sm:w-28 md:w-32 aspect-3/4 rounded-sm overflow-hidden border border-border/70 bg-accent/25 shrink-0 shadow-md group mx-auto sm:mx-0">
          <Image
            src={volume.cover}
            alt={volume.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="130px"
          />
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded-xs bg-black/70 text-[9px] text-white font-black uppercase tracking-wider border border-zinc-800">
            Vol {volume.number}
          </div>
        </div>

        {/* Chapters List */}
        <div className="flex-1 w-full space-y-1 divide-y divide-border/20">
          {volume.chapters.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground italic">
              Chưa có chương nào trong tập này. Nhấn &quot;Thêm chap&quot; để bổ sung.
            </div>
          ) : (
            displayedChapters.map((chapter) => {
              const chapIndex = sortedChapters.findIndex((c) => c.id === chapter.id)
              const isFirst = chapIndex === 0
              const isLast = chapIndex === sortedChapters.length - 1

              return (
                <ChapterItem
                  key={chapter.id}
                  chapter={chapter}
                  volumeId={volume.id}
                  novelId={novelId}
                  isFirst={isFirst}
                  isLast={isLast}
                  onMove={onMoveChapter}
                  onToggleLock={onToggleLockChapter}
                  onOpenEdit={onOpenEditChapter}
                  onDelete={onDeleteChapter}
                />
              )
            })
          )}

          {/* Expand / Collapse Chapters button */}
          {volume.chapters.length > 5 && (
            <div className="pt-2 border-t-0">
              <button
                type="button"
                onClick={() => onToggleExpand(volume.id)}
                className="text-xs font-bold text-foreground hover:underline flex items-center gap-1 cursor-pointer py-1.5 px-2 rounded-md hover:bg-accent/15 transition-all uppercase tracking-wider"
              >
                {isExpanded ? (
                  <>
                    Thu gọn <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    Xem tiếp ({remainingCount} chương) <ChevronDown size={14} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
