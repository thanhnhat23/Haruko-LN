"use client"

import * as React from "react"
import { getNovelById } from "@/data/mock-novel-data"
import {
  NovelHeaderInfo,
  NovelReviews,
  NovelVolumesList,
  NovelComments,
  NovelDetailSkeleton,
} from "@/components/novel-detail"

export default function NovelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  const [loading, setLoading] = React.useState(true)
  const novel = getNovelById(id)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200)
    return () => clearTimeout(timer)
  }, [id])

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-background text-foreground transition-colors duration-300 py-10 px-4 sm:px-8">
        <NovelDetailSkeleton />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground transition-colors duration-300 relative pt-14">
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12 z-10">
        <NovelHeaderInfo
          novel={novel}
          onScrollToSection={scrollToSection}
        />

        <NovelReviews
          ratingScore={novel.ratingScore}
          ratingCount={novel.ratingCount}
          reviews={novel.reviews}
        />

        <NovelVolumesList
          novelId={novel.id}
          volumes={novel.volumes}
        />

        <NovelComments
          totalComments={novel.totalComments}
          discussionCount={novel.discussionCount}
          comments={novel.comments}
        />
      </main>
    </div>
  )
}
