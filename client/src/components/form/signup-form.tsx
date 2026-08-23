"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, CalendarIcon, User, KeyRound, Mail, LogIn } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { IconBrandFacebook, IconBrandX, IconBrandDiscord, IconBrandGoogle } from '@tabler/icons-react';

interface SignUpFormProps {
  onSwitchView: (view: "login") => void
}

export function SignUpForm({ onSwitchView }: SignUpFormProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [showCalendar, setShowCalendar] = React.useState(false)
  const calendarRef = React.useRef<HTMLDivElement>(null)

  // Close calendar when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="w-full">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground uppercase">
          Đăng ký
          <Image 
            src="/haruko.png"
            alt="Logo"
            width={80}
            height={80}
            className="mx-auto mb-2"
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-muted-foreground text-xs font-semibold uppercase tracking-normal">
              <User size={14} />
              Tên người dùng
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="haruko_LN"
              required
              className="bg-background border-border py-4 text-foreground placeholder-muted-foreground/60 focus-visible:ring-0 focus-visible:border-foreground focus:ring-offset-0 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground text-xs font-semibold uppercase tracking-normal">
              <Mail size={14} />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              className="bg-background border-border py-4 text-foreground placeholder-muted-foreground/60 focus-visible:ring-0 focus-visible:border-foreground focus:ring-offset-0 transition-colors"
            />
          </div>
          
          {/* Calendar Date of Birth Field */}
          <div className="space-y-2 relative" ref={calendarRef}>
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-normal">
              <CalendarIcon size={14} />
              Ngày sinh
            </Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full bg-background border-border py-4 text-left justify-between text-muted-foreground hover:text-foreground hover:bg-accent/40 font-normal focus:border-foreground"
            >
              <span>{date ? date.toLocaleDateString("vi-VN") : "Chọn ngày sinh của bạn"}</span>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </Button>

            {showCalendar && (
              <div className="absolute left-0 right-0 z-30 mt-1 bg-popover border border-border rounded-md p-2 shadow-2xl flex justify-center">
                <Calendar
                  mode="single"
                  captionLayout="dropdown-years"
                  startMonth={new Date(1980, 0)}
                  endMonth={new Date()}
                  selected={date}
                  onSelect={(d) => {
                    setDate(d)
                    setShowCalendar(false)
                  }}
                  className="bg-popover text-popover-foreground rounded-md"
                  classNames={{
                    today: "bg-accent text-accent-foreground rounded-md",
                    selected: "bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/95"
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground text-xs font-semibold uppercase tracking-normal">
              <KeyRound size={14} />
              Mật khẩu
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Nhập mật khẩu"
                className="bg-background border-border py-4 text-foreground placeholder-muted-foreground/60 focus-visible:ring-0 focus-visible:border-foreground focus:ring-offset-0 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-muted-foreground text-xs font-semibold uppercase tracking-normal">
              <KeyRound size={14} />
              Xác nhận mật khẩu
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Nhập lại mật khẩu"
                className="bg-background border-border py-4 text-foreground placeholder-muted-foreground/60 focus-visible:ring-0 focus-visible:border-foreground focus:ring-offset-0 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full bg-foreground hover:bg-foreground/90 text-background font-bold tracking-wide uppercase transition-all duration-200 active:scale-[0.98] py-4 cursor-pointer gap-2 mb-4">
            <LogIn />
            Đăng ký
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground tracking-wider">Hoặc</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button type="button" variant="outline" className="bg-background font-bold border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200 cursor-pointer flex items-center justify-center p-4">
            <IconBrandGoogle stroke={2} className="size-4 mr-2"/>
            Google
          </Button>
          <Button type="button" variant="outline" className="bg-background font-bold border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200 cursor-pointer flex items-center justify-center p-4">
            <IconBrandDiscord stroke={2} className="size-4 mr-2"/>
            Discord
          </Button>
          <Button type="button" variant="outline" className="bg-background font-bold border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200 cursor-pointer flex items-center justify-center p-4">
            <IconBrandFacebook stroke={2} className="size-4 mr-2"/>
            Facebook
          </Button>
          <Button type="button" variant="outline" className="bg-background font-bold border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200 cursor-pointer flex items-center justify-center p-4">
            <IconBrandX stroke={2} className="size-4 mr-2"/>
            Twitter
          </Button>
        </div>
      </CardContent>

      <CardFooter className="justify-center border-t border-border pt-2">
        <p className="text-sm text-muted-foreground mt-4">
          Đã có tài khoản?{" "}
          <button
            onClick={() => onSwitchView("login")}
            className="text-foreground text-sm hover:underline font-semibold transition-colors cursor-pointer"
          >
            Đăng nhập
          </button>
        </p>
      </CardFooter>
    </div>
  )
}
