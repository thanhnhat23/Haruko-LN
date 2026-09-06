"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { FileText, Image as ImageIcon, X, ExternalLink } from "lucide-react"
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

interface ImageMapping {
  code: string
  url: string
}

// Convert ![](url) from DB/state into clean shortcodes [img:1] for editor display only
function maskContentForEditor(
  rawContent: string
): { maskedText: string; mappings: ImageMapping[] } {
  if (!rawContent) return { maskedText: "", mappings: [] }

  const mappings: ImageMapping[] = []
  let counter = 1

  // Scan content for markdown images: ![](url) or ![alt](url)
  const maskedText = rawContent.replace(
    /!\[.*?\]\((https?:\/\/[^\s)]+|data:[^\s)]+)\)/g,
    (_, url) => {
      let found = mappings.find((m) => m.url === url)
      if (!found) {
        found = { code: `${counter++}`, url }
        mappings.push(found)
      }
      return `[img:${found.code}]`
    }
  )

  return { maskedText, mappings }
}

function getNextImageCode(mappings: ImageMapping[]): string {
  const existingNums = mappings
    .map((m) => parseInt(m.code, 10))
    .filter((n) => !isNaN(n))
  return existingNums.length > 0 ? `${Math.max(...existingNums) + 1}` : "1"
}

// Unmask [img:1] back to standard markdown ![](url) before saving to state / DB
function unmaskContentForStorage(
  editorText: string,
  mappings: ImageMapping[]
): string {
  if (!editorText) return ""

  return editorText.replace(
    /\[(?:img|image):([a-zA-Z0-9_-]+)\]/gi,
    (match, code) => {
      const cleanCode = code.trim().toLowerCase()
      const fromMap = mappings.find(
        (m) => m.code.toLowerCase() === cleanCode
      )
      if (fromMap && fromMap.url) {
        return `\n![](${fromMap.url})\n`
      }
      return match
    }
  )
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
  const [imageMappings, setImageMappings] = useState<ImageMapping[]>([])
  const [isPreview, setIsPreview] = useState(false)
  const [previewInlineImage, setPreviewInlineImage] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Only consider mappings whose shortcode [img:code] actually exists in the textarea content
  const activeImageMappings = React.useMemo(() => {
    return imageMappings.filter((m) => {
      const regex = new RegExp(`\\[(?:img|image):\\s*${m.code}\\s*\\]`, "i")
      return regex.test(content)
    })
  }, [imageMappings, content])

  useEffect(() => {
    setChapterNumber(modalState.chapterNumber)
    setOrderIndex(modalState.orderIndex)
    setTitle(modalState.title)

    // Mask real URLs to [img:1], [img:2] for clean editor display
    const { maskedText, mappings } = maskContentForEditor(modalState.content || "")
    setContent(maskedText)
    setImageMappings(mappings)

    setHasIllustration(modalState.hasIllustration)
    setImages(modalState.images || [])
    setIsPreview(false)
  }, [modalState])

  if (!modalState.isOpen) return null

  // Delete an inline image completely from both content text and image states
  const handleDeleteInlineImage = (code: string, url: string) => {
    // 1. Remove [img:code] from content (handles whitespace and linebreaks)
    const regex = new RegExp(`\\n?\\s*\\[(?:img|image):\\s*${code}\\s*\\]\\s*\\n?`, "gi")
    setContent((prev) => {
      const replaced = prev.replace(regex, "\n")
      return replaced.replace(/\n{3,}/g, "\n\n")
    })

    // 2. Remove from imageMappings
    setImageMappings((prev) =>
      prev.filter((item) => item.code.toLowerCase() !== code.toLowerCase())
    )

    // 3. Remove from images state
    setImages((prev) => prev.filter((img) => img.imageUrl !== url))
  }

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

  // Insert image: shows [img:1] in textarea while keeping real URL in imageMappings for saving
  const handleInsertImageFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`Ảnh "${file.name}" vượt quá 10MB. Vui lòng chọn ảnh nhỏ hơn.`)
      return
    }

    const nextCode = getNextImageCode(imageMappings)
    const placeholder = `\n[Đang tải ảnh...] (vui lòng đợi)\n`
    setContent((prev) => prev + placeholder)

    const reader = new FileReader()
    reader.onload = (uploadEvent) => {
      const uploadedUrl = uploadEvent.target?.result as string
      // Save to mappings so it can be unmasked back to raw link on save
      setImageMappings((prev) => [...prev, { code: nextCode, url: uploadedUrl }])

      // In editor: show clean shortcode
      const shortcodeTag = `\n[img:${nextCode}]\n`
      setContent((prev) => prev.replace(placeholder, shortcodeTag))

      // Track in images
      const newInlineImage: ChapterImage = {
        id: Date.now() + Math.floor(Math.random() * 9999),
        imageUrl: uploadedUrl,
        publicId: `inline_${Date.now()}`,
        orderIndex: activeImageMappings.length + 1,
        type: "inline",
        createdAt: "Vừa xong",
      }
      setImages((prev) => [...prev, newInlineImage])
    }
    reader.readAsDataURL(file)
  }

  // Support Copy-Paste image into textarea: shows [img:1] while keeping real URL in imageMappings
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.indexOf("image") !== -1) {
        e.preventDefault()
        const file = item.getAsFile()
        if (!file) continue

        if (file.size > 10 * 1024 * 1024) {
          alert(`Ảnh vượt quá 10MB. Vui lòng chọn ảnh nhỏ hơn.`)
          return
        }

        const nextCode = getNextImageCode(imageMappings)
        const textarea = e.currentTarget
        const start = textarea.selectionStart
        const end = textarea.selectionEnd

        const placeholder = `\n[Đang tải ảnh...] (vui lòng đợi)\n`
        const newContent =
          content.substring(0, start) + placeholder + content.substring(end)
        setContent(newContent)

        const reader = new FileReader()
        reader.onload = (uploadEvent) => {
          const uploadedUrl = uploadEvent.target?.result as string
          // Save to mappings so it can be unmasked back to raw link on save
          setImageMappings((prev) => [...prev, { code: nextCode, url: uploadedUrl }])

          // In editor: show clean shortcode
          const shortcodeTag = `\n[img:${nextCode}]\n`
          setContent((prev) => prev.replace(placeholder, shortcodeTag))

          // Record in images
          const newInlineImage: ChapterImage = {
            id: Date.now() + Math.floor(Math.random() * 9999),
            imageUrl: uploadedUrl,
            publicId: `inline_${Date.now()}`,
            orderIndex: activeImageMappings.length + 1,
            type: "inline",
            createdAt: "Vừa xong",
          }
          setImages((prev) => [...prev, newInlineImage])
        }
        reader.readAsDataURL(file)
        return
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Unmask only currently active image shortcodes back to real markdown ![](url)
    const contentToSave = unmaskContentForStorage(content, activeImageMappings)

    const activeUrls = new Set(activeImageMappings.map((m) => m.url))

    // Separate gallery (header) images and inline images
    const headerImages = images
      .filter((img) => img.type !== "inline")
      .map((img, idx) => ({ ...img, orderIndex: idx + 1, type: "header" as const }))

    // Only keep inline images that are currently referenced in the content!
    const inlineImages = images.filter(
      (img) => img.type === "inline" && activeUrls.has(img.imageUrl)
    )

    const combinedImages = hasIllustration
      ? [...headerImages, ...inlineImages]
      : inlineImages

    const hasAnyIllustrations =
      (hasIllustration && headerImages.length > 0) ||
      inlineImages.length > 0 ||
      headerImages.length > 0

    onSave({
      chapterNumber,
      orderIndex: Number(orderIndex) || 1,
      title,
      content: contentToSave, // Real link saved in state/DB as requested!
      hasIllustration: hasAnyIllustrations,
      images: combinedImages,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto no-scrollbar scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wide flex items-center gap-2">
            <FileText size={16} className="text-emerald-500" />
            {modalState.mode === "add" ? "Thêm chương mới" : "Chỉnh sửa chương"}
          </h3>
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
              images={images.filter((img) => img.type !== "inline")}
              onChange={(newHeaderImages) => {
                const inlineImages = images.filter((img) => img.type === "inline")
                const normalized = newHeaderImages.map((img, idx) => ({
                  ...img,
                  orderIndex: idx + 1,
                  type: "header" as const,
                }))
                setImages([...normalized, ...inlineImages])
              }}
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
                onInsertImageFile={handleInsertImageFile}
              />

              {/* Inline Images Shortcode Badges */}
              {activeImageMappings.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-accent/20 border border-border/60 text-xs">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Mã ảnh trong bài:
                  </span>
                  {activeImageMappings.map((m) => (
                    <div
                      key={m.code}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background border border-border shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setPreviewInlineImage(m.url)
                        }}
                        className="flex items-center gap-1.5 cursor-zoom-in group/item hover:opacity-90 transition-opacity"
                        title="Nhấn để mở xem ảnh phóng to"
                      >
                        <div className="relative w-5 h-5 rounded overflow-hidden bg-accent/30 shrink-0 border border-border/50">
                          <Image
                            src={m.url}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover group-hover/item:scale-110 transition-transform duration-200"
                          />
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDeleteInlineImage(m.code, m.url)
                        }}
                        className="text-muted-foreground hover:text-rose-500 transition-colors ml-0.5 cursor-pointer p-0.5 rounded hover:bg-rose-500/10"
                        title="Xóa ảnh này khỏi bài"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {isPreview ? (
                <div className="min-h-56 max-h-96 overflow-y-auto no-scrollbar scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-3 rounded-lg bg-card/50 border border-dashed border-border/70 text-foreground text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {content.trim() ? (
                    <CommentMarkdown
                      content={unmaskContentForStorage(content, activeImageMappings)}
                    />
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
                  onPaste={handlePaste}
                  rows={8}
                  placeholder="Dán hoặc nhập nội dung chương truyện... Có thể dán ảnh trực tiếp (Ctrl+V) vào giữa content"
                  className="w-full text-xs sm:text-sm p-3 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden transition-colors resize-y font-normal leading-relaxed whitespace-pre-wrap"
                  style={{ tabSize: 4 }}
                />
              )}
            </div>

            <p className="text-[10px] text-muted-foreground italic">
              * Mẹo: Nhấn <kbd className="px-1 py-0.5 rounded bg-accent/40 font-mono text-[9px] font-bold">Ctrl + V</kbd> để dán ảnh trực tiếp vào nội dung hoặc nhấn <kbd className="px-1 py-0.5 rounded bg-accent/40 font-mono text-[9px] font-bold">Tab</kbd> để thụt đầu dòng 4 khoảng trắng.
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

      {/* Lightbox Preview Modal for Inline Image */}
      {previewInlineImage && (
        <div
          className="fixed inset-0 z-70 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewInlineImage(null)}
        >
          <div
            className="relative max-w-3xl w-full flex flex-col items-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewInlineImage(null)}
              className="absolute -top-10 right-0 p-2 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
              title="Đóng (Esc)"
            >
              <X size={18} />
            </button>

            <div className="relative overflow-hidden rounded-sm border border-white/15 bg-black/40 shadow-2xl flex items-center justify-center p-1">
              <Image
                src={previewInlineImage}
                alt="Xem trước ảnh minh họa"
                width={1200}
                height={800}
                unoptimized
                className="max-h-[75vh] max-w-full w-auto h-auto object-contain select-none"
              />
            </div>

            {previewInlineImage.startsWith("http") && (
              <div className="flex items-center gap-3 mt-3">
                <Link
                  href={previewInlineImage}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-white/85 hover:text-white font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
                >
                  <ExternalLink size={13} />
                  Mở ảnh trong tab mới
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
