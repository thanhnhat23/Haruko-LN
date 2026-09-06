"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Home,
  ChevronRight,
  ShieldAlert,
  FileText,
  Scale,
  Users,
  AlertTriangle,
  Lock,
  BookOpen,
  HelpCircle,
  Clock,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const SECTIONS = [
  { id: "section-1", title: "1. Chấp thuận điều khoản", icon: Scale },
  { id: "section-2", title: "2. Tài khoản & Bảo mật", icon: Lock },
  { id: "section-3", title: "3. Quy định Dịch thuật & Bản quyền", icon: BookOpen },
  { id: "section-4", title: "4. Quyền & Trách nhiệm Nhóm dịch", icon: Users },
  { id: "section-5", title: "5. Các hành vi bị nghiêm cấm", icon: ShieldAlert },
  { id: "section-6", title: "6. Xử lý vi phạm & Khóa tài khoản", icon: AlertTriangle },
  { id: "section-7", title: "7. Miễn trừ & Thay đổi điều khoản", icon: HelpCircle },
]

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("section-1")

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground transition-colors duration-300 relative select-none pt-16">
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 z-10">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Link
            href="/"
            className="hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <Home size={13} />
            Trang chủ
          </Link>
          <ChevronRight size={12} className="opacity-50" />
          <span className="text-foreground font-bold">Điều khoản dịch vụ</span>
        </nav>

        {/* Page Hero Header Box */}
        <div className="relative border border-border/80 bg-card/60 backdrop-blur-md rounded-md p-6 sm:p-10 shadow-xl overflow-hidden">
          {/* Technical Corner Brackets */}
          <div className="absolute top-0 left-0 border-t-2 border-l-2 border-foreground/30 w-4 h-4 rounded-tl-md pointer-events-none" />
          <div className="absolute top-0 right-0 border-t-2 border-r-2 border-foreground/30 w-4 h-4 rounded-tr-md pointer-events-none" />
          <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-foreground/30 w-4 h-4 rounded-bl-md pointer-events-none" />
          <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-foreground/30 w-4 h-4 rounded-br-md pointer-events-none" />

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-zinc-800 text-zinc-200 border border-zinc-700/50 text-[9px] font-black uppercase tracking-widest">
              <FileText size={11} className="text-zinc-400" />
              Quy chuẩn & Pháp lý
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-foreground uppercase tracking-tight leading-tight">
              Điều Khoản Dịch Vụ
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
              Chào mừng bạn đến với nền tảng đọc và quản lý Light Novel Haruko. Bằng việc truy cập, tạo tài khoản hoặc sử dụng bất kỳ dịch vụ nào trên hệ thống, bạn đồng ý tuân thủ các điều khoản và quy định dưới đây.
            </p>

            <div className="flex items-center gap-2 pt-2 text-[11px] text-muted-foreground font-mono">
              <Clock size={13} className="text-foreground/70" />
              <span>Hiệu lực từ: 01/09/2026 • Phiên bản 1.2.0</span>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sticky Table of Contents */}
          <aside className="md:col-span-4 lg:col-span-3.5 md:sticky md:top-24 space-y-3 border border-border/80 bg-card/60 backdrop-blur-md rounded-md p-4 sm:p-5 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2 border-b border-border/40 pb-2.5">
              <Sparkles size={13} className="text-yellow-400" />
              Mục lục quy định
            </h2>

            <nav className="space-y-1">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon
                const isActive = activeSection === sec.id

                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-semibold text-left transition-all cursor-pointer",
                      isActive
                        ? "bg-foreground! text-background! font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/20"
                    )}
                  >
                    <Icon size={14} className="shrink-0" />
                    <span className="truncate">{sec.title}</span>
                  </button>
                )
              })}
            </nav>

            <div className="pt-3 border-t border-border/30 text-[10px] text-muted-foreground leading-relaxed">
              Cần hỗ trợ giải đáp thắc mắc? Liên hệ{" "}
              <Link href="#" className="text-foreground font-bold hover:underline">
                Ban Quản Trị
              </Link>
            </div>
          </aside>

          {/* Right Column: Detailed Policy Articles */}
          <div className="md:col-span-8 lg:col-span-8.5 space-y-8">
            
            {/* Section 1 */}
            <article
              id="section-1"
              className="border border-border/80 bg-card/45 rounded-md p-6 sm:p-8 space-y-4 scroll-mt-24 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Scale className="size-5 text-foreground" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                  1. Chấp Thuận Điều Khoản & Đối Tượng Sử Dụng
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                <p>
                  Khi truy cập hoặc đăng ký tài khoản tại <strong>Haruko Light Novel</strong>, người dùng được coi là đã đọc, hiểu và đồng ý hoàn toàn với toàn bộ các điều khoản được nêu tại đây cùng với Chính sách Bảo mật của chúng tôi.
                </p>
                <p>
                  Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng dịch vụ và không đăng tải nội dung lên hệ thống.
                </p>
                <div className="p-3.5 rounded-xl bg-accent/20 border border-border/60 text-xs text-muted-foreground space-y-1">
                  <span className="font-bold text-foreground block">Độ tuổi quy định:</span>
                  Nền tảng phục vụ cho độc giả từ đủ 13 tuổi trở lên. Đối với các tác phẩm có nhãn phân loại độ tuổi (16+ / 18+), người dùng phải tự chịu trách nhiệm về hành vi truy cập của mình.
                </div>
              </div>
            </article>

            {/* Section 2 */}
            <article
              id="section-2"
              className="border border-border/80 bg-card/45 rounded-md p-6 sm:p-8 space-y-4 scroll-mt-24 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Lock className="size-5 text-foreground" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                  2. Tài Khoản Người Dùng & Bảo Mật
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Tính chính xác:</strong> Người dùng có trách nhiệm cung cấp thông tin chính xác (Email, Tên người dùng) khi đăng ký.
                  </li>
                  <li>
                    <strong className="text-foreground">Bảo vệ mật khẩu:</strong> Bạn có nghĩa vụ tự bảo quản mật khẩu tài khoản của mình. Haruko không chịu trách nhiệm đối với bất kỳ tổn thất nào phát sinh do việc chia sẻ tài khoản cho bên thứ ba.
                  </li>
                  <li>
                    <strong className="text-foreground">Tên hiển thị & Avatar:</strong> Tên người dùng và ảnh đại diện không được chứa từ ngữ tục tĩu, xúc phạm danh dự cá nhân, tổ chức, tôn giáo hoặc chính trị.
                  </li>
                </ul>
              </div>
            </article>

            {/* Section 3 */}
            <article
              id="section-3"
              className="border border-border/80 bg-card/45 rounded-md p-6 sm:p-8 space-y-4 scroll-mt-24 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <BookOpen className="size-5 text-foreground" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                  3. Quy Định Về Dịch Thuật & Bản Quyền
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                <p>
                  Haruko là nền tảng chia sẻ và lưu trữ Light Novel phi thương mại được vận hành bởi cộng đồng những người đam mê văn học mạng Nhật Bản / Châu Á.
                </p>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-400 uppercase tracking-wider">
                    <AlertTriangle size={14} />
                    Tôn trọng bản quyền tác giả gốc:
                  </div>
                  <p>
                    Tất cả bản dịch truyện (Human Trans & AI Trans) đều thuộc quyền sở hữu trí tuệ của tác giả và nhà xuất bản gốc. Các nhóm dịch hoạt động với mục đích phi lợi nhuận nhằm quảng bá tác phẩm tới độc giả Việt Nam.
                  </p>
                </div>
                <p>
                  Nếu một bộ truyện đã được mua bản quyền phát hành chính thức tại Việt Nam (Licensed), Haruko sẽ lập tức khóa hoặc gỡ bỏ các chương tương ứng theo yêu cầu của đơn vị sở hữu bản quyền hợp pháp.
                </p>
              </div>
            </article>

            {/* Section 4 */}
            <article
              id="section-4"
              className="border border-border/80 bg-card/45 rounded-md p-6 sm:p-8 space-y-4 scroll-mt-24 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Users className="size-5 text-foreground" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                  4. Quyền & Trách Nhiệm Của Nhóm Dịch (Translator)
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Quyền quản lý tập & chương:</strong> Nhóm dịch có toàn quyền chỉnh sửa, thêm ảnh minh họa cho Volume, cập nhật hoặc ẩn các chương truyện do mình đăng tải.
                  </li>
                  <li>
                    <strong className="text-foreground">Ghi nguồn minh bạch:</strong> Phải ghi rõ thông tin tác giả, họa sĩ và nguồn bản quyền gốc (Raw / English source) trong phần thông tin truyện.
                  </li>
                  <li>
                    <strong className="text-foreground">Nghiêm cấm Re-up trái phép:</strong> Không được sao chép chất xám, bê nguyên bản dịch từ các nhóm dịch khác khi chưa có sự đồng ý của dịch giả gốc.
                  </li>
                </ul>
              </div>
            </article>

            {/* Section 5 */}
            <article
              id="section-5"
              className="border border-border/80 bg-card/45 rounded-md p-6 sm:p-8 space-y-4 scroll-mt-24 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <ShieldAlert className="size-5 text-foreground" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                  5. Các Hành Vi Bị Nghiêm Cấm
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                <p>Nghiêm cấm các hành vi sau đây trên toàn bộ nền tảng Haruko:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-accent/15 border border-border/40 space-y-1">
                    <span className="text-xs font-bold text-rose-500 block">1. Độc hại & Xúc phạm:</span>
                    <span className="text-[11px] text-muted-foreground block">
                      Lăng mạ nhóm dịch, xúc phạm danh dự người dùng khác trong khu vực bình luận.
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-accent/15 border border-border/40 space-y-1">
                    <span className="text-xs font-bold text-rose-500 block">2. Spam & Quảng cáo:</span>
                    <span className="text-[11px] text-muted-foreground block">
                      Spam link cờ bạc, lừa đảo hoặc dẫn link sang website thương mại trái phép.
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-accent/15 border border-border/40 space-y-1">
                    <span className="text-xs font-bold text-rose-500 block">3. Phá hoại hệ thống:</span>
                    <span className="text-[11px] text-muted-foreground block">
                      Tấn công DDOS, dùng bot crawl dữ liệu gây quá tải hoặc khai thác lỗ hổng bảo mật.
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-accent/15 border border-border/40 space-y-1">
                    <span className="text-xs font-bold text-rose-500 block">4. Nội dung đồi trụy:</span>
                    <span className="text-[11px] text-muted-foreground block">
                      Đăng tải hình ảnh khiêu dâm cực đoan hoặc vi phạm thuần phong mỹ tục.
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 6 */}
            <article
              id="section-6"
              className="border border-border/80 bg-card/45 rounded-md p-6 sm:p-8 space-y-4 scroll-mt-24 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <AlertTriangle className="size-5 text-foreground" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                  6. Cơ Chế Xử Lý Vi Phạm & Khóa Tài Khoản
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                <p>Tùy theo mức độ vi phạm, Ban Quản Trị Haruko có quyền áp dụng các biện pháp:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground">
                  <li>Cảnh cáo trực tiếp qua hòm thư thông báo.</li>
                  <li>Xóa bình luận, bài đánh giá hoặc gỡ bỏ chương truyện vi phạm mà không cần báo trước.</li>
                  <li>Khóa tài khoản tạm thời (3 ngày, 7 ngày, 30 ngày) hoặc vĩnh viễn (Perma-ban).</li>
                </ol>
              </div>
            </article>

            {/* Section 7 */}
            <article
              id="section-7"
              className="border border-border/80 bg-card/45 rounded-md p-6 sm:p-8 space-y-4 scroll-mt-24 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <HelpCircle className="size-5 text-foreground" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                  7. Miễn Trừ Trách Nhiệm & Thay Đổi Điều Khoản
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                <p>
                  Haruko có quyền cập nhật, chỉnh sửa các điều khoản này vào bất kỳ lúc nào để phù hợp với định hướng phát triển của nền tảng và quy định pháp luật hiện hành.
                </p>
                <p>
                  Mọi thay đổi sẽ có hiệu lực ngay khi được đăng tải trên trang này. Việc bạn tiếp tục sử dụng Haruko đồng nghĩa với việc chấp thuận các điều khoản sửa đổi đó.
                </p>
              </div>
            </article>

          </div>
        </div>

      </main>
    </div>
  )
}
