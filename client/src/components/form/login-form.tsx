"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, LogIn, KeyRound, Mail } from "lucide-react"
import { IconBrandFacebook, IconBrandX, IconBrandDiscord, IconBrandGoogle } from '@tabler/icons-react';

interface LoginFormProps {
  onSwitchView: (view: "signup" | "forgot-password") => void
}

export function LoginForm({ onSwitchView }: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="w-full">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground uppercase">
          Đăng nhập
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-muted-foreground text-xs font-semibold uppercase tracking-normal">
                <KeyRound size={14} />
                Mật khẩu
              </Label>
              <button
                type="button"
                onClick={() => onSwitchView("forgot-password")}
                className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>

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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full bg-foreground hover:bg-foreground/90 text-background font-bold tracking-wide uppercase transition-all duration-200 active:scale-[0.98] py-4 cursor-pointer gap-2">
            <LogIn />
            Đăng nhập
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
          Chưa có tài khoản?{" "}
          <button
            onClick={() => onSwitchView("signup")}
            className="text-foreground text-sm hover:underline font-semibold transition-colors cursor-pointer"
          >
            Đăng ký
          </button>
        </p>
      </CardFooter>
    </div>
  )
}
