'use client'

import { Smartphone, MonitorPlay, LayoutList, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore, type OutputFormat } from '@/lib/stores/useAppStore'

type FormatOption = {
  id: OutputFormat
  icon: React.ElementType
  label: string
  sub: string
  disabled?: boolean
}

const YOUTUBE_FORMATS: FormatOption[] = [
  {
    id: 'shorts',
    icon: Smartphone,
    label: 'Shorts / Reels',
    sub: '30 – 90 detik',
  },
  {
    id: 'long',
    icon: MonitorPlay,
    label: 'Video Panjang',
    sub: '8 mnt – 2 jam',
  },
  {
    id: 'series',
    icon: LayoutList,
    label: 'Video Series',
    sub: 'Segera Hadir',
    disabled: true,
  },
]

// Duration options per format
const SHORTS_DURATIONS = ['30 detik', '45 detik', '60 detik', '75 detik', '90 detik']
const LONG_DURATIONS = ['8 menit', '10 menit', '15 menit', '20 menit', '30 menit', '45 menit', '1 jam', '1.5 jam', '2 jam']

// Shot count options per format
const SHORT_SHOTS = [3, 5, 7, 10, 12, 15]
const LONG_SHOTS = [10, 15, 20, 30, 50, 80, 100]

const DURATION_TIPS: Record<string, string> = {
  // Shorts
  '30 detik': 'Cocok untuk konten singkat & langsung. Algoritma Shorts sangat menyukai video 30 detik penuh.',
  '45 detik': 'Balance antara informasi dan retensi. Ideal untuk storytime singkat.',
  '60 detik': 'Durasi maksimal Shorts klasik. Cukup untuk 1 poin utama dengan penjelasan.',
  '75 detik': 'Shorts+ yang memberikan ruang lebih untuk context dan build-up.',
  '90 detik': 'Durasi terpanjang Shorts. Pastikan hook sangat kuat di awal.',
  // Long video
  '8 menit': 'Durasi minimal untuk monetisasi YouTube. Ideal untuk tutorial singkat.',
  '10 menit': 'Sweet spot YouTube. Cukup panjang untuk mid-roll ads, tapi tidak membosankan.',
  '15 menit': 'Konten mendalam. Cocok untuk review, vlog, atau essay video.',
  '20 menit': 'Format long-form yang kuat. Pastikan pace editing tetap dinamis.',
  '30 menit': 'Konten marathon. Ideal untuk dokumenter mini atau deep-dive topik.',
  '45 menit': 'Semi-podcast format. Cocok untuk wawancara, diskusi, atau masterclass.',
  '1 jam': 'Konten premium panjang. Ideal untuk kelas online, dokumenter, atau watchalong.',
  '1.5 jam': 'Format film/dokumenter penuh. Pastikan struktur act jelas: intro, isi, resolusi.',
  '2 jam': 'Konten super-panjang. Cocok untuk live recording, podcast penuh, atau film pendek.',
}

function getDurationList(format: OutputFormat) {
  if (format === 'long') return LONG_DURATIONS
  return SHORTS_DURATIONS
}

function getShotList(format: OutputFormat) {
  if (format === 'long') return LONG_SHOTS
  return SHORT_SHOTS
}

export default function FormatPicker() {
  const outputFormat = useAppStore((s) => s.outputFormat)
  const setOutputFormat = useAppStore((s) => s.setOutputFormat)
  const targetDuration = useAppStore((s) => s.targetDuration)
  const setTargetDuration = useAppStore((s) => s.setTargetDuration)
  const shotCount = useAppStore((s) => s.shotCount)
  const setShotCount = useAppStore((s) => s.setShotCount)

  const formats = YOUTUBE_FORMATS
  const durations = getDurationList(outputFormat)
  const shotList = getShotList(outputFormat)
  const isLongFormat = outputFormat === 'long'

  const accentActive = 'bg-red-600 border-red-600 text-white shadow-md shadow-red-600/20'

  const durationActive = 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400'

  const shotActive = isLongFormat
    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400'
    : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-700 dark:text-indigo-400'

  const shotInfoBg = isLongFormat
    ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30'
    : 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800/30'

  const shotInfoText = isLongFormat
    ? 'text-blue-600 dark:text-blue-400'
    : 'text-indigo-600 dark:text-indigo-400'

  const shotInfoIcon = isLongFormat ? 'text-blue-400' : 'text-indigo-400'

  return (
    <div className="space-y-6">
      {/* Format */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
          Format Output
        </label>
        <div className="grid grid-cols-3 gap-3">
          {formats.map((fmt) => {
            const isActive = outputFormat === fmt.id
            return (
              <button
                key={fmt.id}
                onClick={() => {
                  if (fmt.disabled) return
                  setOutputFormat(fmt.id)
                  // Reset duration & shot to first option of new format
                  const newDurations = getDurationList(fmt.id)
                  setTargetDuration(newDurations[0])
                  const newShots = getShotList(fmt.id)
                  // Only reset shot if current shotCount not in new list
                  if (!newShots.includes(shotCount)) {
                    setShotCount(newShots[0])
                  }
                }}
                disabled={!!fmt.disabled}
                className={cn(
                  'flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl border transition-all',
                  fmt.disabled
                    ? 'border-slate-200 dark:border-border bg-slate-50/50 dark:bg-slate-900/20 text-slate-400 cursor-not-allowed'
                    : isActive
                      ? accentActive
                      : 'bg-white dark:bg-card border-slate-200 dark:border-border text-slate-600 dark:text-slate-400 hover:border-slate-300'
                )}
              >
                <fmt.icon className="size-4" />
                <span className="text-xs font-bold">{fmt.label}</span>
                <span className={cn('text-[9px]', isActive && !fmt.disabled ? 'opacity-75' : 'text-slate-400')}>
                  {fmt.sub}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
          Durasi Target
        </label>
        <div className="flex flex-wrap gap-2">
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => setTargetDuration(d)}
              className={cn(
                'px-4 py-2 text-xs font-semibold rounded-full border transition-all',
                targetDuration === d
                  ? durationActive
                  : 'bg-white dark:bg-card border-slate-200 dark:border-border text-slate-600 dark:text-slate-400 hover:border-slate-300'
              )}
            >
              {d}
            </button>
          ))}
        </div>
        {DURATION_TIPS[targetDuration] && (
          <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-border">
            <Info className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <span className="font-bold text-slate-700 dark:text-slate-300">{targetDuration}</span>{' '}
              — {DURATION_TIPS[targetDuration]}
            </p>
          </div>
        )}
      </div>

      {/* Shot count */}
      {!isLongFormat && (
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
            Jumlah Shot / Scene
          </label>
          <div className="flex flex-wrap gap-2">
            {shotList.map((s) => (
              <button
                key={s}
                onClick={() => setShotCount(s)}
                className={cn(
                  'px-4 py-2 text-xs font-semibold rounded-full border transition-all',
                  shotCount === s
                    ? shotActive
                    : 'bg-white dark:bg-card border-slate-200 dark:border-border text-slate-600 dark:text-slate-400 hover:border-slate-300'
                )}
              >
                {s} shot
              </button>
            ))}
          </div>
          <div className={cn('flex items-start gap-2 rounded-xl p-3 border', shotInfoBg)}>
            <Info className={cn('size-3.5 shrink-0 mt-0.5', shotInfoIcon)} />
            <p className={cn('text-[10px] leading-relaxed', shotInfoText)}>
              <span className="font-bold">{shotCount} shot</span>{' '}
              — AI akan menghasilkan {shotCount} scene berbeda untuk video Anda. Lebih banyak shot = variasi visual lebih kaya.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
