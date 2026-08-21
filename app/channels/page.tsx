'use client'

import MainLayout from '@/components/MainLayout'
import ChannelPicker from '@/components/ChannelPicker'
import { useAppStore } from '@/lib/stores/useAppStore'

export default function ChannelsPage() {
  const platform = useAppStore((s) => s.platform)
  const channels = useAppStore((s) => s.channels)
  const isYouTube = platform === 'youtube'

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-[800px] mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Channel & Target</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola channel dan persona konten kamu. {channels.length} channel terdaftar.
          </p>
        </div>

        <div className="bg-white dark:bg-card rounded-3xl border border-slate-200/60 dark:border-border shadow-sm p-6 md:p-8">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">Pilih Channel Aktif</h3>
          <p className="text-xs text-slate-500 mb-6">
            Channel yang dipilih akan digunakan sebagai persona dan style untuk semua analisis AI.
          </p>
          <ChannelPicker />
        </div>
      </div>
    </MainLayout>
  )
}
