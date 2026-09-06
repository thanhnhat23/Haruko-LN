"use client"

import { useState } from "react"
import type { NovelComment, CommentReply } from "@/data/mock-novel-data"

export interface ReplyTarget {
  commentId: number
  replyId?: number
  replyToUsername: string
}

export interface EditingTarget {
  commentId: number
  replyId?: number
}

// Add reply into recursive tree
function addReplyRecursive(
  items: CommentReply[],
  targetReplyId: number,
  newReply: CommentReply
): CommentReply[] {
  return items.map((item) => {
    if (item.id === targetReplyId) {
      return {
        ...item,
        replies: [...(item.replies || []), newReply],
      }
    }
    if (item.replies && item.replies.length > 0) {
      return {
        ...item,
        replies: addReplyRecursive(item.replies, targetReplyId, newReply),
      }
    }
    return item
  })
}

// Update reply content in recursive tree
function updateReplyRecursive(
  items: CommentReply[],
  targetReplyId: number,
  newContent: string
): CommentReply[] {
  return items.map((item) => {
    if (item.id === targetReplyId) {
      return { ...item, content: newContent }
    }
    if (item.replies && item.replies.length > 0) {
      return {
        ...item,
        replies: updateReplyRecursive(item.replies, targetReplyId, newContent),
      }
    }
    return item
  })
}

// Delete reply in recursive tree: soft delete if has replies, hard delete if leaf
function deleteReplyRecursive(
  items: CommentReply[],
  targetReplyId: number
): CommentReply[] {
  return items
    .map((item) => {
      if (item.id === targetReplyId) {
        if (item.replies && item.replies.length > 0) {
          return {
            ...item,
            isDeleted: true,
            deletedAt: "Vừa xong",
            image: undefined,
          }
        }
        return null
      }

      if (item.replies && item.replies.length > 0) {
        const updatedChildReplies = deleteReplyRecursive(
          item.replies,
          targetReplyId
        )
        if (item.isDeleted && updatedChildReplies.length === 0) {
          return null
        }
        return {
          ...item,
          replies: updatedChildReplies,
        }
      }

      return item
    })
    .filter(Boolean) as CommentReply[]
}

export function useComments(initialComments: NovelComment[]) {
  const [comments, setComments] = useState<NovelComment[]>(initialComments)
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({
    101: true,
    102: true,
  })
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null)
  const [editingTarget, setEditingTarget] = useState<EditingTarget | null>(null)

  const toggleReplies = (id: number) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Add new root comment
  const addComment = (content: string, image?: string) => {
    const trimmed = content.trim()
    if (!trimmed && !image) return

    const newComment: NovelComment = {
      id: Date.now(),
      user: {
        id: "me",
        username: "Bạn (Độc giả)",
        avatar:
          "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif",
      },
      content: trimmed,
      image,
      createdAt: "Vừa xong",
      likes: 0,
      replies: [],
    }

    setComments((prev) => [newComment, ...prev])
  }

  // Start or cancel reply
  const startReply = (
    commentId: number,
    replyId: number | undefined,
    username: string
  ) => {
    setReplyTarget({ commentId, replyId, replyToUsername: username })
    setEditingTarget(null)
  }

  const cancelReply = () => {
    setReplyTarget(null)
  }

  // Submit new reply to thread
  const sendReply = (text: string, image?: string) => {
    if (!replyTarget) return
    const trimmed = text.trim()
    if (!trimmed && !image) return

    const newReply: CommentReply = {
      id: Date.now(),
      user: {
        id: "me",
        username: "Bạn (Độc giả)",
        avatar:
          "https://i.pinimg.com/originals/4e/2a/f4/4e2af41014d87c89b468cad0080667ca.gif",
      },
      replyToUser: replyTarget.replyId
        ? { id: "target", username: replyTarget.replyToUsername }
        : undefined,
      content: trimmed,
      image,
      createdAt: "Vừa xong",
      likes: 0,
      replies: [],
    }

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === replyTarget.commentId) {
          if (!replyTarget.replyId) {
            return {
              ...c,
              replies: [...(c.replies || []), newReply],
            }
          }
          return {
            ...c,
            replies: addReplyRecursive(
              c.replies || [],
              replyTarget.replyId,
              newReply
            ),
          }
        }
        return c
      })
    )

    setExpandedReplies((prev) => ({ ...prev, [replyTarget.commentId]: true }))
    setReplyTarget(null)
  }

  // Start, cancel, or save inline edit
  const startEdit = (commentId: number, replyId?: number) => {
    setEditingTarget({ commentId, replyId })
    setReplyTarget(null)
  }

  const cancelEdit = () => {
    setEditingTarget(null)
  }

  const saveEdit = (newText: string) => {
    if (!editingTarget) return

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === editingTarget.commentId) {
          if (!editingTarget.replyId) {
            return { ...c, content: newText }
          }
          return {
            ...c,
            replies: updateReplyRecursive(
              c.replies || [],
              editingTarget.replyId,
              newText
            ),
          }
        }
        return c
      })
    )

    setEditingTarget(null)
  }

  // Delete root comment
  const deleteComment = (commentId: number) => {
    setComments((prev) =>
      prev
        .map((c) => {
          if (c.id === commentId) {
            if (c.replies && c.replies.length > 0) {
              return {
                ...c,
                isDeleted: true,
                deletedAt: "Vừa xong",
                image: undefined,
              }
            }
            return null
          }
          return c
        })
        .filter(Boolean) as NovelComment[]
    )
  }

  // Delete reply within thread
  const deleteReply = (commentId: number, replyId: number) => {
    setComments((prev) =>
      prev
        .map((c) => {
          if (c.id === commentId) {
            const updatedReplies = deleteReplyRecursive(c.replies || [], replyId)
            if (c.isDeleted && updatedReplies.length === 0) {
              return null
            }
            return {
              ...c,
              replies: updatedReplies,
            }
          }
          return c
        })
        .filter(Boolean) as NovelComment[]
    )
  }

  return {
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
  }
}
