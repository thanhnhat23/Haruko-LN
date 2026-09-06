"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bookmark, MessageSquare, Flame, Tag } from "lucide-react"
import { RankRow } from "./novel-card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Mock Data for Widgets
const RECENTLY_READ = [
  { id: 1, title: "Kimi no Na wa: Another Side", chapter: "Chương 12", progress: "Đọc 2 ngày trước", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif" },
  { id: 2, title: "Monogatari: Owarimonogatari", chapter: "Chương 4", progress: "Đọc hôm qua", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif" },
  { id: 3, title: "No Game No Life: Volume 12", chapter: "Chương 1", progress: "Đọc 5 giờ trước", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif" },
  { id: 4, title: "Re:Zero kara Hajimeru Isekai Seikatsu", chapter: "Chương 180", progress: "Đọc 3 ngày trước", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif" },
  { id: 5, title: "Overlord: Volume 16", chapter: "Chương 18", progress: "Đọc 4 ngày trước", image: "https://i.pinimg.com/originals/d5/21/e1/d521e1a0f03c26a5caa225e60faa608f.gif" }
]

const RECENT_COMMENTS = [
  {
    id: 1,
    user: "HarukoFan",
    comment: "Volume này dịch hay quá, chờ mãi chương mới của nhóm dịch!",
    novel: "Kimi no Na wa: Another Side",
    avatar: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif",
    time: "5 phút trước"
  },
  {
    id: 2,
    user: "Koyomi_Araragi",
    comment: "Phần Owarimonogatari xem đi xem lại vẫn thấy đỉnh cao triết lý.",
    novel: "Monogatari: Owarimonogatari",
    avatar: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif",
    time: "25 phút trước"
  },
  {
    id: 3,
    user: "Sora_Blank",
    comment: "Không bao giờ làm tôi thất vọng. Trận đấu trí quá xuất sắc.",
    novel: "No Game No Life: Volume 12",
    avatar: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif",
    time: "1 giờ trước"
  },
  {
    id: 4,
    user: "Asuna_Yuuki",
    comment: "Kirito ngầu quá đi mất, mong tập tiếp theo ghê.",
    novel: "Sword Art Online: Unital Ring",
    avatar: "https://i.pinimg.com/originals/2c/83/ff/2c83ff0cbb92ef28ba5e325fae6315d9.gif",
    time: "2 giờ trước"
  }
]

const TOP_FOLLOW = [
  { id: 1, title: "Re:Zero kara Hajimeru Isekai Seikatsu", author: "Tappei Nagatsuki", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif", views: "310k", rating: "4.9", chapters: "Chương 180" },
  { id: 2, title: "Overlord: Volume 16", author: "Kugane Maruyama", image: "https://i.pinimg.com/originals/d5/21/e1/d521e1a0f03c26a5caa225e60faa608f.gif", views: "185k", rating: "4.8", chapters: "Chương 18 (Hoàn thành)" },
  { id: 3, title: "Sword Art Online: Unital Ring", author: "Reki Kawahara", image: "https://i.pinimg.com/originals/2c/83/ff/2c83ff0cbb92ef28ba5e325fae6315d9.gif", views: "250k", rating: "4.6", chapters: "Chương 35" },
  { id: 4, title: "Kimi no Na wa: Another Side", author: "Arata Kanoh", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif", views: "142k", rating: "4.9", chapters: "Chương 24 (Hoàn thành)" },
  { id: 5, title: "Monogatari: Owarimonogatari", author: "Nisio Isin", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif", views: "98k", rating: "4.8", chapters: "Chương 42" },
  { id: 6, title: "No Game No Life: Volume 12", author: "Yuu Kamiya", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif", views: "87k", rating: "4.7", chapters: "Chương 12" },
  { id: 7, title: "Re:Zero kara Hajimeru Isekai Seikatsu", author: "Tappei Nagatsuki", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif", views: "310k", rating: "4.9", chapters: "Chương 180" },
  { id: 8, title: "Overlord: Volume 16", author: "Kugane Maruyama", image: "https://i.pinimg.com/originals/d5/21/e1/d521e1a0f03c26a5caa225e60faa608f.gif", views: "185k", rating: "4.8", chapters: "Chương 18 (Hoàn thành)" },
  { id: 9, title: "Sword Art Online: Unital Ring", author: "Reki Kawahara", image: "https://i.pinimg.com/originals/2c/83/ff/2c83ff0cbb92ef28ba5e325fae6315d9.gif", views: "250k", rating: "4.6", chapters: "Chương 35" },
  { id: 10, title: "Kimi no Na wa: Another Side", author: "Arata Kanoh", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif", views: "142k", rating: "4.9", chapters: "Chương 24 (Hoàn thành)" }
]

const TOP_VIEW = [
  { id: 1, title: "Kimi no Na wa: Another Side", author: "Arata Kanoh", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif", views: "142k", rating: "4.9", chapters: "Chương 24 (Hoàn thành)" },
  { id: 2, title: "Re:Zero kara Hajimeru Isekai Seikatsu", author: "Tappei Nagatsuki", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif", views: "310k", rating: "4.9", chapters: "Chương 180" },
  { id: 3, title: "Monogatari: Owarimonogatari", author: "Nisio Isin", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif", views: "98k", rating: "4.8", chapters: "Chương 42" },
  { id: 4, title: "Sword Art Online: Unital Ring", author: "Reki Kawahara", image: "https://i.pinimg.com/originals/2c/83/ff/2c83ff0cbb92ef28ba5e325fae6315d9.gif", views: "250k", rating: "4.6", chapters: "Chương 35" },
  { id: 5, title: "Overlord: Volume 16", author: "Kugane Maruyama", image: "https://i.pinimg.com/originals/d5/21/e1/d521e1a0f03c26a5caa225e60faa608f.gif", views: "185k", rating: "4.8", chapters: "Chương 18 (Hoàn thành)" },
  { id: 6, title: "No Game No Life: Volume 12", author: "Yuu Kamiya", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif", views: "87k", rating: "4.7", chapters: "Chương 12" },
  { id: 7, title: "Re:Zero kara Hajimeru Isekai Seikatsu", author: "Tappei Nagatsuki", image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif", views: "310k", rating: "4.9", chapters: "Chương 180" },
  { id: 8, title: "Overlord: Volume 16", author: "Kugane Maruyama", image: "https://i.pinimg.com/originals/d5/21/e1/d521e1a0f03c26a5caa225e60faa608f.gif", views: "185k", rating: "4.8", chapters: "Chương 18 (Hoàn thành)" },
  { id: 9, title: "Sword Art Online: Unital Ring", author: "Reki Kawahara", image: "https://i.pinimg.com/originals/2c/83/ff/2c83ff0cbb92ef28ba5e325fae6315d9.gif", views: "250k", rating: "4.6", chapters: "Chương 35" },
  { id: 10, title: "Kimi no Na wa: Another Side", author: "Arata Kanoh", image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif", views: "142k", rating: "4.9", chapters: "Chương 24 (Hoàn thành)" }
]

export function RecentlyReadWidget() {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <Bookmark className="size-4 text-foreground/80" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Truyện vừa đọc</h3>
      </div>
      <div className="space-y-3">
        {RECENTLY_READ.map((item) => (
          <Link href={`/novel/${item.id}`} key={item.id} className="flex items-center gap-3 group hover:opacity-85 transition-opacity">
            <div className="relative w-8 h-10 rounded-sm overflow-hidden border border-border/60 shrink-0 bg-accent/25">
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="40px" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-foreground truncate group-hover:text-muted-foreground transition-colors uppercase tracking-wide">
                {item.title}
              </h4>
              <div className="flex items-center justify-between text-[9px] text-muted-foreground mt-0.5 font-semibold">
                <span>Đang đọc: {item.chapter}</span>
                <span>{item.progress}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function RecentCommentsWidget() {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <MessageSquare className="size-4 text-foreground/80" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Bình luận gần đây</h3>
      </div>
      <div className="space-y-3.5">
        {RECENT_COMMENTS.map((item) => (
          <Link href="#" key={item.id} className="flex gap-3 text-xs leading-normal group hover:opacity-85 transition-opacity">
            <Avatar size="sm" className="mt-0.5 border border-border bg-accent/20">
              <AvatarImage src={item.avatar} alt={item.user} />
              <AvatarFallback>{item.user[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-center justify-between gap-2 text-[10px]">
                <span className="font-bold text-foreground">{item.user}</span>
                <span className="text-muted-foreground/80">{item.time}</span>
              </div>
              <p className="text-muted-foreground text-[11px] line-clamp-2 leading-relaxed bg-accent/15 p-2 rounded-lg border border-border/20">
                {item.comment}
              </p>
              <div className="text-[9px] text-muted-foreground font-semibold truncate uppercase tracking-wider pt-0.5">
                Tại: <span className="text-foreground/80 font-bold">{item.novel}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function TabbedTopWidget() {
  const [activeTab, setActiveTab] = useState<"follow" | "view">("follow")

  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 shadow-xs space-y-4">
      {/* Tabs Header */}
      <div className="flex border-b border-border/40 pb-1 items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("follow")}
            className={`text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "follow"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Theo dõi nhiều
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "view"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Top View
          </button>
        </div>
        <Flame className="size-4 text-foreground/80 animate-pulse" />
      </div>

      {/* List content based on active tab */}
      <div className="space-y-1">
        {activeTab === "follow"
          ? TOP_FOLLOW.map((novel, index) => (
              <RankRow key={novel.id} novel={novel} rank={index + 1} />
            ))
          : TOP_VIEW.map((novel, index) => (
              <RankRow key={novel.id} novel={novel} rank={index + 1} />
            ))}
      </div>
    </div>
  )
}

const GENRES = [
  "Action", "Adapted to Anime", "Adapted to Drama CD", "Adapted to Manga", "Adapted to Manhua", 
  "Adapted to Manhwa", "Adventure", "Age Gap", "Boys Love", "Character Growth", 
  "Chinese Novel", "Comedy", "Cooking", "Different Social Status", "Drama", 
  "Ecchi", "English Novel", "Fanfiction", "Fantasy", "Female Protagonist", 
  "Game", "Gender Bender", "Harem", "Historical", "Horror", 
  "Isekai", "Josei", "Korean Novel", "Magic", "Martial Arts", 
  "Mecha", "Military", "Misunderstanding", "Mystery", "Netorare", 
  "Obsession", "One shot", "Otome Game", "Parody", "Psychological", 
  "Reverse Harem", "Romance", "Satire", "School Life", "Science Fiction", 
  "Seinen", "Shoujo", "Shoujo ai", "Shounen", "Shounen ai", 
  "Slice of Life", "Slow Life", "Sports", "Super Power", "Supernatural", 
  "Suspense", "Tragedy", "Wars", "Web Novel", "Workplace", 
  "Wuxia", "Xianxia", "Yandere", "Yuri"
]

export function GenresWidget() {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <Tag className="size-4 text-foreground/80" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Thể loại</h3>
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        {GENRES.map((genre) => (
          <Link
            key={genre}
            href="#"
            className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-border/60 hover:border-foreground/30 bg-accent/25 hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            {genre}
          </Link>
        ))}
      </div>
    </div>
  )
}
