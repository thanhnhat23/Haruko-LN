"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  FileText,
  Clock,
  ImageIcon,
  ZoomIn,
  AlertCircle,
  AlertTriangle,
  Sliders,
  Home,
  BookOpen,
  Globe,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getChapterDetail } from "@/data/mock-novel-data"
import {
  ReaderHeader,
  ReaderSettingsModal,
  ChapterQuickJumpModal,
  ReaderNavigationFooter,
  ChapterMarkdownReader,
  ReaderFloatingToolbar,
  TtsSettingsModal,
  TtsPlayerBar,
  DEFAULT_READER_SETTINGS,
  THEME_CONFIGS,
} from "@/components/novel-reader"
import type { ReaderSettings } from "@/components/novel-reader"
import { useChapterTts } from "@/hooks/use-chapter-tts"
import { CommentImageModal } from "@/components/novel-detail/comments/comment-image-modal"
import { cn } from "@/lib/utils"

export default function ChapterReaderPage({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>
}) {
  const router = useRouter()
  const { id, chapterId } = React.use(params)

  // Fetch chapter and navigation data dynamically
  const chapterData = getChapterDetail(id, chapterId)

  // Reader Settings State with LocalStorage Persistence
  const [settings, setSettings] = React.useState<ReaderSettings>(DEFAULT_READER_SETTINGS)

  // Load saved settings from localStorage after mount to prevent hydration mismatch
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("haruko_reader_settings")
      if (saved) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }))
      }
    } catch (e) {
      // Fallback to default
    }
  }, [])

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [isQuickJumpOpen, setIsQuickJumpOpen] = React.useState(false)
  const [previewImage, setPreviewImage] = React.useState<string | null>(null)

  // Text-To-Speech hook with Vietnamese detection, chunking and persistent settings
  const tts = useChapterTts(
    chapterData?.chapter?.content || "",
    chapterData?.chapter?.title || ""
  )

  // Save settings changes to localStorage
  const handleUpdateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("haruko_reader_settings", JSON.stringify(updated))
        } catch (e) {
          // Ignore write error
        }
      }
      return updated
    })
  }

  const handleResetSettings = () => {
    setSettings(DEFAULT_READER_SETTINGS)
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("haruko_reader_settings")
      } catch (e) {
        // Ignore write error
      }
    }
  }

  // Keyboard navigation shortcuts (ArrowLeft: Prev, ArrowRight: Next)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.key === "ArrowLeft" && chapterData?.prevChapter) {
        e.preventDefault()
        router.push(`/novel/${id}/chapter/${chapterData.prevChapter.id}`)
      } else if (e.key === "ArrowRight" && chapterData?.nextChapter) {
        e.preventDefault()
        router.push(`/novel/${id}/chapter/${chapterData.nextChapter.id}`)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [chapterData, id, router])

  // If chapter or novel not found
  if (!chapterData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground text-center space-y-4">
        <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-wide">
          Không tìm thấy chương truyện
        </h1>
        <p className="text-xs text-muted-foreground max-w-sm">
          Chương bạn đang tìm kiếm có thể đã bị xóa hoặc đường dẫn không chính xác.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Link href={`/novel/${id}`}>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
            >
              <BookOpen size={14} className="mr-1.5" />
              Về trang truyện
            </Button>
          </Link>
          <Link href="/">
            <Button size="sm" variant="outline" className="text-xs font-bold">
              <Home size={14} className="mr-1.5" />
              Trang chủ
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const { novel, volume, chapter, prevChapter, nextChapter } = chapterData

  // Estimated reading time (~250 words per minute)
  const readingTimeMinutes = Math.max(
    1,
    Math.ceil((chapter.wordCount || 500) / 250)
  )

  // Theme configuration for consistent contrast across all elements
  const currentTheme = THEME_CONFIGS[settings.theme] || THEME_CONFIGS.dark

  const maxWidthClasses = {
    narrow: "max-w-3xl",
    normal: "max-w-5xl",
    wide: "max-w-7xl",
  }[settings.maxWidth]

  const lineHeightClasses = {
    normal: "leading-normal",
    relaxed: "leading-relaxed",
    loose: "leading-loose",
  }[settings.lineHeight]

  const fontFamilyClasses =
    {
      sans: "font-sans",
      serif: "font-serif",
      "be-vietnam-pro": "font-be-vietnam-pro",
      literata: "font-literata",
      lora: "font-lora",
      merriweather: "font-merriweather",
      roboto: "font-roboto",
      playfair: "font-playfair",
    }[settings.fontFamily] || "font-sans"

  const textAlignClasses =
    settings.textAlign === "justify" ? "text-justify" : "text-left"

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "min-h-screen flex flex-col transition-colors duration-200",
        fontFamilyClasses
      )}
      style={
        {
          backgroundColor: currentTheme.bg,
          color: currentTheme.text,
          "--reader-bg": currentTheme.bg,
          "--reader-text": currentTheme.text,
          "--reader-muted": currentTheme.muted,
          "--reader-border": currentTheme.border,
          "--reader-card": currentTheme.cardBg,
          "--reader-header": currentTheme.headerBg,
          "--reader-spoiler": currentTheme.spoilerBg,
          "--reader-btn-hover": currentTheme.btnHover,
        } as React.CSSProperties
      }
    >
      {/* Ensure global navbar is never visible in reader mode */}
      <style>{`.haruko-global-navbar { display: none !important; }`}</style>

      {/* Sticky Reader Header */}
      <ReaderHeader
        novelId={novel.id}
        novelTitle={novel.title}
        chapterTitle={chapter.title}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        onOpenQuickJump={() => setIsQuickJumpOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Reading Container */}
      <main className="flex-1 w-full flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
        <article
          className={cn(
            "w-full space-y-8",
            maxWidthClasses
          )}
        >
          {/* Chapter Metadata & Header */}
          <header
            className="space-y-4 pb-6 border-b select-none"
            style={{ borderColor: "var(--reader-border)" }}
          >
            {/* Breadcrumb Navigation */}
            <div
              className="flex flex-wrap items-center gap-2 text-xs font-semibold"
              style={{ color: "var(--reader-muted)" }}
            >
              <Link
                href={`/novel/${novel.id}`}
                className="hover:text-emerald-500 transition-colors truncate max-w-50"
              >
                {novel.title}
              </Link>
              <span>/</span>
              <span>
                Vol {volume.number}: {volume.title}
              </span>
            </div>

            {/* Chapter Title */}
            <h1
              className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight"
              style={{ color: "var(--reader-text)" }}
            >
              {chapter.title}
            </h1>

            {/* Meta badges info */}
            <div
              className="flex flex-wrap items-center gap-4 text-xs pt-1"
              style={{ color: "var(--reader-muted)" }}
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar size={13} className="opacity-70" />
                {chapter.createdAt}
              </span>

              {chapter.wordCount > 0 && (
                <span className="flex items-center gap-1.5 font-mono font-medium">
                  <FileText size={13} className="opacity-70" />
                  {chapter.wordCount.toLocaleString()} từ
                </span>
              )}

              <span className="flex items-center gap-1.5 font-medium">
                <Clock size={13} className="opacity-70" />
                Khoảng {readingTimeMinutes} phút đọc
              </span>

              {chapter.hasIllustration && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full">
                  <ImageIcon size={12} />
                  Có tranh minh họa
                </span>
              )}
            </div>
          </header>

          {/* Chapter Illustrations Gallery (Header only) */}
          {chapter.images &&
            chapter.images.filter((img) => img.type !== "inline").length > 0 && (
            <section className="space-y-3 p-4 select-none">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {chapter.images
                  .filter((img) => img.type !== "inline")
                  .map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setPreviewImage(img.imageUrl)}
                    className="group relative md:h-80 w-auto max-w-full overflow-hidden border cursor-zoom-in transition-all shadow-xs rounded-xs shrink-0 flex items-center justify-center bg-black/20 hover:border-emerald-500/60"
                    style={{ borderColor: "var(--reader-border)" }}
                    title="Nhấn để xem ảnh kích thước lớn"
                  >
                    <Image
                      src={img.imageUrl}
                      alt={`Minh họa #${img.orderIndex}`}
                      width={1200}
                      height={800}
                      unoptimized
                      className="h-full w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded-xs bg-black/75 text-[9px] font-mono font-black text-yellow-400 border border-zinc-800">
                      #{img.orderIndex}
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="p-1 rounded-full bg-black/60 text-white backdrop-blur-xs">
                        <ZoomIn size={14} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Chapter Main Body Content with Markdown Rendering */}
          <div
            suppressHydrationWarning
            className={cn(
              "chapter-body font-normal whitespace-pre-wrap selection:bg-emerald-500/30 selection:text-emerald-200",
              lineHeightClasses,
              textAlignClasses
            )}
            style={{
              fontSize: `${settings.fontSize}px`,
              color: "var(--reader-text)",
            }}
          >
            {chapter.content?.trim() ? (
              <ChapterMarkdownReader content={chapter.content} />
            ) : (
              <div
                className="py-16 text-center italic text-sm border-2 border-dashed rounded-2xl p-6"
                style={{
                  borderColor: "var(--reader-border)",
                  color: "var(--reader-muted)",
                }}
              >
                Chương truyện này hiện chưa có nội dung văn bản.
              </div>
            )}
          </div>

          {/* Large Navigation Action Footer */}
          <ReaderNavigationFooter
            novelId={novel.id}
            prevChapter={prevChapter}
            nextChapter={nextChapter}
            onOpenQuickJump={() => setIsQuickJumpOpen(true)}
          />
        </article>
      </main>

      {/* Redesigned Fixed Floating Toolbar */}
      <ReaderFloatingToolbar
        novelId={novel.id}
        novelTitle={novel.title}
        chapterId={chapter.id}
        chapterTitle={chapter.title}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        isTtsPlaying={tts.isPlaying}
        isTtsPaused={tts.isPaused}
        onToggleTTS={tts.togglePlay}
        onOpenTtsSettings={() => tts.setIsSettingsOpen(true)}
        onOpenQuickJump={() => setIsQuickJumpOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Floating Alert Notification when Gemini TTS rate limit / error occurs */}
      {tts.ttsError && (
        <div className="fixed bottom-36 sm:bottom-28 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:w-auto sm:min-w-110 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/40 p-4">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex items-start gap-3 pr-7">
              {/* Status Icon Badge */}
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0 shadow-xs mt-0.5">
                <AlertTriangle size={18} />
              </div>

              {/* Content Body */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-foreground">
                    {tts.ttsError.includes("giới hạn") || tts.ttsError.includes("429")
                      ? "Đã đạt giới hạn yêu cầu Gemini API"
                      : "Thông báo giọng đọc"}
                  </h4>
                  <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {tts.ttsError.includes("giới hạn") || tts.ttsError.includes("429") ? "Hạn ngạch" : "Cảnh báo"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tts.ttsError}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      tts.updateSettings({ engine: "webspeech" })
                      tts.setTtsError(null)
                      tts.togglePlay()
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 inline-flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <Globe size={13} />
                    <span>Đổi sang Trình duyệt &amp; đọc tiếp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      tts.setIsSettingsOpen(true)
                      tts.setTtsError(null)
                    }}
                    className="px-2.5 py-1.5 rounded-xl border border-border/80 bg-accent/30 hover:bg-accent/60 text-foreground font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Sliders size={13} />
                    <span>Cài đặt</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => tts.setTtsError(null)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/40 cursor-pointer transition-colors"
              title="Đóng thông báo"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Floating TTS Audio Player Bar */}
      <TtsPlayerBar
        isPlaying={tts.isPlaying}
        isPaused={tts.isPaused}
        isLoadingAudio={tts.isLoadingAudio}
        engine={tts.settings.engine}
        currentChunkIndex={tts.currentChunkIndex}
        totalChunks={tts.totalChunks}
        currentTextPreview={tts.currentTextPreview}
        currentSpeed={tts.settings.rate}
        onTogglePlay={tts.togglePlay}
        onStop={tts.stopPlaying}
        onPrevChunk={tts.prevChunk}
        onNextChunk={tts.nextChunk}
        onCycleSpeed={tts.cycleSpeed}
        onOpenSettings={() => tts.setIsSettingsOpen(true)}
      />

      {/* TTS Settings Modal */}
      <TtsSettingsModal
        isOpen={tts.isSettingsOpen}
        onClose={() => tts.setIsSettingsOpen(false)}
        settings={tts.settings}
        onUpdateSettings={tts.updateSettings}
        onResetSettings={tts.resetSettings}
        availableVoices={tts.voices}
        onTestVoice={tts.testVoice}
        isTestingVoice={tts.isTestingVoice}
        isPlaying={tts.isPlaying}
        isPaused={tts.isPaused}
        isLoadingAudio={tts.isLoadingAudio}
        ttsError={tts.ttsError}
        onStartReading={tts.togglePlay}
        onStopReading={tts.stopPlaying}
      />

      {/* Reader Settings Modal */}
      <ReaderSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetSettings={handleResetSettings}
      />

      {/* Chapter Quick Jump Modal */}
      <ChapterQuickJumpModal
        isOpen={isQuickJumpOpen}
        onClose={() => setIsQuickJumpOpen(false)}
        novelId={novel.id}
        novelTitle={novel.title}
        volumes={novel.volumes}
        currentChapterId={chapter.id}
      />

      {/* Image Lightbox Modal */}
      <CommentImageModal
        imageSrc={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  )
}
