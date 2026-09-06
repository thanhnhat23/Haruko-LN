"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

// Interactive Spoiler Component for Reader
function ReaderSpoilerSpan({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <span
      onClick={(e) => {
        e.stopPropagation()
        setRevealed(!revealed)
      }}
      title={revealed ? "Nhấn để ẩn spoiler" : "Nhấn để xem spoiler"}
      className={cn(
        "cursor-pointer rounded-xs px-1.5 py-0.5 transition-all duration-200 inline-block select-none",
        revealed
          ? "border opacity-100"
          : "select-none shadow-xs"
      )}
      style={{
        backgroundColor: revealed ? "var(--reader-card)" : "var(--reader-spoiler)",
        color: revealed ? "var(--reader-text)" : "transparent",
        borderColor: "var(--reader-border)",
      }}
    >
      {children}
    </span>
  )
}

export interface ChapterMarkdownReaderProps {
  content: string
  className?: string
}

export function ChapterMarkdownReader({
  content,
  className,
}: ChapterMarkdownReaderProps) {
  const renderFormattedContent = (text: string) => {
    const parts = text.split(/(\|\|[\s\S]*?\|\|)/g)

    return parts.map((part, index) => {
      if (part.startsWith("||") && part.endsWith("||") && part.length >= 4) {
        const spoilerText = part.slice(2, -2)
        return (
          <ReaderSpoilerSpan key={index}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              urlTransform={(url) => url}
              components={{
                p: ({ children }) => <span className="inline">{children}</span>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
              }}
            >
              {spoilerText}
            </ReactMarkdown>
          </ReaderSpoilerSpan>
        )
      }

      return (
        <ReactMarkdown
          key={index}
          remarkPlugins={[remarkGfm]}
          urlTransform={(url) => url}
          components={{
            p: ({ children }) => (
              <p className="leading-relaxed font-normal">{children}</p>
            ),
            strong: ({ children }) => (
              <strong className="font-extrabold">{children}</strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            del: ({ children }) => (
              <del className="line-through opacity-70">{children}</del>
            ),
            hr: () => (
              <hr
                className="my-8 border-t-2 border-dashed"
                style={{ borderColor: "var(--reader-border)" }}
              />
            ),
            blockquote: ({ children }) => (
              <blockquote
                className="border-l-4 pl-4 rounded-r-md italic"
                style={{
                  borderColor: "var(--reader-border)",
                  backgroundColor: "var(--reader-card)",
                  color: "var(--reader-text)",
                }}
              >
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <Link
                href={href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline underline-offset-2 hover:opacity-80"
                style={{ color: "#10b981" }}
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
                  className="max-h-[75vh] w-auto h-auto object-contain mx-auto rounded-xs transition-transform duration-200 group-hover:scale-[1.01]"
                />
              )

              return (
                <span className="block my-3 text-center select-none">
                  {isDataUrl ? (
                    <span
                      className="inline-block group relative rounded-sm overflow-hidden border transition-all shadow-sm"
                      style={{ borderColor: "var(--reader-border)" }}
                    >
                      {imageNode}
                    </span>
                  ) : (
                    <Link
                      href={imageSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block group relative cursor-zoom-in rounded-sm overflow-hidden border transition-all shadow-sm"
                      style={{ borderColor: "var(--reader-border)" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {imageNode}
                    </Link>
                  )}
                </span>
              )
            },
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-1.5 my-3 pl-2">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1.5 my-3 pl-2">
                {children}
              </ol>
            ),
            h1: ({ children }) => (
              <h1 className="text-xl sm:text-2xl font-black my-4 tracking-tight">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg sm:text-xl font-bold my-3 tracking-tight">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-bold my-2">{children}</h3>
            ),
            code: ({ inline, className, children, ...props }: any) => {
              return !inline ? (
                <pre
                  className="p-3.5 my-4 rounded-xl text-xs font-mono overflow-x-auto border"
                  style={{
                    backgroundColor: "var(--reader-card)",
                    borderColor: "var(--reader-border)",
                    color: "var(--reader-text)",
                  }}
                >
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code
                  className="px-1.5 py-0.5 rounded-md font-mono text-[0.88em] border"
                  style={{
                    backgroundColor: "var(--reader-card)",
                    borderColor: "var(--reader-border)",
                    color: "var(--reader-text)",
                  }}
                  {...props}
                >
                  {children}
                </code>
              )
            },
          }}
        >
          {part}
        </ReactMarkdown>
      )
    })
  }

  return (
    <div
      className={cn("chapter-text-content select-text", className)}
      style={{ color: "var(--reader-text)" }}
    >
      {renderFormattedContent(content)}
    </div>
  )
}
