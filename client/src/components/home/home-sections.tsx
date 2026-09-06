"use client"

import Link from "next/link"
import { Compass, CheckCircle2, Award, ChevronRight } from "lucide-react"
import { VerticalCard, HorizontalCard } from "./novel-card"

// Mock datasets (10 items for Translated, 6 for Completed, 6 for Top Novels)
const TRANSLATED_NOVELS = [
  { id: 1, title: "Kimi no Na wa: Another Side", author: "Arata Kanoh", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif", views: "142k", rating: "4.9", chapters: "Chương 24 (Hoàn thành)" },
  { id: 2, title: "Monogatari: Owarimonogatari", author: "Nisio Isin", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif", views: "98k", rating: "4.8", chapters: "Chương 42" },
  { id: 3, title: "No Game No Life: Volume 12", author: "Yuu Kamiya", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif", views: "87k", rating: "4.7", chapters: "Chương 12" },
  { id: 4, title: "Sword Art Online: Unital Ring", author: "Reki Kawahara", image: "https://i.pinimg.com/originals/2c/83/ff/2c83ff0cbb92ef28ba5e325fae6315d9.gif", views: "250k", rating: "4.6", chapters: "Chương 35" },
  { id: 5, title: "Overlord: Volume 16", author: "Kugane Maruyama", image: "https://i.pinimg.com/originals/d5/21/e1/d521e1a0f03c26a5caa225e60faa608f.gif", views: "185k", rating: "4.8", chapters: "Chương 18 (Hoàn thành)" },
  { id: 6, title: "Re:Zero kara Hajimeru Isekai Seikatsu", author: "Tappei Nagatsuki", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif", views: "310k", rating: "4.9", chapters: "Chương 180" },
  { id: 7, title: "Kimi no Na wa: Another Side", author: "Arata Kanoh", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif", views: "142k", rating: "4.9", chapters: "Chương 24 (Hoàn thành)" },
  { id: 8, title: "Monogatari: Owarimonogatari", author: "Nisio Isin", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif", views: "98k", rating: "4.8", chapters: "Chương 42" },
  { id: 9, title: "No Game No Life: Volume 12", author: "Yuu Kamiya", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif", views: "87k", rating: "4.7", chapters: "Chương 12" },
  { id: 10, title: "Sword Art Online: Unital Ring", author: "Reki Kawahara", image: "https://i.pinimg.com/originals/2c/83/ff/2c83ff0cbb92ef28ba5e325fae6315d9.gif", views: "250k", rating: "4.6", chapters: "Chương 35" }
]

const COMPLETED_NOVELS = [
  { id: 1, title: "Kimi no Na wa: Another Side", author: "Arata Kanoh", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif", views: "142k", rating: "4.9", chapters: "Chương 24 (Hoàn thành)" },
  { id: 2, title: "Overlord: Volume 16", author: "Kugane Maruyama", image: "https://i.pinimg.com/originals/d5/21/e1/d521e1a0f03c26a5caa225e60faa608f.gif", views: "185k", rating: "4.8", chapters: "Chương 18 (Hoàn thành)" },
  { id: 3, title: "Monogatari: Owarimonogatari", author: "Nisio Isin", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif", views: "98k", rating: "4.8", chapters: "Chương 42" },
  { id: 4, title: "No Game No Life: Volume 12", author: "Yuu Kamiya", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif", views: "87k", rating: "4.7", chapters: "Chương 12" },
  { id: 5, title: "Re:Zero kara Hajimeru Isekai Seikatsu", author: "Tappei Nagatsuki", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif", views: "310k", rating: "4.9", chapters: "Chương 180" },
  { id: 6, title: "Sword Art Online: Unital Ring", author: "Reki Kawahara", image: "https://i.pinimg.com/originals/2c/83/ff/2c83ff0cbb92ef28ba5e325fae6315d9.gif", views: "250k", rating: "4.6", chapters: "Chương 35" }
]

const TOP_NOVELS = [
  { id: 1, title: "Re:Zero kara Hajimeru Isekai Seikatsu", description: "Subaru Natsuki bất ngờ bị triệu hồi đến một thế giới khác. Tại đây, anh sở hữu năng lực 'Trở về từ cõi chết' để bảo vệ những người thương yêu.", author: "Tappei Nagatsuki", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif", views: "310k", rating: "4.9", chapters: "Chương 180" },
  { id: 2, title: "Overlord: Volume 16", description: "Ainz Ooal Gown cùng các thuộc hạ trung thành tiếp tục hành trình bành trướng thế lực tại Tân Thế Giới, đối đầu với Elf Country.", author: "Kugane Maruyama", image: "https://i.pinimg.com/originals/d5/21/e1/d521e1a0f03c26a5caa225e60faa608f.gif", views: "185k", rating: "4.8", chapters: "Chương 18 (Hoàn thành)" },
  { id: 3, title: "Sword Art Online: Unital Ring", description: "Hành trình sinh tồn mới của Kirito và những người bạn trong thế giới game bí ẩn nơi tất cả các game VRMMO sáp nhập làm một.", author: "Reki Kawahara", image: "https://i.pinimg.com/originals/2c/83/ff/2c83ff0cbb92ef28ba5e325fae6315d9.gif", views: "250k", rating: "4.6", chapters: "Chương 35" },
  { id: 4, title: "Kimi no Na wa: Another Side", description: "Câu chuyện kể dưới góc nhìn của Teshigawara và những người bạn về sự kiện sao chổi định mệnh làm đảo lộn cuộc sống yên bình tại Itomori.", author: "Arata Kanoh", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif", views: "142k", rating: "4.9", chapters: "Chương 24 (Hoàn thành)" },
  { id: 5, title: "Monogatari: Owarimonogatari", description: "Phần kết của câu chuyện về các hiện tượng kỳ bí. Đối mặt với chiếc gương phản chiếu quá khứ và bóng tối thực sự đe dọa Koyomi.", author: "Nisio Isin", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif", views: "98k", rating: "4.8", chapters: "Chương 42" },
  { id: 6, title: "No Game No Life: Volume 12", description: "Sự xuất hiện của chủng tộc Ex-Machina huyền thoại và cuộc chiến cân não hoành tráng mới trên bàn cờ của thế giới Disboard.", author: "Yuu Kamiya", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif", views: "87k", rating: "4.7", chapters: "Chương 12" }
]

export function TranslatedSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5 border-b border-border/40 pb-2">
        <div className="bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 font-extrabold text-[9px] tracking-wider px-2 py-0.5 rounded-xs uppercase select-none shrink-0">
          Trans
        </div>
        <h3 className="text-base font-black uppercase tracking-wider text-foreground flex gap-2 items-center">
          Truyện dịch
          <Compass className="size-4 text-foreground mr-1" />
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {TRANSLATED_NOVELS.map((novel, index) => (
          <div key={novel.id} className={index >= 4 ? "hidden sm:block" : ""}>
            <VerticalCard novel={novel} />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4">
        <Link href="#" className="text-xs font-bold text-muted-foreground hover:text-foreground hover:underline transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer select-none">
          Xem thêm <ChevronRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}

export function CompletedSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5 border-b border-border/40 pb-2">
        <div className="bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 font-extrabold text-[9px] tracking-wider px-2 py-0.5 rounded-xs uppercase select-none shrink-0">
          Full
        </div>
        <h3 className="text-base font-black uppercase tracking-wider text-foreground flex gap-2 items-center">
          Đã hoàn thành
          <CheckCircle2 className="size-4 text-green-400 dark:text-green-300 mr-1" />
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {COMPLETED_NOVELS.map((novel, index) => (
          <div key={novel.id} className={index >= 4 ? "hidden sm:block" : ""}>
            <VerticalCard novel={novel} />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4">
        <Link href="#" className="text-xs font-bold text-muted-foreground hover:text-foreground hover:underline transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer select-none">
          Xem thêm <ChevronRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}

export function TopNovelsSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5 border-b border-border/40 pb-2">
        <div className="bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 font-extrabold text-[9px] tracking-wider px-2 py-0.5 rounded-xs uppercase select-none shrink-0">
          Top
        </div>
        <h3 className="text-base font-black uppercase tracking-wider text-foreground flex gap-2 items-center">
          Top truyện
          <Award className="size-4 text-yellow-400 dark:text-yellow-300 mr-1" />
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOP_NOVELS.map((novel, index) => (
          <div key={novel.id} className={index >= 4 ? "hidden sm:block" : ""}>
            <HorizontalCard novel={novel} />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4">
        <Link href="#" className="text-xs font-bold text-muted-foreground hover:text-foreground hover:underline transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer select-none">
          Xem thêm <ChevronRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
