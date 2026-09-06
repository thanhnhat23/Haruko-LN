"use client"

import { NovelCarousel } from "@/components/home/novel-carousel"
import { 
  TranslatedSection, 
  AiTranslatedSection, 
  CompletedSection, 
  TopNovelsSection 
} from "@/components/home/home-sections"
import { 
  RecentlyReadWidget, 
  RecentCommentsWidget, 
  TabbedTopWidget,
  GenresWidget
} from "@/components/home/home-widgets"

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      <main className="flex-1 w-full pt-16 md:pt-20 pb-20 z-10 flex flex-col justify-start items-center">
        <NovelCarousel />

        <div className="w-full max-w-360 px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-6 gap-12 mt-12">
          
          <div className="lg:col-span-4 space-y-12">
            <TranslatedSection />
            <AiTranslatedSection />
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
      </main>
    </div>
  )
}
