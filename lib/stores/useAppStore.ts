'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Platform = 'youtube'
export type OutputFormat = 'shorts' | 'long' | 'series'

export interface Channel {
  id: string
  name: string
  emoji: string
  description: string
  platform: 'youtube'
  analyticsData?: string
}

export interface AnalysisResult {
  id: string
  url: string
  platform: Platform
  channel: Channel
  format: OutputFormat
  duration: string
  shots: number
  timestamp: string
  result: {
    ringkasan: {
      judul_video_sumber: string
      ide_utama: string
      struktur_video: string
      hook_sumber: string
      opening_terbaik: string
      durasi_estimasi: string
    }
    psikologi_audiens: {
      pain_point: string[]
      desire: string[]
      fear: string[]
      hope: string[]
      curiosity: string
      emotional_trigger: string
      target_audience: string
    }
    skor_growth: {
      ctr: { score: number; alasan: string }
      retention: { score: number; alasan: string }
      watch_time: { score: number; alasan: string }
      seo: { score: number; alasan: string }
      viral_potential: { score: number; alasan: string }
      evergreen: { score: number; alasan: string }
      emotional_impact: { score: number; alasan: string }
    }
    video_panjang?: {
      strategi_konten: {
        big_idea: string
        unique_angle: string
        hook_baru: string
        alternatif_hook: Array<{ tipe: string; teks: string; alasan: string }>
        opening_60_detik: {
          start_time: string
          end_time: string
          klip: Array<{
            video_baru_start: string
            video_baru_end: string
            sumber_start: string
            sumber_end: string
            narasi_sumber: string
            catatan_editing: string
          }>
          alasan: string
        }
        outline: Array<{
          babak: string
          isi: string
          start_estimate: string
          end_estimate: string
          sumber_segmen: Array<{ start: string; end: string; catatan: string }>
        }>
        cta: {
          teks_video: string
          komentar_pin: string
          postingan_komunitas: { teks: string; rekomendasi_gambar: string }
        }
      }
      momen_highlight_sumber: Array<{ start_time: string; end_time: string; durasi: string; alasan: string }>
      judul: { opsi: string[]; best_choice: string; alasan_best_choice: string }
      thumbnail: {
        konsep: string
        komposisi: string
        warna: string[]
        psikologi_warna: string
        prompt_ai_image: string
        teks_thumbnail: string
      }
      deskripsi_youtube: string
      seo: {
        keyword_utama: string[]
        keyword_turunan: string[]
        tags: string[]
        hashtags: string[]
        playlist_recommendation: string[]
      }
      editing: { rekomendasi: string[] }
      prediksi_performa: { ringkasan: string; skor_keseluruhan: number; catatan: string }
      checklist: Array<{ item: string; wajib: boolean }>
      rekomendasi_upload: {
        tersedia: boolean
        hari_terbaik: string[]
        jam_upload: string
        alasan: string
        hindari: string
      }
    }
    shots?: Array<{
      shot_number: number
      segmen: { start_time: string; end_time: string; durasi: string; alasan: string }
      strategi_konten: {
        big_idea: string
        unique_angle: string
        hook_baru: string
        alternatif_hook: Array<{ tipe: string; teks: string; alasan: string }>
        outline: Array<{ babak: string; isi: string }>
        cta: string
      }
      judul: { opsi: string[]; best_choice: string; alasan_best_choice: string }
      thumbnail: {
        konsep: string
        komposisi: string
        warna: string[]
        psikologi_warna: string
        prompt_ai_image: string
        teks_thumbnail: string
      }
      deskripsi_youtube: string
      seo: {
        keyword_utama: string[]
        keyword_turunan: string[]
        tags: string[]
        hashtags: string[]
        playlist_recommendation: string[]
      }
      editing: { rekomendasi: string[] }
      prediksi_performa: { ringkasan: string; skor_keseluruhan: number; catatan: string }
      checklist: Array<{ item: string; wajib: boolean }>
    }>
  } | null
  status: 'pending' | 'loading' | 'success' | 'error'
  error?: string
}

export const DEFAULT_CHANNELS: Channel[] = [
  {
    id: 'suara-filsuf',
    name: 'Suara Filsuf',
    emoji: '🧠',
    description: 'Filosofi populer, reflektif, tenang, dan dalam.',
    platform: 'youtube',
  },
  {
    id: 'nalar-senyap',
    name: 'Nalar Senyap',
    emoji: '🌿',
    description: 'Psikologi, healing, dan kontemplasi diri yang hangat.',
    platform: 'youtube',
  },
  {
    id: 'tutur-kyai',
    name: 'Tutur Kyai',
    emoji: '🕊️',
    description: 'Hikmah Islami, akhlak, dan nilai spiritual yang santun.',
    platform: 'youtube',
  },
]

export const YOUTUBE_MODELS = [
  'Combo-Maut',
  'ComToken',
  'Google',
  'inferx/Qwen3.8-27B-FP8',
  'inferx/deepseek-v4-flash',
  'kr/claude-sonnet-5',
  'ag/gemini-3.7-flash-high',
  'gemini/gemini-3.7-flash',
  'kr/gpt-5.6-sol',
  'gc/gemini-3.1-pro-preview',
]

export const GOOGLE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
]

interface AppState {
  // Theme
  isDark: boolean
  toggleDark: () => void

  // Mobile Menu
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  setMobileMenuOpen: (o: boolean) => void

  // Platform
  platform: Platform
  setPlatform: (p: Platform) => void

  // Settings
  aiProvider: '9router' | 'google'
  setAiProvider: (p: '9router' | 'google') => void
  selectedModel: string
  setModel: (m: string) => void
  routerApiKey: string
  setRouterApiKey: (k: string) => void
  googleApiKey: string
  setGoogleApiKey: (k: string) => void
  googleModel: string
  setGoogleModel: (m: string) => void

  // Channel
  channels: Channel[]
  activeChannel: Channel
  setActiveChannel: (c: Channel) => void
  addChannel: (c: Channel) => void

  // Analysis
  analyses: AnalysisResult[]
  addAnalysis: (a: AnalysisResult) => void
  updateAnalysis: (id: string, update: Partial<AnalysisResult>) => void
  deleteAnalysis: (id: string) => void
  clearHistory: () => void

  // Form state
  url: string
  setUrl: (u: string) => void
  notes: string
  setNotes: (n: string) => void
  keyword: string
  setKeyword: (k: string) => void
  outputFormat: OutputFormat
  setOutputFormat: (f: OutputFormat) => void
  targetDuration: string
  setTargetDuration: (d: string) => void
  shotCount: number
  setShotCount: (s: number) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleDark: () => set((s) => ({ isDark: !s.isDark })),

      isMobileMenuOpen: false,
      toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
      setMobileMenuOpen: (o) => set({ isMobileMenuOpen: o }),

      platform: 'youtube',
      setPlatform: (platform) =>
        set((s) => {
          return {
            platform: 'youtube',
            outputFormat: 'shorts',
            activeChannel: s.channels[0],
          }
        }),

      aiProvider: '9router',
      setAiProvider: (aiProvider) => set({ aiProvider }),
      selectedModel: 'Combo-Maut',
      setModel: (selectedModel) => set({ selectedModel }),
      googleApiKey: '',
      setGoogleApiKey: (googleApiKey) => set({ googleApiKey }),
      routerApiKey: 'sk-359ef6f88ed2d372-wi3lmm-fce3c847',
      setRouterApiKey: (routerApiKey) => set({ routerApiKey }),
      googleModel: 'gemini-3.6-flash',
      setGoogleModel: (googleModel) => set({ googleModel }),

      channels: DEFAULT_CHANNELS,
      activeChannel: DEFAULT_CHANNELS[0],
      setActiveChannel: (activeChannel) => set({ activeChannel }),
      addChannel: (c) => set((s) => ({ channels: [...s.channels, c] })),

      analyses: [],
      addAnalysis: (a) => set((s) => ({ analyses: [a, ...s.analyses].slice(0, 50) })),
      updateAnalysis: (id, update) =>
        set((s) => ({
          analyses: s.analyses.map((a) => (a.id === id ? { ...a, ...update } : a)),
        })),
      deleteAnalysis: (id) =>
        set((s) => ({
          analyses: s.analyses.filter((a) => a.id !== id),
        })),
      clearHistory: () => set({ analyses: [] }),

      url: '',
      setUrl: (url) => set({ url }),
      notes: '',
      setNotes: (notes) => set({ notes }),
      keyword: '',
      setKeyword: (keyword) => set({ keyword }),
      outputFormat: 'shorts',
      setOutputFormat: (outputFormat) => set({ outputFormat }),
      targetDuration: '30 detik',
      setTargetDuration: (targetDuration) => set({ targetDuration }),
      shotCount: 5,
      setShotCount: (shotCount) => set({ shotCount }),
    }),
    {
      name: 'kontenai-store',
      partialize: (s) => ({
        isDark: s.isDark,
        aiProvider: s.aiProvider,
        selectedModel: s.selectedModel,
        googleApiKey: s.googleApiKey,
        routerApiKey: s.routerApiKey,
        googleModel: s.googleModel,
        channels: s.channels,
        activeChannel: s.activeChannel,
        analyses: s.analyses,
        platform: s.platform,
      }),
    }
  )
)
