"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Home,
  ChevronRight,
  Shield,
  Eye,
  Database,
  Cookie,
  Share2,
  UserCheck,
  Mail,
  Clock,
  Sparkles,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"

const POLICY_SECTIONS = [
  { id: "policy-1", title: "1. Thông tin chúng tôi thu thập", icon: Eye },
  { id: "policy-2", title: "2. Mục đích sử dụng dữ liệu", icon: Database },
  { id: "policy-3", title: "3. Lưu trữ & Mã hóa an toàn", icon: Lock },
  { id: "policy-4", title: "4. Cookies & Lưu trữ cục bộ", icon: Cookie },
  { id: "policy-5", title: "5. Chia sẻ với bên thứ ba", icon: Share2 },
  { id: "policy-6", title: "6. Quyền lợi & Xóa dữ liệu", icon: UserCheck },
  { id: "policy-7", title: "7. Liên hệ & Cập nhật", icon: Mail },
]

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("policy-1")

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
          <span className="text-foreground font-bold">Chính sách bảo mật</span>
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
              <Shield size={11} className="text-zinc-400" />
              Quyền riêng tư & Dữ liệu
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-foreground uppercase tracking-tight leading-tight">
              Chính Sách Bảo Mật
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
              Tại Haruko Light Novel, chúng tôi tôn trọng và cam kết bảo vệ tuyệt đối quyền riêng tư và an toàn dữ liệu cá nhân của mọi độc giả cũng như dịch giả tham gia đóng góp trên nền tảng.
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
              Mục lục chính sách
            </h2>

            <nav className="space-y-1">
              {POLICY_SECTIONS.map((sec) => {
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
              Bạn có câu hỏi về quyền riêng tư? Gửi email tới{" "}
              <span className="text-foreground font-mono font-bold">
                privacy@haruko.vn
              </span>
            </div>
          </aside>

          {/* Right Column: Detailed Policy Articles */}
          <div className="md:col-span-8 lg:col-span-8.5 space-y-8">
            
            {/* Policy Section 1 */}
            <article
              id="policy-1"
              className="border border-border/80 bg-card/45 rounded-md p-6 sm:p-8 space-y-4 scroll-mt-24 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Eye className="size-5 text-foreground" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                  1. Thông Tin Chúng Tôi Thu Thập
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                <p>Chúng tôi chỉ thu thập các dữ liệu cần thiết phục vụ cho quá trình đọc và sử dụng dịch vụ:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Thông tin tài khoản:</strong> Địa chỉ email, tên hiển thị (Username), ngày sinh và ảnh đại diện (Avatar).
                  </li>
                  <li>
                    <strong className="text-foreground">Lịch sử đọc & Tiến độ (Reading_History):</strong> Danh sách truyện vừa đọc, chương đang đọc dở và vị trí phần trăm cuộn trang để đồng bộ trải nghiệm khi đọc lại.
                  </li>
                  <li>
                    <strong className="text-foreground">Tương tác người dùng:</strong> Danh sách truyện yêu thích (Bookmarks), truyện đang theo dõi (Following), điểm đánh giá (Rating) và các nội dung bình luận (Comments).
                  </li>
                  <li>
                    <strong className="text-foreground">Dữ liệu kỹ thuật:</strong> Địa chỉ IP ẩn danh, loại trình duyệt và thiết bị truy cập để tối ưu hiển thị giao diện.
                  </li>
                </ul>
              </div>
            </article>

            {/* Policy Section 2 */}
            <article
              id="policy-2"
              className="border border-border/80 bg-card/45 rounded-md p-6 sm:p-8 space-y-4 scroll-mt-24 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Database className="size-5 text-foreground" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                  2. Mục Đích Sử Dụng Dữ Liệu
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                <p>Thông tin thu thập được sử dụng duy nhất cho các mục đích sau:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground">
                  <li>Cung cấp và duy trì hoạt động ổn định của nền tảng đọc truyện Haruko.</li>
                  <li>Tự động lưu và khôi phục tiến độ đọc chương trên mọi thiết bị bạn đăng nhập.</li>
                  <li>Gửi thông báo khi truyện bạn theo dõi có chương mới hoặc có người trả lời bình luận của bạn.</li>
                  <li>Ngăn chặn các hành vi gian lận, spam, quấy rối hoặc tấn công mạng.</li>
                </ol>
              </div>
            </article>

            {/* Policy Section 3 */}
            <article
              id="policy-3"
              className="border border-border/80 bg-card/45 rounded-md p-6 sm:p-8 space-y-4 scroll-mt-24 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Lock className="size-5 text-foreground" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                  3. Lưu Trữ & Bảo Mật Dữ Liệu
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                <p>
                  Haruko áp dụng các tiêu chuẩn bảo mật kỹ thuật số hiện đại để bảo vệ dữ liệu cá nhân của bạn:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-accent/15 border border-border/40 space-y-1">
                    <span className="text-xs font-bold text-foreground block">Mã hóa mật khẩu:</span>
                    <span className="text-[11px] text-muted-foreground block">
                      Toàn bộ mật khẩu được mã hóa một chiều bằng thuật toán băm Bcrypt/Argon2. Quản trị viên không thể đọc mật khẩu gốc của bạn.
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-accent/15 border border-border/40 space-y-1">
                    <span className="text-xs font-bold text-foreground block">Giao thức HTTPS:</span>
                    <span className="text-[11px] text-muted-foreground block">
                      100% lưu lượng truyền tải giữa trình duyệt của bạn và máy chủ Haruko đều được bảo vệ qua kết nối mã hóa SSL/TLS.
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Policy Section 4 */}
            <article
              id="policy-4"
              className="border border-border/80 bg-card/45 rounded-md p-6 sm:p-8 space-y-4 scroll-mt-24 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Cookie className="size-5 text-foreground" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                  4. Cookies & Lưu Trữ Cục Bộ (Local Storage)
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                <p>
                  Chúng tôi sử dụng Cookies và Local Storage trên trình duyệt để ghi nhớ:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Tùy chọn giao diện Sáng / Tối (Theme Light / Dark).</li>
                  <li>Kích thước chữ, kiểu phông chữ và màu nền trình đọc chương truyện.</li>
                  <li>Phiên đăng nhập an toàn (Session token).</li>
                </ul>
                <p className="text-xs text-muted-foreground pt-1">
                  Bạn có thể xóa Cookies bất kỳ lúc nào trong phần cài đặt của trình duyệt.
                </p>
              </div>
            </article>

            {/* Policy Section 5 */}
            <article
              id="policy-5"
              className="border border-border/80 bg-card/45 rounded-md p-6 sm:p-8 space-y-4 scroll-mt-24 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Share2 className="size-5 text-foreground" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                  5. Cam Kết Không Bán Dữ Liệu & Chia Sẻ Bên Thứ Ba
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold text-xs space-y-1">
                  <span className="font-bold text-emerald-400 block uppercase tracking-wider">
                    Cam kết bảo mật 100%:
                  </span>
                  Chúng tôi cam kết KHÔNG BAO GIỜ bán, trao đổi hoặc cho thuê thông tin cá nhân của bạn cho bất kỳ công ty quảng cáo hay bên thứ ba nào.
                </div>
                <p className="text-muted-foreground text-xs">
                  Thông tin chỉ có thể được cung cấp cho cơ quan chức năng có thẩm quyền trong trường hợp có yêu cầu pháp lý chính thức theo quy định của pháp luật.
                </p>
              </div>
            </article>

            {/* Policy Section 6 */}
            <article
              id="policy-6"
              className="border border-border/80 bg-card/45 rounded-md p-6 sm:p-8 space-y-4 scroll-mt-24 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <UserCheck className="size-5 text-foreground" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                  6. Quyền Lợi Của Người Dùng & Quyền Xóa Dữ Liệu
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                <p>Bạn có toàn quyền kiểm soát dữ liệu cá nhân của mình:</p>
                <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                  <li>Xem, chỉnh sửa thông tin hồ sơ và đổi mật khẩu trong mục Cài đặt tài khoản.</li>
                  <li>Tùy ý xóa lịch sử đọc truyện hoặc danh sách theo dõi.</li>
                  <li>
                    <strong className="text-foreground">Quyền được lãng quên:</strong> Bạn có thể gửi yêu cầu xóa tài khoản vĩnh viễn cùng toàn bộ dữ liệu liên quan khỏi cơ sở dữ liệu Haruko bất kỳ lúc nào.
                  </li>
                </ul>
              </div>
            </article>

            {/* Policy Section 7 */}
            <article
              id="policy-7"
              className="border border-border/80 bg-card/45 rounded-md p-6 sm:p-8 space-y-4 scroll-mt-24 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Mail className="size-5 text-foreground" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                  7. Thông Tin Liên Hệ & Cập Nhật Chính Sách
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                <p>
                  Mọi thắc mắc, khiếu nại hoặc yêu cầu liên quan đến quyền riêng tư, vui lòng liên hệ với Đội ngũ Bảo mật Haruko:
                </p>
                <div className="p-3 rounded-lg bg-accent/20 border border-border/60 text-xs space-y-1 font-mono">
                  <div>Email: <strong className="text-foreground">privacy@haruko.vn</strong></div>
                  <div>Discord Cộng Đồng: <strong className="text-foreground">discord.gg/haruko-ln</strong></div>
                </div>
              </div>
            </article>

          </div>
        </div>

      </main>
    </div>
  )
}
