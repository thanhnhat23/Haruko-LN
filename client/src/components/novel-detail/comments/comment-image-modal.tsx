"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, ExternalLink } from "lucide-react"

export interface CommentImageModalProps {
  imageSrc: string | null
  onClose: () => void
}

export function CommentImageModal({ imageSrc, onClose }: CommentImageModalProps) {
  useEffect(() => {
    if (!imageSrc) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [imageSrc, onClose])

  if (!imageSrc) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-7xl w-full flex flex-col items-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          title="Đóng (Esc)"
        >
          <X size={18} />
        </button>

        <div className="relative overflow-hidden rounded-sm border border-white/15 bg-black/40 shadow-2xl flex items-center justify-center p-1">
          <Image
            src={imageSrc}
            alt="Xem ảnh kích thước lớn"
            width={1200}
            height={800}
            unoptimized
            className="w-auto h-auto object-contain select-none"
          />
        </div>

        <div className="flex items-center gap-3 mt-3">
          <Link
            href={imageSrc}
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
  )
}
