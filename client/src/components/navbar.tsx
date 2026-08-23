"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { Search, Compass, MessageSquare, Info, Upload, MessageCircleWarning, ShieldKeyhole, ReceiptText, Users, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  // Initialize theme from localStorage on client side mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const initialTheme = savedTheme || "dark"
    setTheme(initialTheme)
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Listen to window scroll events to trigger scroll-to-hide behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = Math.abs(currentScrollY - lastScrollY)

      // Only toggle visibility if scrolled past 15px to avoid jittery trigger
      if (delta > 15) {
        if (currentScrollY > 60 && currentScrollY > lastScrollY) {
          setVisible(false)
          setMenuOpen(false) // Automatically close mobile menu on scroll down
        } else {
          setVisible(true)
        }
        setLastScrollY(currentScrollY)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Handle theme changes
  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: [0.5, 1, 0.5, 1] }}
      className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/30 backdrop-blur-xs transition-colors duration-300"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 relative">
        
        {/* Left Section: Logo & Brand */}
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
          <div className="relative w-12 h-12 overflow-hidden group-hover:border-foreground/40 transition-colors">
            <Image
              src="/haruko.png"
              alt="Haruko Logo"
              width={100}
              height={100}
              priority
              className="object-cover"
            />
          </div>
          <span className="text-xl font-black tracking-widest uppercase text-foreground transition-colors">
            Haruko
          </span>
        </Link>

        {/* Center Section: Navigation Menu */}
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-1">
              <NavigationMenuItem>
                <Link href="/danh-sach" className={`${navigationMenuTriggerStyle()} text-sm! font-bold! text-muted-foreground hover:text-foreground transition-colors bg-transparent hover:bg-accent/40 py-2 px-3 flex items-center`}>
                  <Compass className="size-4 mr-1" />
                  Danh sách
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/thao-luan" className={`${navigationMenuTriggerStyle()} text-sm! font-bold! text-muted-foreground hover:text-foreground transition-colors bg-transparent hover:bg-accent/40 py-2 px-3 flex items-center`}>
                  <MessageSquare className="size-4 mr-1" />
                  Thảo luận
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={`${navigationMenuTriggerStyle()} text-sm! font-bold! text-muted-foreground hover:text-foreground transition-colors bg-transparent hover:bg-accent/40 py-2 px-3`}>
                  <Info className="size-4 mr-1" />
                  Thông tin
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-50 bg-popover border border-border rounded-lg p-2 shadow-2xl flex flex-col gap-0.5">
                  <NavigationMenuLink href="/dang-truyen" className="text-muted-foreground text-sm! font-bold! hover:text-foreground hover:bg-accent/60 px-3 py-2 rounded-md transition-colors">
                    <Upload className="size-4 mr-2" />
                    Đăng truyện
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/gop-y" className="text-muted-foreground text-sm! font-bold! hover:text-foreground hover:bg-accent/60 px-3 py-2 rounded-md transition-colors">
                    <MessageCircleWarning className="size-4 mr-2" />
                    Góp ý - báo lỗi
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/chinh-sach" className="text-muted-foreground text-sm! font-bold! hover:text-foreground hover:bg-accent/60 px-3 py-2 rounded-md transition-colors">
                    <ShieldKeyhole className="size-4 mr-2" />
                    Chính sách bảo mật
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/dieu-khoan" className="text-muted-foreground text-sm! font-bold! hover:text-foreground hover:bg-accent/60 px-3 py-2 rounded-md transition-colors">
                    <ReceiptText className="size-4 mr-2" />
                    Điều khoản sử dụng
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/gioi-thieu" className="text-muted-foreground text-sm! font-bold! hover:text-foreground hover:bg-accent/60 px-3 py-2 rounded-md transition-colors">
                    <Users className="size-4 mr-2" />
                    Giới thiệu
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative hidden sm:block w-48 lg:w-60">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm truyện..."
              className="pl-8 bg-background border-border text-foreground placeholder-muted-foreground/60 h-9 text-xs focus-visible:ring-0 focus-visible:border-foreground focus:ring-offset-0 transition-colors w-full"
            />
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-center p-2 rounded-md border border-input hover:bg-accent/40 transition-colors w-9 h-9">
            {mounted ? (
              <AnimatedThemeToggler
                theme={theme}
                onThemeChange={handleThemeChange}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              />
            ) : (
              <div className="w-5 h-5" />
            )}
          </div>

          {/* Login Button */}
          <Link href="/authentication" onClick={() => setMenuOpen(false)}>
            <Button variant="outline" className="h-9 px-4 text-xs font-bold transition-all duration-300 hover:bg-foreground! hover:text-background! hover:scale-105 active:scale-95 cursor-pointer">
              Đăng nhập
            </Button>
          </Link>

          {/* Hamburger Menu Trigger for Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md border border-input hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-colors w-9 h-9 flex items-center justify-center cursor-pointer"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>

        {/* Mobile Slide-Down Menu Overlay */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 border-b border-border/80 bg-background/95 backdrop-blur-md shadow-2xl p-4 flex flex-col gap-4 z-40 transition-all duration-300">
            {/* Search Input for Mobile Menu */}
            <div className="relative w-full sm:hidden">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm truyện..."
                className="pl-8 bg-background border-border text-foreground placeholder-muted-foreground/60 h-9 text-xs focus-visible:ring-0 focus-visible:border-foreground w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Link 
                href="/danh-sach" 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent/60 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                <Compass className="size-4" />
                Danh sách
              </Link>
              <Link 
                href="/thao-luan" 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent/60 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                <MessageSquare className="size-4" />
                Thảo luận
              </Link>
              
              <div className="border-t border-border/40 my-1" />
              
              <Link 
                href="/dang-truyen" 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-muted-foreground/80 hover:text-foreground hover:bg-accent/60 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                <Upload className="size-4" />
                Đăng truyện
              </Link>
              <Link 
                href="/gop-y" 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-muted-foreground/80 hover:text-foreground hover:bg-accent/60 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                <MessageCircleWarning className="size-4" />
                Góp ý - báo lỗi
              </Link>
              <Link 
                href="/chinh-sach" 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-muted-foreground/80 hover:text-foreground hover:bg-accent/60 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                <ShieldKeyhole className="size-4" />
                Chính sách bảo mật
              </Link>
              <Link 
                href="/dieu-khoan" 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-muted-foreground/80 hover:text-foreground hover:bg-accent/60 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                <ReceiptText className="size-4" />
                Điều khoản sử dụng
              </Link>
              <Link 
                href="/gioi-thieu" 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-muted-foreground/80 hover:text-foreground hover:bg-accent/60 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                <Users className="size-4" />
                Giới thiệu
              </Link>
            </div>
          </div>
        )}

      </div>
    </motion.header>
  )
}
