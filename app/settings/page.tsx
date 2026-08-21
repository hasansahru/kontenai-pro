'use client'

import { useState } from 'react'
import { Zap, Check, Key, Bot, Activity, AlertCircle } from 'lucide-react'
import { useAppStore, YOUTUBE_MODELS, GOOGLE_MODELS } from '@/lib/stores/useAppStore'
import MainLayout from '@/components/MainLayout'
import { cn } from '@/lib/utils'

const MODEL_DESCRIPTIONS: Record<string, string> = {
  // 9Router models
  'Combo-Maut': 'Model default terbaik. Otomatis pilih model terkuat dengan failover cadangan.',
  'ComToken': 'Model Fallback super cepat & stabil (Poolside Laguna). Sangat direkomendasikan.',
  'Google': 'Grup model Google Gemini via 9Router dengan auto-fallback internal.',
  'inferx/Qwen3.8-27B-FP8': 'Qwen 3.8 — model penalaran dan coding open-source sangat tajam.',
  'inferx/deepseek-v4-flash': 'DeepSeek v4 Flash — kecepatan tinggi dan hemat waktu.',
  'kr/claude-sonnet-5': 'Claude Sonnet 5 — model tercerdas Claude untuk penulisan & analisis kreatif.',
  'ag/gemini-3.7-flash-high': 'Gemini 3.7 Flash High — performa generasi tinggi dengan konteks luas.',
  'gemini/gemini-3.7-flash': 'Gemini 3.7 Flash — responsif, cepat, dan akurat.',
  'kr/gpt-5.6-sol': 'GPT 5.6 Sol — model penalaran kelas atas OpenAI.',
  'gc/gemini-3.1-pro-preview': 'Gemini 3.1 Pro — model terbesar Google untuk tugas kompleks.',
  // Google AI Studio models
  'gemini-3.6-flash': 'Model tercepat & terbaru dari Google (Sangat Mumpuni).',
  'gemini-3.5-flash': 'Model sangat cepat dan stabil.',
  'gemini-2.5-flash': 'Model andal untuk tugas umum.',
  'gemini-2.5-pro': 'Model paling pintar dari Google untuk reasoning mendalam.',
}

export default function SettingsPage() {
  const aiProvider = useAppStore((s) => s.aiProvider)
  const setAiProvider = useAppStore((s) => s.setAiProvider)
  
  const selectedModel = useAppStore((s) => s.selectedModel)
  const setModel = useAppStore((s) => s.setModel)
  
  const googleApiKey = useAppStore((s) => s.googleApiKey)
  const setGoogleApiKey = useAppStore((s) => s.setGoogleApiKey)
  const routerApiKey = useAppStore((s) => s.routerApiKey)
  const setRouterApiKey = useAppStore((s) => s.setRouterApiKey)
  const googleModel = useAppStore((s) => s.googleModel)
  const setGoogleModel = useAppStore((s) => s.setGoogleModel)

  const [saved, setSaved] = useState(false)
  const [testStatus, setTestStatus] = useState<{ loading: boolean; type?: 'success' | 'error'; message?: string }>({ loading: false })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTestConnection = async (provider: '9router' | 'google') => {
    setTestStatus({ loading: true })
    try {
      const res = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey: provider === 'google' ? googleApiKey : routerApiKey,
          googleModel,
          model: selectedModel || 'Combo-Maut'
        })
      })
      const data = await res.json()
      setTestStatus({
        loading: false,
        type: data.success ? 'success' : 'error',
        message: data.message
      })
    } catch (err) {
      setTestStatus({
        loading: false,
        type: 'error',
        message: 'Terjadi kesalahan jaringan'
      })
    }
    setTimeout(() => setTestStatus({ loading: false }), 4000)
  }

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-[800px] mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Pengaturan AI</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Konfigurasi provider AI, model, dan API Key
          </p>
        </div>

        {/* AI Provider Selection */}
        <div className="bg-white dark:bg-card rounded-3xl border border-slate-200/60 dark:border-border shadow-sm p-6 md:p-8 mb-6">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4">Pilih Provider AI</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 9Router Option */}
            <button
              onClick={() => setAiProvider('9router')}
              className={cn(
                'flex flex-col gap-2 p-5 rounded-2xl border transition-all text-left',
                aiProvider === '9router'
                  ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-400 ring-1 ring-blue-500/20'
                  : 'border-slate-200 dark:border-border hover:border-slate-300 dark:hover:border-slate-600'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600">
                    <Zap className="size-4" />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-100">9Router (Free)</span>
                </div>
                {aiProvider === '9router' && <Check className="size-4 text-blue-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Gunakan server 9Router dengan puluhan model premium tanpa perlu API Key sendiri.
              </p>
            </button>

            {/* Google AI Studio Option */}
            <button
              onClick={() => setAiProvider('google')}
              className={cn(
                'flex flex-col gap-2 p-5 rounded-2xl border transition-all text-left',
                aiProvider === 'google'
                  ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-400 ring-1 ring-amber-500/20'
                  : 'border-slate-200 dark:border-border hover:border-slate-300 dark:hover:border-slate-600'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600">
                    <Bot className="size-4" />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-100">Google AI Studio</span>
                </div>
                {aiProvider === 'google' && <Check className="size-4 text-amber-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Gunakan API Key sendiri dari Google AI Studio untuk akses model Gemini secara langsung.
              </p>
            </button>
          </div>
        </div>

        {/* 9Router Settings */}
        {aiProvider === '9router' && (
          <div className="bg-white dark:bg-card rounded-3xl border border-slate-200/60 dark:border-border shadow-sm p-6 md:p-8 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                  <Zap className="size-4 text-blue-500" />
                  Pilih Model 9Router
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Model yang digunakan untuk analisis.
                </p>
              </div>
              <button
                onClick={() => handleTestConnection('9router')}
                disabled={testStatus.loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all"
              >
                <Activity className={cn("size-3.5", testStatus.loading && "animate-spin")} />
                {testStatus.loading ? 'Menguji...' : 'Tes Koneksi'}
              </button>
            </div>

            <div className="space-y-6">
              {/* API Key 9Router */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  9Router API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={routerApiKey}
                    onChange={(e) => setRouterApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full h-12 pl-12 pr-4 rounded-2xl border text-sm bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-border outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <Key className="absolute left-4 top-3.5 size-5 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  Masukkan API Key 9Router Anda (Opsional jika server mendukung akses tanpa kunci).
                </p>
              </div>

              {/* Select 9Router Model */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  Pilih Model 9Router
                </label>
                <div className="space-y-3 pt-2">
                  {YOUTUBE_MODELS.map((model) => {
                const isActive = selectedModel === model
                return (
                  <button
                    key={model}
                    onClick={() => setModel(model)}
                    className={cn(
                      'w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-300 dark:border-blue-700 ring-1 ring-blue-500/20'
                        : 'border-slate-200 dark:border-border hover:border-slate-300 dark:hover:border-slate-600'
                    )}
                  >
                    <div>
                      <div className={cn(
                        'text-sm font-bold',
                        isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'
                      )}>
                        {model}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {MODEL_DESCRIPTIONS[model] || 'Model 9Router premium'}
                      </div>
                    </div>
                    {isActive && (
                      <div className="size-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="size-3 text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Google AI Studio Settings */}
        {aiProvider === 'google' && (
          <div className="bg-white dark:bg-card rounded-3xl border border-slate-200/60 dark:border-border shadow-sm p-6 md:p-8 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="size-4 text-amber-500" />
                Konfigurasi Google AI Studio
              </h3>
              <button
                onClick={() => handleTestConnection('google')}
                disabled={testStatus.loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all"
              >
                <Activity className={cn("size-3.5", testStatus.loading && "animate-spin")} />
                {testStatus.loading ? 'Menguji...' : 'Tes Koneksi'}
              </button>
            </div>
            
            <div className="space-y-6">
              {/* API Key */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={googleApiKey}
                    onChange={(e) => setGoogleApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full h-12 pl-12 pr-4 rounded-2xl border text-sm bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-border outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                  <Key className="absolute left-4 top-3.5 size-5 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  Dapatkan API Key gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>. Key disimpan aman secara lokal.
                </p>
              </div>

              {/* Select Google Model */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  Pilih Model Gemini
                </label>
                <div className="space-y-3 pt-2">
                  {GOOGLE_MODELS.map((model) => {
                    const isActive = googleModel === model
                    return (
                      <button
                        key={model}
                        onClick={() => setGoogleModel(model)}
                        className={cn(
                          'w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left',
                          isActive
                            ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-300 dark:border-amber-700 ring-1 ring-amber-500/20'
                            : 'border-slate-200 dark:border-border hover:border-slate-300 dark:hover:border-slate-600'
                        )}
                      >
                        <div>
                          <div className={cn(
                            'text-sm font-bold',
                            isActive ? 'text-amber-700 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'
                          )}>
                            {model}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {MODEL_DESCRIPTIONS[model] || 'Google Gemini Model'}
                          </div>
                        </div>
                        {isActive && (
                          <div className="size-5 rounded-full bg-amber-500 flex items-center justify-center">
                            <Check className="size-3 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Result Alert */}
        {testStatus.type && (
          <div className={cn(
            "mb-6 p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300",
            testStatus.type === 'success' 
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300" 
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40 text-red-800 dark:text-red-300"
          )}>
            {testStatus.type === 'success' ? <Check className="size-5 mt-0.5 shrink-0" /> : <AlertCircle className="size-5 mt-0.5 shrink-0" />}
            <div>
              <div className="font-bold text-sm mb-0.5">
                {testStatus.type === 'success' ? 'Koneksi Berhasil' : 'Koneksi Gagal'}
              </div>
              <div className="text-xs opacity-90">{testStatus.message}</div>
            </div>
          </div>
        )}

        {/* Save button & Status */}
        <div className="flex items-center justify-between bg-white dark:bg-card rounded-3xl border border-slate-200/60 dark:border-border shadow-sm p-6 md:p-8">
          <button
            onClick={handleSave}
            className={cn(
              'flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all shadow-md',
              saved
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-slate-900/20 dark:shadow-white/20'
            )}
          >
            {saved ? <><Check className="size-4" /> Tersimpan!</> : 'Simpan Pengaturan'}
          </button>

          {aiProvider === '9router' ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              9Router Mode
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl">
              <Bot className="size-3.5" />
              Google Studio Mode
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
