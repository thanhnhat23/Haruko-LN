"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, Star, Clock } from "lucide-react"

interface NovelData {
  id: number
  title: string
  description?: string
  author: string
  image: string
  views: string
  rating: string
  chapters: string
  lastUpdate?: string
}

interface NovelCardProps {
  novel: NovelData
}

// Vertical Card: Borderless premium poster style to prevent squashing in narrow grids
export function VerticalCard({ novel }: NovelCardProps) {
  return (
    <Link href="#" className="group flex flex-col gap-2 hover:-translate-y-1 transition-all duration-300">
      {/* Aspect Ratio 3:4 for vertical covers */}
      <div className="relative w-full aspect-3/4 overflow-hidden rounded-lg border border-border/80 bg-accent/20 shadow-xs group-hover:shadow-md transition-all duration-300">
        <Image
          src={novel.image}
          alt={novel.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, 250px"
        />
        {/* Quality Rating Badge overlayed on the cover */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-sm bg-black/60 text-[9px] text-yellow-400 font-bold backdrop-blur-xs border border-zinc-800 flex items-center gap-1">
          <Star className="size-2.5 fill-yellow-400 stroke-yellow-400" />
          <span>{novel.rating}</span>
        </div>
      </div>
      
      {/* Text Details - line-clamp-2 allows smooth wrapping in narrow columns */}
      <div className="space-y-1 px-0.5">
        <h4 className="text-xs font-bold text-foreground line-clamp-2 group-hover:text-muted-foreground transition-colors uppercase tracking-wide leading-tight">
          {novel.title}
        </h4>
        <div className="space-y-0.5">
          <span className="text-[10px] text-muted-foreground block font-medium truncate">Tác giả: {novel.author}</span>
          <span className="text-[9px] text-muted-foreground font-semibold block">{novel.views} lượt đọc</span>
        </div>
      </div>
    </Link>
  )
}

export function HorizontalCard({ novel }: NovelCardProps) {
  return (
    <Link href="#" className="group flex bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs hover:shadow-md p-3 gap-4 hover:-translate-y-0.5 hover:border-border/10 transition-all duration-300">
      <div className="relative w-20 sm:w-24 aspect-3/4 rounded-lg overflow-hidden bg-accent/30 border border-border/60 shrink-0">
        <Image
          src={novel.image}
          alt={novel.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="100px"
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 group-hover:text-muted-foreground transition-colors uppercase tracking-wide">
              {novel.title}
            </h4>
            {novel.lastUpdate && (
              <span className="text-[9px] text-muted-foreground whitespace-nowrap shrink-0">{novel.lastUpdate}</span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground block font-medium">Tác giả: {novel.author}</span>
          {novel.description && (
            <p className="text-muted-foreground text-[11px] leading-relaxed line-clamp-2 pt-1 block">
              {novel.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 text-[9px] text-muted-foreground font-semibold pt-2 border-t border-border/30">
          <div className="flex items-center gap-1">
            <Eye className="size-3 text-foreground/75" />
            <span>{novel.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="size-3 text-foreground/75 fill-foreground/20" />
            <span>{novel.rating}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Clock className="size-3 text-foreground/75" />
            <span>{novel.chapters}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

interface RankRowProps {
  novel: NovelData
  rank: number
}

export function RankRow({ novel, rank }: RankRowProps) {
  // Visual cues based on ranking position
  let rankStyle = "text-muted-foreground/60 text-xs"
  let borderStyle = "border-border/60"
  let rowStyle = "py-2 border-b border-border/40 last:border-b-0"

  if (rank === 1) {
    rankStyle = "text-yellow-500 dark:text-yellow-400 font-black text-sm drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]"
    borderStyle = "border-yellow-500/60 scale-105 shadow-sm shadow-yellow-500/10"
    rowStyle = "bg-yellow-500/5 px-2 -mx-2 rounded-lg py-2.5 my-1 border-b-0 hover:bg-yellow-500/10 transition-colors"
  } else if (rank === 2) {
    rankStyle = "text-zinc-400 dark:text-zinc-300 font-black text-sm drop-shadow-[0_0_6px_rgba(200,200,200,0.3)]"
    borderStyle = "border-zinc-400/50 scale-102 shadow-sm"
    rowStyle = "bg-zinc-500/5 px-2 -mx-2 rounded-lg py-2 my-0.5 border-b-0 hover:bg-zinc-500/10 transition-colors"
  } else if (rank === 3) {
    rankStyle = "text-amber-600 dark:text-amber-500 font-bold text-sm"
    borderStyle = "border-amber-600/40"
    rowStyle = "bg-amber-600/5 px-2 -mx-2 rounded-lg py-2 my-0.5 border-b-0 hover:bg-amber-600/10 transition-colors"
  } else if (rank === 4) {
    rankStyle = "text-zinc-500 dark:text-zinc-400 font-bold text-xs"
    borderStyle = "border-border"
    rowStyle = "px-2 -mx-2 rounded-lg py-2 border-b-0 hover:bg-accent/15 transition-colors"
  } else {
    rowStyle = "py-2 border-b border-border/40 last:border-b-0 hover:opacity-85 transition-opacity"
  }

  return (
    <Link href="#" className={`flex items-center gap-3 group ${rowStyle}`}>
      {/* Rank Indicator */}
      <span className={`w-5 text-center shrink-0 font-extrabold ${rankStyle}`}>
        {String(rank).padStart(2, '0')}
      </span>

      {/* Mini Thumbnail */}
      <div className={`relative w-8 h-10 rounded-sm overflow-hidden border bg-accent/20 shrink-0 transition-transform ${borderStyle}`}>
        <Image
          src={novel.image}
          alt={novel.title}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h5 className="text-xs font-bold text-foreground truncate group-hover:text-muted-foreground transition-colors uppercase tracking-wide">
          {novel.title}
        </h5>
        <div className="flex items-center gap-2 text-[9px] text-muted-foreground mt-0.5 font-medium">
          <span>{novel.chapters}</span>
          <span>•</span>
          <span className="flex items-center gap-0.5">
            <Star className="size-2.5 fill-foreground/10" />
            {novel.rating}
          </span>
        </div>
      </div>
    </Link>
  )
}
