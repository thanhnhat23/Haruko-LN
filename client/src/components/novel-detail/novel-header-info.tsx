"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Home,
  ChevronRight,
  Heart,
  Star,
  List,
  MessageSquare,
  Share2,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { NovelDetailData } from "@/data/mock-novel-data"
import { cn } from "@/lib/utils"

interface NovelHeaderInfoProps {
  novel: NovelDetailData
  onScrollToSection?: (sectionId: string) => void
}

export function NovelHeaderInfo({
  novel,
  onScrollToSection,
}: NovelHeaderInfoProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(novel.bookmarkCount)
  const [isCopied, setIsCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleBookmark = () => {
    if (isBookmarked) {
      setIsBookmarked(false)
      setBookmarkCount((prev) => prev - 1)
    } else {
      setIsBookmarked(true)
      setBookmarkCount((prev) => prev + 1)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="w-full space-y-6 select-none">
      {/* Breadcrumbs */}
      <nav className="hidden md:flex items-center gap-2 text-xs md:text-sm font-semibold text-muted-foreground">
        <Link
          href="/"
          className="hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <Home size={13} />
          Trang chủ
        </Link>
        <ChevronRight size={12} className="opacity-50" />
        <Link href="#" className="hover:text-foreground transition-colors">
          {novel.type}
        </Link>
        <ChevronRight size={12} className="opacity-50" />
        <span className="text-foreground truncate max-w-xs sm:max-w-md font-bold">
          {novel.title}
        </span>
      </nav>

      {/* Main Novel Overview Card */}
      <div className="relative border border-border/80 bg-card/60 backdrop-blur-md rounded-2xl p-5 sm:p-7 md:p-8 shadow-xl space-y-6">
        
        {/* Top Info Layout*/}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* Left Column*/}
          <div className="md:col-span-4 lg:col-span-3.5 flex flex-col items-center">
            {/* Category Tag Header on top of cover */}
            <div className="w-full mb-2 flex justify-center">
              <span className="w-full max-w-65 text-center py-1 rounded-md bg-emerald-600/90 text-white font-extrabold text-xs tracking-wider uppercase shadow-xs">
                {novel.type}
              </span>
            </div>

            <div className="relative w-full aspect-3/4 max-w-65 rounded-xl overflow-hidden border border-border/80 bg-accent/20 shadow-2xl group">
              <Image
                src={novel.thumbnail}
                alt={novel.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 260px, 320px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-40 pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Title, Tags, Author, Action Buttons & Toolbar */}
          <div className="md:col-span-8 lg:col-span-8.5 space-y-4">
            
            {/* Main Title */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-foreground uppercase tracking-tight leading-snug drop-shadow-xs">
              {novel.title}
            </h1>

            {/* Author & Artist */}
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-semibold">
                <span>
                  Tác giả:{" "}
                  <strong className="text-foreground font-bold">{novel.author}</strong>
                </span>
              </div>
            </div>

            {/* Tags Cloud */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {novel.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href="#"
                  className="px-2.5 py-0.5 rounded-md bg-accent/25 hover:bg-foreground hover:text-background border border-border/60 text-[11px] font-bold tracking-wide transition-all"
                >
                  {tag.name}
                </Link>
              ))}
            </div>

            {/* Status & Translator Info */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Tình trạng:</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase",
                    novel.status === "Đã hoàn thành"
                      ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                      : "bg-yellow-500/15 text-yellow-500 border border-yellow-500/30"
                  )}
                >
                  {novel.status}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-muted-foreground">
                <UserCheck size={13} className="text-foreground" />
                <span>
                  Nhóm dịch:{" "}
                  <span className="text-foreground font-bold">
                    {novel.translator.name}
                  </span>
                </span>
              </div>
            </div>

            {/* Primary Action Button (Continue Reading) */}
            <div className="pt-2">
              <Link href={`#volume-101`} className="inline-block">
                <Button
                  size="lg"
                  className="h-11 px-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest active:scale-95 transition-all duration-300 shadow-lg shadow-green-600/20 cursor-pointer flex items-center gap-2"
                >
                  <BookOpen size={16} />
                  Đọc tiếp
                </Button>
              </Link>
            </div>

            {/* Interactive Action Toolbar */}
            <div className="pt-4 border-t border-border/40 grid grid-cols-5 gap-2 text-center select-none">
              
              {/* Bookmark */}
              <button
                type="button"
                onClick={handleBookmark}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer hover:bg-accent/20",
                  isBookmarked
                    ? "text-rose-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Heart
                  size={20}
                  className={cn(
                    "transition-transform active:scale-125 mb-1",
                    isBookmarked && "fill-rose-500"
                  )}
                />
                <span className="text-xs font-black">{bookmarkCount.toLocaleString("vi-VN")}</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider opacity-70">
                  {isBookmarked ? "Đã thích" : "Yêu thích"}
                </span>
              </button>

              {/* Rating */}
              <button
                type="button"
                onClick={() => onScrollToSection?.("reviews-section")}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all cursor-pointer"
              >
                <Star size={20} className="text-yellow-400 fill-yellow-400/20 mb-1" />
                <span className="text-xs font-black">{novel.ratingScore}</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider opacity-70">
                  Đánh giá
                </span>
              </button>

              {/* TOC*/}
              <button
                type="button"
                onClick={() => onScrollToSection?.("volumes-section")}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all cursor-pointer"
              >
                <List size={20} className="mb-1" />
                <span className="text-xs font-black">{novel.volumes.length} Vol</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider opacity-70">
                  Mục lục
                </span>
              </button>

              {/* Discussion*/}
              <button
                type="button"
                onClick={() => onScrollToSection?.("comments-section")}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all cursor-pointer"
              >
                <MessageSquare size={20} className="mb-1" />
                <span className="text-xs font-black">{novel.discussionCount}</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider opacity-70">
                  Bàn luận
                </span>
              </button>

              {/* Share*/}
              <button
                type="button"
                onClick={handleShare}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all cursor-pointer relative"
              >
                {isCopied ? (
                  <Check size={20} className="text-emerald-500 mb-1" />
                ) : (
                  <Share2 size={20} className="mb-1" />
                )}
                <span className="text-xs font-black">
                  {isCopied ? "Đã chép" : "Chia sẻ"}
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-wider opacity-70">
                  Liên kết
                </span>
              </button>

            </div>

          </div>
        </div>

        {/* Bottom 4-Column Metrics Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 rounded-xl bg-accent/15 border border-border/40 text-center select-none">
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
              Lần cuối
            </span>
            <p className="text-xs sm:text-sm font-black text-foreground">
              {novel.lastUpdate}
            </p>
          </div>

          <div className="space-y-0.5 border-l-2 border-border/30">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
              Số từ
            </span>
            <p className="text-xs sm:text-sm font-black text-foreground">
              {novel.wordCount.toLocaleString("vi-VN")}
            </p>
          </div>

          <div className="space-y-0.5 md:border-l-2 border-border/30">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
              Đánh giá
            </span>
            <p className="text-xs sm:text-sm font-black text-foreground flex items-center justify-center gap-1">
              <Star size={13} className="text-yellow-400 fill-yellow-400" />
              <span>
                {novel.ratingScore} <span className="text-xs text-muted-foreground font-normal">/ {novel.ratingCount}</span>
              </span>
            </p>
          </div>

          <div className="space-y-0.5 border-l-2 border-border/30">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
              Lượt xem
            </span>
            <p className="text-xs sm:text-sm font-black text-foreground">
              {novel.views.toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Synopsis Box */}
        <div className="space-y-2 pt-1 border-t border-border/40">
          <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5 pt-4">
            Tóm tắt nội dung
          </h3>

          <div className="relative">
            <div
              className={cn(
                "text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line font-medium transition-all duration-300",
                !isExpanded && "line-clamp-4"
              )}
            >
              {novel.description}
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-bold text-foreground hover:underline pt-2 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {isExpanded ? (
                <>
                  Thu gọn <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Xem thêm <ChevronDown size={14} />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
