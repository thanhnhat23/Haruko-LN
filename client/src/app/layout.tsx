import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Haruko Light Novel",
  description: "A modern platform for reading, discovering, and managing Light Novels.",
};

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300 font-sans"
      >
        <TooltipProvider delay={150}>
          <Navbar />
          {children}
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
