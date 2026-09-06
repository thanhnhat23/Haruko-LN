import rawNovelsData from "./novels-data.json"

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface ChapterImage {
  id: number
  chapterId?: number
  imageUrl: string
  publicId?: string
  orderIndex: number
  createdAt?: string
}

export interface Chapter {
  id: number
  volumeId: number
  chapterNumber: number | string
  title: string
  content?: string
  wordCount: number
  isLocked?: boolean
  orderIndex?: number
  createdAt: string
  updatedAt?: string
  isDeleted?: boolean
  hasIllustration?: boolean
  images?: ChapterImage[]
}

export interface Volume {
  id: number
  postId?: number
  number: number
  title: string
  cover: string
  chapters: Chapter[]
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface UserReview {
  id: number
  user: {
    id: string
    username: string
    avatar: string
    role?: string
    rankTitle?: string
    isVerified?: boolean
  }
  score: number
  review: string
  createdAt: string
  helpfulCount: number
}

export interface CommentReply {
  id: number
  user: {
    id: string
    username: string
    avatar: string
    role?: string
    rankTitle?: string
    isAuthor?: boolean
    isTranslator?: boolean
  }
  replyToUser?: {
    id: string
    username: string
  }
  content: string
  image?: string
  createdAt: string
  likes: number
  replies?: CommentReply[]
  isDeleted?: boolean
  deletedAt?: string
}

export interface NovelComment {
  id: number
  user: {
    id: string
    username: string
    avatar: string
    role?: string
    rankTitle?: string
    isAuthor?: boolean
    isTranslator?: boolean
  }
  chapterTitle?: string
  content: string
  image?: string
  createdAt: string
  likes: number
  replies?: CommentReply[]
  isDeleted?: boolean
  deletedAt?: string
}

export interface NovelDetailData {
  id: number
  title: string
  originalTitle?: string
  author: string
  artist?: string
  thumbnail: string
  banner?: string
  type: "Truyện dịch" | "AI dịch" | "Sáng tác"
  status: "Đã hoàn thành" | "Đang tiến hành" | "Tạm ngưng"
  description: string
  tags: Tag[]
  views: number
  wordCount: number
  ratingScore: number
  ratingCount: number
  bookmarkCount: number
  totalComments: number
  discussionCount: number
  lastUpdate: string
  translator: {
    name: string
    avatar: string
    role: string
    rankTitle: string
  }
  volumes: Volume[]
  reviews: UserReview[]
  comments: NovelComment[]
}

// Cast JSON dataset to TypeScript models
export const MOCK_NOVEL_DETAILS: Record<number, NovelDetailData> =
  rawNovelsData as unknown as Record<number, NovelDetailData>

// Get novel by ID
export function getNovelById(id: number | string): NovelDetailData {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id
  if (MOCK_NOVEL_DETAILS[numericId]) {
    return MOCK_NOVEL_DETAILS[numericId]
  }

  // Fallback to default novel with dynamic ID
  const base = MOCK_NOVEL_DETAILS[1]
  return {
    ...base,
    id: isNaN(numericId) ? 1 : numericId,
    title:
      numericId === 2
        ? "Monogatari Series: Owarimonogatari"
        : numericId === 3
        ? "No Game No Life: Volume 12"
        : numericId === 4
        ? "Re:Zero kara Hajimeru Isekai Seikatsu"
        : numericId === 5
        ? "Sword Art Online: Unital Ring"
        : numericId === 6
        ? "Overlord: Volume 16 - The Half Wood Elf God-kin"
        : base.title,
  }
}

export interface FlattenedChapterItem extends Chapter {
  volumeNumber: number
  volumeTitle: string
}

export interface ChapterDetailResult {
  novel: NovelDetailData
  volume: Volume
  chapter: Chapter
  prevChapter: FlattenedChapterItem | null
  nextChapter: FlattenedChapterItem | null
  allChapters: FlattenedChapterItem[]
}

// Get chapter detail with adjacent chapters for navigation
export function getChapterDetail(
  novelId: number | string,
  chapterId: number | string
): ChapterDetailResult | null {
  const novel = getNovelById(novelId)
  if (!novel) return null

  const targetChapId = Number(chapterId)

  // Flatten all chapters sequentially across volumes
  const allChapters: FlattenedChapterItem[] = []
  novel.volumes.forEach((vol) => {
    vol.chapters.forEach((chap) => {
      allChapters.push({
        ...chap,
        volumeNumber: vol.number,
        volumeTitle: vol.title,
      })
    })
  })

  // Find target chapter
  const currentIndex = allChapters.findIndex((c) => c.id === targetChapId)
  if (currentIndex === -1) return null

  const chapter = allChapters[currentIndex]
  const volume =
    novel.volumes.find((v) => v.id === chapter.volumeId) || novel.volumes[0]

  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null
  const nextChapter =
    currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null

  return {
    novel,
    volume,
    chapter,
    prevChapter,
    nextChapter,
    allChapters,
  }
}
