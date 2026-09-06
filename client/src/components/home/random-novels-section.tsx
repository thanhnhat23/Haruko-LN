"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Shuffle, Sparkles, BookOpen } from "lucide-react"

interface NovelItem {
  id: number
  title: string
  subtitle: string
  latestChapter: string
  image: string
}

const ALL_RANDOM_NOVELS: NovelItem[] = [
  {
    id: 1,
    title: "Không Có Tư Trắc Học Tại Phòng 306",
    subtitle: "Xin chào 306. Tạm biệt 306.",
    latestChapter: "Lời bạt cuối",
    image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif",
  },
  {
    id: 2,
    title: "Trở Thành Kiếm Sĩ Thời Trung Cổ",
    subtitle: "200-?",
    latestChapter: "Chương 243: Hoàn thành nhiệm vụ",
    image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif",
  },
  {
    id: 3,
    title: "Các Nữ Chính Tôi Bảo Vệ Hết Mình Dường Như Muốn Độc Chiếm",
    subtitle: "Vol 1 Web Novel",
    latestChapter: "Chương 11: Vương Đô Và Thiếu Nữ",
    image: "https://i.pinimg.com/originals/2c/83/ff/2c83ff0cbb92ef28ba5e325fae6315d9.gif",
  },
  {
    id: 4,
    title: "Vô Song Dị Giới Nhờ Kỹ Năng Tẩy Não Tuyệt Đối",
    subtitle: "VOL 4",
    latestChapter: "Minh Hoạ",
    image: "https://i.pinimg.com/originals/d5/21/e1/d521e1a0f03c26a5caa225e60faa608f.gif",
  },
  {
    id: 5,
    title: "Days gone - Hồi ức những ngày đã qua",
    subtitle: "Quyển 2",
    latestChapter: "Chương 36: Đừng mà......",
    image: "https://i.pinimg.com/originals/a5/05/07/a50507183c22ac4b7535e058dbd0f1e7.gif",
  },
  {
    id: 6,
    title: "Nhật ký của một Thám Hiểm giả – Người Vô Tình Cứu Công Chúa",
    subtitle: "Web novel (Chương 121 ~ 150)",
    latestChapter: "Chương 140: Chiến hữu",
    image: "https://i.pinimg.com/originals/73/ff/0e/73ff0e2b5a1619c244af0e73f74a0b45.gif",
  },
  {
    id: 7,
    title: "Cả Phòng Hóa Gái Cười Hì Hì, Lúc Tắm Chung Mới Biết Toàn Cú",
    subtitle: "Web Novel",
    latestChapter: "451 - Màn khen thưởng kết thúc",
    image: "https://i.pinimg.com/originals/4b/cf/aa/4bcfaacc3c497169cd788c574fb446ba.gif",
  },
  {
    id: 8,
    title: "Hồi ức về cô gái từng nói \"Hãy mãi là bạn thân nhé\"",
    subtitle: "Webnovel",
    latestChapter: "Vol 3 Phần kết",
    image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif",
  },
  {
    id: 9,
    title: "Satou lạnh lùng chỉ ngọt ngào với một mình tôi",
    subtitle: "Tập 3",
    latestChapter: "Tấm ảnh thứ nhất: Quán cà phê \"Ushio\"",
    image: "https://i.pinimg.com/originals/c5/bf/9b/c5bf9b4801ee89b2c9d56924a9357217.gif",
  },
  {
    id: 10,
    title: "Cô Gái Ngồi Bàn Bên Đột Nhiên Thú Nhận Thích Tôi",
    subtitle: "Tập 2: Mùa hè rực rỡ",
    latestChapter: "Chương 18: Lễ hội pháo hoa",
    image: "https://i.pinimg.com/originals/2c/83/ff/2c83ff0cbb92ef28ba5e325fae6315d9.gif",
  },
  {
    id: 11,
    title: "Hiệp Sĩ Lưu Đày Và Công Chúa Rồng Bị Lãng Quên",
    subtitle: "Quyển 1 - Khởi đầu lưu lạc",
    latestChapter: "Chương 45: Hơi thở rồng thiêng",
    image: "https://i.pinimg.com/originals/d5/21/e1/d521e1a0f03c26a5caa225e60faa608f.gif",
  },
  {
    id: 12,
    title: "Tiệm Giặt Ủi Thời Gian Của Pháp Sư Tập Sự",
    subtitle: "Webnovel Đặc Biệt",
    latestChapter: "Chương 29: Ký ức được giặt sạch",
    image: "https://i.pinimg.com/originals/a5/05/07/a50507183c22ac4b7535e058dbd0f1e7.gif",
  },
  {
    id: 13,
    title: "Sống Lại Thành Boss Cuối Nhưng Lại Muốn Làm Ruộng",
    subtitle: "Tập 5",
    latestChapter: "Chương 88: Vụ mùa ngô bội thu",
    image: "https://i.pinimg.com/originals/73/ff/0e/73ff0e2b5a1619c244af0e73f74a0b45.gif",
  },
  {
    id: 14,
    title: "Đừng Lại Gần Tôi, Hỡi Các Thánh Nữ Rắc Rối",
    subtitle: "Phần 2: Thần Điện",
    latestChapter: "Chương 52: Lời cầu nguyện lúc nửa đêm",
    image: "https://i.pinimg.com/originals/4b/cf/aa/4bcfaacc3c497169cd788c574fb446ba.gif",
  },
  {
    id: 15,
    title: "Thầy Giáo Phép Thuật Thất Nghiệp Và Ba Nữ Đồ Đệ",
    subtitle: "Vol 2 Light Novel",
    latestChapter: "Chương 21: Bài kiểm tra ma thuật",
    image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif",
  },
]

function getRandomItems(arr: NovelItem[], count: number = 9): NovelItem[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export function RandomNovelsSection() {
  const [novels, setNovels] = React.useState<NovelItem[]>([])
  const [isRotating, setIsRotating] = React.useState(false)

  React.useEffect(() => {
    setNovels(ALL_RANDOM_NOVELS.slice(0, 9))
  }, [])

  const handleShuffle = () => {
    setIsRotating(true)
    setNovels(getRandomItems(ALL_RANDOM_NOVELS, 9))
    setTimeout(() => {
      setIsRotating(false)
    }, 450)
  }

  return (
    <div className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 font-extrabold text-[9px] tracking-wider px-2 py-0.5 rounded-xs uppercase select-none shrink-0">
            Khám phá
          </div>
          <h3 className="text-base font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            Ngẫu nhiên
            <Sparkles className="size-4 text-emerald-500 fill-emerald-500/20" />
          </h3>
        </div>

        <button
          type="button"
          onClick={handleShuffle}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-muted-foreground hover:text-foreground bg-background/60 hover:bg-accent/40 border border-border/60 hover:border-border transition-all cursor-pointer select-none"
        >
          <Shuffle
            className={`size-3.5 text-emerald-500 transition-transform duration-500 ${
              isRotating ? "rotate-180 scale-110" : "group-hover:rotate-45"
            }`}
          />
          <span>Đổi ngẫu nhiên</span>
        </button>
      </div>

      {/* Grid: 3 columns x 3 rows = 9 items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {novels.map((novel, index) => {
          const rankStr = String(index + 1).padStart(2, "0")
          return (
            <Link
              key={`${novel.id}-${index}`}
              href={`/novel/${novel.id}`}
              className="group relative flex items-start gap-3 p-2.5 sm:p-3 rounded-lg bg-card/70 hover:bg-accent/40 border border-border hover:border-emerald-500/50 transition-all duration-200 shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative w-14 h-20 sm:w-15 sm:h-21 rounded-xs overflow-hidden bg-accent/30 border border-border/60 shrink-0 shadow-2xs">
                <Image
                  src={novel.image}
                  alt={novel.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="70px"
                />
              </div>

              {/* Rank number (01, 02, ...) */}
              <span className="font-mono font-black text-lg sm:text-xl text-muted-foreground/35 select-none shrink-0 tracking-tighter leading-none pt-0.5">
                {rankStr}
              </span>

              {/* Content Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-[13px] font-bold text-foreground line-clamp-1 group-hover:text-emerald-500 transition-colors leading-snug">
                    {novel.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground/80 line-clamp-1 font-medium">
                    {novel.subtitle}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-emerald-500 dark:text-emerald-400 line-clamp-1 flex items-center gap-1 group-hover:underline">
                    <BookOpen className="size-3 shrink-0" />
                    {novel.latestChapter}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
