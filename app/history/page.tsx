'use client'

import { Trash2, Play, Music, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useAppStore } from '@/lib/stores/useAppStore'
import MainLayout from '@/components/MainLayout'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function HistoryPage() {
  const analyses = useAppStore((s) => s.analyses)
  const deleteAnalysis = useAppStore((s) => s.deleteAnalysis)
  const clearHistory = useAppStore((s) => s.clearHistory)

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Riwayat Analisis</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {analyses.length} analisis tersimpan secara lokal
            </p>
          </div>
          {analyses.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
            >
              <Trash2 className="size-3.5" />
              Hapus Semua
            </button>
          )}
        </div>

        {analyses.length === 0 ? (
          <div className="bg-white dark:bg-card rounded-3xl border border-slate-200/60 dark:border-border p-16 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Belum ada riwayat</h3>
            <p className="text-sm text-slate-500 mt-2 mb-6">Mulai analisis pertama kamu!</p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20">
              Analisis Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => {
              const isYouTube = analysis.platform === 'youtube'
              const date = new Date(analysis.timestamp)
              return (
                <Link
                  href={`/?id=${analysis.id}`}
                  key={analysis.id}
                  className="block bg-white dark:bg-card rounded-2xl border border-slate-200/60 dark:border-border p-5 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {/* Platform icon */}
                    <div className={cn(
                      'size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                      isYouTube
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-600 group-hover:bg-red-200'
                        : 'bg-slate-900 text-tiktok-cyan group-hover:bg-slate-800'
                    )}>
                      {isYouTube ? <Play className="size-5 fill-current" /> : <Music className="size-5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* URL */}
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {analysis.url}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full',
                          isYouTube
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-slate-900 dark:bg-slate-800 text-tiktok-cyan'
                        )}>
                          {isYouTube ? 'YouTube' : 'TikTok'}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="size-3" />
                          {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' '}{date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {analysis.channel.emoji} {analysis.channel.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {analysis.duration} · {analysis.shots} shot
                        </span>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="shrink-0 flex items-center gap-3">
                      {analysis.status === 'success' && (
                        <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-semibold">
                          <CheckCircle className="size-4" />
                          Selesai
                        </div>
                      )}
                      {analysis.status === 'error' && (
                        <div className="flex items-center gap-1 text-red-500 text-[10px] font-semibold">
                          <AlertCircle className="size-4" />
                          Gagal
                        </div>
                      )}
                      {analysis.status === 'loading' && (
                        <div className="flex items-center gap-1 text-blue-500 text-[10px] font-semibold">
                          <Loader2 className="size-4 animate-spin" />
                          Proses...
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          deleteAnalysis(analysis.id)
                        }}
                        title="Hapus analisis ini"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Result preview */}
                  {analysis.result?.ringkasan?.ide_utama && (
                    <div className="mt-3 ml-14 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-border group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10 transition-colors">
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {analysis.result.ringkasan.ide_utama}
                      </p>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
