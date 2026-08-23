"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Send } from "lucide-react"
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

      <footer className="border-t border-border/40 bg-card/45 backdrop-blur-xs py-12 sm:py-16 z-10 text-xs text-muted-foreground transition-colors duration-300">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 overflow-hidden rounded-md border border-border/40">
                <Image
                  src="/haruko.png"
                  alt="Haruko Logo"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <span className="text-base font-black tracking-widest uppercase text-foreground">
                Haruko
              </span>
            </Link>
            <p className="text-[11px] leading-relaxed text-muted-foreground/80 max-w-sm">
              Cổng đọc Light Novel trực tuyến miễn phí hàng đầu. Nơi hội tụ các dịch giả tài năng và hệ thống dịch thuật AI thông minh, mang đến trải nghiệm đọc hoàn hảo nhất cho độc giả Việt Nam.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link href="#" className="p-2 rounded-lg bg-accent/40 hover:bg-accent/80 hover:text-foreground border border-border/50 transition-all flex items-center justify-center">
                {/* Facebook Inline SVG */}
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </Link>
              <Link href="#" className="p-2 rounded-lg bg-accent/40 hover:bg-accent/80 hover:text-foreground border border-border/50 transition-all flex items-center justify-center">
                {/* Github Inline SVG */}
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </Link>
              <Link href="#" className="p-2 rounded-lg bg-accent/40 hover:bg-accent/80 hover:text-foreground border border-border/50 transition-all flex items-center justify-center">
                <Mail className="size-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-foreground">Danh Mục</h4>
            <ul className="space-y-2 font-medium">
              <li><Link href="#" className="hover:text-foreground transition-colors">Truyện dịch</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">AI dịch</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Đã hoàn thành</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Top truyện</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-foreground">Chính Sách</h4>
            <ul className="space-y-2 font-medium">
              <li><Link href="#" className="hover:text-foreground transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Khiếu nại bản quyền</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Liên hệ quảng cáo</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-foreground">Đăng ký bản tin</h4>
            <p className="text-[11px] leading-relaxed text-muted-foreground/80 max-w-sm">
              Nhận thông báo email sớm nhất khi có tập mới, chương mới hoặc các cập nhật quan trọng từ hệ thống Haruko.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 max-w-sm pt-1">
              <input
                type="email"
                placeholder="Tên email của bạn..."
                className="w-full bg-accent/25 border border-border/60 hover:border-border focus:border-foreground/40 rounded-lg px-3 py-2 text-xs outline-hidden transition-all text-foreground"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-foreground text-background hover:opacity-90 font-bold border border-border/20 transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>

        </div>

        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground/70">
          <p>&copy; {new Date().getFullYear()} Bản quyền thuộc về Haruko. Toàn bộ nội dung đều được dịch bởi cộng đồng.</p>
          <div className="flex gap-4 font-semibold">
            <span>Thiết kế bởi Haruko Team</span>
            <span>•</span>
            <span>Phiên bản 1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
