"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { LoginForm } from "@/components/form/login-form"
import { SignUpForm } from "@/components/form/signup-form"
import { ForgotPasswordForm } from "@/components/form/forgot-password-form"
import Image from "next/image"

type AuthView = "login" | "signup" | "forgot-password"

export default function AuthenticationPage() {
  const [view, setView] = useState<AuthView>("login")

  const isReverse = view === "login"

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-hidden flex flex-col md:flex-row transition-colors duration-300">
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className={`flex flex-col md:flex-row w-full min-h-screen ${isReverse ? "md:flex-row-reverse" : "md:flex-row"}`}
      >
        {/* Left/Right Background Image Section */}
        <motion.div 
          layout="position"
          className={`w-full md:w-1/2 h-[30vh] md:h-screen relative bg-card md:border-border overflow-hidden ${isReverse ? "md:border-l" : "md:border-r"}`}
        >
          <Image
            src="https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif"
            alt="Authentication Background"
            className="w-full h-full object-cover opacity-75 dark:opacity-60"
            width={1500}
            height={1500}
            priority
          />
          {/* Overlay to darken image and blend it using theme-aware colors */}
          <div className={`absolute inset-0 bg-linear-to-t ${isReverse ? "md:bg-linear-to-r" : "md:bg-linear-to-l"} from-background via-background/25 to-transparent pointer-events-none`} />
          
          {/* Branding overlay */}
          <div className={`absolute bottom-6 ${!isReverse ? "left-6" : "right-6"} z-10 hidden md:block`}>
            <h1 className="text-foreground text-3xl font-black tracking-widest uppercase mb-1 drop-shadow-md">
              Haruko
            </h1>
            <p className={`text-muted-foreground text-xs tracking-wider uppercase font-semibold ${!isReverse ? "text-left" : "text-right"}`}>Light Novel</p>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div 
          layout="position"
          className="w-full md:w-1/2 min-h-[70vh] md:h-screen flex items-center justify-center bg-background px-4 py-8 md:p-12 relative overflow-y-auto"
        >
          {/* Stark minimal monochrome dot pattern background with drift animation */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes dot-drift {
              from { background-position: 0px 0px; }
              to { background-position: 24px 24px; }
            }
          `}} />
          <div 
            className="absolute inset-0 pointer-events-none text-foreground/10" 
            style={{
              backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
              maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
              animation: "dot-drift 25s linear infinite"
            }}
          />

          <div className="w-full max-w-100 bg-card border border-border rounded-lg p-6 sm:p-8 shadow-xl z-10">
            <AnimatePresence mode="wait" initial={false}>
              {view === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <LoginForm onSwitchView={setView} />
                </motion.div>
              )}

              {view === "signup" && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <SignUpForm onSwitchView={() => setView("login")} />
                </motion.div>
              )}

              {view === "forgot-password" && (
                <motion.div
                  key="forgot-password"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ForgotPasswordForm onSwitchView={() => setView("login")} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
