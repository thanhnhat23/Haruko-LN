"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface CommentMarkdownProps {
  content: string
  className?: string
}

// Interactive Spoiler Component for Light Novel Spoilers
function SpoilerSpan({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <span
      onClick={(e) => {
        e.stopPropagation()
        setRevealed(!revealed)
      }}
      title={revealed ? "Nhấn để ẩn spoiler" : "Nhấn để xem spoiler"}
      className={cn(
        "cursor-pointer rounded-xs px-1.5 py-0.5 transition-all duration-200 inline-block text-xs select-none",
        revealed
          ? "bg-zinc-500/15 text-foreground border border-zinc-500/30"
          : "bg-zinc-800 text-transparent hover:bg-zinc-700 select-none shadow-xs"
      )}
    >
      {children}
    </span>
  )
}

export function CommentMarkdown({ content, className }: CommentMarkdownProps) {
  const renderFormattedContent = (text: string) => {
    const parts = text.split(/(\|\|[\s\S]*?\|\|)/g)

    return parts.map((part, index) => {
      if (part.startsWith("||") && part.endsWith("||") && part.length >= 4) {
        const spoilerText = part.slice(2, -2)
        return (
          <SpoilerSpan key={index}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              urlTransform={(url) => url}
              components={{
                p: ({ children }) => <span className="inline">{children}</span>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                del: ({ children }) => <del className="line-through">{children}</del>,
                code: ({ children }) => (
                  <code className="px-1 py-0.5 rounded-sm bg-accent/40 font-mono text-[11px]">
                    {children}
                  </code>
                ),
              }}
            >
              {spoilerText}
            </ReactMarkdown>
          </SpoilerSpan>
        )
      }

      return (
        <ReactMarkdown
          key={index}
          remarkPlugins={[remarkGfm]}
          urlTransform={(url) => url}
          components={{
            p: ({ children }) => (
              <span className="leading-relaxed whitespace-pre-line inline my-0.5">
                {children}
              </span>
            ),
            strong: ({ children }) => (
              <strong className="font-extrabold text-foreground">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-foreground/95">{children}</em>
            ),
            del: ({ children }) => (
              <del className="line-through text-muted-foreground">{children}</del>
            ),
            code: ({ inline, className, children, ...props }: any) => {
              return !inline ? (
                <pre className="mr-4 p-2 my-2 rounded-xl bg-zinc-800 text-zinc-100 text-xs font-mono overflow-x-auto border border-border/80">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code
                  className="px-1.5 py-0.5 mx-0.5 rounded-md bg-accent/40 dark:bg-zinc-800 text-[11px] font-mono text-emerald-500 font-semibold"
                  {...props}
                >
                  {children}
                </code>
              )
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-3 border-emerald-500/80 bg-accent/20 dark:bg-zinc-900/50 pl-3 py-1 my-1.5 rounded-r-lg text-muted-foreground italic text-xs">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <Link
                href={href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-500 hover:text-emerald-400 font-bold underline underline-offset-2 inline-flex items-center gap-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                {children}
              </Link>
            ),
            img: ({ src }) => {
              if (!src) return null
              const imageSrc = typeof src === "string" ? src : ""
              const isDataUrl = imageSrc.startsWith("data:") || imageSrc.startsWith("blob:")

              const imageNode = (
                <Image
                  src={imageSrc}
                  alt=""
                  width={1200}
                  height={800}
                  unoptimized
                  className="max-h-[70vh] w-auto h-auto object-contain mx-auto rounded-xs transition-transform duration-200 group-hover:scale-[1.01]"
                />
              )

              return (
                <span className="block my-4 text-center select-none">
                  {isDataUrl ? (
                    <span className="inline-block group relative rounded-xs overflow-hidden border border-border/80 shadow-xs">
                      {imageNode}
                    </span>
                  ) : (
                    <Link
                      href={imageSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block group relative cursor-zoom-in rounded-xs overflow-hidden border border-border/80 hover:border-emerald-500/70 transition-all shadow-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {imageNode}
                    </Link>
                  )}
                </span>
              )
            },
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-1 my-1 pl-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1 my-1 pl-2">{children}</ol>
            ),
            h1: ({ children }) => (
              <h1 className="text-base font-black text-foreground my-1">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-sm font-bold text-foreground my-1">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xs font-bold text-foreground my-0.5">{children}</h3>
            ),
          }}
        >
          {part}
        </ReactMarkdown>
      )
    })
  }

  return (
    <div className={cn("text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal", className)}>
      {renderFormattedContent(content)}
    </div>
  )
}
