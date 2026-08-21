'use client'

import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore, type Channel } from '@/lib/stores/useAppStore'

export default function ChannelPicker() {
  const channels = useAppStore((s) => s.channels)
  const activeChannel = useAppStore((s) => s.activeChannel)
  const setActiveChannel = useAppStore((s) => s.setActiveChannel)
  const platform = useAppStore((s) => s.platform)

  const filtered = channels

  return (
    <div className="flex flex-col gap-3">
      {filtered.map((channel) => {
        const isActive = activeChannel.id === channel.id
        return (
          <button
            key={channel.id}
            onClick={() => setActiveChannel(channel)}
            className={cn(
              'flex items-center justify-between p-4 rounded-2xl border transition-all text-left',
              isActive
                ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50 ring-1 ring-blue-500/20'
                : 'bg-white dark:bg-card border-slate-200 dark:border-border hover:border-slate-300 dark:hover:border-slate-700'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg shadow-sm border border-slate-800">
                {channel.emoji}
              </div>
              <div>
                <div className={cn(
                  'text-sm font-bold',
                  isActive
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-slate-900 dark:text-white'
                )}>
                  {channel.name}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 max-w-[200px] truncate">
                  {channel.description}
                </div>
              </div>
            </div>
            <div className={cn(
              'size-5 rounded-full flex items-center justify-center transition-all',
              isActive
                ? 'bg-blue-500 text-white'
                : 'border border-slate-300 dark:border-slate-600'
            )}>
              {isActive && <Check className="size-3" />}
            </div>
          </button>
        )
      })}

      {/* Edit active channel panel */}
      <div className="mt-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          ⚙️ Pengaturan Khusus: {activeChannel.name}
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
              Data Analytics Channel (Markdown)
            </label>
            <textarea
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] font-mono text-slate-600 dark:text-slate-400"
              placeholder="Paste data performa/analytics channel di sini (seperti rata-rata CTR, retensi, pola views). Data ini akan otomatis disisipkan ke AI setiap kali Anda menganalisis video untuk channel ini."
              value={activeChannel.analyticsData || ''}
              onChange={(e) => {
                const updatedChannels = channels.map(c =>
                  c.id === activeChannel.id ? { ...c, analyticsData: e.target.value } : c
                )
                useAppStore.setState({ channels: updatedChannels })
                setActiveChannel({ ...activeChannel, analyticsData: e.target.value })
              }}
            />
          </div>
        </div>
      </div>

      {/* Add channel button */}
      <button className="flex items-center gap-2 p-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
        <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Plus className="size-4" />
        </div>
        <span className="text-xs font-semibold">Tambah Channel Baru (Segera Hadir)</span>
      </button>
    </div>
  )
}
