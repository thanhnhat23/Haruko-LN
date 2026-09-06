"use client"

import React, { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  UploadCloud,
  ImageIcon,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  Plus,
  X,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ChapterImage } from "@/data/mock-novel-data"
import { cn } from "@/lib/utils"

export interface ChapterImagesUploaderProps {
  images: ChapterImage[]
  onChange: (images: ChapterImage[]) => void
}

export function ChapterImagesUploader({
  images,
  onChange,
}: ChapterImagesUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Handle multiple image uploads
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileList = Array.from(files)
    const newItems: ChapterImage[] = []
    const baseTimestamp = Date.now()
    let processedCount = 0
    fileList.forEach((file, idx) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Ảnh "${file.name}" vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.`)
        processedCount++
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        newItems.push({
          id: baseTimestamp + (idx + 1) * 10000 + Math.floor(Math.random() * 9999),
          imageUrl: dataUrl,
          orderIndex: images.length + newItems.length + 1,
          createdAt: "Vừa xong",
        })

        processedCount++
        if (processedCount === fileList.length) {
          // Sort and normalize orderIndex
          const combined = [...images, ...newItems]
            .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
            .map((item, index) => ({
              ...item,
              orderIndex: index + 1,
            }))
          onChange(combined)
        }
      }
      reader.readAsDataURL(file)
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Move image order up or down
  const moveImage = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= images.length) return

    const reordered = [...images]
    const temp = reordered[index]
    reordered[index] = reordered[targetIndex]
    reordered[targetIndex] = temp

    // Normalize orderIndex sequentially: 1..N
    const normalized = reordered.map((item, idx) => ({
      ...item,
      orderIndex: idx + 1,
    }))
    onChange(normalized)
  }

  // Update orderIndex manually
  const handleOrderChange = (index: number, newOrder: number) => {
    const updated = [...images]
    updated[index] = { ...updated[index], orderIndex: newOrder }
    const sorted = updated
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
      .map((item, idx) => ({ ...item, orderIndex: idx + 1 }))
    onChange(sorted)
  }

  // Delete image from chapter
  const deleteImage = (id: number, index: number) => {
    const filtered = images
      .filter((img, idx) => (img.id ? img.id !== id : idx !== index))
      .map((item, idx) => ({ ...item, orderIndex: idx + 1 }))
    onChange(filtered)
  }

  return (
    <div className="space-y-3 p-3.5 rounded-xl bg-accent/15 border border-border/70 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon size={15} className="text-yellow-400" />
          <span className="text-xs font-bold text-foreground">
            Danh sách ảnh minh họa ({images.length} ảnh)
          </span>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-7 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
        >
          <Plus size={13} />
          <span>Thêm ảnh</span>
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFilesSelected}
        />
      </div>

      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border/80 hover:border-emerald-500/60 rounded-xl p-5 text-center cursor-pointer transition-colors bg-accent/10 hover:bg-accent/20 flex flex-col items-center justify-center gap-1.5"
        >
          <UploadCloud size={24} className="text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">
            Nhấn để tải lên một hoặc nhiều ảnh minh họa
          </span>
          <span className="text-[10px] text-muted-foreground">
            Hỗ trợ PNG, JPG, GIF, WebP (Tối đa 5MB/ảnh). Có thể chỉnh thứ tự hiển thị sau khi tải.
          </span>
        </div>
      ) : (
        <div className="space-y-2 pr-1">
          {images.map((img, index) => {
            const isFirst = index === 0
            const isLast = index === images.length - 1
            const itemKey = `chapter-img-${img.id || "item"}-${index}`

            return (
              <div
                key={itemKey}
                className="flex items-center justify-between gap-3 p-2 rounded-lg bg-background border border-border/80 shadow-2xs hover:border-border transition-colors"
              >
                {/* Thumbnail & Order Index Badge */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-accent/30 border border-border shrink-0">
                    <Image
                      src={img.imageUrl}
                      alt={`Ảnh minh họa #${img.orderIndex}`}
                      fill
                      unoptimized
                      sizes="48px"
                      className="object-cover"
                    />
                    <div className="absolute top-0.5 left-0.5 z-10 px-1 rounded-xs bg-black/75 text-[9px] font-mono font-black text-yellow-400">
                      #{img.orderIndex}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground truncate">
                      <span>Ảnh minh họa #{img.orderIndex}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        Thứ tự:
                      </span>
                      <input
                        type="number"
                        min="1"
                        max={images.length}
                        value={img.orderIndex}
                        onChange={(e) =>
                          handleOrderChange(index, Number(e.target.value) || 1)
                        }
                        className="w-12 h-5 px-1 text-[11px] font-mono font-bold rounded bg-accent/20 border border-border text-foreground text-center focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Preview Button */}
                  <button
                    type="button"
                    onClick={() => setPreviewImage(img.imageUrl)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors cursor-pointer"
                    title="Xem trước ảnh phóng to"
                  >
                    <Eye size={13} />
                  </button>

                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => moveImage(index, "up")}
                    className={cn(
                      "p-1.5 rounded-md transition-colors",
                      isFirst
                        ? "text-muted-foreground/30 cursor-not-allowed"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/30 cursor-pointer"
                    )}
                    title="Đưa ảnh lên trước"
                  >
                    <ArrowUp size={13} />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={isLast}
                    onClick={() => moveImage(index, "down")}
                    className={cn(
                      "p-1.5 rounded-md transition-colors",
                      isLast
                        ? "text-muted-foreground/30 cursor-not-allowed"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/30 cursor-pointer"
                    )}
                    title="Đưa ảnh xuống sau"
                  >
                    <ArrowDown size={13} />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => deleteImage(img.id, index)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-rose-500 hover:bg-rose-500/15 transition-colors cursor-pointer"
                    title="Xóa ảnh này"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl w-full flex flex-col items-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 p-2 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
              title="Đóng (Esc)"
            >
              <X size={18} />
            </button>

            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-2xl flex items-center justify-center p-1">
              <Image
                src={previewImage}
                alt="Xem trước ảnh minh họa"
                width={1200}
                height={800}
                unoptimized
                className="max-h-[75vh] max-w-full w-auto h-auto object-contain select-none"
              />
            </div>

            <div className="flex items-center gap-3 mt-3">
              <Link
                href={previewImage}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/85 hover:text-white font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
              >
                <ExternalLink size={13} />
                Mở ảnh trong tab mới
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
