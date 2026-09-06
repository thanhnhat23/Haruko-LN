"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  X,
  Volume2,
  Play,
  Pause,
  Square,
  RotateCcw,
  Check,
  Info,
  ChevronDown,
  Search,
  Sparkles,
  Globe,
  AlertTriangle,
  Loader2,
  Key,
  Eye,
  EyeOff,
  Languages,
} from "lucide-react"
import type { TtsSettings, TtsEngine } from "./reader-types"
import { GEMINI_PREBUILT_VOICES } from "./reader-types"
import { cn } from "@/lib/utils"

export interface TtsSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: TtsSettings
  onUpdateSettings: (newSettings: Partial<TtsSettings>) => void
  onResetSettings: () => void
  availableVoices: SpeechSynthesisVoice[]
  onTestVoice: (
    voiceIdOrUri: string,
    rate: number,
    pitch: number,
    volume: number,
    engine?: TtsEngine
  ) => void
  isTestingVoice?: boolean
  isPlaying?: boolean
  isPaused?: boolean
  isLoadingAudio?: boolean
  ttsError?: string | null
  onStartReading?: () => void
  onStopReading?: () => void
}

export function TtsSettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
  availableVoices,
  onTestVoice,
  isTestingVoice = false,
  isPlaying = false,
  isPaused = false,
  isLoadingAudio = false,
  ttsError = null,
  onStartReading,
  onStopReading,
}: TtsSettingsModalProps) {
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false)
  const [voiceSearch, setVoiceSearch] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [testingVoiceId, setTestingVoiceId] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsVoiceDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!isOpen) return null

  // Categorize Web Speech voices: Vietnamese vs Others
  const vietnameseVoices = availableVoices.filter(
    (v) =>
      v.lang.toLowerCase().startsWith("vi") ||
      v.lang.toLowerCase().includes("vn") ||
      v.name.toLowerCase().includes("vietnam")
  )

  const otherVoices = availableVoices.filter(
    (v) =>
      !v.lang.toLowerCase().startsWith("vi") &&
      !v.lang.toLowerCase().includes("vn") &&
      !v.name.toLowerCase().includes("vietnam")
  )

  const hasVietnameseVoice = vietnameseVoices.length > 0

  const currentWebVoice = availableVoices.find((v) => v.voiceURI === settings.voiceURI)
  const isCurrentVietnamese =
    currentWebVoice &&
    (currentWebVoice.lang.toLowerCase().startsWith("vi") ||
      currentWebVoice.lang.toLowerCase().includes("vn") ||
      currentWebVoice.name.toLowerCase().includes("vietnam"))

  const filteredVietnamese = vietnameseVoices.filter(
    (v) =>
      v.name.toLowerCase().includes(voiceSearch.toLowerCase()) ||
      v.lang.toLowerCase().includes(voiceSearch.toLowerCase())
  )

  const filteredOthers = otherVoices.filter(
    (v) =>
      v.name.toLowerCase().includes(voiceSearch.toLowerCase()) ||
      v.lang.toLowerCase().includes(voiceSearch.toLowerCase())
  )

  const speedPresets = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0]

  const handleTestGeminiVoice = (voiceId: string) => {
    setTestingVoiceId(voiceId)
    onTestVoice(voiceId, settings.rate, settings.pitch, settings.volume, "gemini")
  }

  const handleTestWebSpeechVoice = () => {
    setTestingVoiceId("webspeech")
    onTestVoice(settings.voiceURI, settings.rate, settings.pitch, settings.volume, "webspeech")
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            <Volume2 size={18} className="text-emerald-500" />
            Cài đặt giọng đọc (Text to Speech)
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

        {/* Redesigned Premium Alert Banner */}
        {ttsError && (
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/35 bg-linear-to-br from-amber-500/12 via-card to-rose-500/8 p-4 shadow-lg shadow-black/20 animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex items-start gap-3">
              {/* Status Icon Badge */}
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0 shadow-xs mt-0.5">
                <AlertTriangle size={18} />
              </div>

              {/* Content Body */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-foreground">
                      {ttsError.includes("giới hạn") || ttsError.includes("429")
                        ? "Đã đạt giới hạn yêu cầu Gemini"
                        : "Thông báo giọng đọc"}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {ttsError.includes("giới hạn") || ttsError.includes("429") ? "Hạn ngạch" : "Cảnh báo"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ttsError}
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {settings.engine === "gemini" && (
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ engine: "webspeech" })}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 inline-flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <Globe size={13} />
                      <span>Đổi sang giọng Trình duyệt</span>
                    </button>
                  )}
                  {settings.engine === "gemini" && (
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector<HTMLInputElement>('input[placeholder*="AIzaSy"]')
                        if (input) {
                          input.focus()
                          input.scrollIntoView({ behavior: "smooth", block: "center" })
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-border/80 bg-accent/30 hover:bg-accent/60 text-foreground font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Key size={13} className="text-amber-400" />
                      <span>Nhập API Key riêng</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Engine Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
            Công nghệ giọng đọc
          </label>
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-accent/20 border border-border/60">
            {/* Gemini AI Option */}
            <button
              type="button"
              onClick={() => onUpdateSettings({ engine: "gemini" })}
              className={cn(
                "py-2 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer text-center relative",
                settings.engine === "gemini"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 border border-emerald-500/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
              )}
            >
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className={settings.engine === "gemini" ? "text-amber-300" : "text-emerald-500"} />
                <span>Gemini AI Voice</span>
              </div>
              <span className={cn(
                "text-[10px] font-normal leading-tight",
                settings.engine === "gemini" ? "text-emerald-100" : "text-muted-foreground"
              )}>
                Model 3.5 Flash • Tự nhiên &amp; Truyền cảm
              </span>
            </button>

            {/* Web Speech Option */}
            <button
              type="button"
              onClick={() => onUpdateSettings({ engine: "webspeech" })}
              className={cn(
                "py-2 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer text-center",
                settings.engine === "webspeech"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 border border-emerald-500/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
              )}
            >
              <div className="flex items-center gap-1.5">
                <Globe size={14} className={settings.engine === "webspeech" ? "text-white" : "text-muted-foreground"} />
                <span>Web Speech API</span>
              </div>
              <span className={cn(
                "text-[10px] font-normal leading-tight",
                settings.engine === "webspeech" ? "text-emerald-100" : "text-muted-foreground"
              )}>
                Giọng máy hệ thống trình duyệt
              </span>
            </button>
          </div>
        </div>

        {/* ENGINE SPECIFIC VOICE SELECTION */}
        {settings.engine === "gemini" ? (
          /* Gemini AI Voices Selection */
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                  Chọn nhân vật đọc AI (Gemini 3.5)
                </label>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                24kHz Hi-Fi Audio
              </span>
            </div>

            {/* Voice Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {GEMINI_PREBUILT_VOICES.map((v) => {
                const isSelected = settings.geminiVoice === v.id
                const isThisTesting = isTestingVoice && testingVoiceId === v.id

                return (
                  <div
                    key={v.id}
                    onClick={() => onUpdateSettings({ geminiVoice: v.id })}
                    className={cn(
                      "p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 text-left relative group",
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500 shadow-sm shadow-emerald-500/10"
                        : "bg-background/80 border-border hover:border-border/80 hover:bg-accent/20"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0",
                            isSelected
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-muted-foreground/40 group-hover:border-muted-foreground"
                          )}
                        >
                          {isSelected && <Check size={10} className="stroke-3" />}
                        </div>
                        <span className="text-xs font-black text-foreground">
                          {v.name}
                        </span>
                        <span className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.2 rounded-md shrink-0",
                          v.gender === "Nữ"
                            ? "bg-pink-500/10 text-pink-500 border border-pink-500/20"
                            : "bg-sky-500/10 text-sky-500 border border-sky-500/20"
                        )}>
                          {v.gender}
                        </span>
                      </div>

                      {v.recommended && (
                        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider shrink-0">
                          Hay nhất
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {v.tone}
                    </p>

                    <div className="pt-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTestGeminiVoice(v.id)
                        }}
                        className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer",
                          isThisTesting
                            ? "bg-emerald-500 text-white animate-pulse"
                            : "bg-accent/30 hover:bg-accent/60 text-foreground hover:text-emerald-500"
                        )}
                      >
                        {isThisTesting ? (
                          <>
                            <Loader2 size={10} className="animate-spin" />
                            <span>Đang phát...</span>
                          </>
                        ) : (
                          <>
                            <Play size={10} className="fill-current" />
                            <span>Nghe thử</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Custom Gemini API Key configuration */}
            <div className="p-3 rounded-xl bg-accent/15 border border-border/60 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <Key size={13} className="text-emerald-500" />
                  <span>Tùy chỉnh Gemini API Key (Tùy chọn)</span>
                </label>
                {settings.customApiKey && (
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ customApiKey: "" })}
                    className="text-[10px] text-rose-500 hover:underline cursor-pointer font-medium"
                  >
                    Khôi phục key mặc định
                  </button>
                )}
              </div>

              <div className="relative flex items-center">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={settings.customApiKey || ""}
                  onChange={(e) => onUpdateSettings({ customApiKey: e.target.value.trim() })}
                  placeholder="Dùng API key mặc định của hệ thống"
                  className="w-full text-xs font-mono pl-3 pr-16 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
                  title={showApiKey ? "Ẩn key" : "Xem key"}
                >
                  {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Để trống để dùng key mặc định. Bạn có thể dán API key riêng từ Google Cloud / AI Studio có liên kết Billing để tận hưởng hạn mức cao không giới hạn RPM.
              </p>
            </div>
          </div>
        ) : (
          /* Web Speech Voices Selection */
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                Chọn giọng đọc trình duyệt
              </label>
              <button
                type="button"
                onClick={handleTestWebSpeechVoice}
                className={cn(
                  "px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                  isTestingVoice && testingVoiceId === "webspeech"
                    ? "bg-emerald-500 text-white border-emerald-500 animate-pulse"
                    : "bg-accent/20 hover:bg-accent/40 text-emerald-500 border-emerald-500/30"
                )}
              >
                <Play size={12} className={isTestingVoice && testingVoiceId === "webspeech" ? "fill-white" : "fill-emerald-500"} />
                <span>{isTestingVoice && testingVoiceId === "webspeech" ? "Đang phát..." : "Nghe thử"}</span>
              </button>
            </div>

            {/* Vietnamese Status Banner */}
            {hasVietnameseVoice ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <Check size={14} className="shrink-0" />
                <span>Đã tìm thấy {vietnameseVoices.length} giọng đọc Tiếng Việt có sẵn trên thiết bị.</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-400 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <Info size={14} className="shrink-0" />
                  <span>Chưa phát hiện gói giọng Tiếng Việt máy</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                Để nghe phát âm Tiếng Việt chuẩn: Vào <strong>Windows Settings &gt; Time &amp; Language &gt; Speech &gt; Add voices &gt; Chọn &quot;Vietnamese&quot;</strong>, hoặc dùng trình duyệt <strong>Google Chrome / Edge</strong> có sẵn giọng &quot;Google Tiếng Việt&quot; hoặc &quot;Microsoft HoaiMy&quot;. Nếu không thể add voice Tiếng Việt hãy đảm bảo đã cài đặt gói ngôn ngữ Tiếng Việt cho Windows ở <strong>Settings &gt; Time & Language &gt; Language & region &gt; Add a language &gt; Vietnamese</strong>.
                </p>
              </div>
            )}

            {/* Custom Styled Web Speech Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground hover:border-emerald-500/60 focus:outline-hidden transition-all flex items-center justify-between gap-2 shadow-xs cursor-pointer "
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  <span className="text-base shrink-0 leading-none">
                    {isCurrentVietnamese ? "🇻🇳" : <Languages size={12} />}
                  </span>
                  <span className="truncate">
                    {currentWebVoice ? currentWebVoice.name : "Chọn giọng đọc..."}
                  </span>
                  {currentWebVoice && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-accent/40 text-muted-foreground border border-border/40 shrink-0">
                      {currentWebVoice.lang}
                    </span>
                  )}
                </div>

                <ChevronDown
                  size={16}
                  className={cn(
                    "text-muted-foreground transition-transform duration-200 shrink-0",
                    isVoiceDropdownOpen && "rotate-180 text-emerald-500"
                  )}
                />
              </button>

              {/* Custom Dropdown Popover */}
              {isVoiceDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-popover border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-1.5 flex flex-col gap-1 no-scrollbar scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <div className="relative p-1">
                    <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={voiceSearch}
                      onChange={(e) => setVoiceSearch(e.target.value)}
                      placeholder="Tìm theo tên hoặc mã ngôn ngữ..."
                      className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-emerald-500"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-56 overflow-y-auto no-scrollbar scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-2 pr-1 pt-1">
                    {filteredVietnamese.length > 0 && (
                      <div className="space-y-0.5">
                        <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                          <span>🇻🇳 Giọng Tiếng Việt (Khuyên dùng)</span>
                        </div>
                        {filteredVietnamese.map((voice) => {
                          const isSelected = voice.voiceURI === settings.voiceURI
                          return (
                            <button
                              key={voice.voiceURI}
                              type="button"
                              onClick={() => {
                                onUpdateSettings({ voiceURI: voice.voiceURI })
                                setIsVoiceDropdownOpen(false)
                              }}
                              className={cn(
                                "w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer",
                                isSelected
                                  ? "bg-emerald-600/15 text-emerald-500 font-bold border border-emerald-500/30"
                                  : "text-foreground hover:bg-accent/40"
                              )}
                            >
                              <div className="flex items-center gap-2 truncate min-w-0">
                                <span className="text-sm shrink-0">🇻🇳</span>
                                <span className="truncate">{voice.name}</span>
                                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-accent/40 text-muted-foreground shrink-0">
                                  {voice.lang}
                                </span>
                              </div>
                              {isSelected && <Check size={14} className="text-emerald-500 shrink-0" />}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {filteredOthers.length > 0 && (
                      <div className="space-y-0.5">
                        <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-t border-border/30 pt-1.5">
                          <span className="flex gap-2">
                            <Languages size={12} />
                            Tất cả giọng đọc hệ thống
                          </span>
                        </div>
                        {filteredOthers.map((voice) => {
                          const isSelected = voice.voiceURI === settings.voiceURI
                          return (
                            <button
                              key={voice.voiceURI}
                              type="button"
                              onClick={() => {
                                onUpdateSettings({ voiceURI: voice.voiceURI })
                                setIsVoiceDropdownOpen(false)
                              }}
                              className={cn(
                                "w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer",
                                isSelected
                                  ? "bg-emerald-600/15 text-emerald-500 font-bold border border-emerald-500/30"
                                  : "text-foreground hover:bg-accent/40"
                              )}
                            >
                              <div className="flex items-center gap-2 truncate min-w-0">
                                <span className="text-sm shrink-0">
                                  <Languages size={12} />
                                </span>
                                <span className="truncate">{voice.name}</span>
                                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-accent/40 text-muted-foreground shrink-0">
                                  {voice.lang}
                                </span>
                              </div>
                              {isSelected && <Check size={14} className="text-emerald-500 shrink-0" />}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {filteredVietnamese.length === 0 && filteredOthers.length === 0 && (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        Không tìm thấy giọng đọc phù hợp.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Speech Rate (Speed) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-foreground uppercase tracking-wider">
            <span>Tốc độ đọc</span>
            <span className="font-mono text-emerald-500">{settings.rate.toFixed(2)}x</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.05}
              value={settings.rate}
              onChange={(e) => onUpdateSettings({ rate: parseFloat(e.target.value) })}
              className="flex-1 accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 pt-1">
            {speedPresets.map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => onUpdateSettings({ rate: speed })}
                className={cn(
                  "flex-1 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer text-center",
                  settings.rate === speed
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-accent/20 hover:bg-accent/40 text-muted-foreground hover:text-foreground"
                )}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Pitch & Volume */}
        <div className="grid grid-cols-2 gap-4">
          {/* Pitch */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-foreground uppercase tracking-wider">
              <span>Cao độ</span>
              <span className="font-mono text-emerald-500">{settings.pitch.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.1}
              value={settings.pitch}
              disabled={settings.engine === "gemini"}
              onChange={(e) => onUpdateSettings({ pitch: parseFloat(e.target.value) })}
              className={cn(
                "w-full accent-emerald-500 cursor-pointer",
                settings.engine === "gemini" && "opacity-40 cursor-not-allowed"
              )}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{settings.engine === "gemini" ? "AI tự nhiên" : "Trầm"}</span>
              <span>{settings.engine === "gemini" ? "" : "Bổng"}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-foreground uppercase tracking-wider">
              <span>Âm lượng</span>
              <span className="font-mono text-emerald-500">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.volume}
              onChange={(e) => onUpdateSettings({ volume: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Nhỏ</span>
              <span>Lớn</span>
            </div>
          </div>
        </div>

        {/* Auto-Scroll */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-foreground block">
              Tự động cuộn trang
            </label>
            <p className="text-[11px] text-muted-foreground">
              Tự động cuộn màn hình theo đoạn văn bản đang đọc
            </p>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings({ autoScroll: !settings.autoScroll })}
            className={cn(
              "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
              settings.autoScroll ? "bg-emerald-600" : "bg-accent/40 border border-border"
            )}
          >
            <span
              className={cn(
                "block w-4 h-4 rounded-full bg-white transition-transform transform shadow-xs absolute top-1",
                settings.autoScroll ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {/* 6. Modal Footer Action Buttons */}
        <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-border/80 hover:bg-accent/30 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <div className="flex items-center gap-2">
            {(isPlaying || isPaused) && (
              <button
                type="button"
                onClick={() => {
                  onStopReading?.()
                  onClose()
                }}
                className="h-10 px-3.5 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 text-rose-500 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-500/20"
              >
                <Square size={12} className="fill-rose-500" />
                <span>Dừng đọc</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onStartReading?.()
                onClose()
              }}
              disabled={isLoadingAudio}
              className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
            >
              {isLoadingAudio ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Đang tải audio AI...</span>
                </>
              ) : isPlaying ? (
                <>
                  <Pause size={14} className="fill-white" />
                  <span>Tạm dừng</span>
                </>
              ) : isPaused ? (
                <>
                  <Play size={14} className="fill-white" />
                  <span>Tiếp tục đọc</span>
                </>
              ) : (
                <>
                  <Play size={14} className="fill-white" />
                  <span>Bắt đầu đọc</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
