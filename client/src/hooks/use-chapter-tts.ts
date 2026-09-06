"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { TtsSettings } from "@/components/novel-reader/reader-types"
import { DEFAULT_TTS_SETTINGS } from "@/components/novel-reader/reader-types"

export function useChapterTts(content: string, chapterTitle: string) {
  const [settings, setSettings] = useState<TtsSettings>(DEFAULT_TTS_SETTINGS)

  // Sync settings from localStorage after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("haruko_tts_settings")
      if (saved) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }))
      }
    } catch (e) {
      // Ignore read error
    }
  }, [])

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0)
  const [chunks, setChunks] = useState<string[]>([])
  const [isTestingVoice, setIsTestingVoice] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [ttsError, setTtsError] = useState<string | null>(null)

  // Refs for tracking active state without stale closures
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const testAudioRef = useRef<HTMLAudioElement | null>(null)
  const activeChunkIndexRef = useRef(0)
  const isPlayingRef = useRef(false)
  const settingsRef = useRef(settings)
  const chunksRef = useRef<string[]>([])
  const prefetchCacheRef = useRef<Map<number, string>>(new Map())

  // Atomic playback generation token to prevent race conditions & overlapping speech
  const playbackIdRef = useRef(0)
  const playChunkRef = useRef<(index: number) => void>(() => {})

  // Keep refs synchronized
  activeChunkIndexRef.current = currentChunkIndex
  isPlayingRef.current = isPlaying
  settingsRef.current = settings
  chunksRef.current = chunks

  // Save settings changes
  const updateSettings = useCallback((newSettings: Partial<TtsSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      settingsRef.current = updated
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("haruko_tts_settings", JSON.stringify(updated))
        } catch (e) {
          // Ignore write error
        }
      }
      return updated
    })

    // If voice, model, key, or engine changes, clear prefetch cache to prevent stale audio
    if (
      newSettings.geminiVoice ||
      newSettings.geminiModel ||
      newSettings.engine ||
      newSettings.customApiKey !== undefined
    ) {
      prefetchCacheRef.current.clear()
    }

    // If rate changes and audio is currently playing in Gemini mode, apply immediately
    if (newSettings.rate !== undefined && audioRef.current) {
      audioRef.current.playbackRate = newSettings.rate
    }
    // If volume changes and audio is playing, apply immediately
    if (newSettings.volume !== undefined && audioRef.current) {
      audioRef.current.volume = newSettings.volume
    }
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_TTS_SETTINGS)
    settingsRef.current = DEFAULT_TTS_SETTINGS
    prefetchCacheRef.current.clear()
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("haruko_tts_settings")
      } catch (e) {
        // Ignore write error
      }
    }
  }, [])

  // Load and listen to browser voices (for Web Speech mode)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return

    const synth = window.speechSynthesis

    const loadVoices = () => {
      const allVoices = synth.getVoices()
      if (allVoices.length > 0) {
        setVoices(allVoices)

        // Prioritize Vietnamese voice if no voice is selected yet
        setSettings((prev) => {
          if (!prev.voiceURI) {
            const viVoice = allVoices.find(
              (v) =>
                v.lang.toLowerCase().startsWith("vi") ||
                v.lang.toLowerCase().includes("vn") ||
                v.name.toLowerCase().includes("vietnam")
            )
            if (viVoice) {
              return { ...prev, voiceURI: viVoice.voiceURI }
            }
          }
          return prev
        })
      }
    }

    loadVoices()
    synth.onvoiceschanged = loadVoices

    return () => {
      synth.onvoiceschanged = null
    }
  }, [])

  // Clean raw markdown content for smooth pronunciation
  const cleanMarkdown = useCallback((text: string): string => {
    return text
      .replace(/\|\|(.*?)\|\|/g, "$1") // Remove spoiler pipes
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Extract link text
      .replace(/[*_~`#>]/g, "") // Remove formatting characters
      .replace(/-\s+/g, "") // Remove list hyphens
      .trim()
  }, [])

  // Auto-scroll helper to synchronize reading viewport with current audio chunk
  const triggerAutoScroll = useCallback((index: number) => {
    if (!settingsRef.current.autoScroll || typeof window === "undefined") return
    try {
      const chapterBody = document.querySelector(".chapter-body") as HTMLElement | null
      if (chapterBody && chunksRef.current.length > 0) {
        const progressRatio = index / Math.max(1, chunksRef.current.length - 1)
        const bodyRect = chapterBody.getBoundingClientRect()
        const absoluteTop = window.scrollY + bodyRect.top
        const targetY = absoluteTop + chapterBody.scrollHeight * progressRatio - window.innerHeight * 0.25
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: "smooth",
        })
      }
    } catch (e) {
      // Ignore scroll error
    }
  }, [])

  // Split chapter into cohesive speech chunks
  useEffect(() => {
    if (!content) {
      setChunks(chapterTitle ? [chapterTitle] : [])
      prefetchCacheRef.current.clear()
      return
    }

    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\u00C0-\u1EF9]/g, "")
    const normTitle = chapterTitle ? normalize(chapterTitle) : ""

    const rawParagraphs = content.split(/\n\s*\n/)
    const cleanedParagraphs: string[] = []

    rawParagraphs.forEach((p) => {
      const cleaned = cleanMarkdown(p)
      if (cleaned.length > 0) {
        cleanedParagraphs.push(cleaned)
      }
    })

    // Check if the very first paragraph already represents the chapter title
    let firstMatchesTitle = false
    if (cleanedParagraphs.length > 0 && normTitle) {
      const firstNorm = normalize(cleanedParagraphs[0])
      if (
        firstNorm === normTitle ||
        (firstNorm.length > 5 && normTitle.includes(firstNorm)) ||
        (normTitle.length > 5 && firstNorm.includes(normTitle))
      ) {
        firstMatchesTitle = true
      }
    }

    // Target ~850 to 1300 characters per chunk
    const TARGET_CHUNK_SIZE = 850
    const MAX_CHUNK_SIZE = 1300

    const blocksToBatch: string[] = []

    // If chapter title is not already in content, prepend it as the first block
    if (chapterTitle && !firstMatchesTitle) {
      blocksToBatch.push(chapterTitle)
    }

    cleanedParagraphs.forEach((p) => {
      // If a single paragraph is unusually long (> MAX_CHUNK_SIZE), split at sentence boundaries
      if (p.length > MAX_CHUNK_SIZE) {
        const sentences = p.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [p]
        sentences.forEach((s) => {
          const trimmed = s.trim()
          if (trimmed) blocksToBatch.push(trimmed)
        })
      } else {
        blocksToBatch.push(p)
      }
    })

    // Group blocks into cohesive speech chunks
    const batchedChunks: string[] = []
    let currentBatch: string[] = []
    let currentBatchLength = 0

    for (const block of blocksToBatch) {
      const blockLen = block.length

      // If adding this block exceeds MAX_CHUNK_SIZE and currentBatch is not empty,
      // finalize currentBatch and start a new batch
      if (currentBatch.length > 0 && currentBatchLength + blockLen + 2 > MAX_CHUNK_SIZE) {
        batchedChunks.push(currentBatch.join("\n\n"))
        currentBatch = [block]
        currentBatchLength = blockLen
        continue
      }

      // Add block to current batch
      currentBatch.push(block)
      currentBatchLength += blockLen + 2

      // If batch reached target size, complete this chunk
      if (currentBatchLength >= TARGET_CHUNK_SIZE) {
        batchedChunks.push(currentBatch.join("\n\n"))
        currentBatch = []
        currentBatchLength = 0
      }
    }

    // Flush any remaining blocks
    if (currentBatch.length > 0) {
      batchedChunks.push(currentBatch.join("\n\n"))
    }

    setChunks(batchedChunks.length > 0 ? batchedChunks : chapterTitle ? [chapterTitle] : [])
    setCurrentChunkIndex(0)
    prefetchCacheRef.current.clear()
  }, [content, chapterTitle, cleanMarkdown])

  // Helper: Fetch Gemini Audio for a specific chunk
  const fetchGeminiAudioChunk = useCallback(async (chunkIndex: number): Promise<string | null> => {
    const text = chunksRef.current[chunkIndex]
    if (!text) return null

    // Check client prefetch cache
    if (prefetchCacheRef.current.has(chunkIndex)) {
      return prefetchCacheRef.current.get(chunkIndex)!
    }

    const attemptFetch = async (retriesLeft = 2, delayMs = 2500): Promise<string | null> => {
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            voice: settingsRef.current.geminiVoice || "Puck",
            model: settingsRef.current.geminiModel || "gemini-3.1-flash-tts-preview",
            apiKey: settingsRef.current.customApiKey,
          }),
        })

        const data = await res.json()

        if (res.status === 429 && retriesLeft > 0) {
          console.warn(`[Gemini TTS] Rate limited (429). Retrying in ${delayMs}ms... (${retriesLeft} retries left)`)
          await new Promise((resolve) => setTimeout(resolve, delayMs))
          return attemptFetch(retriesLeft - 1, delayMs * 1.5)
        }

        if (!res.ok || !data.audio) {
          throw new Error(data.error || `HTTP ${res.status}`)
        }

        prefetchCacheRef.current.set(chunkIndex, data.audio)
        return data.audio
      } catch (err: any) {
        if (retriesLeft > 0 && err.message?.includes("429")) {
          await new Promise((resolve) => setTimeout(resolve, delayMs))
          return attemptFetch(retriesLeft - 1, delayMs * 1.5)
        }
        console.error("Gemini TTS Fetch Error:", err)
        throw err
      }
    }

    return attemptFetch()
  }, [])

  // Helper: Pre-fetch next chunk in background for gapless playback
  const prefetchNext = useCallback(
    (nextIdx: number) => {
      if (nextIdx < chunksRef.current.length && !prefetchCacheRef.current.has(nextIdx)) {
        fetchGeminiAudioChunk(nextIdx).catch(() => {
          // Prefetch failure is silent; playChunk will retry
        })
      }
    },
    [fetchGeminiAudioChunk]
  )

  // Web Speech playback logic
  const playWebSpeechChunk = useCallback(
    (index: number, currentPid: number) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return
      const currentList = chunksRef.current
      if (index < 0 || index >= currentList.length) {
        setIsPlaying(false)
        setIsPaused(false)
        return
      }

      // Stop any existing HTML5 audio immediately
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.src = ""
        audioRef.current.onended = null
        audioRef.current.onerror = null
      }

      const synth = window.speechSynthesis
      synth.cancel()

      const text = currentList[index]
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = settingsRef.current.rate
      utterance.pitch = settingsRef.current.pitch
      utterance.volume = settingsRef.current.volume

      // Resolve selected voice or fallback to Vietnamese
      if (settingsRef.current.voiceURI && voices.length > 0) {
        const selectedVoice = voices.find((v) => v.voiceURI === settingsRef.current.voiceURI)
        if (selectedVoice) {
          utterance.voice = selectedVoice
          utterance.lang = selectedVoice.lang
        }
      } else {
        const viVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("vi") ||
            v.lang.toLowerCase().includes("vn") ||
            v.name.toLowerCase().includes("vietnam")
        )
        if (viVoice) {
          utterance.voice = viVoice
          utterance.lang = viVoice.lang
        } else {
          utterance.lang = "vi-VN"
        }
      }

      utterance.onend = () => {
        // Prevent obsolete callbacks if superseded
        if (currentPid !== playbackIdRef.current || !isPlayingRef.current) return
        if (settingsRef.current.engine !== "webspeech") return

        const nextIndex = index + 1
        if (nextIndex < chunksRef.current.length) {
          setCurrentChunkIndex(nextIndex)
          playChunkRef.current(nextIndex)
        } else {
          setIsPlaying(false)
          setIsPaused(false)
        }
      }

      utterance.onerror = (e) => {
        if (currentPid !== playbackIdRef.current) return
        if (e.error !== "canceled" && e.error !== "interrupted") {
          setIsPlaying(false)
          setIsPaused(false)
        }
      }

      utteranceRef.current = utterance
      synth.speak(utterance)
      setIsPlaying(true)
      setIsPaused(false)
      setIsLoadingAudio(false)
      triggerAutoScroll(index)
    },
    [voices, triggerAutoScroll]
  )

  // Gemini AI Voice playback logic
  const playGeminiChunk = useCallback(
    async (index: number, currentPid: number) => {
      const currentList = chunksRef.current
      if (index < 0 || index >= currentList.length) {
        setIsPlaying(false)
        setIsPaused(false)
        setIsLoadingAudio(false)
        return
      }

      // 1. Immediately stop any active HTML5 audio and browser speech synthesis
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.src = ""
        audioRef.current.onended = null
        audioRef.current.onerror = null
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }

      setIsLoadingAudio(true)
      setTtsError(null)

      try {
        const audioSrc = await fetchGeminiAudioChunk(index)

        // 2. Check if this request is still the active playback session
        if (currentPid !== playbackIdRef.current || !isPlayingRef.current) {
          setIsLoadingAudio(false)
          return
        }

        if (!audioSrc) {
          setIsLoadingAudio(false)
          return
        }

        // Initialize Audio element
        if (!audioRef.current) {
          audioRef.current = new Audio()
        }

        const audio = audioRef.current
        audio.src = audioSrc
        audio.playbackRate = settingsRef.current.rate
        audio.volume = settingsRef.current.volume

        audio.onended = () => {
          // Verify session is still valid
          if (currentPid !== playbackIdRef.current || !isPlayingRef.current) return
          if (settingsRef.current.engine !== "gemini") return

          const nextIndex = index + 1
          if (nextIndex < chunksRef.current.length) {
            setCurrentChunkIndex(nextIndex)
            playChunkRef.current(nextIndex)
          } else {
            setIsPlaying(false)
            setIsPaused(false)
          }
        }

        audio.onerror = () => {
          if (currentPid !== playbackIdRef.current) return
          setIsPlaying(false)
          setIsPaused(false)
          setIsLoadingAudio(false)
          setTtsError("Không thể phát đoạn âm thanh này. Bạn có thể thử lại hoặc chuyển sang Web Speech.")
        }

        await audio.play()

        // Verify session after async play() call
        if (currentPid !== playbackIdRef.current || !isPlayingRef.current) {
          audio.pause()
          audio.src = ""
          return
        }

        setIsPlaying(true)
        setIsPaused(false)
        setIsLoadingAudio(false)
        triggerAutoScroll(index)

        // Prefetch subsequent chunk for seamless gapless playback
        prefetchNext(index + 1)
      } catch (err: any) {
        if (currentPid !== playbackIdRef.current) return
        console.error("Gemini playback error:", err)
        setIsPlaying(false)
        setIsPaused(false)
        setIsLoadingAudio(false)
        setTtsError(err.message || "Lỗi khi tải âm thanh từ Gemini TTS")
      }
    },
    [fetchGeminiAudioChunk, prefetchNext, triggerAutoScroll]
  )

  // Unified Play Chunk dispatcher with atomic playback token
  const playChunk = useCallback(
    (index: number) => {
      const currentPid = ++playbackIdRef.current
      isPlayingRef.current = true
      setIsPlaying(true)
      setIsPaused(false)

      if (settingsRef.current.engine === "gemini") {
        playGeminiChunk(index, currentPid)
      } else {
        playWebSpeechChunk(index, currentPid)
      }
    },
    [playGeminiChunk, playWebSpeechChunk]
  )

  // Keep ref synchronized for recursive playlist advancement
  playChunkRef.current = playChunk

  // Audio actions
  const startPlaying = useCallback(() => {
    if (chunks.length === 0) return
    playChunk(currentChunkIndex)
  }, [chunks.length, currentChunkIndex, playChunk])

  const pausePlaying = useCallback(() => {
    playbackIdRef.current++
    isPlayingRef.current = false
    setIsPlaying(false)
    setIsPaused(true)
    setIsLoadingAudio(false)

    if (settingsRef.current.engine === "gemini") {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.pause()
      }
    }
  }, [])

  const resumePlaying = useCallback(() => {
    if (settingsRef.current.engine === "gemini") {
      if (audioRef.current && audioRef.current.src && isPaused) {
        isPlayingRef.current = true
        setIsPaused(false)
        setIsPlaying(true)
        audioRef.current.play().catch(() => {
          playChunk(currentChunkIndex)
        })
      } else {
        playChunk(currentChunkIndex)
      }
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        if (isPaused) {
          window.speechSynthesis.resume()
          isPlayingRef.current = true
          setIsPaused(false)
          setIsPlaying(true)
        } else {
          playChunk(currentChunkIndex)
        }
      }
    }
  }, [currentChunkIndex, isPaused, playChunk])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pausePlaying()
    } else if (isPaused) {
      resumePlaying()
    } else {
      startPlaying()
    }
  }, [isPlaying, isPaused, pausePlaying, resumePlaying, startPlaying])

  const stopPlaying = useCallback(() => {
    playbackIdRef.current++
    isPlayingRef.current = false
    setIsPlaying(false)
    setIsPaused(false)
    setIsLoadingAudio(false)

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.src = ""
      audioRef.current.onended = null
      audioRef.current.onerror = null
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const prevChunk = useCallback(() => {
    const prevIndex = Math.max(0, currentChunkIndex - 1)
    setCurrentChunkIndex(prevIndex)
    if (isPlaying) {
      playChunk(prevIndex)
    }
  }, [currentChunkIndex, isPlaying, playChunk])

  const nextChunk = useCallback(() => {
    const nextIndex = Math.min(chunks.length - 1, currentChunkIndex + 1)
    setCurrentChunkIndex(nextIndex)
    if (isPlaying) {
      playChunk(nextIndex)
    }
  }, [chunks.length, currentChunkIndex, isPlaying, playChunk])

  // Cycle speed quickly (1.0 -> 1.25 -> 1.5 -> 2.0 -> 0.75 -> 1.0)
  const cycleSpeed = useCallback(() => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0]
    const currentIndex = speeds.findIndex((s) => Math.abs(s - settings.rate) < 0.05)
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length]
    updateSettings({ rate: nextSpeed })

    // If currently playing in webspeech mode, restart chunk to apply rate
    if (isPlaying && settings.engine === "webspeech") {
      playChunk(currentChunkIndex)
    }
  }, [currentChunkIndex, isPlaying, playChunk, settings.engine, settings.rate, updateSettings])

  // Test voice in modal
  const testVoice = useCallback(
    async (
      voiceIdOrUri: string,
      rate: number,
      pitch: number,
      volume: number,
      engine: "gemini" | "webspeech" = settings.engine
    ) => {
      // Stop any active chapter playback
      stopPlaying()

      // Stop any existing test audio
      if (testAudioRef.current) {
        testAudioRef.current.pause()
        testAudioRef.current.currentTime = 0
        testAudioRef.current.src = ""
      }

      setIsTestingVoice(true)

      if (engine === "gemini") {
        try {
          const testText = "Xin chào! Đây là giọng đọc trí tuệ nhân tạo Gemini trên Haruko Light Novel. Chúc bạn có trải nghiệm đọc truyện tuyệt vời!"
          const res = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: testText,
              voice: voiceIdOrUri || "Puck",
              model: settings.geminiModel || "gemini-3.1-flash-tts-preview",
              apiKey: settings.customApiKey,
            }),
          })
          const data = await res.json()
          if (!data.audio) throw new Error(data.error || "Không thể tải giọng đọc thử nghiệm")

          if (!testAudioRef.current) {
            testAudioRef.current = new Audio()
          }
          const audio = testAudioRef.current
          audio.src = data.audio
          audio.playbackRate = rate
          audio.volume = volume

          audio.onended = () => setIsTestingVoice(false)
          audio.onerror = () => setIsTestingVoice(false)

          await audio.play()
        } catch (e: any) {
          console.error("Test voice error:", e)
          setIsTestingVoice(false)
        }
      } else {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
          setIsTestingVoice(false)
          return
        }
        const synth = window.speechSynthesis
        const testText = "Xin chào! Đây là giọng đọc thử nghiệm trên Haruko Light Novel. Chúc bạn có trải nghiệm đọc truyện tuyệt vời!"
        const utterance = new SpeechSynthesisUtterance(testText)
        utterance.rate = rate
        utterance.pitch = pitch
        utterance.volume = volume

        const chosenVoice = voices.find((v) => v.voiceURI === voiceIdOrUri)
        if (chosenVoice) {
          utterance.voice = chosenVoice
          utterance.lang = chosenVoice.lang
        } else {
          utterance.lang = "vi-VN"
        }

        utterance.onend = () => setIsTestingVoice(false)
        utterance.onerror = () => setIsTestingVoice(false)

        synth.speak(utterance)
      }
    },
    [settings.customApiKey, settings.engine, settings.geminiModel, stopPlaying, voices]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      playbackIdRef.current++
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current.onended = null
        audioRef.current.onerror = null
      }
      if (testAudioRef.current) {
        testAudioRef.current.pause()
        testAudioRef.current.src = ""
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  return {
    settings,
    updateSettings,
    resetSettings,
    voices,
    isPlaying,
    isPaused,
    isLoadingAudio,
    currentChunkIndex,
    totalChunks: chunks.length,
    currentTextPreview: chunks[currentChunkIndex] || "",
    isTestingVoice,
    isSettingsOpen,
    setIsSettingsOpen,
    ttsError,
    setTtsError,
    togglePlay,
    startPlaying,
    pausePlaying,
    resumePlaying,
    stopPlaying,
    prevChunk,
    nextChunk,
    cycleSpeed,
    testVoice,
  }
}
