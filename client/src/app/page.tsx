"use client"

import { NovelCarousel } from "@/components/home/novel-carousel"
import { 
  TranslatedSection, 
  CompletedSection, 
  TopNovelsSection 
} from "@/components/home/home-sections"
import { 
  RecentlyReadWidget, 
  RecentCommentsWidget, 
  TabbedTopWidget,
  GenresWidget
} from "@/components/home/home-widgets"
import { RandomNovelsSection } from "@/components/home/random-novels-section"

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      <main className="flex-1 w-full pt-16 md:pt-20 z-10 flex flex-col justify-start items-center">
        <NovelCarousel />

        <div className="w-full max-w-360 px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-6 gap-12 mt-12 pb-14">
          
          <div className="lg:col-span-4 space-y-12">
            <TranslatedSection />
            <CompletedSection />
            <TopNovelsSection />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <RecentlyReadWidget />
            <RecentCommentsWidget />
            <TabbedTopWidget />
            <GenresWidget />
          </div>

        </div>

        <section className="w-full bg-muted/60 dark:bg-zinc-900/60 border-t border-border/60 py-10 sm:py-14 transition-colors">
          <div className="w-full max-w-360 px-4 sm:px-8 mx-auto">
            <RandomNovelsSection />
          </div>
        </section>
      </main>
    </div>
  )
}
