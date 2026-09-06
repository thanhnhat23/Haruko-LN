"use client"

import React from "react"
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  Quote,
  Code,
  EyeOff,
  Link2,
  Minus,
  Eye,
  Edit3,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Insert markdown syntax at cursor position preserving selections and indentation
export function insertChapterMarkdown(
  textarea: HTMLTextAreaElement | null,
  text: string,
  setText: React.Dispatch<React.SetStateAction<string>>,
  prefix: string,
  suffix = prefix,
  placeholder = "văn bản"
) {
  if (!textarea) {
    setText((prev) => prev + prefix + placeholder + suffix)
    return
  }

  const start = textarea.selectionStart || 0
  const end = textarea.selectionEnd || 0
  const selectedText = text.substring(start, end)
  const contentToWrap = selectedText || placeholder

  const newText =
    text.substring(0, start) + prefix + contentToWrap + suffix + text.substring(end)
  setText(newText)

  setTimeout(() => {
    textarea.focus()
    const newCursorStart = start + prefix.length
    const newCursorEnd = newCursorStart + contentToWrap.length
    textarea.setSelectionRange(newCursorStart, newCursorEnd)
  }, 0)
}

export interface ChapterMarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>
  isPreview: boolean
  onTogglePreview: () => void
}

export function ChapterMarkdownToolbar({
  textareaRef,
  content,
  setContent,
  isPreview,
  onTogglePreview,
}: ChapterMarkdownToolbarProps) {
  const handleFormat = (
    prefix: string,
    suffix = prefix,
    placeholder = "văn bản"
  ) => {
    insertChapterMarkdown(
      textareaRef.current,
      content,
      setContent,
      prefix,
      suffix,
      placeholder
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-1 pb-2 border-b border-border/50 text-muted-foreground text-xs select-none">
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat("**", "**", "in đậm")}
          className={cn(
            "p-1.5 rounded-md hover:bg-accent/40 hover:text-foreground transition-colors cursor-pointer",
            isPreview && "opacity-40 cursor-not-allowed"
          )}
          title="In đậm (**text**)"
        >
          <Bold size={13} />
        </button>

        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat("*", "*", "in nghiêng")}
          className={cn(
            "p-1.5 rounded-md hover:bg-accent/40 hover:text-foreground transition-colors cursor-pointer",
            isPreview && "opacity-40 cursor-not-allowed"
          )}
          title="In nghiêng (*text*)"
        >
          <Italic size={13} />
        </button>

        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat("~~", "~~", "gạch ngang")}
          className={cn(
            "p-1.5 rounded-md hover:bg-accent/40 hover:text-foreground transition-colors cursor-pointer",
            isPreview && "opacity-40 cursor-not-allowed"
          )}
          title="Gạch ngang (~~text~~)"
        >
          <Strikethrough size={13} />
        </button>

        <div className="w-px h-4 bg-border/60 mx-0.5" />

        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat("## ", "", "Tiêu đề lớn")}
          className={cn(
            "p-1.5 rounded-md hover:bg-accent/40 hover:text-foreground transition-colors cursor-pointer",
            isPreview && "opacity-40 cursor-not-allowed"
          )}
          title="Tiêu đề H2 (## Tiêu đề)"
        >
          <Heading2 size={13} />
        </button>

        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat("### ", "", "Tiêu đề nhỏ")}
          className={cn(
            "p-1.5 rounded-md hover:bg-accent/40 hover:text-foreground transition-colors cursor-pointer",
            isPreview && "opacity-40 cursor-not-allowed"
          )}
          title="Tiêu đề H3 (### Tiêu đề)"
        >
          <Heading3 size={13} />
        </button>

        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat("> ", "", "Trích dẫn")}
          className={cn(
            "p-1.5 rounded-md hover:bg-accent/40 hover:text-foreground transition-colors cursor-pointer",
            isPreview && "opacity-40 cursor-not-allowed"
          )}
          title="Trích dẫn (> Quote)"
        >
          <Quote size={13} />
        </button>

        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat("```\n", "\n```", "khối code / thơ")}
          className={cn(
            "p-1.5 rounded-md hover:bg-accent/40 hover:text-foreground transition-colors cursor-pointer",
            isPreview && "opacity-40 cursor-not-allowed"
          )}
          title="Khối mã hoặc thơ (```)"
        >
          <Code size={13} />
        </button>

        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat("||", "||", "nội dung ẩn")}
          className={cn(
            "p-1.5 rounded-md hover:bg-accent/40 hover:text-foreground transition-colors cursor-pointer",
            isPreview && "opacity-40 cursor-not-allowed"
          )}
          title="Cảnh báo Spoiler (||nội dung||)"
        >
          <EyeOff size={13} />
        </button>

        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat("\n\n---\n\n", "", "")}
          className={cn(
            "p-1.5 rounded-md hover:bg-accent/40 hover:text-foreground transition-colors cursor-pointer",
            isPreview && "opacity-40 cursor-not-allowed"
          )}
          title="Đường phân cách (---)"
        >
          <Minus size={13} />
        </button>

        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat("[", "](https://example.com)", "tiêu đề link")}
          className={cn(
            "p-1.5 rounded-md hover:bg-accent/40 hover:text-foreground transition-colors cursor-pointer",
            isPreview && "opacity-40 cursor-not-allowed"
          )}
          title="Chèn liên kết [link](url)"
        >
          <Link2 size={13} />
        </button>
      </div>

      {/* Preview Toggle Button */}
      <button
        type="button"
        onClick={onTogglePreview}
        className={cn(
          "px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border",
          isPreview
            ? "bg-emerald-600/20 text-emerald-500 border-emerald-500/40"
            : "bg-accent/20 text-muted-foreground border-border/60 hover:text-foreground hover:bg-accent/30"
        )}
      >
        {isPreview ? (
          <>
            <Edit3 size={12} />
            <span>Soạn thảo</span>
          </>
        ) : (
          <>
            <Eye size={12} />
            <span>Xem trước</span>
          </>
        )}
      </button>
    </div>
  )
}
