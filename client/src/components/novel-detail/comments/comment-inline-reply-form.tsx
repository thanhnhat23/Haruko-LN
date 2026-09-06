"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { CornerDownRight, Smile, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmojiPickerPopover } from "@/components/ui/emoji-picker"
import { CommentMarkdown } from "@/components/novel-detail/comments/comment-markdown"
import { cn } from "@/lib/utils"
import {
  CommentMarkdownToolbar,
  insertMarkdown,
} from "./comment-markdown-toolbar"

export interface CommentInlineReplyFormProps {
  targetUsername: string
  onSubmit: (text: string, image?: string) => void
  onCancel: () => void
}

const MAX_REPLY_LENGTH = 1000

export function CommentInlineReplyForm({
  targetUsername,
  onSubmit,
  onCancel,
}: CommentInlineReplyFormProps) {
  const [replyText, setReplyText] = useState("")
  const [replyImage, setReplyImage] = useState<string | null>(null)
  const [isPreview, setIsPreview] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("Dung lượng ảnh tối đa là 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setReplyImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!replyText.trim() && !replyImage) return
    onSubmit(replyText.slice(0, MAX_REPLY_LENGTH), replyImage || undefined)
  }

  return (
    <div className="pt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold px-1">
        <span className="flex items-center gap-1">
          <CornerDownRight size={12} className="text-foreground/70" />
          Đang trả lời <strong className="text-foreground font-bold">@{targetUsername}</strong>
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-rose-500 hover:text-rose-400 hover:underline cursor-pointer text-[10px] font-bold uppercase tracking-wider"
        >
          Hủy
        </button>
      </div>

      <div className="p-2.5 rounded-xl bg-card/70 border-2 border-border/80 dark:border-zinc-700/80 space-y-2">
        <CommentMarkdownToolbar
          onBold={() =>
            insertMarkdown(inputRef.current, replyText, setReplyText, "**", "**", "in đậm", MAX_REPLY_LENGTH)
          }
          onItalic={() =>
            insertMarkdown(inputRef.current, replyText, setReplyText, "*", "*", "in nghiêng", MAX_REPLY_LENGTH)
          }
          onStrike={() =>
            insertMarkdown(inputRef.current, replyText, setReplyText, "~~", "~~", "gạch ngang", MAX_REPLY_LENGTH)
          }
          onSpoiler={() =>
            insertMarkdown(inputRef.current, replyText, setReplyText, "||", "||", "spoiler", MAX_REPLY_LENGTH)
          }
          onQuote={() =>
            insertMarkdown(inputRef.current, replyText, setReplyText, "> ", "", "trích dẫn", MAX_REPLY_LENGTH)
          }
          onCode={() =>
            insertMarkdown(inputRef.current, replyText, setReplyText, "`", "`", "code", MAX_REPLY_LENGTH)
          }
          onLink={() =>
            insertMarkdown(inputRef.current, replyText, setReplyText, "[tiêu đề](", ")", "https://", MAX_REPLY_LENGTH)
          }
          isPreview={isPreview}
          onTogglePreview={() => setIsPreview(!isPreview)}
        />

        {isPreview ? (
          <div className="p-2 rounded-lg bg-background min-h-10 border border-border/40 text-xs">
            {replyText.trim() ? (
              <CommentMarkdown content={replyText} />
            ) : (
              <span className="text-muted-foreground italic">Chưa có nội dung xem trước</span>
            )}
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={replyText}
                maxLength={MAX_REPLY_LENGTH}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                placeholder={`Trả lời @${targetUsername}...`}
                className="w-full text-xs p-2 pr-14 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-foreground"
                autoFocus
              />
              <span className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono select-none pointer-events-none",
                replyText.length >= MAX_REPLY_LENGTH ? "text-rose-500 font-bold" : "text-muted-foreground/60"
              )}>
                {replyText.length}/{MAX_REPLY_LENGTH}
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            <div className="relative" ref={emojiRef}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={cn(
                  "p-2 rounded-md hover:bg-accent/20 hover:text-foreground cursor-pointer transition-colors",
                  showEmojiPicker && "text-foreground bg-accent/30"
                )}
                title="Chèn biểu cảm"
              >
                <Smile size={15} />
              </button>

              <EmojiPickerPopover
                isOpen={showEmojiPicker}
                onEmojiSelect={(emojiChar) => {
                  if ((replyText + emojiChar).length <= MAX_REPLY_LENGTH) {
                    setReplyText((prev) => prev + emojiChar)
                  }
                }}
                className="top-full mt-2 right-0 left-auto"
                height="h-64"
                width="w-60 sm:w-68"
              />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "p-2 rounded-md hover:bg-accent/20 hover:text-foreground cursor-pointer transition-colors",
                replyImage && "text-foreground bg-accent/30"
              )}
              title="Đính kèm ảnh"
            >
              <ImageIcon size={15} />
            </button>

            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              className="h-8 px-3 bg-foreground! text-background! hover:bg-background! hover:text-foreground! font-bold text-xs uppercase cursor-pointer"
            >
              Gửi
            </Button>
          </div>
        )}
      </div>

      {replyImage && (
        <div className="relative inline-block mt-1">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-border bg-accent/20 shadow-xs">
            <Image
              src={replyImage}
              alt="Preview ảnh trả lời"
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setReplyImage(null)
              if (fileInputRef.current) fileInputRef.current.value = ""
            }}
            className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-background text-foreground hover:bg-destructive hover:text-destructive-foreground shadow-xs border border-border cursor-pointer"
            title="Xóa ảnh"
          >
            <X size={11} />
          </button>
        </div>
      )}
    </div>
  )
}
