"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Star, Eye, Clock } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

const FEATURED_NOVELS = [
  {
    id: 1,
    title: "Kimi no Na wa: Another Side",
    description: "Câu chuyện kể dưới góc nhìn của Teshigawara và những người bạn về sự kiện sao chổi định mệnh làm đảo lộn cuộc sống yên bình tại Itomori.",
    author: "Arata Kanoh",
    image: "https://i.pinimg.com/originals/4b/cf/aa/4bcfaacc3c497169cd788c574fb446ba.gif",
    views: "142k",
    rating: "4.9",
    chapters: "Chương 24 (Hoàn thành)"
  },
  {
    id: 2,
    title: "Monogatari: Owarimonogatari",
    description: "Phần kết của câu chuyện về các hiện tượng kỳ bí. Đối mặt với chiếc gương phản chiếu quá khứ và bóng tối thực sự đe dọa Koyomi.",
    author: "Nisio Isin",
    image: "https://i.pinimg.com/originals/a5/05/07/a50507183c22ac4b7535e058dbd0f1e7.gif",
    views: "98k",
    rating: "4.8",
    chapters: "Chương 42"
  },
  {
    id: 3,
    title: "No Game No Life: Volume 12",
    description: "Sự xuất hiện của chủng tộc Ex-Machina huyền thoại và cuộc chiến cân não hoành tráng mới trên bàn cờ của thế giới Disboard.",
    author: "Yuu Kamiya",
    image: "https://i.pinimg.com/originals/73/ff/0e/73ff0e2b5a1619c244af0e73f74a0b45.gif",
    views: "87k",
    rating: "4.7",
    chapters: "Chương 12"
  },
  {
    id: 4,
    title: "Re:Zero kara Hajimeru Isekai Seikatsu",
    description: "Subaru Natsuki bất ngờ bị triệu hồi đến một thế giới khác. Tại đây, anh sở hữu năng lực 'Trở về từ cõi chết' để bảo vệ những người thương yêu.",
    author: "Tappei Nagatsuki",
    image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif",
    views: "310k",
    rating: "4.9",
    chapters: "Chương 180"
  },
  {
    id: 5,
    title: "Sword Art Online: Unital Ring",
    description: "Hành trình sinh tồn mới của Kirito và những người bạn trong thế giới game bí ẩn nơi tất cả các game VRMMO sáp nhập làm một.",
    author: "Reki Kawahara",
    image: "https://i.pinimg.com/originals/2c/83/ff/2c83ff0cbb92ef28ba5e325fae6315d9.gif",
    views: "250k",
    rating: "4.6",
    chapters: "Chương 35"
  },
  {
    id: 6,
    title: "Overlord: Volume 16",
    description: "Ainz Ooal Gown cùng các thuộc hạ trung thành tiếp tục hành trình bành trướng thế lực tại Tân Thế Giới, đối đầu với Elf Country.",
    author: "Kugane Maruyama",
    image: "https://i.pinimg.com/originals/d5/21/e1/d521e1a0f03c26a5caa225e60faa608f.gif",
    views: "185k",
    rating: "4.8",
    chapters: "Chương 18 (Hoàn thành)"
  }
]

export function NovelCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile width to dynamically disable gradient edge masks
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Track active slide index
  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    onSelect()

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  useEffect(() => {
    if (!api || isHovered) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 7000)

    return () => clearInterval(interval)
  }, [api, isHovered])

  return (
    <div 
      className="w-full relative overflow-hidden animate-fade-in"
      style={isMobile ? undefined : {
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
      }}
    >
      <Carousel 
        setApi={setApi}
        opts={{ align: "center", loop: true, skipSnaps: false, containScroll: "trimSnaps" }} 
        className="w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CarouselContent className="ml-0 sm:-ml-4">
          {FEATURED_NOVELS.map((novel, index) => {
            const isActive = activeIndex === index
            
            return (
              <CarouselItem 
                key={novel.id} 
                className="pl-0 sm:pl-4 basis-full sm:basis-[75%] md:basis-[70%] lg:basis-[60%] transition-all duration-700 ease-in-out"
                style={{
                  opacity: isActive ? 1 : 0.25,
                  filter: isActive ? "none" : "blur(1px)",
                  transform: isActive ? "scale(1)" : "scale(0.95)",
                }}
              >
                {/* Cinematic Card Layout */}
                <div className="w-full aspect-16/10 md:aspect-21/9 relative md:rounded-xl overflow-hidden border border-border/80 bg-zinc-950 shadow-2xl transition-colors duration-300">
                  
                  {/* Background Illustration covering the entire card */}
                  <Image
                    src={novel.image}
                    alt={novel.title}
                    fill
                    className="object-cover opacity-60 dark:opacity-40"
                    priority
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />

                  {/* Rich bottom-up dark gradient overlay to blend cover image with content */}
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent pointer-events-none" />

                  {/* Text Details Overlay at the bottom */}
                  <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 z-10 text-white flex flex-col justify-end pointer-events-none select-none">
                    
                    {/* Meta stats badges */}
                    <div className="flex flex-wrap items-center gap-3.5 text-[10px] text-zinc-300 font-bold uppercase tracking-wider mb-2">
                      <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md border border-zinc-800">
                        <Eye className="size-3.5 text-white" />
                        <span>{novel.views}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md border border-zinc-800">
                        <Star className="size-3.5 text-white fill-white" />
                        <span>{novel.rating}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md border border-zinc-800 ml-auto">
                        <Clock className="size-3.5 text-white" />
                        <span>{novel.chapters}</span>
                      </div>
                    </div>

                    {/* Title & Author */}
                    <div className="space-y-1">
                      <h2 className="text-lg md:text-3.5xl font-black uppercase tracking-wider leading-none text-white drop-shadow-md">
                        {novel.title}
                      </h2>
                      <span className="text-[10px] md:text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                        Tác giả: {novel.author}
                      </span>
                    </div>

                    {/* Brief description */}
                    <p className="text-zinc-300 text-xs md:text-sm max-w-2xl leading-relaxed mt-3 line-clamp-2 drop-shadow-sm">
                      {novel.description}
                    </p>
                  </div>

                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        
        {/* Slide Navigation Controls */}
        <div className="absolute right-12 -bottom-8 flex gap-2 z-20">
          <CarouselPrevious className="relative left-0 top-0 translate-y-0 border-border hover:bg-accent/40 hover:text-foreground text-muted-foreground size-8 cursor-pointer" />
          <CarouselNext className="relative right-0 top-0 translate-y-0 border-border hover:bg-accent/40 hover:text-foreground text-muted-foreground size-8 cursor-pointer" />
        </div>
      </Carousel>
    </div>
  )
}
