'use client'

import { Play, Music } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore, type Platform } from '@/lib/stores/useAppStore'

export default function PlatformSelector() {
  const platform = useAppStore((s) => s.platform)
  const setPlatform = useAppStore((s) => s.setPlatform)

  return (
    <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit">
      <PlatformBtn
        value="youtube"
        current={platform}
        onClick={() => setPlatform('youtube')}
        icon={<Play className="size-4 fill-current" />}
        label="YouTube"
        activeClass="bg-red-600 text-white shadow-md shadow-red-600/25"
      />
    </div>
  )
}

function PlatformBtn({
  value, current, onClick, icon, label, activeClass, activeLabel,
}: {
  value: Platform
  current: Platform
  onClick: () => void
  icon: React.ReactNode
  label: string
  activeClass: string
  activeLabel?: React.ReactNode
}) {
  const isActive = value === current
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200',
        isActive
          ? activeClass
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
      )}
    >
      {icon}
      {isActive && activeLabel ? activeLabel : label}
    </button>
  )
}
