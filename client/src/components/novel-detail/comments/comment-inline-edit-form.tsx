"use client"

import React, { useState, useRef } from "react"
import { Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommentMarkdown } from "@/components/novel-detail/comments/comment-markdown"
import { cn } from "@/lib/utils"
import {
  CommentMarkdownToolbar,
  insertMarkdown,
} from "./comment-markdown-toolbar"

export interface CommentInlineEditFormProps {
  initialText: string
  onSave: (newText: string) => void
  onCancel: () => void
}

const MAX_COMMENT_LENGTH = 1000

export function CommentInlineEditForm({
  initialText,
  onSave,
  onCancel,
}: CommentInlineEditFormProps) {
  const [editText, setEditText] = useState(initialText)
  const [isPreview, setIsPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="p-3 rounded-xl bg-card/80 border-2 border-emerald-500/40 dark:border-emerald-500/30 space-y-2.5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between text-[11px] font-bold text-foreground pb-1 border-b border-border/40">
        <span className="flex items-center gap-1 text-emerald-500">
          <Edit3 size={13} />
          Chỉnh sửa bình luận
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground cursor-pointer text-[10px] uppercase tracking-wider"
        >
          Hủy
        </button>
      </div>

      <CommentMarkdownToolbar
        onBold={() =>
          insertMarkdown(textareaRef.current, editText, setEditText, "**", "**", "in đậm", MAX_COMMENT_LENGTH)
        }
        onItalic={() =>
          insertMarkdown(textareaRef.current, editText, setEditText, "*", "*", "in nghiêng", MAX_COMMENT_LENGTH)
        }
        onStrike={() =>
          insertMarkdown(textareaRef.current, editText, setEditText, "~~", "~~", "gạch ngang", MAX_COMMENT_LENGTH)
        }
        onSpoiler={() =>
          insertMarkdown(textareaRef.current, editText, setEditText, "||", "||", "spoiler", MAX_COMMENT_LENGTH)
        }
        onQuote={() =>
          insertMarkdown(textareaRef.current, editText, setEditText, "> ", "", "trích dẫn", MAX_COMMENT_LENGTH)
        }
        onCode={() =>
          insertMarkdown(textareaRef.current, editText, setEditText, "`", "`", "code", MAX_COMMENT_LENGTH)
        }
        onLink={() =>
          insertMarkdown(textareaRef.current, editText, setEditText, "[tiêu đề](", ")", "https://", MAX_COMMENT_LENGTH)
        }
        isPreview={isPreview}
        onTogglePreview={() => setIsPreview(!isPreview)}
      />

      {isPreview ? (
        <div className="p-3 rounded-xl bg-background border border-border min-h-15 text-xs">
          {editText.trim() ? (
            <CommentMarkdown content={editText} />
          ) : (
            <span className="text-muted-foreground italic">Chưa có nội dung</span>
          )}
        </div>
      ) : (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
            maxLength={MAX_COMMENT_LENGTH}
            className="w-full text-xs sm:text-sm p-2.5 pb-6 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-foreground transition-colors resize-none"
            autoFocus
          />
          <div className="absolute right-2.5 bottom-2 text-[10px] font-mono select-none pointer-events-none">
            <span className={cn(
              editText.length >= MAX_COMMENT_LENGTH ? "text-rose-500 font-bold" : "text-muted-foreground/60"
            )}>
              {editText.length.toLocaleString("vi-VN")}/{MAX_COMMENT_LENGTH.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="h-7 px-3 text-xs cursor-pointer"
        >
          Hủy
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            if (editText.trim()) onSave(editText.trim().slice(0, MAX_COMMENT_LENGTH))
          }}
          className="h-7 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase cursor-pointer"
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  )
}
