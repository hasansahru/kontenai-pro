'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Play, Music, Brain, Target, MousePointerClick, Sparkles,
  Link2, Search, FileText, UploadCloud, Users, SlidersVertical,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/stores/useAppStore'
import MainLayout from '@/components/MainLayout'
import PlatformSelector from '@/components/PlatformSelector'
import ChannelPicker from '@/components/ChannelPicker'
import FormatPicker from '@/components/FormatPicker'
import AnalysisResult from '@/components/AnalysisResult'
import type { AnalysisResult as AnalysisResultType } from '@/lib/stores/useAppStore'

import {
  SYSTEM_PROMPT,
  VIDEO_INTELLIGENCE,
  AUDIENCE_PSYCHOLOGY,
  YOUTUBE_GROWTH,
  CONTENT_STRATEGIST,
  THUMBNAIL_PROMPT,
  SEO_PROMPT,
  OUTPUT_FORMAT as OUTPUT_FORMAT_SCHEMA,
  CHANNELS_DNA
} from '@/lib/prompts/suaraai'

function buildSystemPrompt(platform: string, channel: { id?: string; name: string; description: string }, format: string, duration: string, shots: number) {
  const isYouTube = platform === 'youtube'

  // Use exact markdown from backend if available, otherwise generate dynamic one
  const channelDna = channel.id && CHANNELS_DNA[channel.id]
    ? CHANNELS_DNA[channel.id]
    : `# DNA CHANNEL TARGET
Nama Channel: ${channel.name}
Karakteristik & Deskripsi: ${channel.description}`

  const userSettings = `# PENGATURAN USER SAAT INI (WAJIB DIIKUTI)
- Output Type: ${format === 'shorts' ? 'Shorts / Reels' : 'Video Panjang'}
- Durasi Target: ${duration}
- Jumlah Shots/Segmen yang Diminta: ${format === 'shorts' ? shots : 'N/A (hanya untuk Shorts)'}
- Platform: ${platform.toUpperCase()}`

  // Build the mega prompt according to SuaraAI backend structure
  const separator = "\n\n---\n\n"
  const sections = [
    SYSTEM_PROMPT,
    VIDEO_INTELLIGENCE,
    AUDIENCE_PSYCHOLOGY,
    YOUTUBE_GROWTH,
    CONTENT_STRATEGIST,
    channelDna,
    THUMBNAIL_PROMPT,
    SEO_PROMPT,
    OUTPUT_FORMAT_SCHEMA,
    userSettings
  ]

  return sections.join(separator)
}

export default function HomePage() {
  const platform = useAppStore((s) => s.platform)
  const url = useAppStore((s) => s.url)
  const setUrl = useAppStore((s) => s.setUrl)
  const notes = useAppStore((s) => s.notes)
  const setNotes = useAppStore((s) => s.setNotes)
  const keyword = useAppStore((s) => s.keyword)
  const setKeyword = useAppStore((s) => s.setKeyword)
  const activeChannel = useAppStore((s) => s.activeChannel)
  const outputFormat = useAppStore((s) => s.outputFormat)
  const targetDuration = useAppStore((s) => s.targetDuration)
  const shotCount = useAppStore((s) => s.shotCount)
  const selectedModel = useAppStore((s) => s.selectedModel)
  const aiProvider = useAppStore((s) => s.aiProvider)
  const googleApiKey = useAppStore((s) => s.googleApiKey)
  const googleModel = useAppStore((s) => s.googleModel)
  const routerApiKey = useAppStore((s) => s.routerApiKey)
  const addAnalysis = useAppStore((s) => s.addAnalysis)
  const updateAnalysis = useAppStore((s) => s.updateAnalysis)
  const analyses = useAppStore((s) => s.analyses)

  const [isLoading, setIsLoading] = useState(false)
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<'url' | 'manual'>('url')
  const [manualText, setManualText] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const id = params.get('id')
      if (id) {
        setCurrentAnalysisId(id)
      }
    }
  }, [])

  const isYouTube = platform === 'youtube'
  const latestAnalysis = currentAnalysisId
    ? analyses.find((a) => a.id === currentAnalysisId) ?? null
    : null

  // Disabled when: loading, or (url mode with empty url), or (manual mode with empty text)
  const canAnalyze = !isLoading && (inputMode === 'url' ? url.trim().length > 0 : manualText.trim().length > 0)

  const primaryColor = 'bg-red-600 hover:bg-red-700 shadow-red-600/25'

  const handleAnalyze = async () => {
    if (!canAnalyze) return
    setIsLoading(true)

    const inputRef = inputMode === 'url' ? url.trim() : `[TRANSKRIP MANUAL]\n\n${manualText.trim()}`

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const newAnalysis: AnalysisResultType = {
      id,
      url: inputMode === 'url' ? url.trim() : '(Transkrip Manual)',
      platform,
      channel: activeChannel,
      format: outputFormat,
      duration: targetDuration,
      shots: shotCount,
      timestamp: new Date().toISOString(),
      result: null,
      status: 'loading',
    }

    addAnalysis(newAnalysis)
    setCurrentAnalysisId(id)
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)

    try {
      const systemPrompt = buildSystemPrompt(platform, activeChannel, outputFormat, targetDuration, shotCount)
      const isYT = platform === 'youtube'
      const userMessage = inputMode === 'url'
        ? `Analisis konten YouTube berikut:

URL: ${url.trim()}
Platform: YOUTUBE
${notes ? `Catatan khusus: ${notes}` : ''}
${keyword ? `Kata kunci target: ${keyword}` : ''}

Jika kamu TIDAK BISA mengakses atau menonton isi video dari URL ini secara langsung (karena batasan sistem/browsing), JANGAN MENGARANG ISINYA. Langsung kembalikan JSON dengan summary berisi "Saya tidak dapat mengakses URL ini secara otomatis. Mohon gunakan opsi Transkrip Manual." dan kosongkan field lainnya.

${activeChannel.analyticsData ? `\n\n${activeChannel.analyticsData}\n\n` : ''}Hasilkan paket konten lengkap dalam format JSON.`
        : `Berikut adalah TRANSKRIP MANUAL dari konten yang ingin dianalisis:

---
${manualText.trim()}
---

Platform target: ${platform.toUpperCase()}
${notes ? `Catatan khusus: ${notes}` : ''}
${keyword ? `Kata kunci target: ${keyword}` : ''}

${activeChannel.analyticsData ? `\n\n${activeChannel.analyticsData}\n\n` : ''}Berdasarkan transkrip di atas, buat paket konten lengkap untuk channel kami. Hasilkan dalam format JSON.`

      // Call unified /api/analyze endpoint with 9Router & Combo-Maut support
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          platform,
          channel: activeChannel,
          format: outputFormat,
          duration: targetDuration,
          shots: shotCount,
          notes,
          keyword,
          model: selectedModel || 'Combo-Maut',
          aiProvider,
          googleApiKey,
          routerApiKey,
          googleModel,
          systemPrompt,
          userMessage,
        }),
      })

      const data = await response.json()

      if (data.result) {
        updateAnalysis(id, { status: 'success', result: data.result })
      } else {
        updateAnalysis(id, { status: 'error', error: data.error || 'Gagal mendapat respons AI' })
      }
    } catch (err: any) {
      updateAnalysis(id, { status: 'error', error: err.message || 'Koneksi ke AI gagal. Pastikan 9Router aktif.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-[1200px] mx-auto flex flex-col gap-6">

        {/* Welcome banner */}
        <div className="bg-white dark:bg-card rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={cn(
              'size-20 rounded-3xl flex items-center justify-center shrink-0 border relative overflow-hidden shadow-inner',
              isYouTube
                ? 'bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/40 dark:to-red-900/10 border-red-100/50 dark:border-red-800/30'
                : 'bg-white dark:bg-card border-slate-200 dark:border-border'
            )}>
              {isYouTube
                ? <Play className="size-9 text-red-600 dark:text-red-400 fill-current relative z-10" />
                : <Music className="size-9 text-white relative z-10" />
              }
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                Selamat datang! 👋
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Apa yang ingin Anda{' '}
                <span className={cn(isYouTube ? 'text-red-600 dark:text-red-400' : 'tiktok-text-gradient')}>
                  analisis
                </span>{' '}
                hari ini?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 pt-1">
                Tempel URL YouTube untuk mengekstrak insight mendalam dengan AI.
                <br />
                Dapatkan skrip, judul, thumbnail, hashtag, dan strategi siap pakai.
              </p>
            </div>
          </div>

          {/* Feature pills */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {[
              { icon: Sparkles, label: 'AI Powered', color: 'blue' },
              { icon: Brain, label: 'Deep Analysis', color: 'indigo' },
              { icon: Target, label: 'SEO Optimized', color: 'emerald' },
              { icon: MousePointerClick, label: 'CTR Focused', color: 'amber' },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold',
                  `bg-${color}-50 dark:bg-${color}-900/20 border-${color}-100 dark:border-${color}-800/30 text-${color}-700 dark:text-${color}-400`
                )}
              >
                <Icon className={`size-3.5 text-${color}-500`} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Platform + URL input */}
        <div className="bg-white dark:bg-card rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-border shadow-sm">
          <div className="space-y-6">
            {/* Platform selector */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <PlatformSelector />
              <div className="flex gap-2 w-full xl:w-auto">
                <button
                  onClick={() => setInputMode('url')}
                  className={cn(
                    'flex-1 xl:flex-none justify-center flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap',
                    inputMode === 'url'
                      ? cn('text-white shadow-md', primaryColor)
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  <Play className="size-3.5 shrink-0" />
                  URL Video
                </button>
                <button
                  onClick={() => setInputMode('manual')}
                  className={cn(
                    'flex-1 xl:flex-none justify-center flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap',
                    inputMode === 'manual'
                      ? cn('text-white shadow-md', primaryColor)
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  <FileText className="size-3.5 shrink-0" />
                  Transkrip Manual
                </button>
              </div>
            </div>

            {/* URL Input or Manual Transcript */}
            {inputMode === 'url' ? (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  URL Video YouTube
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      id="video-url-input"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                      placeholder="Tempel tautan YouTube... (e.g. https://www.youtube.com/watch?v=...)"
                      className="w-full h-12 pl-12 pr-4 rounded-2xl border text-sm bg-slate-50 dark:bg-slate-900/50 dark:border-border outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    />
                    <Link2 className="absolute left-4 top-3.5 size-5 text-slate-400" />
                  </div>
                  <button
                    id="analyze-btn"
                    onClick={handleAnalyze}
                    disabled={!canAnalyze}
                    className={cn(
                      'h-12 px-8 rounded-2xl text-white font-bold text-sm shadow-lg transition-all shrink-0 flex items-center gap-2',
                      !canAnalyze ? 'opacity-50 cursor-not-allowed bg-slate-400' : primaryColor
                    )}
                  >
                    {isLoading
                      ? <><Loader2 className="size-4 animate-spin" /> Menganalisis...</>
                      : <><Sparkles className="size-4" /> Analisis Sekarang</>
                    }
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Transkrip / Teks Konten
                </label>
                <textarea
                  id="manual-transcript-input"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  rows={8}
                  placeholder={`Tempel transkrip video atau isi konten yang ingin dianalisis...\n\nContoh:\n- Salin teks subtitle dari YouTube\n- Ketik poin-poin utama yang ingin diolah AI`}
                  className="w-full rounded-2xl border text-sm bg-slate-50 dark:bg-slate-900/50 dark:border-border p-4 resize-none outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
                <div className="flex items-center justify-between pt-1">
                  <p className="text-[10px] text-slate-400">
                    {manualText.length > 0 ? `${manualText.length} karakter` : 'Tempel teks konten di atas'}
                  </p>
                  <button
                    id="analyze-manual-btn"
                    onClick={handleAnalyze}
                    disabled={!canAnalyze}
                    className={cn(
                      'h-10 px-6 rounded-xl text-white font-bold text-sm shadow-lg transition-all flex items-center gap-2',
                      !canAnalyze ? 'opacity-50 cursor-not-allowed bg-slate-400' : primaryColor
                    )}
                  >
                    {isLoading
                      ? <><Loader2 className="size-4 animate-spin" /> Menganalisis...</>
                      : <><Sparkles className="size-4" /> Analisis Sekarang</>
                    }
                  </button>
                </div>
              </div>
            )}

            {/* Notes + Keyword */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-border/50">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  Catatan Khusus ke AI (Opsional)
                </label>
                <textarea
                  id="ai-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. Fokuskan pada aspek stoikisme praktis, gaya santai namun mendalam..."
                  className="w-full rounded-2xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-slate-900/50 text-xs p-4 resize-none outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  Riset Kata Kunci YouTube (Opsional)
                </label>
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-border rounded-2xl p-3 flex items-center gap-2 h-12 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
                  <Search className="size-4 text-slate-400 ml-1 shrink-0" />
                  <input
                    id="keyword-input"
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g. cara mengatasi cemas, stoikisme modern..."
                    className="bg-transparent border-none text-xs w-full focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
                <p className="text-[10px] text-slate-500 flex items-center gap-1.5 pl-1">
                  {isYouTube
                    ? '🔍 Dapatkan riset kata kunci terkait untuk optimasi SEO'
                    : ''
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Channel + Format settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Channel picker */}
          <div className="bg-white dark:bg-card rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-border shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
              <Users className="size-4 text-slate-500" />
              Target Channel & Persona
            </h3>
            <div className="mb-4 px-4 py-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl flex items-center gap-3">
              <div className="text-2xl">{activeChannel.emoji}</div>
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-400">
                  Channel Aktif: {activeChannel.name}
                </div>
                <div className="text-[10px] text-blue-600/70 dark:text-blue-400/70">
                  {activeChannel.description}
                </div>
              </div>
            </div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-3">
              Pilih Channel
            </label>
            <ChannelPicker />


          </div>

          {/* Format picker */}
          <div className="bg-white dark:bg-card rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-border shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
              <SlidersVertical className="size-4 text-slate-500" />
              Format Output & Durasi
            </h3>
            <FormatPicker />
          </div>
        </div>

        {/* Analysis Result */}
        {latestAnalysis && (
          <div ref={resultRef}>
            <AnalysisResult analysis={latestAnalysis} />
          </div>
        )}
      </div>
    </MainLayout>
  )
}
