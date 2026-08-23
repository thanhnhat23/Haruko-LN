"use client"

import { useEffect } from "react"
import { motion } from "motion/react"
import { RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
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
    <html lang="vi">
      <body className="bg-zinc-950 text-white antialiased">
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 select-none">
          
          {/* Stark minimal monochrome drifting dot pattern background */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes globalerror-dot-drift {
              from { background-position: 0px 0px; }
              to { background-position: 24px 24px; }
            }
          `}} />
          <div 
            className="absolute inset-0 pointer-events-none z-0 opacity-10" 
            style={{
              backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
              maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 80%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 80%, transparent 100%)",
              animation: "globalerror-dot-drift 30s linear infinite"
            }}
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            className="max-w-lg w-full relative z-10 flex flex-col items-center text-center space-y-8 bg-zinc-905 border border-zinc-800 backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-2xl"
          >
            {/* Typographic Heading */}
            <div className="space-y-3 flex flex-col items-center">
              <div className="p-3 bg-zinc-800/30 border border-zinc-700/40 rounded-full shadow-lg">
                <AlertTriangle size={28} className="text-zinc-400" />
              </div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                CRITICAL
              </h1>
              <span className="text-xs font-black tracking-[0.2em] uppercase text-zinc-500">
                Fatal Application Error
              </span>
            </div>

            {/* Content detail */}
            <div className="space-y-2">
              <p className="text-sm font-bold">
                Ứng dụng gặp lỗi không thể tự khôi phục.
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Vui lòng nhấn nút tải lại trang bên dưới để khởi tạo lại toàn bộ tài nguyên.
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-2 w-full">
              <Button
                size="lg"
                className="w-full h-11 rounded-lg bg-foreground! text-background! border border-zinc-800 dark:border-zinc-700 hover:bg-background! hover:text-foreground! hover:border-foreground! font-bold text-xs uppercase tracking-widest active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center"
                onClick={() => reset()}
              >
                <RefreshCw size={14} className="mr-2" />
                Tải lại trang
              </Button>
            </div>

            {error?.digest && (
              <p className="text-[10px] text-zinc-600 font-mono opacity-50 select-text">
                Error ID: {error.digest}
              </p>
            )}
          </motion.div>
        </div>
      </body>
    </html>
  )
}
