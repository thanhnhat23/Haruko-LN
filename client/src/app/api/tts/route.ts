import { NextRequest, NextResponse } from "next/server"

// In-memory cache for generated WAV audio chunks
const audioCache = new Map<string, string>()
const MAX_CACHE_SIZE = 300

// Helper to convert 16-bit linear PCM (24000Hz mono) to standard RIFF WAV buffer
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8
  const blockAlign = (numChannels * bitsPerSample) / 8
  const dataSize = pcmBuffer.length
  const header = Buffer.alloc(44)

  // RIFF chunk descriptor
  header.write("RIFF", 0)
  header.writeUInt32LE(36 + dataSize, 4)
  header.write("WAVE", 8)

  // "fmt " sub-chunk
  header.write("fmt ", 12)
  header.writeUInt32LE(16, 16) // Subchunk1Size (16 for standard PCM)
  header.writeUInt16LE(1, 20) // AudioFormat (1 for PCM)
  header.writeUInt16LE(numChannels, 22)
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(byteRate, 28)
  header.writeUInt16LE(blockAlign, 32)
  header.writeUInt16LE(bitsPerSample, 34)

  // "data" sub-chunk
  header.write("data", 36)
  header.writeUInt32LE(dataSize, 40)

  return Buffer.concat([header, pcmBuffer])
}

function getCacheKey(model: string, voice: string, text: string): string {
  return `${model}::${voice}::${text.trim()}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, voice = "Puck", model = "gemini-3.1-flash-tts-preview", apiKey: userApiKey } = body

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Nội dung văn bản không được để trống" }, { status: 400 })
    }

    const trimmedText = text.trim()

    // Format model name for Google API
    const formattedModel = model.startsWith("models/") ? model : `models/${model}`

    // Check cache
    const cacheKey = getCacheKey(formattedModel, voice, trimmedText)
    if (audioCache.has(cacheKey)) {
      return NextResponse.json({
        audio: audioCache.get(cacheKey),
        cached: true,
      })
    }

    const apiKey =
      userApiKey && typeof userApiKey === "string" && userApiKey.trim().length > 0
        ? userApiKey.trim()
        : process.env.GEMINI_API_KEY

    const url = `https://generativelanguage.googleapis.com/v1beta/${formattedModel}:generateContent?key=${apiKey}`

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: trimmedText,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voice,
              },
            },
          },
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const status = response.status

      if (status === 429) {
        return NextResponse.json(
          {
            error: "Đã đạt giới hạn yêu cầu của Gemini API. Vui lòng chờ một lát hoặc chuyển sang giọng đọc Trình duyệt.",
            code: 429,
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        {
          error: errorData?.error?.message || `Lỗi từ Gemini API: HTTP ${status}`,
          details: errorData,
        },
        { status }
      )
    }

    const data = await response.json()
    const inlineData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData

    if (!inlineData?.data) {
      return NextResponse.json(
        {
          error: "Không nhận được dữ liệu âm thanh từ Gemini TTS. Bạn có thể chuyển sang giọng đọc Trình duyệt để tiếp tục.",
        },
        { status: 500 }
      )
    }

    // Convert raw PCM to standard WAV Data URL
    const pcmBuffer = Buffer.from(inlineData.data, "base64")
    const wavBuffer = pcmToWav(pcmBuffer, 24000, 1, 16)
    const audioDataUrl = `data:audio/wav;base64,${wavBuffer.toString("base64")}`

    // Store in cache (LRU eviction if limit reached)
    if (audioCache.size >= MAX_CACHE_SIZE) {
      const firstKey = audioCache.keys().next().value
      if (firstKey) audioCache.delete(firstKey)
    }
    audioCache.set(cacheKey, audioDataUrl)

    return NextResponse.json({
      audio: audioDataUrl,
      cached: false,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Đã xảy ra lỗi khi tạo âm thanh Gemini TTS",
      },
      { status: 500 }
    )
  }
}
