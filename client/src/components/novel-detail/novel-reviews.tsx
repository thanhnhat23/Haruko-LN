"use client"

import React, { useState, useRef, useEffect } from "react"
import { Star, PenLine, ShieldCheck, Smile, Edit3, X, Trash2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { EmojiPickerPopover } from "@/components/ui/emoji-picker"
import type { UserReview } from "@/data/mock-novel-data"
import { cn } from "@/lib/utils"
import { ConfirmDeleteModal } from "./confirm-delete-modal"

interface NovelReviewsProps {
  ratingScore: number
  ratingCount: number
  reviews: UserReview[]
}

export function NovelReviews({
  ratingScore: initialRatingScore,
  ratingCount: initialRatingCount,
  reviews: initialReviews,
}: NovelReviewsProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [selectedScore, setSelectedScore] = useState(5)
  const [reviewText, setReviewText] = useState("")
  const [showReviewEmojiPicker, setShowReviewEmojiPicker] = useState(false)

  // Edit review state
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null)
  const [editScore, setEditScore] = useState(5)
  const [editReviewText, setEditReviewText] = useState("")

  // Delete review state
  const [deleteReviewId, setDeleteReviewId] = useState<number | null>(null)

  const reviewEmojiRef = useRef<HTMLDivElement>(null)
  const reviewTextareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInsertReviewEmoji = (emojiChar: string) => {
    const textarea = reviewTextareaRef.current
    if (textarea) {
      const start = textarea.selectionStart || 0
      const end = textarea.selectionEnd || 0
      const text = reviewText
      const newText = text.substring(0, start) + emojiChar + text.substring(end)
      setReviewText(newText)
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(
          start + emojiChar.length,
          start + emojiChar.length
        )
      }, 0)
    } else {
      setReviewText((prev) => prev + emojiChar)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        reviewEmojiRef.current &&
        !reviewEmojiRef.current.contains(event.target as Node)
      ) {
        setShowReviewEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewText.trim()) return

    const newReview: UserReview = {
      id: Date.now(),
      user: {
        id: "me",
        username: "Bạn (Độc giả)",
        avatar:
          "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif",
        rankTitle: "Nhà Thám Hiểm",
        isVerified: true,
      },
      score: selectedScore,
      review: reviewText.trim(),
      createdAt: "Vừa xong",
      helpfulCount: 0,
    }

    setReviews([newReview, ...reviews])
    setReviewText("")
    setShowReviewForm(false)
    setShowReviewEmojiPicker(false)
  }

  // Edit Review handlers
  const handleStartEdit = (rev: UserReview) => {
    setEditingReviewId(rev.id)
    setEditScore(rev.score)
    setEditReviewText(rev.review)
  }

  const handleSaveEdit = (id: number) => {
    if (!editReviewText.trim()) return

    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            score: editScore,
            review: editReviewText.trim(),
          }
        }
        return r
      })
    )

    setEditingReviewId(null)
  }

  const handleCancelEdit = () => {
    setEditingReviewId(null)
  }

  // Confirm delete review
  const handleConfirmDelete = () => {
    if (deleteReviewId === null) return
    setReviews((prev) => prev.filter((r) => r.id !== deleteReviewId))
    setDeleteReviewId(null)
  }

  // Calculate dynamic rating score
  const computedRatingScore =
    reviews.length > 0
      ? Number(
          (
            reviews.reduce((acc, curr) => acc + curr.score, 0) / reviews.length
          ).toFixed(1)
        )
      : initialRatingScore

  return (
    <section id="reviews-section" className="w-full space-y-5 select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/40 pb-3 gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 font-extrabold text-[9px] tracking-wider px-2 py-0.5 rounded-xs uppercase">
            Review
          </div>
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            Đánh giá từ độc giả
            <span className="text-xs text-muted-foreground font-bold">
              ({reviews.length})
            </span>
          </h2>
        </div>

        <Button
          size="sm"
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="h-8 px-3 rounded-lg border border-border! bg-card hover:bg-foreground hover:text-background text-foreground text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          <PenLine size={13} className="mr-1.5" />
          {showReviewForm ? "Đóng form" : "Viết đánh giá"}
        </Button>
      </div>

      {/* Review Form (Expandable) */}
      {showReviewForm && (
        <form
          onSubmit={handleSubmitReview}
          className="p-4 sm:p-5 rounded-xl border border-border/80 bg-accent/15 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Đánh giá truyện của bạn
            </h3>

            {/* Star Selector */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground font-semibold mr-2">
                Chấm điểm:
              </span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setSelectedScore(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-125"
                >
                  <Star
                    size={18}
                    className={cn(
                      star <= selectedScore
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-zinc-600"
                    )}
                  />
                </button>
              ))}
              <span className="text-xs font-black text-foreground ml-1.5">
                {selectedScore} / 5
              </span>
            </div>
          </div>

          <textarea
            ref={reviewTextareaRef}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={3}
            placeholder="Chia sẻ cảm nhận, đánh giá về nhân vật, cốt truyện hoặc nhóm dịch..."
            className="w-full text-xs sm:text-sm p-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-foreground transition-colors resize-none"
            required
          />

          <div className="flex items-center justify-between pt-1">
            {/* Review Emoji Picker */}
            <div className="relative" ref={reviewEmojiRef}>
              <button
                type="button"
                onClick={() => setShowReviewEmojiPicker(!showReviewEmojiPicker)}
                className={cn(
                  "p-1.5 rounded-md hover:bg-accent/20 hover:text-foreground cursor-pointer transition-colors flex items-center gap-1.5 text-xs text-muted-foreground",
                  showReviewEmojiPicker && "text-foreground bg-accent/30"
                )}
                title="Chèn biểu cảm"
              >
                <Smile size={16} />
                <span>Biểu cảm</span>
              </button>

              {/* Review Emoji Picker Popover */}
              <EmojiPickerPopover
                isOpen={showReviewEmojiPicker}
                onEmojiSelect={(emojiChar) => handleInsertReviewEmoji(emojiChar)}
                className="top-full mt-2 left-0"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowReviewForm(false)}
                className="h-8 text-xs cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 px-4 bg-foreground! text-background! hover:bg-background! hover:text-foreground! hover:border-foreground! border border-transparent font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Đăng đánh giá
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Reviews Summary Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 sm:p-5 rounded-xl border border-border/80 bg-card/60 items-center">
        {/* Left Score Block */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center text-center p-2 sm:border-r border-border/40">
          <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {computedRatingScore}
          </div>
          <div className="flex items-center gap-1 my-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className="text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Dựa trên {reviews.length} lượt đánh giá
          </span>
        </div>

        {/* Right Star Breakdown Distribution */}
        <div className="sm:col-span-8 space-y-1.5 px-2">
          {[
            { star: 5, percent: 85, count: reviews.filter((r) => r.score >= 5).length },
            { star: 4, percent: 12, count: reviews.filter((r) => r.score >= 4 && r.score < 5).length },
            { star: 3, percent: 3, count: reviews.filter((r) => r.score >= 3 && r.score < 4).length },
            { star: 2, percent: 0, count: reviews.filter((r) => r.score >= 2 && r.score < 3).length },
            { star: 1, percent: 0, count: reviews.filter((r) => r.score < 2).length },
          ].map((item) => (
            <div
              key={item.star}
              className="flex items-center gap-2.5 text-xs text-muted-foreground"
            >
              <span className="w-8 font-bold text-[11px] text-foreground flex items-center gap-0.5">
                {item.star} <Star size={10} className="fill-foreground text-foreground" />
              </span>
              <div className="flex-1 h-2 rounded-full bg-accent/30 overflow-hidden border border-border/30">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${reviews.length > 0 ? (item.count / reviews.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="w-7 text-right text-[10px] font-mono font-medium">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-3 pt-1">
        {reviews.map((rev) => {
          const isEditing = editingReviewId === rev.id

          return (
            <div
              key={rev.id}
              className="p-4 rounded-xl border border-border/80 bg-card/40 space-y-2.5 hover:border-border transition-colors"
            >
              {/* User Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Avatar size="sm" className="border border-border/60">
                    <AvatarImage src={rev.user.avatar} alt={rev.user.username} />
                    <AvatarFallback>{rev.user.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">
                        {rev.user.username}
                      </span>
                      {rev.user.isVerified && (
                        <ShieldCheck size={13} className="text-emerald-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className={cn(
                              i < Math.floor(rev.score)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-zinc-600"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        • {rev.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons for Review */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      isEditing ? handleCancelEdit() : handleStartEdit(rev)
                    }
                    className="p-1 rounded-md text-muted-foreground hover:text-emerald-500 hover:bg-accent/20 cursor-pointer transition-colors"
                    title="Chỉnh sửa đánh giá"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteReviewId(rev.id)}
                    className="p-1 rounded-md text-muted-foreground hover:text-rose-500 hover:bg-accent/20 cursor-pointer transition-colors"
                    title="Xóa đánh giá"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Review Content or Inline Edit Mode */}
              {isEditing ? (
                <div className="pt-2 space-y-3 border-t border-border/40 animate-in fade-in duration-200">
                  {/* Score editor */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground font-semibold">
                      Chỉnh sửa điểm:
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setEditScore(star)}
                          className="p-0.5 cursor-pointer hover:scale-110"
                        >
                          <Star
                            size={15}
                            className={cn(
                              star <= editScore
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-zinc-600"
                            )}
                          />
                        </button>
                      ))}
                      <span className="font-bold text-foreground ml-1">
                        {editScore} / 5
                      </span>
                    </div>
                  </div>

                  <textarea
                    value={editReviewText}
                    onChange={(e) => setEditReviewText(e.target.value)}
                    rows={3}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-foreground resize-none"
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="h-7 px-3 text-xs cursor-pointer"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSaveEdit(rev.id)}
                      className="h-7 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase cursor-pointer"
                    >
                      Lưu
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium pt-1">
                  {rev.review}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Confirm delete review modal */}
      <ConfirmDeleteModal
        isOpen={deleteReviewId !== null}
        title="Xác nhận xóa đánh giá"
        description="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này sẽ không thể hoàn tác."
        confirmText="Xóa đánh giá"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteReviewId(null)}
      />
    </section>
  )
}