"use client"

import React from "react"
import Link from "next/link"
import {
  FileText,
  Image as ImageIcon,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
} from "lucide-react"
import type { Chapter } from "@/data/mock-novel-data"
import { cn } from "@/lib/utils"

export interface ChapterItemProps {
  chapter: Chapter
  volumeId: number
  novelId: number
  isFirst: boolean
  isLast: boolean
  onMove: (volId: number, chapterId: number, direction: "up" | "down") => void
  onToggleLock: (volId: number, chapterId: number) => void
  onOpenEdit: (volId: number, chapter: Chapter) => void
  onDelete: (volId: number, chapterId: number, chapTitle: string) => void
}

export function ChapterItem({
  chapter,
  volumeId,
  novelId,
  isFirst,
  isLast,
  onMove,
  onToggleLock,
  onOpenEdit,
  onDelete,
}: ChapterItemProps) {
  return (
    <div className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-accent/25 group transition-colors -mx-1">
      {/* Locked chapter: disable click/navigation */}
      {chapter.isLocked ? (
        <div
          className="flex items-center gap-2 min-w-0 pr-3 flex-1 cursor-not-allowed select-none opacity-70"
          title="Chương này đang bị khóa, bạn không thể truy cập nội dung"
        >
          <Lock size={14} className="text-amber-500 shrink-0" />

          <span
            className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-accent/40 text-muted-foreground border border-border/40 shrink-0"
            title={`Thứ tự sắp xếp: #${chapter.orderIndex}`}
          >
            #{chapter.orderIndex}
          </span>

          <span className="text-xs font-semibold truncate text-muted-foreground line-through decoration-muted-foreground/40">
            {chapter.title}
          </span>

          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-500 bg-amber-500/15 px-1.5 py-0.2 rounded-xs border border-amber-500/30 shrink-0 uppercase tracking-wider">
            Đã khóa
          </span>
        </div>
      ) : (
        <Link
          href={`/novel/${novelId}/chapter/${chapter.id}`}
          className="flex items-center gap-2 min-w-0 pr-3 flex-1 group/link"
        >
          {chapter.hasIllustration ? (
            <ImageIcon
              size={14}
              className="text-yellow-400 shrink-0 group-hover/link:scale-110 transition-transform"
            />
          ) : (
            <FileText
              size={14}
              className="text-muted-foreground shrink-0 group-hover/link:text-foreground transition-colors"
            />
          )}

          <span
            className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-accent/50 text-foreground/80 border border-border/50 shrink-0 group-hover/link:border-foreground/30 transition-colors"
            title={`Thứ tự sắp xếp: #${chapter.orderIndex}`}
          >
            #{chapter.orderIndex}
          </span>

          <span
            className={cn(
              "text-xs font-semibold truncate transition-colors",
              chapter.hasIllustration
                ? "text-foreground font-bold group-hover/link:text-yellow-400"
                : "text-foreground/90 group-hover/link:text-foreground"
            )}
          >
            {chapter.title}
          </span>

          {chapter.hasIllustration && chapter.images && chapter.images.length > 0 && (
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded-xs bg-yellow-400/10 text-yellow-500 dark:text-yellow-400 border border-yellow-400/25 text-[9px] font-mono font-bold shrink-0">
              {chapter.images.length} ảnh
            </span>
          )}
        </Link>
      )}

      {/* Word count, timestamp, and actions toolbar */}
      <div className="flex items-center gap-2.5 shrink-0">
        {chapter.wordCount > 0 && (
          <span className="hidden sm:inline-block text-[10px] text-muted-foreground/80 font-mono">
            {chapter.wordCount.toLocaleString()} từ
          </span>
        )}
        <span className="text-[10px] sm:text-[11px] text-muted-foreground font-mono whitespace-nowrap">
          {chapter.createdAt}
        </span>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {/* Reorder buttons */}
          <button
            type="button"
            disabled={isFirst}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onMove(volumeId, chapter.id, "up")
            }}
            className={cn(
              "p-1 rounded-md transition-colors",
              isFirst
                ? "text-muted-foreground/25 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30 cursor-pointer"
            )}
            title={isFirst ? "Đang ở vị trí đầu tiên" : "Đưa chương lên trước"}
          >
            <ArrowUp size={11} />
          </button>

          <button
            type="button"
            disabled={isLast}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onMove(volumeId, chapter.id, "down")
            }}
            className={cn(
              "p-1 rounded-md transition-colors",
              isLast
                ? "text-muted-foreground/25 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30 cursor-pointer"
            )}
            title={isLast ? "Đang ở vị trí cuối cùng" : "Đưa chương xuống sau"}
          >
            <ArrowDown size={11} />
          </button>

          {/* Lock / Unlock button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleLock(volumeId, chapter.id)
            }}
            className={cn(
              "p-1 rounded-md cursor-pointer transition-colors",
              chapter.isLocked
                ? "text-amber-500 hover:text-amber-400 bg-amber-500/20"
                : "text-muted-foreground hover:text-amber-500 hover:bg-accent/30"
            )}
            title={chapter.isLocked ? "Mở khóa chương" : "Khóa chương"}
          >
            {chapter.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
          </button>

          {/* Edit chapter button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onOpenEdit(volumeId, chapter)
            }}
            className="p-1 rounded-md text-muted-foreground hover:text-emerald-500 hover:bg-accent/30 cursor-pointer transition-colors"
            title="Sửa chương"
          >
            <Edit3 size={12} />
          </button>

          {/* Delete chapter button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete(volumeId, chapter.id, chapter.title)
            }}
            className="p-1 rounded-md text-muted-foreground hover:text-rose-500 hover:bg-accent/30 cursor-pointer transition-colors"
            title="Xóa chương này"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
