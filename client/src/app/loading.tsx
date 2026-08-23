"use client"

import { motion } from "motion/react"
import Image from "next/image"

export default function Loading() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-foreground py-16 relative select-none">
      
      <div className="relative z-10 flex flex-col items-center space-y-8">
        
        {/* Concentric rotating loaders */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border border-border/80 border-t-zinc-400 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute w-32 h-32 border border-zinc-900/40 dark:border-zinc-800/40 border-b-zinc-500 rounded-full"
          />

          {/* Logo center */}
          <motion.div
            animate={{ scale: [0.96, 1.04, 0.96] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-14 h-14 flex items-center justify-center"
          >
            <Image
              src="/haruko.png"
              width={80}
              height={80}
              alt="Haruko Logo Loading"
              className="object-contain filter grayscale dark:invert opacity-90"
              priority
              unoptimized
            />
          </motion.div>
        </div>

        {/* Text and progress loading */}
        <div className="flex flex-col items-center space-y-3 pt-2">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-muted-foreground animate-pulse">
            ĐANG TẢI...
          </span>
          
          {/* Sleek horizontal loading bar */}
          <div className="relative w-28 h-[1px] bg-zinc-800 dark:bg-zinc-700 rounded-full overflow-hidden">
            <motion.div
              animate={{ left: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-1/2 h-full bg-zinc-500 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
