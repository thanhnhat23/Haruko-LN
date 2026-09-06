"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function VerticalCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2 select-none", className)}>
      {/* 3:4 Cover Skeleton with Rating Badge Overlay */}
      <div className="relative w-full aspect-3/4 rounded-lg border border-border/80 bg-accent/15 overflow-hidden shadow-xs">
        <Skeleton className="w-full h-full rounded-none" />
        
        {/* Top-left Rating Badge placeholder */}
        <div className="absolute top-2 left-2 h-4 w-10 rounded-sm bg-black/60 border border-zinc-800/80 flex items-center gap-1 px-1">
          <Skeleton className="size-2.5 rounded-full bg-yellow-500/40" />
          <Skeleton className="h-2 w-4 rounded-xs bg-zinc-600" />
        </div>
      </div>

      {/* Text Details */}
      <div className="space-y-1.5 px-0.5 pt-0.5">
        {/* 2-line Title */}
        <Skeleton className="h-3.5 w-full rounded-xs" />
        <Skeleton className="h-3.5 w-3/4 rounded-xs" />

        {/* Author & Views */}
        <div className="space-y-1 pt-0.5">
          <Skeleton className="h-2.5 w-1/2 rounded-xs" />
          <Skeleton className="h-2 w-1/3 rounded-xs" />
        </div>
      </div>
    </div>
  )
}

export function HorizontalCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs p-3 gap-4 select-none",
        className
      )}
    >
      {/* Thumbnail Cover 3:4 */}
      <div className="relative w-20 sm:w-24 aspect-3/4 rounded-lg overflow-hidden border border-border/60 shrink-0 bg-accent/20">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* Content Side */}
      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
        <div className="space-y-1.5">
          {/* Title & Update Timestamp */}
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-4 w-3/5 rounded-xs" />
            <Skeleton className="h-2.5 w-14 rounded-xs shrink-0" />
          </div>

          {/* Author */}
          <Skeleton className="h-2.5 w-1/3 rounded-xs" />

          {/* 2-line Description */}
          <div className="space-y-1 pt-1">
            <Skeleton className="h-2.5 w-full rounded-xs" />
            <Skeleton className="h-2.5 w-4/5 rounded-xs" />
          </div>
        </div>

        {/* Meta Stats Bottom Bar */}
        <div className="flex items-center gap-4 pt-2 border-t border-border/30">
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-2.5 w-8 rounded-xs" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-2.5 w-6 rounded-xs" />
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-2.5 w-12 rounded-xs" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function RankRowSkeleton({
  rank,
  className,
}: {
  rank?: number
  className?: string
}) {
  const isTop1 = rank === 1
  const isTop2 = rank === 2
  const isTop3 = rank === 3

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-2 border-b border-border/40 last:border-b-0 select-none",
        isTop1 && "bg-yellow-500/5 px-2 -mx-2 rounded-lg py-2.5 my-1 border-b-0",
        isTop2 && "bg-zinc-500/5 px-2 -mx-2 rounded-lg py-2 my-0.5 border-b-0",
        isTop3 && "bg-amber-600/5 px-2 -mx-2 rounded-lg py-2 my-0.5 border-b-0",
        className
      )}
    >
      {/* Rank Indicator */}
      <div className="w-5 flex justify-center shrink-0">
        <Skeleton
          className={cn(
            "h-4 w-4 rounded-xs",
            isTop1 && "bg-yellow-500/40",
            isTop2 && "bg-zinc-400/40",
            isTop3 && "bg-amber-600/40"
          )}
        />
      </div>

      {/* Mini Thumbnail (3:4) */}
      <div className="relative w-8 h-10 rounded-sm overflow-hidden border border-border/60 bg-accent/20 shrink-0">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* Title & Details */}
      <div className="flex-1 min-w-0 space-y-1">
        <Skeleton className="h-3.5 w-4/5 rounded-xs" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-2 w-16 rounded-xs" />
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-8 rounded-xs" />
        </div>
      </div>
    </div>
  )
}

export function VerticalCardGridSkeleton({
  count = 5,
  columns = 5,
  className,
}: {
  count?: number
  columns?: 5 | 6
  className?: string
}) {
  const colClass = columns === 6 ? "lg:grid-cols-6" : "lg:grid-cols-5"

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-4", colClass, className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={index >= 4 ? "hidden sm:block" : ""}>
          <VerticalCardSkeleton />
        </div>
      ))}
    </div>
  )
}

export function HorizontalCardGridSkeleton({
  count = 6,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={index >= 4 ? "hidden sm:block" : ""}>
          <HorizontalCardSkeleton />
        </div>
      ))}
    </div>
  )
}

export function RankRowListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, index) => (
        <RankRowSkeleton key={index} rank={index + 1} />
      ))}
    </div>
  )
}
