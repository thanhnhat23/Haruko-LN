"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Reply,
  AlertTriangle,
  Flag,
  Send,
  Smile,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  X,
  ZoomIn,
  Edit3,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { EmojiPickerPopover } from "@/components/ui/emoji-picker"
import { CommentMarkdown } from "@/components/novel-detail/comments/comment-markdown"
import { useComments } from "@/hooks/use-comments"
import {
  CommentMarkdownToolbar,
  insertMarkdown,
} from "./comments/comment-markdown-toolbar"
import { CommentInlineEditForm } from "./comments/comment-inline-edit-form"
import { CommentInlineReplyForm } from "./comments/comment-inline-reply-form"
import { CommentReplyItem } from "./comments/comment-reply-item"
import { CommentImageModal } from "./comments/comment-image-modal"
import { ConfirmDeleteModal } from "./confirm-delete-modal"
import type { NovelComment } from "@/data/mock-novel-data"
import { cn } from "@/lib/utils"

interface NovelCommentsProps {
  totalComments?: number
  discussionCount?: number
  comments: NovelComment[]
}

interface DeleteConfirmState {
  isOpen: boolean
  type: "comment" | "reply"
  commentId: number
  replyId?: number
}

export function NovelComments({ comments: initialComments }: NovelCommentsProps) {
  const {
    comments,
    expandedReplies,
    replyTarget,
    editingTarget,
    toggleReplies,
    addComment,
    startReply,
    cancelReply,
    sendReply,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteComment,
    deleteReply,
  } = useComments(initialComments)

  // Main comment form local state
  const [newCommentText, setNewCommentText] = useState("")
  const [commentImage, setCommentImage] = useState<string | null>(null)
  const [isMainPreview, setIsMainPreview] = useState(false)
  const [showMainEmojiPicker, setShowMainEmojiPicker] = useState(false)
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState | null>(null)

  const mainEmojiRef = useRef<HTMLDivElement>(null)
  const mainTextareaRef = useRef<HTMLTextAreaElement>(null)
  const mainFileInputRef = useRef<HTMLInputElement>(null)

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mainEmojiRef.current &&
        !mainEmojiRef.current.contains(event.target as Node)
      ) {
        setShowMainEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle main comment image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("Dung lượng ảnh tối đa là 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setCommentImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Submit main comment
  const handleSubmitMainComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentText.trim() && !commentImage) return

    addComment(newCommentText, commentImage || undefined)
    setNewCommentText("")
    setCommentImage(null)
    setIsMainPreview(false)
    if (mainFileInputRef.current) mainFileInputRef.current.value = ""
  }

  return (
    <section id="comments-section" className="w-full space-y-6 select-none">
      {/* Total comments header */}
      <div className="space-y-3 border-b border-border/40 pb-4">
        <h2 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-wide">
          Tổng bình luận ({comments.length.toLocaleString("vi-VN")})
        </h2>

        <div className="space-y-1.5 text-xs font-semibold">
          <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
            <AlertTriangle size={15} className="shrink-0" />
            <span>
              Báo cáo vi phạm hoặc phát hiện chương lỗi/trùng lặp tại{" "}
              <Link href="#report" className="font-bold underline hover:text-rose-400">
                Báo cáo chương lỗi
              </Link>
            </span>
          </div>

          <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg">
            <Flag size={15} className="shrink-0" />
            <span>
              Không spam, quảng cáo web khác hoặc sử dụng ngôn từ xúc phạm. Hãy giữ gìn văn minh cộng đồng đọc truyện!
            </span>
          </div>
        </div>
      </div>

      {/* Discussion title bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black text-foreground uppercase tracking-wide">
          {comments.length} Bình luận
        </h3>
      </div>

      {/* Main comment input form */}
      <div className="border border-border/80 bg-card/60 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium pb-2 border-b border-border/30">
          <span>
            Bạn phải{" "}
            <Link href="/authentication" className="text-foreground font-bold hover:underline">
              đăng nhập
            </Link>{" "}
            để bình luận.
          </span>
          <span className="text-[10px] text-muted-foreground">Hỗ trợ Markdown &amp; Spoiler</span>
        </div>

        <form onSubmit={handleSubmitMainComment} className="space-y-3">
          <CommentMarkdownToolbar
            onBold={() =>
              insertMarkdown(mainTextareaRef.current, newCommentText, setNewCommentText, "**", "**", "bold")
            }
            onItalic={() =>
              insertMarkdown(mainTextareaRef.current, newCommentText, setNewCommentText, "*", "*", "italic")
            }
            onStrike={() =>
              insertMarkdown(mainTextareaRef.current, newCommentText, setNewCommentText, "~~", "~~", "strike")
            }
            onSpoiler={() =>
              insertMarkdown(mainTextareaRef.current, newCommentText, setNewCommentText, "||", "||", "spoiler")
            }
            onQuote={() =>
              insertMarkdown(mainTextareaRef.current, newCommentText, setNewCommentText, "> ", "", "quote")
            }
            onCode={() =>
              insertMarkdown(mainTextareaRef.current, newCommentText, setNewCommentText, "`", "`", "code")
            }
            onLink={() =>
              insertMarkdown(mainTextareaRef.current, newCommentText, setNewCommentText, "[title](", ")", "https://")
            }
            isPreview={isMainPreview}
            onTogglePreview={() => setIsMainPreview(!isMainPreview)}
          />

          <div className="flex gap-3 items-start">
            <Avatar size="default" className="mt-1 border border-border/60 shrink-0">
              <AvatarImage
                src="https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif"
                alt="Avatar"
              />
              <AvatarFallback>U</AvatarFallback>
              <AvatarBadge className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 border border-background" />
            </Avatar>

            {isMainPreview ? (
              <div className="flex-1 p-3 rounded-xl bg-background border border-border min-h-19">
                {newCommentText.trim() ? (
                  <CommentMarkdown content={newCommentText} />
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Chưa có nội dung xem trước
                  </span>
                )}
              </div>
            ) : (
              <textarea
                ref={mainTextareaRef}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                rows={3}
                placeholder="Tham gia thảo luận..."
                className="flex-1 text-xs sm:text-sm p-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-foreground transition-colors resize-none"
              />
            )}
          </div>

          <input
            type="file"
            ref={mainFileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          {commentImage && (
            <div className="relative inline-block pl-11">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-border/90 bg-accent/20 shadow-md">
                <Image
                  src={commentImage}
                  alt="Preview ảnh bình luận"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setCommentImage(null)
                  if (mainFileInputRef.current) mainFileInputRef.current.value = ""
                }}
                className="absolute top-1 right-1 p-1 rounded-full bg-background/90 text-foreground hover:bg-destructive hover:text-destructive-foreground shadow-md transition-all cursor-pointer border border-border"
                title="Xóa ảnh"
              >
                <X size={13} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <div className="relative" ref={mainEmojiRef}>
                <button
                  type="button"
                  onClick={() => setShowMainEmojiPicker(!showMainEmojiPicker)}
                  className={cn(
                    "p-1.5 rounded-md hover:bg-accent/20 hover:text-foreground cursor-pointer transition-colors flex items-center gap-1.5 text-xs text-muted-foreground",
                    showMainEmojiPicker && "text-foreground bg-accent/30"
                  )}
                  title="Chèn biểu cảm"
                >
                  <Smile size={16} />
                </button>

                <EmojiPickerPopover
                  isOpen={showMainEmojiPicker}
                  onEmojiSelect={(emojiChar) => setNewCommentText((prev) => prev + emojiChar)}
                  className="top-full mt-2 left-0"
                />
              </div>

              <button
                type="button"
                onClick={() => mainFileInputRef.current?.click()}
                className={cn(
                  "p-1.5 rounded-md hover:bg-accent/20 hover:text-foreground cursor-pointer transition-colors flex items-center gap-1.5 text-xs text-muted-foreground",
                  commentImage && "text-foreground bg-accent/30"
                )}
                title="Đính kèm hình ảnh"
              >
                <ImageIcon size={16} />
              </button>
            </div>

            <Button
              type="submit"
              size="sm"
              className="h-8 px-4 rounded-lg bg-foreground! text-background! hover:bg-background! hover:text-foreground! hover:border-foreground! border border-transparent font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
            >
              <Send size={13} />
              Gửi bình luận
            </Button>
          </div>
        </form>
      </div>

      {/* Threaded comments list */}
      <div className="space-y-4">
        {comments.map((comment) => {
          const isRepliesExpanded = expandedReplies[comment.id]
          const hasReplies = comment.replies && comment.replies.length > 0
          const isReplyingToRoot = replyTarget?.commentId === comment.id && !replyTarget?.replyId
          const isEditingRoot = editingTarget?.commentId === comment.id && !editingTarget?.replyId

          return (
            <div
              key={comment.id}
              className={cn(
                "p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/45 space-y-3.5 hover:border-border transition-all",
                comment.isDeleted && "opacity-75"
              )}
            >
              {/* User Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <Avatar size="lg" className="border border-border/60 shrink-0">
                    {!comment.isDeleted && comment.user.avatar && (
                      <AvatarImage src={comment.user.avatar} alt={comment.user.username} />
                    )}
                    <AvatarFallback className="text-xs text-muted-foreground bg-accent/40">
                      {comment.isDeleted ? "?" : comment.user.username[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          "text-xs sm:text-sm font-bold",
                          comment.isDeleted ? "text-muted-foreground italic" : "text-foreground"
                        )}
                      >
                        {comment.isDeleted ? "[Bình luận đã bị xóa]" : comment.user.username}
                      </span>

                      {!comment.isDeleted && (
                        <>
                          {comment.user.role === "CHỦ THỚT" && (
                            <span className="px-1.5 py-0.2 rounded-xs bg-rose-600/90 text-[9px] text-white font-black uppercase tracking-wider">
                              Chủ thớt
                            </span>
                          )}
                          {comment.user.isTranslator && (
                            <span className="px-1.5 py-0.2 rounded-xs bg-emerald-600/90 text-[9px] text-white font-black uppercase tracking-wider">
                              Trans
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {!comment.isDeleted && comment.chapterTitle && (
                      <div className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                        Tại: <span className="text-foreground/90 font-bold">{comment.chapterTitle}</span>
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap shrink-0">
                  {comment.isDeleted ? comment.deletedAt || comment.createdAt : comment.createdAt}
                </span>
              </div>

              {/* Comment Content / Inline Edit Form */}
              <div className="space-y-2">
                {comment.isDeleted ? (
                  <div className="py-2.5 px-4 text-xs sm:text-sm text-muted-foreground italic rounded-xl border border-dashed border-border/70 bg-accent/10 flex items-center gap-2 select-none">
                    <span>Bình luận đã bị xóa</span>
                  </div>
                ) : isEditingRoot ? (
                  <CommentInlineEditForm
                    initialText={comment.content}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                  />
                ) : (
                  comment.content && (
                    <div className="py-2 px-4 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium rounded-xl border border-border/80 dark:border-zinc-800 bg-accent/15 dark:bg-zinc-950/60 shadow-2xs">
                      <CommentMarkdown content={comment.content} />
                    </div>
                  )
                )}

                {!comment.isDeleted && comment.image && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setPreviewModalImage(comment.image!)}
                      className="group relative block rounded-xl overflow-hidden border border-border/80 dark:border-zinc-800 bg-accent/10 shadow-xs hover:border-foreground/40 hover:shadow-md transition-all cursor-zoom-in text-left focus:outline-hidden"
                      title="Nhấn để xem ảnh phóng to"
                    >
                      <div className="relative w-48 sm:w-56 max-w-full">
                        <Image
                          src={comment.image}
                          alt="Ảnh đính kèm"
                          width={300}
                          height={200}
                          className="w-full h-auto object-cover rounded-xl group-hover:scale-103 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs shadow-md">
                          <ZoomIn size={16} />
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Actions Toolbar */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-semibold pt-1">
                <button
                  type="button"
                  onClick={() =>
                    isReplyingToRoot
                      ? cancelReply()
                      : startReply(
                        comment.id,
                        undefined,
                        comment.isDeleted ? "người dùng" : comment.user.username
                      )
                  }
                  className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors"
                >
                  <Reply size={13} />
                  <span>{isReplyingToRoot ? "Hủy trả lời" : "Trả lời"}</span>
                </button>

                {!comment.isDeleted && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        isEditingRoot ? cancelEdit() : startEdit(comment.id, undefined)
                      }
                      className="flex items-center gap-1 hover:text-emerald-500 cursor-pointer transition-colors"
                    >
                      <Edit3 size={13} />
                      <span>{isEditingRoot ? "Đóng sửa" : "Sửa"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          type: "comment",
                          commentId: comment.id,
                        })
                      }
                      className="flex items-center gap-1 hover:text-rose-500 cursor-pointer transition-colors"
                    >
                      <X size={13} />
                      <span>Xóa</span>
                    </button>
                  </>
                )}
              </div>

              {/* Inline reply form for root comment */}
              {isReplyingToRoot && (
                <div className="pt-2">
                  <CommentInlineReplyForm
                    targetUsername={comment.user.username}
                    onSubmit={(text, img) => sendReply(text, img)}
                    onCancel={cancelReply}
                  />
                </div>
              )}

              {/* Recursive replies */}
              {hasReplies && (
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => toggleReplies(comment.id)}
                    className="text-[11px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors uppercase tracking-wider"
                  >
                    {isRepliesExpanded ? (
                      <>
                        Thu gọn câu trả lời <ChevronUp size={13} />
                      </>
                    ) : (
                      <>
                        Xem thêm {comment.replies?.length} phản hồi <ChevronDown size={13} />
                      </>
                    )}
                  </button>

                  {isRepliesExpanded && (
                    <div className="space-y-3 pl-3 sm:pl-4 border-l-2 border-border/80 dark:border-zinc-800 pt-1">
                      {comment.replies?.map((reply) => (
                        <CommentReplyItem
                          key={reply.id}
                          reply={reply}
                          commentId={comment.id}
                          depth={1}
                          replyTarget={replyTarget}
                          editingTarget={editingTarget}
                          onStartReply={startReply}
                          onCancelReply={cancelReply}
                          onSendReply={(text, img) => sendReply(text, img)}
                          onStartEdit={startEdit}
                          onCancelEdit={cancelEdit}
                          onSaveEdit={saveEdit}
                          onDeleteReply={(cId, rId) =>
                            setDeleteConfirm({
                              isOpen: true,
                              type: "reply",
                              commentId: cId,
                              replyId: rId,
                            })
                          }
                          onPreviewImage={setPreviewModalImage}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Image lightbox modal */}
      <CommentImageModal
        imageSrc={previewModalImage}
        onClose={() => setPreviewModalImage(null)}
      />

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteConfirm?.isOpen}
        title={
          deleteConfirm?.type === "comment"
            ? "Xác nhận xóa bình luận"
            : "Xác nhận xóa phản hồi"
        }
        description={
          deleteConfirm?.type === "comment"
            ? "Bình luận này sẽ bị xóa. Nếu có phản hồi bên dưới, nội dung sẽ được đánh dấu [Đã xóa] để bảo toàn luồng thảo luận."
            : "Phản hồi này sẽ bị xóa khỏi luồng thảo luận."
        }
        confirmText="Xác nhận xóa"
        onConfirm={() => {
          if (!deleteConfirm) return
          if (deleteConfirm.type === "comment") {
            deleteComment(deleteConfirm.commentId)
          } else if (deleteConfirm.type === "reply" && deleteConfirm.replyId) {
            deleteReply(deleteConfirm.commentId, deleteConfirm.replyId)
          }
        }}
        onClose={() => setDeleteConfirm(null)}
      />
    </section>
  )
}