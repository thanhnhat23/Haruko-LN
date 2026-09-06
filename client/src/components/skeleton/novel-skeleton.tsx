"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function NovelDetailSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 select-none">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Main Header Card Skeleton */}
      <div className="border border-border/80 bg-card/60 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Left Cover */}
          <div className="md:col-span-4 lg:col-span-3.5 space-y-2 flex flex-col items-center">
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="w-full aspect-3/4 max-w-65 rounded-xl" />
          </div>

          {/* Right Details */}
          <div className="md:col-span-8 lg:col-span-8.5 space-y-4">
            <Skeleton className="h-8 w-4/5 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-xs" />

            {/* Tags */}
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>

            {/* Status & Trans */}
            <div className="flex gap-4 pt-1">
              <Skeleton className="h-5 w-28 rounded-xs" />
              <Skeleton className="h-5 w-36 rounded-xs" />
            </div>

            {/* Read Button */}
            <div className="pt-2">
              <Skeleton className="h-11 w-36 rounded-lg" />
            </div>

            {/* Action Toolbar */}
            <div className="pt-4 border-t border-border/40 grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <Skeleton className="size-6 rounded-full" />
                  <Skeleton className="h-3 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4-column Stats */}
        <div className="grid grid-cols-4 gap-3 py-4 rounded-xl bg-accent/15">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1 text-center flex flex-col items-center">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>

        {/* Synopsis */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
      </div>

      {/* Reviews Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between border-b border-border/40 pb-3">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>

      {/* Volumes Skeleton */}
      <div className="space-y-6">
        <div className="border-b border-border/40 pb-3">
          <Skeleton className="h-6 w-48" />
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border border-border/80 bg-card/60 rounded-2xl p-6 flex gap-6"
          >
            <Skeleton className="w-28 aspect-3/4 rounded-xl shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>

      {/* Comments Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    </div>
  )
}
