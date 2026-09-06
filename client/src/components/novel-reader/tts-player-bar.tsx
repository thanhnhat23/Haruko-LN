"use client"

import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  X,
  Sparkles,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { TtsEngine } from "./reader-types"

export interface TtsPlayerBarProps {
  isPlaying: boolean
  isPaused: boolean
  isLoadingAudio?: boolean
  engine?: TtsEngine
  currentChunkIndex: number
  totalChunks: number
  currentTextPreview?: string
  currentSpeed: number
  onTogglePlay: () => void
  onStop: () => void
  onPrevChunk: () => void
  onNextChunk: () => void
  onCycleSpeed: () => void
  onOpenSettings: () => void
}

export function TtsPlayerBar({
  isPlaying,
  isPaused,
  isLoadingAudio = false,
  engine = "gemini",
  currentChunkIndex,
  totalChunks,
  currentTextPreview = "",
  currentSpeed,
  onTogglePlay,
  onStop,
  onPrevChunk,
  onNextChunk,
  onCycleSpeed,
  onOpenSettings,
}: TtsPlayerBarProps) {
  if (!isPlaying && !isPaused && !isLoadingAudio) return null

  const progressPercent = totalChunks > 0 ? Math.round(((currentChunkIndex + 1) / totalChunks) * 100) : 0

  return (
    <div
      aria-label="Thanh điều khiển đọc giọng nói"
      className="fixed bottom-22 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] sm:w-auto sm:min-w-105 max-w-lg rounded-2xl border backdrop-blur-xl shadow-2xl p-3 flex flex-col gap-2 select-none animate-in fade-in slide-in-from-bottom-6 duration-300"
      style={{
        backgroundColor: "var(--reader-card)",
        borderColor: "var(--reader-border)",
        color: "var(--reader-text)",
        boxShadow: "0 20px 35px -10px rgba(0, 0, 0, 0.4), 0 0 1px 1px var(--reader-border)",
      }}
    >
      {/* Upper row: Status, Preview snippet, and Close */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            {isPlaying && !isLoadingAudio && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={cn(
                "relative inline-flex rounded-full h-2.5 w-2.5",
                isLoadingAudio
                  ? "bg-sky-400"
                  : isPlaying
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              )}
            />
          </span>

          {isLoadingAudio ? (
            <span className="font-bold text-[11px] shrink-0 text-emerald-500 flex items-center gap-1">
              <Loader2 size={11} className="animate-spin" />
              <span>Đang tải audio AI...</span>
            </span>
          ) : (
            <span className="font-bold text-[11px] shrink-0" style={{ color: "var(--reader-text)" }}>
              {isPlaying ? "Đang đọc" : "Đã tạm dừng"}
            </span>
          )}

          {/* Engine indicator badge */}
          {engine === "gemini" ? (
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 flex items-center gap-1 shrink-0">
              <Sparkles size={9} className="text-amber-400" />
              <span>Gemini 3.5</span>
            </span>
          ) : (
            <span className="text-[9px] font-medium px-1.5 py-0.2 rounded-md bg-accent/40 text-muted-foreground border border-border/40 shrink-0">
              Web Speech
            </span>
          )}

          <span className="text-[10px] font-mono shrink-0 px-1.5 py-0.2 rounded-md bg-accent/40 text-muted-foreground border border-border/40">
            Đoạn {currentChunkIndex + 1}/{totalChunks} ({progressPercent}%)
          </span>
        </div>

        {/* Action icons right */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer hover:bg-accent/30"
            title="Cài đặt giọng đọc"
          >
            <SlidersHorizontal size={14} />
          </button>
          <button
            type="button"
            onClick={onStop}
            className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer hover:bg-rose-500/15"
            title="Tắt đọc giọng nói"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Snippet Preview */}
      {currentTextPreview && (
        <p
          className="text-[11px] truncate italic opacity-80 px-1"
          style={{ color: "var(--reader-muted)" }}
        >
          &ldquo;{currentTextPreview}&rdquo;
        </p>
      )}

      {/* Lower row: Player Controls */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/30">
        <div className="flex items-center gap-1.5">
          {/* Previous Paragraph */}
          <button
            type="button"
            onClick={onPrevChunk}
            disabled={currentChunkIndex <= 0}
            className="p-1.5 rounded-xl border border-transparent hover:border-border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent/20"
            style={{ color: "var(--reader-text)" }}
            title="Đoạn trước"
          >
            <SkipBack size={15} />
          </button>

          {/* Main Play / Pause Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={isLoadingAudio}
            className="h-8 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
          >
            {isLoadingAudio ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Đang tải...</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause size={14} className="fill-white" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play size={14} className="fill-white" />
                <span>Tiếp tục</span>
              </>
            )}
          </button>

          {/* Next Paragraph */}
          <button
            type="button"
            onClick={onNextChunk}
            disabled={currentChunkIndex >= totalChunks - 1}
            className="p-1.5 rounded-xl border border-transparent hover:border-border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent/20"
            style={{ color: "var(--reader-text)" }}
            title="Đoạn kế tiếp"
          >
            <SkipForward size={15} />
          </button>

          {/* Stop Button */}
          <button
            type="button"
            onClick={onStop}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer hover:bg-accent/20"
            title="Dừng phát"
          >
            <Square size={13} />
          </button>
        </div>

        {/* Speed button & Settings */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onCycleSpeed}
            className="h-7 px-2.5 rounded-lg border border-border/80 hover:border-emerald-500 font-mono text-[11px] font-black transition-all cursor-pointer hover:bg-accent/30"
            style={{ color: "var(--reader-text)" }}
            title="Nhấn để đổi tốc độ đọc nhanh"
          >
            {currentSpeed.toFixed(2).replace(/\.00$/, "")}x
          </button>
        </div>
      </div>
    </div>
  )
}
