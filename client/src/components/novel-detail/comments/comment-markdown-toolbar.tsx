"use client"

import React from "react"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Quote,
  EyeOff,
  Link2,
  Eye,
  Edit3,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Insert markdown syntax at cursor position
export function insertMarkdown(
  inputEl: HTMLTextAreaElement | HTMLInputElement | null,
  text: string,
  setText: React.Dispatch<React.SetStateAction<string>>,
  prefix: string,
  suffix = prefix,
  placeholder = "văn bản"
) {
  if (!inputEl) {
    setText((prev) => prev + prefix + placeholder + suffix)
    return
  }
  const start = inputEl.selectionStart || 0
  const end = inputEl.selectionEnd || 0
  const selected = text.substring(start, end)
  const contentToWrap = selected || placeholder
  const newText =
    text.substring(0, start) +
    prefix +
    contentToWrap +
    suffix +
    text.substring(end)
  setText(newText)
  setTimeout(() => {
    inputEl.focus()
    if (!selected) {
      inputEl.setSelectionRange(
        start + prefix.length,
        start + prefix.length + placeholder.length
      )
    } else {
      inputEl.setSelectionRange(
        start + prefix.length + selected.length + suffix.length,
        start + prefix.length + selected.length + suffix.length
      )
    }
  }, 0)
}

export interface MarkdownToolbarProps {
  onBold: () => void
  onItalic: () => void
  onStrike: () => void
  onCode: () => void
  onQuote: () => void
  onSpoiler: () => void
  onLink: () => void
  isPreview: boolean
  onTogglePreview: () => void
}

export function CommentMarkdownToolbar({
  onBold,
  onItalic,
  onStrike,
  onCode,
  onQuote,
  onSpoiler,
  onLink,
  isPreview,
  onTogglePreview,
}: MarkdownToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 pb-3 border-b border-border/50 text-muted-foreground text-xs">
      <button
        type="button"
        onClick={onBold}
        className="p-1 rounded-md hover:bg-accent/20 hover:text-foreground cursor-pointer transition-colors"
        title="In đậm (**text**)"
      >
        <Bold size={13} />
      </button>
      <button
        type="button"
        onClick={onItalic}
        className="p-1 rounded-md hover:bg-accent/20 hover:text-foreground cursor-pointer transition-colors"
        title="In nghiêng (*text*)"
      >
        <Italic size={13} />
      </button>
      <button
        type="button"
        onClick={onStrike}
        className="p-1 rounded-md hover:bg-accent/20 hover:text-foreground cursor-pointer transition-colors"
        title="Gạch ngang (~~text~~)"
      >
        <Strikethrough size={13} />
      </button>
      <button
        type="button"
        onClick={onSpoiler}
        className="p-1 rounded-md hover:bg-accent/20 hover:text-foreground cursor-pointer transition-colors"
        title="Cảnh báo Spoil (||text||)"
      >
        <EyeOff size={13} />
      </button>
      <button
        type="button"
        onClick={onQuote}
        className="p-1 rounded-md hover:bg-accent/20 hover:text-foreground cursor-pointer transition-colors"
        title="Trích dẫn (> text)"
      >
        <Quote size={13} />
      </button>
      <button
        type="button"
        onClick={onCode}
        className="p-1 rounded-md hover:bg-accent/20 hover:text-foreground cursor-pointer transition-colors"
        title="Mã inline (`code`)"
      >
        <Code size={13} />
      </button>
      <button
        type="button"
        onClick={onLink}
        className="p-1 rounded-md hover:bg-accent/20 hover:text-foreground cursor-pointer transition-colors"
        title="Liên kết ([tiêu đề](url))"
      >
        <Link2 size={13} />
      </button>

      <div className="ml-auto">
        <button
          type="button"
          onClick={onTogglePreview}
          className={cn(
            "px-2 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1",
            isPreview
              ? "bg-emerald-600 text-white font-bold"
              : "hover:bg-accent/20 text-muted-foreground hover:text-foreground"
          )}
          title="Bật/tắt xem trước Markdown"
        >
          {isPreview ? (
            <>
              <Edit3 size={12} />
              <span>Chỉnh sửa</span>
            </>
          ) : (
            <>
              <Eye size={12} />
              <span>Xem trước</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
