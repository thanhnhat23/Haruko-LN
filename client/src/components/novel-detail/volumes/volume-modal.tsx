"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Layers, UploadCloud, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { VolumeModalState } from "@/hooks/use-volumes"

export interface VolumeModalProps {
  modalState: VolumeModalState
  onClose: () => void
  onSave: (number: number, title: string, cover: string) => void
}

export function VolumeModal({ modalState, onClose, onSave }: VolumeModalProps) {
  const [number, setNumber] = useState(modalState.number)
  const [title, setTitle] = useState(modalState.title)
  const [cover, setCover] = useState(modalState.cover)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setNumber(modalState.number)
    setTitle(modalState.title)
    setCover(modalState.cover)
  }, [modalState])

  if (!modalState.isOpen) return null

  // Handle cover image upload from device
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("Dung lượng ảnh tối đa là 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setCover(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(Number(number) || 1, title, cover)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wide flex items-center gap-2">
            <Layers size={16} className="text-emerald-500" />
            {modalState.mode === "add" ? "Thêm tập mới" : "Chỉnh sửa tập"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Volume Number */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
              Số tập
            </label>
            <input
              type="number"
              min="1"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
              placeholder="VD: 1, 2, 3..."
              className="w-full text-xs p-2.5 rounded-lg bg-background border border-border text-foreground font-bold focus:outline-hidden focus:border-foreground"
              required
            />
          </div>

          {/* Volume Title */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
              Tên / Tiêu đề tập
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Lời thách thức từ cô bạn thuở nhỏ"
              className="w-full text-xs p-2.5 rounded-lg bg-background border border-border text-foreground focus:outline-hidden focus:border-foreground"
              autoFocus
            />
          </div>

          {/* Upload Cover Image */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
              Ảnh bìa tập truyện
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleCoverUpload}
            />

            {cover ? (
              <div className="flex items-center gap-4 p-3 rounded-xl bg-background border border-border/80">
                <div className="relative w-16 h-22 rounded-lg overflow-hidden border border-border shadow-xs shrink-0">
                  <Image src={cover} alt="Preview ảnh bìa" fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <p className="text-[11px] text-muted-foreground font-medium truncate">
                    Đã chọn ảnh bìa
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-7 text-[11px] px-2.5 flex items-center gap-1 cursor-pointer"
                    >
                      <Upload size={12} /> Thay ảnh
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCover("")}
                      className="h-7 text-[11px] px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border/80 hover:border-emerald-500/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-accent/10 hover:bg-accent/20 flex flex-col items-center justify-center gap-1.5"
              >
                <UploadCloud size={24} className="text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">
                  Chọn ảnh từ thiết bị
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Hỗ trợ PNG, JPG, GIF (tối đa 5MB)
                </span>
              </div>
            )}
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
              {modalState.mode === "add" ? "Thêm tập" : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
