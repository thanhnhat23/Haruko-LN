"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowLeft, Mail, Send } from "lucide-react"

interface ForgotPasswordFormProps {
  onSwitchView: (view: "login") => void
}

export function ForgotPasswordForm({ onSwitchView }: ForgotPasswordFormProps) {
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="w-full">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground uppercase">
          Quên mật khẩu
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
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-3 text-center">
            <CheckCircle2 className="h-12 w-12 text-foreground animate-pulse" />
            <p className="text-sm text-muted-foreground">
              Liên kết khôi phục mật khẩu đã được gửi thành công.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="bg-background py-4 border-border text-foreground placeholder-muted-foreground/60 focus-visible:ring-0 focus-visible:border-foreground focus:ring-offset-0 transition-colors"
              />
            </div>
            <Button type="submit" className="w-full gap-2 bg-foreground hover:bg-foreground/90 text-background font-bold tracking-wide uppercase transition-all duration-200 active:scale-[0.98] py-4 cursor-pointer">
              <Send size={16} />
              Xác nhận
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="justify-center border-t border-border pt-2">
        <button
          onClick={() => onSwitchView("login")}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Quay lại Đăng nhập
        </button>
      </CardFooter>
    </div>
  )
}
