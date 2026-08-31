'use client'

import { useState } from 'react'
import {
  FileText, Clapperboard, Type, Image, Hash, TrendingUp,
  Copy, Check, Sparkles, Target, Scissors
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore, type AnalysisResult } from '@/lib/stores/useAppStore'

type Tab = 'summary' | 'strategy' | 'segments' | 'titles' | 'thumbnail' | 'seo' | 'editing' | 'performance'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'summary', label: 'Ringkasan', icon: FileText },
  { id: 'strategy', label: 'Strategi & Growth', icon: TrendingUp },
  { id: 'segments', label: 'Segmen', icon: Clapperboard },
  { id: 'titles', label: 'Judul', icon: Type },
  { id: 'thumbnail', label: 'Thumbnail', icon: Image },
  { id: 'seo', label: 'SEO', icon: Hash },
  { id: 'editing', label: 'Editing', icon: Scissors },
  { id: 'performance', label: 'Performa', icon: Target },
]

function CopyButton({ text }: { text?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
    >
      {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
      {copied ? 'Tersalin' : 'Salin'}
    </button>
  )
}

function SectionTitle({ icon: Icon, title, badge }: { icon: React.ElementType; title: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between gap-2 mb-3">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
          <Icon className="size-4" />
        </div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{title}</h4>
      </div>
      {badge && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
          {badge}
        </span>
      )}
    </div>
  )
}

function SectionBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm space-y-3", className)}>
      {children}
    </div>
  )
}

function Section({ title, children, rightElement }: { title: string; children: React.ReactNode; rightElement?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{title}</h4>
        {rightElement}
      </div>
      {children}
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20", className)}>
      {children}
    </div>
  )
}

export default function AnalysisResultPanel({ analysis }: { analysis: AnalysisResult }) {
  const [activeTab, setActiveTab] = useState<Tab>('summary')
  const [activeShot, setActiveShot] = useState<number>(0)
  const { aiProvider, selectedModel, googleModel } = useAppStore()

  const activeModelName = aiProvider === 'google'
    ? (googleModel || 'Google Gemini')
    : (selectedModel || '9Router AI')

  const { result, platform, status, error } = analysis
  const isYouTube = platform === 'youtube'
  const accentColor = isYouTube ? 'text-red-600 dark:text-red-400 border-red-500' : 'text-blue-500 border-blue-500'

  if (status === 'loading') {
    return null
  }

  if (status === 'error') {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-800/30 p-10 flex flex-col items-center justify-center gap-4 min-h-[300px] text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-red-800 dark:text-red-400 mb-1">Analisis Gagal</h3>
          <p className="text-xs text-red-600/80 dark:text-red-400/80 max-w-[320px]">{error}</p>
        </div>
      </div>
    )
  }

  if (!result) return null

  const isShorts = Array.isArray(result.shots) && result.shots.length > 0
  const currentData: any = isShorts && Array.isArray(result.shots) && result.shots.length > 0
    ? result.shots[Math.min(activeShot, result.shots.length - 1)]
    : (result.video_panjang || result || {})

  // Helper extractor for Judul
  const judulBest = typeof currentData?.judul === 'string'
    ? currentData.judul
    : (currentData?.judul?.best_choice || (Array.isArray(currentData?.judul?.opsi) && currentData.judul.opsi[0]) || (Array.isArray(currentData?.judul) && currentData.judul[0]) || 'Judul Konten Terbaik')

  const judulAlasan = typeof currentData?.judul === 'object' && currentData.judul?.alasan_best_choice
    ? currentData.judul.alasan_best_choice
    : 'Judul dioptimalkan dengan formula psikologi klik dan kata kunci bervolume tinggi.'

  const judulOpsiList = typeof currentData?.judul === 'object' && Array.isArray(currentData.judul?.opsi)
    ? currentData.judul.opsi
    : (Array.isArray(currentData?.judul) ? currentData.judul : [])

  // Helper extractor for Thumbnail
  const thumbConcept = typeof currentData?.thumbnail === 'string'
    ? currentData.thumbnail
    : (currentData?.thumbnail?.konsep || 'Komposisi visual dramatis dengan kontras warna tinggi.')

  const thumbTeks = typeof currentData?.thumbnail === 'object' && currentData.thumbnail?.teks_thumbnail
    ? currentData.thumbnail.teks_thumbnail
    : 'RAHASIA UTAMA'

  const thumbPrompt = typeof currentData?.thumbnail === 'object' && currentData.thumbnail?.prompt_ai_image
    ? currentData.thumbnail.prompt_ai_image
    : (typeof currentData?.thumbnail === 'string' ? currentData.thumbnail : 'Cinematic lighting portrait, rule of thirds, dramatic shadows, 8k resolution')

  return (
    <div className="bg-white dark:bg-card rounded-3xl border border-slate-200/60 dark:border-border shadow-sm animate-slide-up overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-border/50">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', isYouTube ? 'bg-red-500' : 'bg-blue-500')} />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Hasil Analisis Konten AI</h3>
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-white">
            {isShorts ? 'YouTube Shorts' : 'Video Panjang'}
          </span>
        </div>
        <CopyButton text={JSON.stringify(result, null, 2)} />
      </div>

      {isShorts && Array.isArray(result.shots) && (
        <div className="px-4 pt-4 flex gap-2 overflow-x-auto">
          {result.shots.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveShot(i)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                activeShot === i
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
              )}
            >
              Shot {s.shot_number || i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-100 dark:border-border/50 px-2 mt-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all',
                isActive ? cn('border-current', accentColor) : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="p-6 space-y-4 animate-fade-in text-sm text-slate-700 dark:text-slate-300">
        {/* SUMMARY TAB */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <Section title="Ringkasan Utama">
              <Card>
                {typeof result.ringkasan === 'string' ? (
                  <p className="leading-relaxed">{result.ringkasan}</p>
                ) : (
                  <div className="grid gap-3">
                    <div><strong className="text-slate-900 dark:text-white">Judul Sumber:</strong> {result.ringkasan?.judul_video_sumber || 'Analisis Video'}</div>
                    <div><strong className="text-slate-900 dark:text-white">Ide Utama:</strong> {result.ringkasan?.ide_utama || 'Strategi konten viral.'}</div>
                    <div><strong className="text-slate-900 dark:text-white">Struktur:</strong> {result.ringkasan?.struktur_video || 'Hook -> Isi -> Resolusi'}</div>
                    <div><strong className="text-slate-900 dark:text-white">Durasi Estimasi:</strong> {result.ringkasan?.durasi_estimasi || '10:00'}</div>
                  </div>
                )}
              </Card>
            </Section>

            {result.psikologi_audiens && (
              <Section title="Psikologi Audiens">
                {typeof result.psikologi_audiens === 'string' ? (
                  <Card><p className="leading-relaxed">{result.psikologi_audiens}</p></Card>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-red-50/50 border-red-100 dark:bg-red-900/10">
                        <strong className="text-red-700 dark:text-red-400 block mb-2">Pain Points</strong>
                        <ul className="list-disc pl-4 space-y-1">
                          {Array.isArray(result.psikologi_audiens?.pain_point)
                            ? result.psikologi_audiens.pain_point.map((p, i) => <li key={i}>{p}</li>)
                            : <li>{String(result.psikologi_audiens?.pain_point || 'Rasa ragu & kebingungan')}</li>}
                        </ul>
                      </Card>
                      <Card className="bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10">
                        <strong className="text-emerald-700 dark:text-emerald-400 block mb-2">Desires</strong>
                        <ul className="list-disc pl-4 space-y-1">
                          {Array.isArray(result.psikologi_audiens?.desire)
                            ? result.psikologi_audiens.desire.map((p, i) => <li key={i}>{p}</li>)
                            : <li>{String(result.psikologi_audiens?.desire || 'Hasil nyata & kepastian')}</li>}
                        </ul>
                      </Card>
                    </div>
                    <Card className="mt-4">
                      <div className="grid gap-2">
                        <div><strong>Curiosity:</strong> {result.psikologi_audiens?.curiosity || 'Kunci rahasia di balik efektivitas metode'}</div>
                        <div><strong>Emotional Trigger:</strong> {result.psikologi_audiens?.emotional_trigger || 'Frustrasi vs Harapan Sukses'}</div>
                        <div><strong>Target Audience:</strong> {result.psikologi_audiens?.target_audience || 'Audiens umum yang ingin berkembang'}</div>
                      </div>
                    </Card>
                  </>
                )}
              </Section>
            )}
          </div>
        )}

        {/* STRATEGY TAB */}
        {activeTab === 'strategy' && (
          <div className="space-y-6">
            {result.skor_growth && (
              <Section title="Skor Growth (Potensi)">
                {typeof result.skor_growth === 'number' ? (
                  <Card className="text-center py-6">
                    <div className="text-4xl font-black text-emerald-500 mb-2">{result.skor_growth}/10</div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Skor Potensi Pertumbuhan Konten</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(result.skor_growth).map(([key, data], i) => {
                      const score = typeof data === 'object' && data !== null && 'score' in data ? (data as any).score : data
                      const alasan = typeof data === 'object' && data !== null && 'alasan' in data ? (data as any).alasan : ''
                      return (
                        <div key={i} className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">{key.replace(/_/g, ' ')}</div>
                          <div className="text-2xl font-black text-slate-800 dark:text-slate-200 mb-1">{score}/10</div>
                          {alasan && <div className="text-[10px] leading-tight text-slate-500">{alasan}</div>}
                        </div>
                      )
                    })}
                  </div>
                )}
              </Section>
            )}

            {currentData?.strategi_konten && (
              <Section title="Strategi Konten Baru">
                <Card className="space-y-4">
                  {typeof currentData.strategi_konten === 'string' ? (
                    <p className="leading-relaxed">{currentData.strategi_konten}</p>
                  ) : (
                    <>
                      <div><strong className="text-emerald-600">Big Idea:</strong> {currentData.strategi_konten?.big_idea || 'Solusi praktis dan mendalam.'}</div>
                      <div><strong className="text-blue-600">Unique Angle:</strong> {currentData.strategi_konten?.unique_angle || 'Pendekatan modern berbasis psikologi.'}</div>
                      <div><strong className="text-amber-600">Hook Utama:</strong> {currentData.strategi_konten?.hook_baru || 'Buka langsung dengan pola kontras.'}</div>
                    </>
                  )}
                </Card>
              </Section>
            )}
          </div>
        )}

        {/* SEGMENTS TAB */}
        {activeTab === 'segments' && currentData && (
          <div className="space-y-6">
            {!isShorts && currentData.strategi_konten?.opening_60_detik && (
              <Section title="🔥 Opening 60 Detik" rightElement={<CopyButton text={JSON.stringify(currentData.strategi_konten?.opening_60_detik, null, 2)} />}>
                <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200">
                  <div className="mb-4 text-xs italic text-amber-800 dark:text-amber-300">
                    Alasan: {currentData.strategi_konten?.opening_60_detik?.alasan || 'Mencegah drop retensi di awal.'}
                  </div>
                  {Array.isArray(currentData.strategi_konten?.opening_60_detik?.klip) && currentData.strategi_konten.opening_60_detik.klip.map((klip: any, i: number) => (
                    <div key={i} className="mb-4 pb-4 border-b border-amber-200/50 dark:border-amber-900/30 last:border-0 last:pb-0 last:mb-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
                        <span className="text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700">
                          🎬 Video Baru: {klip.video_baru_start || '00:00'} - {klip.video_baru_end || '00:30'}
                        </span>
                        <span className="text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded border border-blue-300 dark:border-blue-700">
                          📌 Ambil Sumber: {klip.sumber_start || klip.sumber_timestamp || '00:00'} - {klip.sumber_end || '00:30'}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">"{klip.narasi_sumber || klip.narasi || 'Narasi opening'}"</p>
                      {klip.catatan_editing && <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">🛠️ Edit: {klip.catatan_editing}</p>}
                    </div>
                  ))}
                </Card>
              </Section>
            )}

            {isShorts && currentData.segmen && (
              <Section title="Sumber Segmen Video" rightElement={<CopyButton text={JSON.stringify(currentData.segmen, null, 2)} />}>
                <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-sm font-black text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">
                      {currentData.segmen.start_time || '00:00'} - {currentData.segmen.end_time || '00:60'}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Durasi: {currentData.segmen.durasi || '60 detik'}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Alasan Pemilihan:</strong> {currentData.segmen.alasan || 'Klimaks pembahasan.'}
                  </p>
                </Card>
              </Section>
            )}

            {Array.isArray(currentData.strategi_konten?.outline) && currentData.strategi_konten.outline.length > 0 && (
              <Section title="Outline Utama" rightElement={<CopyButton text={JSON.stringify(currentData.strategi_konten.outline, null, 2)} />}>
                <div className="space-y-3">
                  {currentData.strategi_konten.outline.map((babak: any, i: number) => {
                    const sumberSegmen = Array.isArray(babak.sumber_segmen) && babak.sumber_segmen.length > 0 ? babak.sumber_segmen[0] : null
                    const sumberStart = sumberSegmen?.start || babak.sumber_start || '00:00'
                    const sumberEnd = sumberSegmen?.end || babak.sumber_end || '03:00'
                    const sumberCatatan = sumberSegmen?.catatan || babak.sumber_catatan || 'Diambil & direferensikan dari segmen video sumber'

                    return (
                      <Card key={i} className="dark:bg-slate-800/30 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/50 dark:border-border/40 pb-2">
                          <strong className="text-slate-900 dark:text-white text-sm">{babak.babak || `Babak ${i + 1}`}</strong>
                          <div className="flex flex-wrap gap-2 text-xs font-mono font-bold">
                            <span className="text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                              ⏱️ Video Baru: {babak.start_estimate || '00:00'} - {babak.end_estimate || '03:00'}
                            </span>
                            <span className="text-indigo-800 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-300 dark:border-indigo-800">
                              📍 Ambil Sumber: {sumberStart} - {sumberEnd}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{babak.isi || babak.deskripsi || ''}</p>
                        {sumberCatatan && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-100 dark:bg-slate-800/60 p-2 rounded-lg">
                            💡 Catatan Segmen Sumber: {sumberCatatan}
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </Section>
            )}
          </div>
        )}

        {/* TITLES TAB */}
        {activeTab === 'titles' && (
          <div className="space-y-6">
            <Section title="Rekomendasi Terbaik">
              <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-black">{judulBest}</h3>
                  <CopyButton text={judulBest} />
                </div>
                <p className="text-xs mt-2 opacity-80">Alasan: {judulAlasan}</p>
              </div>
            </Section>
            {judulOpsiList.length > 0 && (
              <Section title="Opsi Lainnya">
                <div className="space-y-2">
                  {judulOpsiList.map((j: string, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/30">
                      <span className="font-medium">{j}</span>
                      <CopyButton text={j} />
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}

        {/* THUMBNAIL TAB */}
        {activeTab === 'thumbnail' && (
          <div className="space-y-6">
            <Section title="Konsep & Komposisi">
              <Card className="space-y-3">
                <div><strong>Konsep Visual:</strong> {thumbConcept}</div>
                {typeof currentData?.thumbnail === 'object' && currentData.thumbnail?.komposisi && (
                  <div><strong>Komposisi:</strong> {currentData.thumbnail.komposisi}</div>
                )}
                <div><strong>Teks Thumbnail:</strong> <span className="font-black text-red-600 uppercase">"{thumbTeks}"</span></div>
                <div>
                  <strong>Warna Utama:</strong>
                  <div className="flex gap-2 mt-1">
                    {Array.isArray(currentData?.thumbnail?.warna)
                      ? currentData.thumbnail.warna.map((w: string, i: number) => <span key={i} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">{w}</span>)
                      : <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">Hitam & Kuning Emas</span>}
                  </div>
                </div>
              </Card>
            </Section>
            <Section title="AI Image Prompt (Midjourney / DALL-E)" rightElement={<CopyButton text={thumbPrompt} />}>
              <pre className="p-4 rounded-xl bg-slate-900 text-green-400 font-mono text-xs whitespace-pre-wrap">
                {thumbPrompt}
              </pre>
            </Section>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            {currentData?.deskripsi_youtube && (
              <Section title="Deskripsi YouTube / Caption" rightElement={<CopyButton text={currentData.deskripsi_youtube} />}>
                <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900/30 whitespace-pre-wrap text-sm leading-relaxed">
                  {currentData.deskripsi_youtube}
                </div>
              </Section>
            )}
            <Section title="Optimasi SEO & Keyword YouTube">
              <Card className="space-y-6">
                {/* Kata Kunci Utama */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <strong className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Kata Kunci Utama (Primary Keywords)</strong>
                    </div>
                    <CopyButton text={Array.isArray(currentData?.seo?.keyword_utama) ? currentData.seo.keyword_utama.join(', ') : (currentData?.seo?.keyword_utama || 'strategi konten, tips youtube, viral hook')} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(currentData?.seo?.keyword_utama)
                      ? currentData.seo.keyword_utama.map((k: string, i: number) => <span key={i} className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700/50 px-2.5 py-1 rounded-md text-xs font-semibold">{k}</span>)
                      : <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700/50 px-2.5 py-1 rounded-md text-xs font-semibold">{currentData?.seo?.keyword_utama || 'strategi konten'}</span>}
                  </div>
                </div>

                {/* Kata Kunci Turunan */}
                {currentData?.seo?.keyword_turunan && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <strong className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Kata Kunci Turunan (Long-Tail Keywords)</strong>
                      </div>
                      <CopyButton text={Array.isArray(currentData.seo.keyword_turunan) ? currentData.seo.keyword_turunan.join(', ') : currentData.seo.keyword_turunan} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(currentData.seo.keyword_turunan)
                        ? currentData.seo.keyword_turunan.map((k: string, i: number) => <span key={i} className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-1 rounded-md text-xs font-medium">{k}</span>)
                        : <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-1 rounded-md text-xs font-medium">{currentData.seo.keyword_turunan}</span>}
                    </div>
                  </div>
                )}

                {/* Tags YouTube (CSV) */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <strong className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Tags YouTube</strong>
                      <span className="ml-2 text-[11px] text-slate-500 font-normal">(Format Tag CSV untuk YouTube Studio)</span>
                    </div>
                    <CopyButton text={
                      Array.isArray(currentData?.seo?.tags)
                        ? currentData.seo.tags.join(', ')
                        : (Array.isArray(currentData?.seo?.keyword_utama)
                          ? [...currentData.seo.keyword_utama, ...(Array.isArray(currentData?.seo?.keyword_turunan) ? currentData.seo.keyword_turunan : [])].join(', ')
                          : 'strategi konten, tips youtube, viral hook')
                    } />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(currentData?.seo?.tags) ? currentData.seo.tags : (Array.isArray(currentData?.seo?.keyword_utama) ? currentData.seo.keyword_utama : ['strategi konten', 'tips youtube'])).map((t: string, i: number) => (
                      <span key={i} className="bg-blue-50 text-blue-800 dark:bg-blue-900/20 border border-dashed border-blue-300 dark:border-blue-700/50 px-2 py-0.5 rounded text-xs font-mono">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Hashtags */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <strong className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Hashtags YouTube</strong>
                    <CopyButton text={Array.isArray(currentData?.seo?.hashtags) ? currentData.seo.hashtags.join(' ') : (currentData?.seo?.hashtags || '#KontenAI #Creator #Viral')} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(currentData?.seo?.hashtags)
                      ? currentData.seo.hashtags.map((k: string, i: number) => <span key={i} className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 px-2.5 py-1 rounded-md text-xs font-medium">{k.startsWith('#') ? k : `#${k}`}</span>)
                      : <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 px-2.5 py-1 rounded-md text-xs font-medium">{currentData?.seo?.hashtags || '#KontenAI'}</span>}
                  </div>
                </div>

                {/* Rekomendasi Playlist */}
                {currentData?.seo?.playlist_recommendation && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <strong className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Rekomendasi Playlist YouTube</strong>
                      <CopyButton text={Array.isArray(currentData.seo.playlist_recommendation) ? currentData.seo.playlist_recommendation.join(', ') : currentData.seo.playlist_recommendation} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(currentData.seo.playlist_recommendation)
                        ? currentData.seo.playlist_recommendation.map((pl: string, i: number) => <span key={i} className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700/50 px-2.5 py-1 rounded-md text-xs font-semibold">{pl}</span>)
                        : <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700/50 px-2.5 py-1 rounded-md text-xs font-semibold">{currentData.seo.playlist_recommendation}</span>}
                    </div>
                  </div>
                )}
              </Card>
            </Section>
          </div>
        )}

        {/* EDITING TAB */}
        {activeTab === 'editing' && (
          <div className="space-y-6">
            <Section title="Rekomendasi Editing & Audio Visual">
              <Card>
                {typeof currentData?.editing === 'string' ? (
                  <p className="leading-relaxed">{currentData.editing}</p>
                ) : Array.isArray(currentData?.editing?.rekomendasi) ? (
                  <ul className="list-decimal pl-5 space-y-2">
                    {currentData.editing.rekomendasi.map((rek: string, i: number) => (
                      <li key={i}>{rek}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Gunakan transisi dinamis setiap 5 detik dan teks penekanan pada momen hook utama.</p>
                )}
              </Card>
            </Section>
          </div>
        )}

        {/* PERFORMANCE TAB */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <Section title="Prediksi Performa">
              <Card>
                <div className="text-center mb-4">
                  <div className="text-4xl font-black text-emerald-500">
                    {typeof currentData?.prediksi_performa === 'object' ? (currentData.prediksi_performa?.skor_keseluruhan || 9.0) : 9.0}/10
                  </div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Skor Potensi Keseluruhan</div>
                </div>
                <div className="text-center italic">
                  {typeof currentData?.prediksi_performa === 'string'
                    ? currentData.prediksi_performa
                    : (currentData?.prediksi_performa?.ringkasan || 'Potensi viral tinggi jika hook 10 detik pertama dieksekusi dengan baik.')}
                </div>
              </Card>
            </Section>

            <Section title="📅 Jadwal & Rekomendasi Upload Terbaik">
              <Card className="bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/40 space-y-3">
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500 block">Jam Upload Terbaik</span>
                    <span className="text-base font-black text-indigo-900 dark:text-indigo-200">
                      {currentData?.rekomendasi_upload?.jam_upload || '19:00 WIB (Puncak Prime Time)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500 block">Hari Rekomendasi</span>
                    <div className="flex gap-1.5 mt-0.5">
                      {(Array.isArray(currentData?.rekomendasi_upload?.hari_terbaik)
                        ? currentData.rekomendasi_upload.hari_terbaik
                        : ['Rabu', 'Jumat', 'Minggu']
                      ).map((hari: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                          {hari}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 pt-1 border-t border-indigo-100 dark:border-indigo-900/30">
                  <strong>💡 Alasan Optimal:</strong> {currentData?.rekomendasi_upload?.alasan || 'Puncak waktu luang penonton pada malam hari.'}
                </div>
                {currentData?.rekomendasi_upload?.hindari && (
                  <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                    ⚠️ <strong>Hindari Upload Pada:</strong> {currentData.rekomendasi_upload.hindari}
                  </div>
                )}
              </Card>
            </Section>

            <Section title="Checklist Produksi">
              <div className="space-y-2">
                {Array.isArray(currentData?.checklist) && currentData.checklist.length > 0 ? (
                  currentData.checklist.map((item: any, i: number) => {
                    const text = typeof item === 'string' ? item : item.item
                    return (
                      <div key={i} className="flex gap-3 items-center p-3 border rounded-lg bg-slate-50 dark:bg-slate-800/20">
                        <input type="checkbox" className="size-4" defaultChecked />
                        <span className="text-sm font-medium">{text}</span>
                      </div>
                    )
                  })
                ) : (
                  ['Thumbnail A/B test siap', 'Hook 0-3 detik teruji', 'Judul dioptimasi SEO', 'Deskripsi & Hashtag terpasang'].map((item, i) => (
                    <div key={i} className="flex gap-3 items-center p-3 border rounded-lg bg-slate-50 dark:bg-slate-800/20">
                      <input type="checkbox" className="size-4" defaultChecked />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))
                )}
              </div>
            </Section>
          </div>
        )}

      </div>
    </div>
  )
}
