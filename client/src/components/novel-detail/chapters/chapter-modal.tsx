"use client"

import React, { useState, useEffect, useRef } from "react"
import { FileText, Image as ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { countWords } from "@/hooks/use-volumes"
import type { ChapterModalState } from "@/hooks/use-volumes"
import type { ChapterImage } from "@/data/mock-novel-data"
import { ChapterImagesUploader } from "./chapter-images-uploader"
import { ChapterMarkdownToolbar } from "./chapter-markdown-toolbar"
import { CommentMarkdown } from "../comments/comment-markdown"

export interface ChapterModalProps {
  modalState: ChapterModalState
  onClose: () => void
  onSave: (data: {
    chapterNumber: number | string
    title: string
    orderIndex: number
    content: string
    hasIllustration: boolean
    images?: ChapterImage[]
  }) => void
}

export function ChapterModal({
  modalState,
  onClose,
  onSave,
}: ChapterModalProps) {
  const [chapterNumber, setChapterNumber] = useState(modalState.chapterNumber)
  const [orderIndex, setOrderIndex] = useState(modalState.orderIndex)
  const [title, setTitle] = useState(modalState.title)
  const [content, setContent] = useState(modalState.content)
  const [hasIllustration, setHasIllustration] = useState(modalState.hasIllustration)
  const [images, setImages] = useState<ChapterImage[]>(modalState.images || [])
  const [isPreview, setIsPreview] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setChapterNumber(modalState.chapterNumber)
    setOrderIndex(modalState.orderIndex)
    setTitle(modalState.title)
    setContent(modalState.content)
    setHasIllustration(modalState.hasIllustration)
    setImages(modalState.images || [])
    setIsPreview(false)
  }, [modalState])

  if (!modalState.isOpen) return null

  // Support Tab key indentation in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent =
        content.substring(0, start) + "    " + content.substring(end)
      setContent(newContent)
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4
      }, 0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      chapterNumber,
      orderIndex: Number(orderIndex) || 1,
      title,
      content,
      hasIllustration,
      images: hasIllustration ? images : [],
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wide flex items-center gap-2">
            <FileText size={16} className="text-emerald-500" />
            {modalState.mode === "add" ? "Thêm chương mới" : "Chỉnh sửa chương"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Chapter Number & Order Index */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                Số chương
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(e.target.value)}
                placeholder="VD: 1, 1.5, 2"
                className="w-full text-xs p-2.5 rounded-lg bg-background border border-border text-foreground font-bold focus:outline-hidden focus:border-foreground"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                Thứ tự sắp xếp
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value) || 1)}
                placeholder="VD: 1, 2, 3"
                className="w-full text-xs p-2.5 rounded-lg bg-background border border-border text-foreground font-bold focus:outline-hidden focus:border-foreground"
                required
              />
            </div>
          </div>

          {/* Chapter Title */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
              Tiêu đề / Tên chương
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Lời hứa dưới pháo hoa"
              className="w-full text-xs p-2.5 rounded-lg bg-background border border-border text-foreground focus:outline-hidden focus:border-foreground"
              autoFocus
            />
          </div>

          {/* Has Illustration Flag */}
          <div className="p-2.5 rounded-xl bg-accent/15 border border-border/60">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
              <input
                type="checkbox"
                checked={hasIllustration}
                onChange={(e) => setHasIllustration(e.target.checked)}
                className="rounded-sm border-border text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <ImageIcon size={14} className="text-yellow-400" />
              <span>Chương có ảnh minh họa</span>
            </label>
          </div>

          {/* Chapter Images Management - Displayed when checkbox is ticked */}
          {hasIllustration && (
            <ChapterImagesUploader
              images={images}
              onChange={setImages}
            />
          )}

          {/* Chapter Content with Markdown Support */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                Nội dung chương (Hỗ trợ Markdown)
              </label>
              <span className="text-[10px] text-muted-foreground font-mono bg-accent/30 px-2 py-0.5 rounded">
                Độ dài: <strong className="text-foreground">~{countWords(content).toLocaleString()} từ</strong>
              </span>
            </div>

            {/* Markdown Toolbar */}
            <div className="p-2.5 rounded-xl bg-background border border-border/80 space-y-2">
              <ChapterMarkdownToolbar
                textareaRef={textareaRef}
                content={content}
                setContent={setContent}
                isPreview={isPreview}
                onTogglePreview={() => setIsPreview(!isPreview)}
              />

              {isPreview ? (
                <div className="min-h-56 max-h-96 overflow-y-auto p-3 rounded-lg bg-card/50 border border-dashed border-border/70 text-foreground text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {content.trim() ? (
                    <CommentMarkdown content={content} />
                  ) : (
                    <p className="text-muted-foreground italic text-center py-8">
                      Chưa có nội dung để xem trước. Vui lòng nhập nội dung chương.
                    </p>
                  )}
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={8}
                  placeholder="Dán hoặc nhập nội dung chương truyện... Hỗ trợ tab, thụt lề, xuống dòng và định dạng Markdown chuẩn."
                  className="w-full text-xs sm:text-sm p-3 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden transition-colors resize-y font-normal leading-relaxed whitespace-pre-wrap"
                  style={{ tabSize: 4 }}
                />
              )}
            </div>

            <p className="text-[10px] text-muted-foreground italic">
              * Mẹo: Nhấn phím <kbd className="px-1 py-0.5 rounded bg-accent/40 font-mono text-[9px] font-bold">Tab</kbd> để thụt đầu dòng 4 khoảng trắng. Toàn bộ định dạng khi dán từ Word sẽ được giữ nguyên vẹn.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              {modalState.mode === "add" ? "Thêm chương" : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
