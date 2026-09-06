"use client"

import React, { useState, useEffect } from "react"
import { Layers, Plus, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVolumes } from "@/hooks/use-volumes"
import { VolumeCard } from "./volumes/volume-card"
import { VolumeModal } from "./volumes/volume-modal"
import { ChapterModal } from "./chapters/chapter-modal"
import { ConfirmDeleteModal } from "./confirm-delete-modal"
import type { Volume } from "@/data/mock-novel-data"

interface NovelVolumesListProps {
  novelId: number
  volumes: Volume[]
}

interface DeleteConfirmState {
  isOpen: boolean
  type: "volume" | "chapter"
  volId: number
  volNumber?: number
  chapterId?: number
  title: string
}

export function NovelVolumesList({
  novelId,
  volumes: initialVolumes,
}: NovelVolumesListProps) {
  const {
    volumes,
    expandedVolumes,
    volModal,
    chapModal,
    saveStatus,
    toggleVolumeExpand,
    openAddVolume,
    openEditVolume,
    closeVolumeModal,
    saveVolume,
    deleteVolume,
    openAddChapter,
    openEditChapter,
    closeChapterModal,
    saveChapter,
    deleteChapter,
    toggleLockChapter,
    moveChapter,
  } = useVolumes(initialVolumes, novelId)

  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState | null>(
    null
  )

  // Open volume delete confirmation modal
  const handleRequestDeleteVolume = (volId: number, volNumber: number) => {
    setDeleteConfirm({
      isOpen: true,
      type: "volume",
      volId,
      volNumber,
      title: `Xác nhận xóa Tập ${volNumber}`,
    })
  }

  // Open chapter delete confirmation modal
  const handleRequestDeleteChapter = (
    volId: number,
    chapterId: number,
    chapTitle: string
  ) => {
    setDeleteConfirm({
      isOpen: true,
      type: "chapter",
      volId,
      chapterId,
      title: `Xác nhận xóa "${chapTitle}"`,
    })
  }

  // Execute deletion after modal confirmation
  const handleExecuteDelete = () => {
    if (!deleteConfirm) return
    if (deleteConfirm.type === "volume") {
      deleteVolume(deleteConfirm.volId)
    } else if (deleteConfirm.type === "chapter" && deleteConfirm.chapterId) {
      deleteChapter(deleteConfirm.volId, deleteConfirm.chapterId)
    }
  }

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (volModal.isOpen) closeVolumeModal()
        if (chapModal.isOpen) closeChapterModal()
        if (deleteConfirm?.isOpen) setDeleteConfirm(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    volModal.isOpen,
    chapModal.isOpen,
    deleteConfirm?.isOpen,
    closeVolumeModal,
    closeChapterModal,
  ])

  return (
    <section id="volumes-section" className="w-full space-y-6 select-none">
      {/* Volumes & Chapters section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <Layers className="text-foreground" size={20} />
          <h2 className="text-base sm:text-lg font-black text-foreground uppercase tracking-wide">
            Tập &amp; Chương
          </h2>
          <span className="text-xs text-muted-foreground font-semibold">
            ({volumes.length} tập)
          </span>
          {saveStatus === "saving" && (
            <span className="text-[11px] text-amber-500 font-semibold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 animate-pulse">
              <Loader2 size={12} className="animate-spin" /> Đang lưu JSON...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <Check size={12} /> Đã lưu vào JSON
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-[11px] text-rose-500 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
              Lỗi khi lưu JSON
            </span>
          )}
        </div>

        {/* Add new volume button */}
        <Button
          type="button"
          size="sm"
          onClick={openAddVolume}
          className="h-8 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer rounded-lg shadow-sm"
        >
          <Plus size={14} />
          <span>Thêm tập mới</span>
        </Button>
      </div>

      {/* Volumes list */}
      <div className="space-y-6">
        {volumes.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-border rounded-2xl p-6 bg-card/30">
            <p className="text-sm font-semibold text-muted-foreground mb-3">
              Truyện chưa có tập nào. Nhấn &quot;Thêm tập mới&quot; để bắt đầu.
            </p>
            <Button
              type="button"
              size="sm"
              onClick={openAddVolume}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase"
            >
              Thêm tập đầu tiên
            </Button>
          </div>
        ) : (
          volumes.map((volume) => (
            <VolumeCard
              key={volume.id}
              volume={volume}
              novelId={novelId}
              isExpanded={!!expandedVolumes[volume.id]}
              onToggleExpand={toggleVolumeExpand}
              onOpenAddChapter={openAddChapter}
              onOpenEditVolume={openEditVolume}
              onDeleteVolume={handleRequestDeleteVolume}
              onMoveChapter={moveChapter}
              onToggleLockChapter={toggleLockChapter}
              onOpenEditChapter={openEditChapter}
              onDeleteChapter={handleRequestDeleteChapter}
            />
          ))
        )}
      </div>

      {/* Add/edit volume modal */}
      <VolumeModal
        modalState={volModal}
        onClose={closeVolumeModal}
        onSave={saveVolume}
      />

      {/* Add/edit chapter modal */}
      <ChapterModal
        modalState={chapModal}
        onClose={closeChapterModal}
        onSave={saveChapter}
      />

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteConfirm?.isOpen}
        title={deleteConfirm?.title || "Xác nhận xóa"}
        description={
          deleteConfirm?.type === "volume"
            ? `Tập ${deleteConfirm?.volNumber} cùng toàn bộ các chương bên trong sẽ bị xóa vĩnh viễn và không thể hoàn tác.`
            : "Chương này sẽ bị xóa khỏi tập truyện và không thể hoàn tác."
        }
        confirmText="Xóa vĩnh viễn"
        onConfirm={handleExecuteDelete}
        onClose={() => setDeleteConfirm(null)}
      />
    </section>
  )
}