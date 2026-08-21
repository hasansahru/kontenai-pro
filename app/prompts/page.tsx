'use client'

import { useState } from 'react'
import {
    Sparkles, Copy, Check, FileText, Video, HeartHandshake, Image as ImageIcon, Search, BarChart3, ArrowRight, Lightbulb
} from 'lucide-react'
import { cn } from '@/lib/utils'
import MainLayout from '@/components/MainLayout'
import { MASTER_PROMPTS, CSV_PERFORMANCE_INSIGHTS, type MasterPrompt } from '@/lib/prompts/csvMasterPrompts'
import { useAppStore } from '@/lib/stores/useAppStore'
import { useRouter } from 'next/navigation'

export default function PromptsPage() {
    const router = useRouter()
    const setUrl = useAppStore((s: any) => s.setUrl)
    const setNotes = useAppStore((s: any) => s.setNotes)
    const setKeyword = useAppStore((s: any) => s.setKeyword)
    const isDark = useAppStore((s: any) => s.isDark)

    const [selectedPrompt, setSelectedPrompt] = useState<MasterPrompt>(MASTER_PROMPTS[0])
    const [inputs, setInputs] = useState<Record<string, string>>({
        topik: 'Mengapa Jiwa Selalu Cemas Meski Segala Hal Tampak Baik-baik Saja? — Rahasia Ketenangan Syekh Abdul Qadir Al-Jailani',
        topik1: 'Mengapa Cinta Berubah Jadi Beban',
        topik2: 'Tetap Waras Saat Lingkungan Toxic',
        topik3: 'Filosofi Kintsugi - Merangkul Luka Masa Lalu',
        topik4: 'Ajaran Stoikisme & Sufi Mengendalikan Amarah',
        topik5: 'Berhenti Mengejar Validasi Orang Lain',
        masalah_utama: 'Rumah Mewah Tapi Batin Selalu Gelisah',
        visual_concept: 'A cracked ceramic heart or silhouette filled with glowing golden lines',
        topik_seo: 'Filsafat Kintsugi: Cara Menyembuhkan Luka Masa Lalu dan Menemukan Kedamaian Batin',
    })
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleInputChange = (key: string, val: string) => {
        setInputs((prev: Record<string, string>) => ({ ...prev, [key]: val }))
    }

    const generateFinalPrompt = (prompt: MasterPrompt) => {
        let result = prompt.template
        prompt.variables.forEach((v) => {
            const val = inputs[v] || `{${v}}`
            result = result.replaceAll(`{${v}}`, val)
        })
        return result
    }

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleUseInAnalyzer = (text: string) => {
        setNotes(text)
        router.push('/')
    }

    const getCategoryIcon = (category: MasterPrompt['category']) => {
        switch (category) {
            case 'longform': return Video
            case 'shorts': return Sparkles
            case 'religi': return HeartHandshake
            case 'thumbnail': return ImageIcon
            case 'seo': return Search
            default: return FileText
        }
    }

    return (
        <MainLayout>
            <div className="p-6 md:p-8 max-w-[1280px] mx-auto flex flex-col gap-8">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white border border-indigo-900/50 shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-0" />
                    <div className="relative z-10 space-y-3 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                            <Sparkles className="size-3.5 text-amber-400" />
                            ECC Content Intelligence Engine
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Master AI Prompt Studio & Performance Insights
                        </h1>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Disusun secara saintifik dari analisis data kinerja 3 channel YouTube (Suara Filsuf, Nalar Senyap, Tutur Kyai) untuk menghasilkan naskah, thumbnail AI, dan SEO berkonversi tinggi.
                        </p>
                    </div>
                </div>

                {/* CSV Performance Insights Section */}
                <div className="bg-white dark:bg-card rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-border shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30">
                            <BarChart3 className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Analisis Kinerja Data YouTube (28 Hari Terakhir)
                            </h2>
                            <p className="text-xs text-slate-500">
                                Pola topik & formula judul dengan CTR & Watch Time tertinggi dari 3 channel target.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                        {CSV_PERFORMANCE_INSIGHTS.map((item) => (
                            <div key={item.channel} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-border/60 rounded-2xl p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                        {item.channel}
                                    </h3>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                        {item.views} Views
                                    </span>
                                </div>
                                <div className="text-[11px] text-slate-500 flex gap-3">
                                    <span>Watch time: {item.watchTime}</span>
                                    <span>|</span>
                                    <span>Impresi: {item.impressions}</span>
                                </div>
                                <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-border/40">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Top Performer:</span>
                                    {item.topThemes.map((t) => (
                                        <div key={t.topic} className="flex justify-between items-center text-xs">
                                            <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]">{t.topic}</span>
                                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                                                CTR {t.ctr}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prompts Studio Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Prompt List Sidebar */}
                    <div className="lg:col-span-5 space-y-3">
                        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 px-1">
                            Pilih Master Prompt Template
                        </h2>
                        <div className="space-y-2.5">
                            {MASTER_PROMPTS.map((prompt) => {
                                const Icon = getCategoryIcon(prompt.category)
                                const isSelected = selectedPrompt.id === prompt.id
                                return (
                                    <button
                                        key={prompt.id}
                                        onClick={() => setSelectedPrompt(prompt)}
                                        className={cn(
                                            'w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-2',
                                            isSelected
                                                ? 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 shadow-sm'
                                                : 'bg-white dark:bg-card border-slate-200/70 dark:border-border hover:border-slate-300 dark:hover:border-slate-700'
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className={cn(
                                                    'p-1.5 rounded-lg text-xs',
                                                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                )}>
                                                    <Icon className="size-4" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-900 dark:text-white">{prompt.title}</span>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                                                {prompt.targetChannel}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 pl-8">
                                            {prompt.description}
                                        </p>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Selected Prompt Customizer & Output */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white dark:bg-card rounded-3xl p-6 border border-slate-200/60 dark:border-border shadow-sm space-y-6">
                            {/* Active Header */}
                            <div className="space-y-2 border-b border-slate-100 dark:border-border/50 pb-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        {selectedPrompt.title}
                                    </h3>
                                    <span className="text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold border border-blue-100 dark:border-blue-800">
                                        {selectedPrompt.targetChannel}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">{selectedPrompt.description}</p>
                                <div className="p-3 bg-amber-50/80 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                                    <Lightbulb className="size-4 shrink-0 text-amber-500 mt-0.5" />
                                    <span><strong>Wawasan Data:</strong> {selectedPrompt.performanceInsight}</span>
                                </div>
                            </div>

                            {/* Dynamic Variables Input */}
                            {selectedPrompt.variables.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                                        Kustomisasi Parameter Topik / Tema
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedPrompt.variables.map((v) => (
                                            <div key={v} className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 capitalize">
                                                    Parameter `{v}`:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={inputs[v] || ''}
                                                    onChange={(e) => handleInputChange(v, e.target.value)}
                                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Live Output Code Area */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Hasil Master Prompt Siap Pakai
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCopy(generateFinalPrompt(selectedPrompt), selectedPrompt.id)}
                                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all"
                                        >
                                            {copiedId === selectedPrompt.id ? (
                                                <><Check className="size-3.5 text-emerald-500" /> Tersalin!</>
                                            ) : (
                                                <><Copy className="size-3.5" /> Salin Prompt</>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleUseInAnalyzer(generateFinalPrompt(selectedPrompt))}
                                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
                                        >
                                            Kirim ke AI Analyzer <ArrowRight className="size-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="relative">
                                    <textarea
                                        readOnly
                                        rows={12}
                                        value={generateFinalPrompt(selectedPrompt)}
                                        className="w-full p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed border border-slate-800 resize-none outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
