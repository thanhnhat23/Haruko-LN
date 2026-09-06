"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  VerticalCardGridSkeleton,
  HorizontalCardGridSkeleton,
  RankRowListSkeleton,
} from "./card-skeleton"
import { cn } from "@/lib/utils"

export function NovelCarouselSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full relative overflow-hidden select-none",
        className
      )}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }}
    >
      <div className="w-full flex justify-center px-0 sm:px-4">
        {/* Main active slide placeholder */}
        <div className="w-full sm:w-[75%] md:w-[70%] lg:w-[60%] aspect-16/10 md:aspect-21/9 relative md:rounded-xl overflow-hidden border border-border/80 bg-zinc-950/80 shadow-2xl">
          {/* Main Background Cover Skeleton */}
          <Skeleton className="w-full h-full rounded-none bg-accent/20" />

          {/* Bottom-up Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent pointer-events-none" />

          {/* Text & Meta Badges Overlay at the Bottom */}
          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 z-10 space-y-3 pointer-events-none">
            {/* Meta Stats Badges */}
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-16 rounded-md bg-black/50 border border-zinc-800 flex items-center justify-center px-2">
                <Skeleton className="h-2.5 w-10 bg-zinc-700" />
              </div>
              <div className="h-6 w-14 rounded-md bg-black/50 border border-zinc-800 flex items-center justify-center px-2">
                <Skeleton className="h-2.5 w-8 bg-zinc-700" />
              </div>
              <div className="h-6 w-24 rounded-md bg-black/50 border border-zinc-800 ml-auto flex items-center justify-center px-2">
                <Skeleton className="h-2.5 w-16 bg-zinc-700" />
              </div>
            </div>

            {/* Title & Author */}
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-7 sm:h-9 md:h-10 w-3/4 sm:w-1/2 bg-zinc-800 rounded-sm" />
              <Skeleton className="h-3.5 sm:h-4 w-1/3 bg-zinc-850 rounded-xs" />
            </div>

            {/* 2-line Description */}
            <div className="hidden sm:block space-y-1 pt-1 max-w-xl">
              <Skeleton className="h-3 w-full bg-zinc-850/80 rounded-xs" />
              <Skeleton className="h-3 w-4/5 bg-zinc-850/80 rounded-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CatalogSectionSkeleton({
  type = "vertical",
  count = 5,
  columns = 5,
  className,
}: {
  type?: "vertical" | "horizontal"
  count?: number
  columns?: 5 | 6
  className?: string
}) {
  return (
    <section className={cn("space-y-4 select-none", className)}>
      {/* Section Header */}
      <div className="flex items-center gap-2.5 border-b border-border/40 pb-2">
        {/* Category Pill Badge */}
        <Skeleton className="h-4.5 w-11 rounded-xs bg-zinc-800" />
        
        {/* Title & Icon */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-28 rounded-xs" />
          <Skeleton className="size-4 rounded-full" />
        </div>
      </div>

      {/* Grid Content */}
      {type === "vertical" ? (
        <VerticalCardGridSkeleton count={count} columns={columns} />
      ) : (
        <HorizontalCardGridSkeleton count={count} />
      )}

      {/* Bottom 'View more' Link placeholder */}
      <div className="flex justify-end pt-3">
        <Skeleton className="h-3.5 w-20 rounded-xs" />
      </div>
    </section>
  )
}

export function RecentlyReadWidgetSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 shadow-xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <Skeleton className="size-4 rounded-xs" />
        <Skeleton className="h-3.5 w-28 rounded-xs" />
      </div>

      {/* Item List */}
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* Thumbnail */}
            <div className="relative w-8 h-10 rounded-sm overflow-hidden border border-border/60 bg-accent/25 shrink-0">
              <Skeleton className="w-full h-full rounded-none" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <Skeleton className="h-3.5 w-4/5 rounded-xs" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-2.5 w-20 rounded-xs" />
                <Skeleton className="h-2.5 w-14 rounded-xs" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function RecentCommentsWidgetSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 shadow-xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <Skeleton className="size-4 rounded-xs" />
        <Skeleton className="h-3.5 w-32 rounded-xs" />
      </div>

      {/* Item List */}
      <div className="space-y-3.5">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex gap-3 text-xs">
            {/* User Avatar */}
            <Skeleton className="size-6.5 rounded-full shrink-0 mt-0.5" />

            {/* Bubble details */}
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-3 w-20 rounded-xs" />
                <Skeleton className="h-2.5 w-12 rounded-xs" />
              </div>

              {/* Speech bubble box */}
              <div className="bg-accent/15 p-2 rounded-lg border border-border/20 space-y-1">
                <Skeleton className="h-2.5 w-full rounded-xs" />
                <Skeleton className="h-2.5 w-4/5 rounded-xs" />
              </div>

              {/* Novel reference line */}
              <Skeleton className="h-2 w-32 rounded-xs pt-0.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TabbedTopWidgetSkeleton() {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 shadow-xs space-y-4 select-none">
      {/* Tab Header */}
      <div className="flex border-b border-border/40 pb-1.5 items-center justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-3.5 w-24 rounded-xs" />
          <Skeleton className="h-3.5 w-20 rounded-xs" />
        </div>
      </div>

      {/* 10 Rank Row Skeletons */}
      <RankRowListSkeleton count={10} />
    </div>
  )
}

export function GenresWidgetSkeleton() {
  // Diverse badge widths for realistic tag cloud appearance
  const tagWidths = [
    "w-12", "w-16", "w-20", "w-14", "w-10", "w-18", "w-12",
    "w-22", "w-16", "w-14", "w-20", "w-12", "w-16", "w-14"
  ]

  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 shadow-xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <Skeleton className="size-4 rounded-xs" />
        <Skeleton className="h-3.5 w-20 rounded-xs" />
      </div>

      {/* Badges Tag Cloud */}
      <div className="flex flex-wrap gap-2 pt-1">
        {tagWidths.map((width, index) => (
          <Skeleton
            key={index}
            className={cn("h-6 rounded-lg bg-accent/25 border border-border/60", width)}
          />
        ))}
      </div>
    </div>
  )
}

export function SidebarWidgetsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <RecentlyReadWidgetSkeleton />
      <RecentCommentsWidgetSkeleton />
      <TabbedTopWidgetSkeleton />
      <GenresWidgetSkeleton />
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <div className="flex-1 flex flex-col bg-background text-foreground transition-colors duration-300 relative overflow-hidden select-none">
      <main className="flex-1 w-full pt-16 md:pt-20 pb-20 z-10 flex flex-col justify-start items-center">
        {/* Top Hero Cinematic Carousel Skeleton */}
        <NovelCarouselSkeleton />

        {/* 4:2 Responsive Column Grid */}
        <div className="w-full max-w-360 px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-6 gap-12 mt-12">
          
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-12">
            {/* Translated Novels */}
            <CatalogSectionSkeleton type="vertical" count={10} columns={5} />

            {/* AI Translated Novels */}
            <CatalogSectionSkeleton type="vertical" count={5} columns={5} />

            {/* Completed Novels */}
            <CatalogSectionSkeleton type="vertical" count={6} columns={6} />

            {/* Top Novels */}
            <CatalogSectionSkeleton type="horizontal" count={6} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <SidebarWidgetsSkeleton />
          </div>

        </div>
      </main>
    </div>
  )
}
