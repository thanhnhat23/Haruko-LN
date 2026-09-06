"use client"

import React from "react"
import Image from "next/image"
import { Reply, Edit3, X, ZoomIn } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "@/components/ui/avatar"
import { CommentMarkdown } from "@/components/novel-detail/comments/comment-markdown"
import { CommentInlineEditForm } from "./comment-inline-edit-form"
import { CommentInlineReplyForm } from "./comment-inline-reply-form"
import type { CommentReply } from "@/data/mock-novel-data"
import type { ReplyTarget, EditingTarget } from "@/hooks/use-comments"
import { cn } from "@/lib/utils"

export interface CommentReplyItemProps {
  reply: CommentReply
  commentId: number
  depth: number
  replyTarget: ReplyTarget | null
  editingTarget: EditingTarget | null
  onStartReply: (commentId: number, replyId: number, username: string) => void
  onCancelReply: () => void
  onSendReply: (text: string, image?: string) => void
  onStartEdit: (commentId: number, replyId: number) => void
  onCancelEdit: () => void
  onSaveEdit: (newText: string) => void
  onDeleteReply: (commentId: number, replyId: number) => void
  onPreviewImage: (src: string) => void
}

export function CommentReplyItem({
  reply,
  commentId,
  depth,
  replyTarget,
  editingTarget,
  onStartReply,
  onCancelReply,
  onSendReply,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDeleteReply,
  onPreviewImage,
}: CommentReplyItemProps) {
  const isReplyingToThis =
    replyTarget?.commentId === commentId && replyTarget?.replyId === reply.id
  const isEditingThis =
    editingTarget?.commentId === commentId && editingTarget?.replyId === reply.id

  return (
    <div className="space-y-2">
      <div className={cn("space-y-1", reply.isDeleted && "opacity-75")}>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <Avatar size="default" className="border border-border/60 shrink-0">
              {!reply.isDeleted && reply.user.avatar && (
                <AvatarImage src={reply.user.avatar} alt={reply.user.username} />
              )}
              <AvatarFallback className="text-[10px] text-muted-foreground bg-accent/40">
                {reply.isDeleted ? "?" : reply.user.username[0]}
              </AvatarFallback>
              {!reply.isDeleted && (
                <AvatarBadge className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 border border-background" />
              )}
            </Avatar>
            <span
              className={cn(
                "text-xs font-bold",
                reply.isDeleted ? "text-muted-foreground italic" : "text-foreground"
              )}
            >
              {reply.isDeleted ? "[Bình luận đã bị xóa]" : reply.user.username}
            </span>

            {!reply.isDeleted && (
              <>
                {reply.user.role === "CHỦ THỚT" && (
                  <span className="px-1.5 py-0.2 rounded-xs bg-rose-600/90 text-[8px] text-white font-black uppercase tracking-wider">
                    Chủ thớt
                  </span>
                )}
                {reply.user.isTranslator && (
                  <span className="px-1.5 py-0.2 rounded-xs bg-emerald-600/90 text-[8px] text-white font-black uppercase tracking-wider">
                    Trans
                  </span>
                )}
                {reply.replyToUser && (
                  <span className="text-[10px] font-bold text-foreground/80 bg-accent/40 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                    <span className="text-muted-foreground text-[9px]">trả lời</span>
                    <span>@{reply.replyToUser.username}</span>
                  </span>
                )}
              </>
            )}
          </div>

          <span className="text-[9px] text-muted-foreground font-mono shrink-0">
            {reply.isDeleted ? reply.deletedAt || reply.createdAt : reply.createdAt}
          </span>
        </div>

        <div className="space-y-1.5">
          {reply.isDeleted ? (
            <div className="py-2 px-3 text-xs text-muted-foreground italic rounded-xl border border-dashed border-border/70 bg-accent/10 flex items-center gap-2 select-none">
              <span>Bình luận đã bị xóa</span>
            </div>
          ) : isEditingThis ? (
            <div className="pl-4">
              <CommentInlineEditForm
                initialText={reply.content}
                onSave={onSaveEdit}
                onCancel={onCancelEdit}
              />
            </div>
          ) : (
            reply.content && (
              <div className="py-2 text-xs text-foreground/90 leading-relaxed font-medium pl-4 rounded-xl border border-border/80 dark:border-zinc-800 bg-accent/15 dark:bg-zinc-950/60 shadow-2xs hover:border-border transition-all">
                <CommentMarkdown content={reply.content} />
              </div>
            )
          )}

          {!reply.isDeleted && reply.image && (
            <div className="pt-1 pl-4">
              <button
                type="button"
                onClick={() => onPreviewImage(reply.image!)}
                className="group relative block rounded-lg overflow-hidden border border-border/80 dark:border-zinc-800 bg-accent/10 shadow-xs hover:border-foreground/40 hover:shadow-md transition-all cursor-zoom-in text-left focus:outline-hidden"
                title="Nhấn để xem ảnh phóng to"
              >
                <div className="relative w-40 sm:w-48 max-w-full">
                  <Image
                    src={reply.image}
                    alt="Ảnh trả lời"
                    width={300}
                    height={200}
                    className="w-full h-auto object-cover rounded-lg group-hover:scale-103 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs shadow-md">
                    <ZoomIn size={14} />
                  </span>
                </div>
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 pl-4 pt-0.5 text-[11px] font-semibold text-muted-foreground">
            <button
              type="button"
              onClick={() =>
                onStartReply(
                  commentId,
                  reply.id,
                  reply.isDeleted ? "người dùng" : reply.user.username
                )
              }
              className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors"
            >
              <Reply size={12} />
              <span>Trả lời</span>
            </button>

            {!reply.isDeleted && (
              <>
                <button
                  type="button"
                  onClick={() => onStartEdit(commentId, reply.id)}
                  className="flex items-center gap-1 hover:text-emerald-500 cursor-pointer transition-colors"
                >
                  <Edit3 size={11} />
                  <span>Sửa</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteReply(commentId, reply.id)}
                  className="flex items-center gap-1 hover:text-rose-500 cursor-pointer transition-colors"
                >
                  <X size={12} />
                  <span>Xóa</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isReplyingToThis && (
        <div className="pl-4">
          <CommentInlineReplyForm
            targetUsername={reply.user.username}
            onSubmit={onSendReply}
            onCancel={onCancelReply}
          />
        </div>
      )}

      {reply.replies && reply.replies.length > 0 && (
        <div
          className={cn(
            "space-y-3 border-l-2 border-foreground/15 dark:border-zinc-800 pt-2",
            depth < 3 ? "pl-3 sm:pl-4" : "pl-2"
          )}
        >
          {reply.replies.map((childReply) => (
            <CommentReplyItem
              key={childReply.id}
              reply={childReply}
              commentId={commentId}
              depth={depth + 1}
              replyTarget={replyTarget}
              editingTarget={editingTarget}
              onStartReply={onStartReply}
              onCancelReply={onCancelReply}
              onSendReply={onSendReply}
              onStartEdit={onStartEdit}
              onCancelEdit={onCancelEdit}
              onSaveEdit={onSaveEdit}
              onDeleteReply={onDeleteReply}
              onPreviewImage={onPreviewImage}
            />
          ))}
        </div>
      )}
    </div>
  )
}
