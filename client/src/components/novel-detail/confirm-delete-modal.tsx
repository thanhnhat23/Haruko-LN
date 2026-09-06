"use client"

import { useEffect } from "react"
import { Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ConfirmDeleteModalProps {
  isOpen: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDeleteModal({
  isOpen,
  title,
  description,
  confirmText = "Xác nhận xóa",
  cancelText = "Hủy",
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button at top right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          <X size={16} />
        </button>

        {/* Confirmation Content */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-500 shrink-0 border border-rose-500/30">
            <Trash2 size={20} />
          </div>

          <div className="space-y-1.5 flex-1 pr-4">
            <h3 className="text-sm sm:text-base font-black text-foreground">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 px-4 text-xs font-semibold cursor-pointer"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="h-8 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
