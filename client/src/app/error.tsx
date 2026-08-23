"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { Home, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-8 py-16 relative overflow-hidden select-none">
      
      {/* Premium subtle tech grid background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.06] dark:opacity-[0.12]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 70%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 70%, transparent 100%)",
        }}
      />

      {/* Main Glassmorphic Structured Frame Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className="relative w-full max-w-7xl border border-border/60 bg-card/35 dark:bg-card/20 backdrop-blur-md rounded-2xl p-6 sm:p-10 md:p-12 shadow-2xl z-10"
      >
        
        {/* Technical Corner Brackets */}
        <div className="absolute top-0 left-0 border-t-2 border-l-2 border-foreground/30 w-4 h-4 rounded-tl-md pointer-events-none" />
        <div className="absolute top-0 right-0 border-t-2 border-r-2 border-foreground/30 w-4 h-4 rounded-tr-md pointer-events-none" />
        <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-foreground/30 w-4 h-4 rounded-bl-md pointer-events-none" />
        <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-foreground/30 w-4 h-4 rounded-br-md pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left Side: Illustration Container (col-span-7) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-7 flex justify-center items-center"
          >
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-border/80 bg-accent/5 shadow-lg group hover:shadow-xl transition-all duration-500">
              {/* Customizable Error Illustration GIF / Image */}
              <Image
                src="https://i.pinimg.com/originals/5f/e2/76/5fe2766bc465290b7b95856832cef409.gif"
                fill
                alt="500 Server Error Illustration"
                className="object-cover opacity-95 dark:opacity-85 transition-transform duration-700 group-hover:scale-102 filter grayscale"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-none" />
            </div>
          </motion.div>

          {/* Right Side: Content Details & Actions (col-span-5) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-6"
          >
            <div className="space-y-3">
              {/* Tag Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-zinc-800 text-zinc-300 dark:bg-zinc-850 dark:text-zinc-200 border border-zinc-700/50 text-[9px] font-black uppercase tracking-widest select-none">
                <AlertTriangle size={11} className="animate-pulse" />
                Lỗi Hệ Thống
              </div>
              
              {/* Main Typographic Heading */}
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-foreground uppercase italic leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                Đã Xảy Ra <span className="text-muted-foreground block md:inline">Lỗi</span>
              </h1>
            </div>

            {/* Description */}
            <div className="space-y-3 max-w-sm sm:max-w-md">
              <h2 className="text-lg font-bold text-foreground/90 leading-snug">
                Máy chủ gặp sự cố ngoài ý muốn.
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                Hệ thống đã ghi nhận lỗi này và đang xử lý khắc phục. Xin vui lòng nhấn nút "Thử lại" hoặc quay về trang chủ để tiếp tục.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
              <Button
                size="lg"
                className="w-full sm:w-auto h-11 px-6 rounded-lg bg-foreground! text-background! border border-zinc-800 dark:border-zinc-700 hover:bg-background! hover:text-foreground! hover:border-foreground! font-bold text-xs uppercase tracking-widest active:scale-95 transition-all duration-300 cursor-pointer"
                onClick={() => reset()}
              >
                <RefreshCw className="size-3.5 mr-2" />
                Thử lại
              </Button>

              <Link href="/" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-11 rounded-lg border border-border! bg-transparent! text-foreground! hover:bg-foreground! hover:text-background! hover:border-foreground! font-bold text-xs uppercase tracking-widest active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  <Home className="size-3.5 mr-2" />
                  Trang chủ
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  )
}
