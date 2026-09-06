"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function LoginFormSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full space-y-6 select-none", className)}>
      {/* Header: Logo & Title */}
      <div className="space-y-3 text-center flex flex-col items-center">
        <Skeleton className="size-16 rounded-full mx-auto" />
        <Skeleton className="h-6 w-32 rounded-xs" />
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3.5 rounded-xs" />
            <Skeleton className="h-3 w-12 rounded-xs" />
          </div>
          <Skeleton className="h-11 w-full rounded-md bg-background border border-border/40" />
        </div>

        {/* Password Field & Forgot Link */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Skeleton className="size-3.5 rounded-xs" />
              <Skeleton className="h-3 w-16 rounded-xs" />
            </div>
            <Skeleton className="h-3 w-20 rounded-xs" />
          </div>
          <Skeleton className="h-11 w-full rounded-md bg-background border border-border/40" />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Skeleton className="h-11 w-full rounded-lg bg-foreground/20" />
        </div>

        {/* Divider with Text */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="w-full border-t border-border/60" />
          <Skeleton className="h-3 w-36 px-2 bg-card z-10 rounded-xs absolute" />
        </div>

        {/* Social Login 4 Buttons */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-10 rounded-lg border border-border/60 bg-accent/20"
            />
          ))}
        </div>
      </div>

      {/* Footer Signup Link */}
      <div className="pt-2 flex justify-center">
        <Skeleton className="h-3.5 w-48 rounded-xs" />
      </div>
    </div>
  )
}

export function SignupFormSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full space-y-6 select-none", className)}>
      {/* Header: Logo & Title */}
      <div className="space-y-3 text-center flex flex-col items-center">
        <Skeleton className="size-16 rounded-full mx-auto" />
        <Skeleton className="h-6 w-28 rounded-xs" />
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Username Field */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3.5 rounded-xs" />
            <Skeleton className="h-3 w-24 rounded-xs" />
          </div>
          <Skeleton className="h-11 w-full rounded-md bg-background border border-border/40" />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3.5 rounded-xs" />
            <Skeleton className="h-3 w-12 rounded-xs" />
          </div>
          <Skeleton className="h-11 w-full rounded-md bg-background border border-border/40" />
        </div>

        {/* Birthdate Field */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3.5 rounded-xs" />
            <Skeleton className="h-3 w-20 rounded-xs" />
          </div>
          <Skeleton className="h-11 w-full rounded-md bg-background border border-border/40" />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3.5 rounded-xs" />
            <Skeleton className="h-3 w-16 rounded-xs" />
          </div>
          <Skeleton className="h-11 w-full rounded-md bg-background border border-border/40" />
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3.5 rounded-xs" />
            <Skeleton className="h-3 w-32 rounded-xs" />
          </div>
          <Skeleton className="h-11 w-full rounded-md bg-background border border-border/40" />
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="size-4 rounded-xs shrink-0" />
          <Skeleton className="h-3 w-56 rounded-xs" />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Skeleton className="h-11 w-full rounded-lg bg-foreground/20" />
        </div>

        {/* Divider with Text */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="w-full border-t border-border/60" />
          <Skeleton className="h-3 w-36 px-2 bg-card z-10 rounded-xs absolute" />
        </div>

        {/* Social Login 4 Buttons */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-10 rounded-lg border border-border/60 bg-accent/20"
            />
          ))}
        </div>
      </div>

      {/* Footer Login Link */}
      <div className="pt-2 flex justify-center">
        <Skeleton className="h-3.5 w-44 rounded-xs" />
      </div>
    </div>
  )
}

export function ForgotPasswordFormSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full space-y-6 select-none", className)}>
      {/* Header: Logo & Title */}
      <div className="space-y-3 text-center flex flex-col items-center">
        <Skeleton className="size-16 rounded-full mx-auto" />
        <Skeleton className="h-6 w-36 rounded-xs" />
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3.5 rounded-xs" />
            <Skeleton className="h-3 w-12 rounded-xs" />
          </div>
          <Skeleton className="h-11 w-full rounded-md bg-background border border-border/40" />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Skeleton className="h-11 w-full rounded-lg bg-foreground/20" />
        </div>
      </div>

      {/* Footer Back to Login Link */}
      <div className="pt-2 flex justify-center">
        <Skeleton className="h-3.5 w-32 rounded-xs" />
      </div>
    </div>
  )
}

export function AuthFormCardSkeleton({
  type = "login",
  className,
}: {
  type?: "login" | "signup" | "forgot-password"
  className?: string
}) {
  return (
    <div
      className={cn(
        "max-w-md w-full bg-card/85 border border-border/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md select-none",
        className
      )}
    >
      {type === "login" && <LoginFormSkeleton />}
      {type === "signup" && <SignupFormSkeleton />}
      {type === "forgot-password" && <ForgotPasswordFormSkeleton />}
    </div>
  )
}

export function GenericFormSkeleton({
  fieldsCount = 3,
  hasTextarea = true,
  hasSubmit = true,
  className,
}: {
  fieldsCount?: number
  hasTextarea?: boolean
  hasSubmit?: boolean
  className?: string
}) {
  return (
    <div className={cn("w-full space-y-4 select-none", className)}>
      {Array.from({ length: fieldsCount }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3.5 w-24 rounded-xs" />
          <Skeleton className="h-10 w-full rounded-md bg-background border border-border/40" />
        </div>
      ))}

      {hasTextarea && (
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-28 rounded-xs" />
          <Skeleton className="h-24 w-full rounded-md bg-background border border-border/40" />
        </div>
      )}

      {hasSubmit && (
        <div className="pt-2 flex justify-end gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg bg-foreground/20" />
        </div>
      )}
    </div>
  )
}
