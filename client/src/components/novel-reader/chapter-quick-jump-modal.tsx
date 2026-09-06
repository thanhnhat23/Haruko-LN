"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { X, Search, BookOpen, Layers, Check } from "lucide-react"
import type { Volume } from "@/data/mock-novel-data"
import { cn } from "@/lib/utils"

export interface ChapterQuickJumpModalProps {
  isOpen: boolean
  onClose: () => void
  novelId: number | string
  novelTitle: string
  volumes: Volume[]
  currentChapterId: number
}

export function ChapterQuickJumpModal({
  isOpen,
  onClose,
  novelId,
  novelTitle,
  volumes,
  currentChapterId,
}: ChapterQuickJumpModalProps) {
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredVolumes = volumes
    .map((vol) => {
      const filteredChapters = vol.chapters.filter((c) =>
        `${c.chapterNumber} ${c.title}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim())
      )
      return {
        ...vol,
        chapters: filteredChapters,
      }
    })
    .filter((vol) => vol.chapters.length > 0)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/40 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
              <BookOpen size={16} className="text-emerald-500" />
              Danh sách chương truyện
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/30 cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-muted-foreground font-semibold truncate">
            {novelTitle}
          </p>

          {/* Search Input */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo số chương hoặc tiêu đề..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-foreground transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Chapters List by Volume */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {filteredVolumes.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground font-semibold">
              Không tìm thấy chương nào phù hợp với từ khóa.
            </div>
          ) : (
            filteredVolumes.map((vol) => (
              <div key={vol.id} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground pb-1 border-b border-border/30">
                  <Layers size={13} className="text-emerald-500" />
                  <span>
                    Vol {vol.number}: {vol.title}
                  </span>
                </div>

                <div className="space-y-1">
                  {vol.chapters.map((chap) => {
                    const isCurrent = chap.id === currentChapterId

                    return (
                      <Link
                        key={chap.id}
                        href={`/novel/${novelId}/chapter/${chap.id}`}
                        onClick={onClose}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                          isCurrent
                            ? "bg-emerald-600/15 text-emerald-500 border border-emerald-500/30 font-bold"
                            : "text-foreground hover:bg-accent/25 hover:text-foreground border border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded text-[10px] font-mono font-bold shrink-0",
                              isCurrent
                                ? "bg-emerald-500 text-white"
                                : "bg-accent/40 text-muted-foreground"
                            )}
                          >
                            #{chap.orderIndex ?? chap.chapterNumber}
                          </span>
                          <span className="truncate">{chap.title}</span>
                        </div>

                        {isCurrent && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold shrink-0">
                            <Check size={12} />
                            <span>Đang đọc</span>
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
