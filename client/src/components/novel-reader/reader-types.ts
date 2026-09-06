export type ReaderTheme =
  | "dark"
  | "oled"
  | "light"
  | "sepia"
  | "parchment"
  | "nord"
  | "forest"
  | "coffee"
  | "lavender"

export type ReaderFontFamily =
  | "sans"
  | "serif"
  | "be-vietnam-pro"
  | "literata"
  | "lora"
  | "merriweather"
  | "roboto"
  | "playfair"

export type ReaderLineHeight = "normal" | "relaxed" | "loose"
export type ReaderMaxWidth = "narrow" | "normal" | "wide"
export type ReaderAlign = "left" | "justify"

export type TtsEngine = "gemini" | "webspeech"

export interface GeminiVoiceOption {
  id: string
  name: string
  gender: "Nam" | "Nữ"
  tone: string
  recommended?: boolean
}

export const GEMINI_PREBUILT_VOICES: GeminiVoiceOption[] = [
  { id: "Puck", name: "Puck", gender: "Nam", tone: "Ấm áp, tự nhiên, diễn cảm", recommended: true },
  { id: "Kore", name: "Kore", gender: "Nữ", tone: "Trong trẻo, thanh thoát, nhẹ nhàng", recommended: true },
  { id: "Charon", name: "Charon", gender: "Nam", tone: "Trầm lắng, chững chạc, nam tính" },
  { id: "Aoede", name: "Aoede", gender: "Nữ", tone: "Truyền cảm, du dương, êm dịu" },
  { id: "Fenrir", name: "Fenrir", gender: "Nam", tone: "Mạnh mẽ, uy lực, dứt khoát" },
]

export interface TtsSettings {
  engine: TtsEngine
  geminiVoice: string
  geminiModel: string
  customApiKey?: string
  voiceURI: string
  rate: number
  pitch: number
  volume: number
  autoScroll: boolean
}

export const DEFAULT_TTS_SETTINGS: TtsSettings = {
  engine: "gemini",
  geminiVoice: "Puck",
  geminiModel: "gemini-3.1-flash-tts-preview",
  customApiKey: "",
  voiceURI: "",
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  autoScroll: true,
}

export interface ReaderSettings {
  theme: ReaderTheme
  fontSize: number
  fontFamily: ReaderFontFamily
  lineHeight: ReaderLineHeight
  maxWidth: ReaderMaxWidth
  textAlign: ReaderAlign
}

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  theme: "dark",
  fontSize: 18,
  fontFamily: "sans",
  lineHeight: "relaxed",
  maxWidth: "normal",
  textAlign: "left",
}

export interface ThemeColors {
  bg: string
  text: string
  muted: string
  border: string
  cardBg: string
  headerBg: string
  spoilerBg: string
  btnHover: string
}

export const THEME_CONFIGS: Record<ReaderTheme, ThemeColors> = {
  dark: {
    bg: "#141416",
    text: "#f4f4f5",
    muted: "#a1a1aa",
    border: "#27272a",
    cardBg: "#1e1e22",
    headerBg: "rgba(20, 20, 22, 0.9)",
    spoilerBg: "#27272a",
    btnHover: "rgba(255, 255, 255, 0.08)",
  },
  light: {
    bg: "#faf8f5",
    text: "#18181b",
    muted: "#71717a",
    border: "#e4e4e7",
    cardBg: "#f2efe9",
    headerBg: "rgba(250, 248, 245, 0.92)",
    spoilerBg: "#e4e4e7",
    btnHover: "rgba(0, 0, 0, 0.06)",
  },
  sepia: {
    bg: "#fbf0d9",
    text: "#2b1e14",
    muted: "#7d6a54",
    border: "#e5d5b7",
    cardBg: "#f2e3c4",
    headerBg: "rgba(251, 240, 217, 0.92)",
    spoilerBg: "#e2ceaa",
    btnHover: "rgba(43, 30, 20, 0.08)",
  },
  oled: {
    bg: "#000000",
    text: "#e4e4e7",
    muted: "#71717a",
    border: "#27272a",
    cardBg: "#0f0f10",
    headerBg: "rgba(0, 0, 0, 0.92)",
    spoilerBg: "#27272a",
    btnHover: "rgba(255, 255, 255, 0.1)",
  },
  parchment: {
    bg: "#f4eedb",
    text: "#2c241b",
    muted: "#80705f",
    border: "#e0d6be",
    cardBg: "#eae1cb",
    headerBg: "rgba(244, 238, 219, 0.92)",
    spoilerBg: "#ded3b8",
    btnHover: "rgba(44, 36, 27, 0.07)",
  },
  nord: {
    bg: "#161b22",
    text: "#e6edf3",
    muted: "#8b949e",
    border: "#30363d",
    cardBg: "#21262d",
    headerBg: "rgba(22, 27, 34, 0.92)",
    spoilerBg: "#30363d",
    btnHover: "rgba(240, 246, 252, 0.08)",
  },
  forest: {
    bg: "#0d1813",
    text: "#e2ede6",
    muted: "#7a9a88",
    border: "#1b2e25",
    cardBg: "#14241d",
    headerBg: "rgba(13, 24, 19, 0.92)",
    spoilerBg: "#1f372d",
    btnHover: "rgba(226, 237, 230, 0.08)",
  },
  coffee: {
    bg: "#181412",
    text: "#ede2da",
    muted: "#9c8b82",
    border: "#2c231e",
    cardBg: "#231b17",
    headerBg: "rgba(24, 20, 18, 0.92)",
    spoilerBg: "#352923",
    btnHover: "rgba(237, 226, 218, 0.08)",
  },
  lavender: {
    bg: "#171321",
    text: "#ede7f6",
    muted: "#9589a8",
    border: "#2b223c",
    cardBg: "#221a32",
    headerBg: "rgba(23, 19, 33, 0.92)",
    spoilerBg: "#34284d",
    btnHover: "rgba(237, 231, 246, 0.08)",
  },
}
