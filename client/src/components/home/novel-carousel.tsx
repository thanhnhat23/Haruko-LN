"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, type Transition } from "motion/react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel"
import { Star, Eye, Clock, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

const FEATURED_NOVELS = [
  {
    id: 1,
    title: "Kimi no Na wa: Another Side",
    description:
      "Câu chuyện kể dưới góc nhìn của Teshigawara và những người bạn về sự kiện sao chổi định mệnh làm đảo lộn cuộc sống yên bình tại Itomori.",
    author: "Arata Kanoh",
    image: "https://i.pinimg.com/originals/4b/cf/aa/4bcfaacc3c497169cd788c574fb446ba.gif",
    views: "142k",
    rating: "4.9",
    chapters: "Chương 24 (Hoàn thành)",
    priority: true,
  },
  {
    id: 2,
    title: "Monogatari: Owarimonogatari",
    description:
      "Phần kết của câu chuyện về các hiện tượng kỳ bí. Đối mặt với chiếc gương phản chiếu quá khứ và bóng tối thực sự đe dọa Koyomi.",
    author: "Nisio Isin",
    image: "https://i.pinimg.com/originals/a5/05/07/a50507183c22ac4b7535e058dbd0f1e7.gif",
    views: "98k",
    rating: "4.8",
    chapters: "Chương 42",
  },
  {
    id: 3,
    title: "No Game No Life: Volume 12",
    description:
      "Sự xuất hiện của chủng tộc Ex-Machina huyền thoại và cuộc chiến cân não hoành tráng mới trên bàn cờ của thế giới Disboard.",
    author: "Yuu Kamiya",
    image: "https://i.pinimg.com/originals/73/ff/0e/73ff0e2b5a1619c244af0e73f74a0b45.gif",
    views: "87k",
    rating: "4.7",
    chapters: "Chương 12",
  },
  {
    id: 4,
    title: "Re:Zero kara Hajimeru Isekai Seikatsu",
    description:
      "Subaru Natsuki bất ngờ bị triệu hồi đến một thế giới khác. Tại đây, anh sở hữu năng lực 'Trở về từ cõi chết' để bảo vệ những người thương yêu.",
    author: "Tappei Nagatsuki",
    image: "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif",
    views: "310k",
    rating: "4.9",
    chapters: "Chương 180",
  },
  {
    id: 5,
    title: "Sword Art Online: Unital Ring",
    description:
      "Hành trình sinh tồn mới của Kirito và những người bạn trong thế giới game bí ẩn nơi tất cả các game VRMMO sáp nhập làm một.",
    author: "Reki Kawahara",
    image: "https://i.pinimg.com/originals/2c/83/ff/2c83ff0cbb92ef28ba5e325fae6315d9.gif",
    views: "250k",
    rating: "4.6",
    chapters: "Chương 35",
  },
  {
    id: 6,
    title: "Overlord: Volume 16",
    description:
      "Ainz Ooal Gown cùng các thuộc hạ trung thành tiếp tục hành trình bành trướng thế lực tại Tân Thế Giới, đối đầu với Elf Country.",
    author: "Kugane Maruyama",
    image: "https://i.pinimg.com/originals/d5/21/e1/d521e1a0f03c26a5caa225e60faa608f.gif",
    views: "185k",
    rating: "4.8",
    chapters: "Chương 18 (Hoàn thành)",
  },
]

type EmblaControls = {
  selectedIndex: number
  scrollSnaps: number[]
  prevDisabled: boolean
  nextDisabled: boolean
  onDotClick: (index: number) => void
  onPrev: () => void
  onNext: () => void
}

const transition: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 25,
  mass: 1,
}

function useEmblaControls(emblaApi: EmblaCarouselType | undefined): EmblaControls {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])
  const [prevDisabled, setPrevDisabled] = React.useState(false)
  const [nextDisabled, setNextDisabled] = React.useState(false)

  const onDotClick = React.useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  const onPrev = React.useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNext = React.useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const updateSelectionState = React.useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap())
    setPrevDisabled(!api.canScrollPrev())
    setNextDisabled(!api.canScrollNext())
  }, [])

  const onInit = React.useCallback(
    (api: EmblaCarouselType) => {
      setScrollSnaps(api.scrollSnapList())
      updateSelectionState(api)
    },
    [updateSelectionState]
  )

  const onSelect = React.useCallback(
    (api: EmblaCarouselType) => {
      updateSelectionState(api)
    },
    [updateSelectionState]
  )

  React.useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    emblaApi.on("reInit", onInit).on("select", onSelect)

    return () => {
      emblaApi.off("reInit", onInit).off("select", onSelect)
    }
  }, [emblaApi, onInit, onSelect])

  return {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  }
}

interface NovelCarouselProps {
  novels?: typeof FEATURED_NOVELS
  options?: EmblaOptionsType
}

export function NovelCarousel({
  novels = FEATURED_NOVELS,
  options,
}: NovelCarouselProps) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const autoplay = React.useRef(
    Autoplay({
      delay: 7000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      ...options,
      align: "center",
      loop: true,
      containScroll: false,
      skipSnaps: false,
    },
    [autoplay.current]
  )

  const {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  } = useEmblaControls(emblaApi)

  return (
    <div
      className="w-full relative group/carousel overflow-hidden select-none py-2"
      style={
        isMobile
          ? undefined
          : {
              maskImage:
                "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            }
      }
    >
      {/* Embla Viewport */}
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {novels.map((novel, index) => {
            const isActive = index === selectedIndex

            return (
              <motion.div
                key={novel.id}
                className="basis-full sm:basis-[75%] md:basis-[70%] lg:basis-[60%] shrink-0 px-2 sm:px-3 min-w-0"
              >
                <motion.div
                  className="w-full aspect-16/10 md:aspect-21/9 relative rounded-xl overflow-hidden border border-border/80 bg-zinc-950 shadow-2xl transition-colors duration-300"
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.94,
                    opacity: isActive ? 1 : 0.35,
                    filter: isActive ? "none" : "blur(0.5px)",
                  }}
                  transition={transition}
                >
                  {/* Background Cover Image */}
                  <Image
                    src={novel.image}
                    alt={novel.title}
                    fill
                    priority={novel.priority}
                    className={cn(
                      "object-cover transition-transform duration-1000 ease-out",
                      isActive ? "scale-105 opacity-65 dark:opacity-45" : "scale-100 opacity-40"
                    )}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Novel Details Overlay */}
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 md:p-10 z-20 text-white pointer-events-none">
                        {/* Meta Stats Badges */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className="flex flex-wrap items-center gap-2.5 text-[10px] text-zinc-300 font-bold uppercase tracking-wider mb-2"
                        >
                          <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-md border border-zinc-800 backdrop-blur-xs">
                            <Eye className="size-3.5 text-white" />
                            <span>{novel.views}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-md border border-zinc-800 backdrop-blur-xs">
                            <Star className="size-3.5 text-yellow-400 fill-yellow-400" />
                            <span>{novel.rating}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-md border border-zinc-800 backdrop-blur-xs ml-auto">
                            <Clock className="size-3.5 text-zinc-400" />
                            <span>{novel.chapters}</span>
                          </div>
                        </motion.div>

                        {/* Title & Author */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="space-y-1"
                        >
                          <h2 className="text-lg sm:text-2xl md:text-3.5xl font-black uppercase tracking-wider leading-tight text-white drop-shadow-md line-clamp-1">
                            {novel.title}
                          </h2>
                          <span className="text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase tracking-wider block">
                            Tác giả: {novel.author}
                          </span>
                        </motion.div>

                        {/* Description & Action CTA */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                          className="pt-1 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
                        >
                          <p className="text-zinc-300 text-xs sm:text-sm max-w-xl leading-relaxed line-clamp-2 drop-shadow-sm font-medium">
                            {novel.description}
                          </p>

                          <div className="pointer-events-auto shrink-0 flex items-center gap-2.5">
                            <Link
                              href={`/novel/${novel.id}`}
                              className="px-4 py-2 rounded-lg bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
                            >
                              <BookOpen className="size-3.5" />
                              Đọc ngay
                            </Link>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Side Arrow Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 right-3 sm:right-6 flex justify-between z-30 pointer-events-none">
        <button
          type="button"
          onClick={onPrev}
          disabled={prevDisabled}
          aria-label="Previous slide"
          className={cn(
            "pointer-events-auto cursor-pointer size-10 md:size-12 rounded-full bg-black/50 hover:bg-black/80 border border-zinc-800/80 backdrop-blur-md text-white transition-all duration-300 flex items-center justify-center shadow-xl opacity-0 group-hover/carousel:opacity-100 -translate-x-2 group-hover/carousel:translate-x-0 disabled:opacity-0"
          )}
        >
          <ChevronLeft className="size-5 md:size-6" />
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          aria-label="Next slide"
          className={cn(
            "pointer-events-auto cursor-pointer size-10 md:size-12 rounded-full bg-black/50 hover:bg-black/80 border border-zinc-800/80 backdrop-blur-md text-white transition-all duration-300 flex items-center justify-center shadow-xl opacity-0 group-hover/carousel:opacity-100 translate-x-2 group-hover/carousel:translate-x-0 disabled:opacity-0"
          )}
        >
          <ChevronRight className="size-5 md:size-6" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center items-center gap-2 pt-4 z-30">
        {scrollSnaps.map((_, index) => {
          const isSelected = index === selectedIndex

          return (
            <button
              key={index}
              onClick={() => onDotClick(index)}
              className={cn(
                "h-1.5 transition-all duration-500 rounded-full cursor-pointer",
                isSelected
                  ? "w-7 bg-foreground dark:bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                  : "w-2 bg-foreground/20 hover:bg-foreground/40 dark:bg-white/20 dark:hover:bg-white/40"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}
