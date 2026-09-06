"use client"

import { useState, useRef, useEffect } from "react"
import {
  X,
  Type,
  AlignLeft,
  AlignJustify,
  Check,
  RotateCcw,
  ChevronDown,
} from "lucide-react"
import type {
  ReaderSettings,
  ReaderTheme,
  ReaderFontFamily,
  ReaderLineHeight,
  ReaderMaxWidth,
} from "./reader-types"
import { cn } from "@/lib/utils"

export interface ReaderSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: ReaderSettings
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void
  onResetSettings: () => void
}

export function ReaderSettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
}: ReaderSettingsModalProps) {
  const [isFontPickerOpen, setIsFontPickerOpen] = useState(false)
  const fontPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFontPickerOpen) {
          setIsFontPickerOpen(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, isFontPickerOpen])

  // Click outside to close font picker dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        fontPickerRef.current &&
        !fontPickerRef.current.contains(e.target as Node)
      ) {
        setIsFontPickerOpen(false)
      }
    }
    if (isFontPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFontPickerOpen])

  if (!isOpen) return null

  const themeOptions: {
    id: ReaderTheme
    name: string
    color: string
    border: string
    isLight?: boolean
  }[] = [
    { id: "dark", name: "Tối mặc định", color: "#141416", border: "#27272a" },
    { id: "oled", name: "Đen OLED", color: "#000000", border: "#27272a" },
    { id: "nord", name: "Xanh đêm Nord", color: "#161b22", border: "#30363d" },
    { id: "forest", name: "Xanh rừng dịu", color: "#0d1813", border: "#1f372d" },
    { id: "coffee", name: "Cà phê ấm", color: "#181412", border: "#352923" },
    { id: "lavender", name: "Tím đêm", color: "#171321", border: "#34284d" },
    { id: "sepia", name: "Ấm cổ điển (Sepia)", color: "#fbf0d9", border: "#d9c7a5", isLight: true },
    { id: "parchment", name: "Giấy ngà (Parchment)", color: "#f4eedb", border: "#d7ccb2", isLight: true },
    { id: "light", name: "Trắng sáng", color: "#faf8f5", border: "#dedbd3", isLight: true },
  ]

  const fontOptions: {
    id: ReaderFontFamily
    name: string
    sub: string
    fontClass: string
  }[] = [
    {
      id: "sans",
      name: "Inter / Sans-serif",
      sub: "Không chân, sắc nét, hiện đại",
      fontClass: "font-sans",
    },
    {
      id: "be-vietnam-pro",
      name: "Be Vietnam Pro",
      sub: "Tối ưu tiếng Việt tuyệt đối",
      fontClass: "font-be-vietnam-pro",
    },
    {
      id: "literata",
      name: "Literata",
      sub: "Thiết kế chuyên cho đọc sách điện tử",
      fontClass: "font-literata",
    },
    {
      id: "lora",
      name: "Lora",
      sub: "Có chân mềm mại, êm mắt khi đọc dài",
      fontClass: "font-lora",
    },
    {
      id: "merriweather",
      name: "Merriweather",
      sub: "Đậm nét, chuẩn phong cách tiểu thuyết",
      fontClass: "font-merriweather",
    },
    {
      id: "serif",
      name: "Georgia / Serif",
      sub: "Có chân truyền thống, trang trọng",
      fontClass: "font-serif",
    },
    {
      id: "roboto",
      name: "Roboto",
      sub: "Hình học tròn trịa, thanh thoát",
      fontClass: "font-roboto",
    },
    {
      id: "playfair",
      name: "Playfair Display",
      sub: "Quý phái, phong cách nghệ thuật",
      fontClass: "font-playfair",
    },
  ]

  const currentFont =
    fontOptions.find((f) => f.id === settings.fontFamily) || fontOptions[0]
  const currentTheme =
    themeOptions.find((t) => t.id === settings.theme) || themeOptions[0]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto no-scrollbar scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            <Type size={16} className="text-emerald-500" />
            Cài đặt giao diện đọc
          </h3>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onResetSettings}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/30 cursor-pointer transition-colors"
              title="Khôi phục mặc định"
            >
              <RotateCcw size={14} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/30 cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
              Màu nền giao diện
            </label>
            <span className="text-[11px] text-muted-foreground font-medium">
              {currentTheme.name}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5 items-center">
            {themeOptions.map((opt) => {
              const isSelected = settings.theme === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onUpdateSettings({ theme: opt.id })}
                  title={opt.name}
                  aria-label={opt.name}
                  style={{ backgroundColor: opt.color, borderColor: opt.border }}
                  className={cn(
                    "w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-xs",
                    isSelected
                      ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-card scale-105"
                      : "opacity-85 hover:opacity-100 hover:scale-105"
                  )}
                >
                  {isSelected && (
                    <Check
                      size={17}
                      strokeWidth={2.6}
                      className={opt.isLight ? "text-zinc-900" : "text-emerald-400"}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-foreground tracking-wider">
            <span className="uppercase">Cỡ chữ</span>
            <span className="font-mono text-emerald-500">{settings.fontSize}px</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({ fontSize: Math.max(14, settings.fontSize - 1) })
              }
              className="h-8 px-3 rounded-lg border border-border bg-accent/20 hover:bg-accent/40 text-xs font-black cursor-pointer transition-colors text-foreground"
            >
              A-
            </button>

            <input
              type="range"
              min={14}
              max={26}
              step={1}
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
              className="flex-1 accent-emerald-500 cursor-pointer"
            />

            <button
              type="button"
              onClick={() =>
                onUpdateSettings({ fontSize: Math.min(26, settings.fontSize + 1) })
              }
              className="h-8 px-3 rounded-lg border border-border bg-accent/20 hover:bg-accent/40 text-sm font-black cursor-pointer transition-colors text-foreground"
            >
              A+
            </button>
          </div>
        </div>

        {/* Font Family */}
        <div className="space-y-2" ref={fontPickerRef}>
          <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
            Phông chữ đọc
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFontPickerOpen((prev) => !prev)}
              className={cn(
                "w-full h-11 px-3.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer shadow-xs",
                isFontPickerOpen
                  ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-accent/25"
                  : "border-border bg-accent/15 hover:bg-accent/25 text-foreground"
              )}
            >
              <div className="flex flex-col min-w-0 pr-2">
                <span className={cn("text-sm font-bold text-foreground truncate", currentFont.fontClass)}>
                  {currentFont.name}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {currentFont.sub}
                </span>
              </div>
              <ChevronDown
                size={16}
                className={cn(
                  "text-muted-foreground transition-transform duration-200 shrink-0",
                  isFontPickerOpen && "rotate-180 text-emerald-500"
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {isFontPickerOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-30 bg-card border border-border rounded-xl shadow-xl p-1.5 max-h-60 overflow-y-auto no-scrollbar scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-1 animate-in fade-in-50 zoom-in-95 duration-150">
                {fontOptions.map((opt) => {
                  const isSelected = settings.fontFamily === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onUpdateSettings({ fontFamily: opt.id })
                        setIsFontPickerOpen(false)
                      }}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer",
                        isSelected
                          ? "bg-emerald-500/15 text-emerald-500 font-semibold"
                          : "text-foreground hover:bg-accent/30"
                      )}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className={cn("text-sm truncate", opt.fontClass)}>
                          {opt.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate">
                          {opt.sub}
                        </span>
                      </div>
                      {isSelected && (
                        <Check size={16} className="text-emerald-500 shrink-0 ml-2" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Line Height & Text Align */}
        <div className="grid grid-cols-2 gap-3">
          {/* Line Height */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
              Giãn dòng
            </label>
            <div className="flex rounded-lg border border-border overflow-hidden bg-accent/10 p-0.5">
              {(
                [
                  { id: "normal", label: "Gọn" },
                  { id: "relaxed", label: "Vừa" },
                  { id: "loose", label: "Rộng" },
                ] as { id: ReaderLineHeight; label: string }[]
              ).map((lh) => (
                <button
                  key={lh.id}
                  type="button"
                  onClick={() => onUpdateSettings({ lineHeight: lh.id })}
                  className={cn(
                    "flex-1 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer text-center",
                    settings.lineHeight === lh.id
                      ? "bg-emerald-600 text-white font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {lh.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Align */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
              Canh lề
            </label>
            <div className="flex rounded-lg border border-border overflow-hidden bg-accent/10 p-0.5">
              <button
                type="button"
                onClick={() => onUpdateSettings({ textAlign: "left" })}
                className={cn(
                  "flex-1 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1",
                  settings.textAlign === "left"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <AlignLeft size={13} />
                <span>Trái</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ textAlign: "justify" })}
                className={cn(
                  "flex-1 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1",
                  settings.textAlign === "justify"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <AlignJustify size={13} />
                <span>Đều</span>
              </button>
            </div>
          </div>
        </div>

        {/* Max Width */}
        <div className="space-y-2 hidden md:block">
          <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
            Độ rộng khung đọc
          </label>
          <div className="flex rounded-lg border border-border overflow-hidden bg-accent/10 p-0.5">
            {(
              [
                { id: "narrow", label: "Thu gọn" },
                { id: "normal", label: "Tiêu chuẩn" },
                { id: "wide", label: "Mở rộng" },
              ] as { id: ReaderMaxWidth; label: string }[]
            ).map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => onUpdateSettings({ maxWidth: w.id })}
                className={cn(
                  "flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer text-center",
                  settings.maxWidth === w.id
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
