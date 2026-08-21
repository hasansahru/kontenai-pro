'use client'

import { usePathname } from 'next/navigation'
import { Sun, Moon, Zap, Menu, Bot, Server } from 'lucide-react'
import { useAppStore } from '@/lib/stores/useAppStore'
import { cn } from '@/lib/utils'

export default function Header() {
  const pathname = usePathname()
  const isDark = useAppStore((s) => s.isDark)
  const toggleDark = useAppStore((s) => s.toggleDark)
  const platform = useAppStore((s) => s.platform)
  const aiProvider = useAppStore((s) => s.aiProvider)
  const selectedModel = useAppStore((s) => s.selectedModel)
  const googleModel = useAppStore((s) => s.googleModel)
  const toggleMobileMenu = useAppStore((s) => s.toggleMobileMenu)
  const isYouTube = platform === 'youtube'

  const activeModel = aiProvider === 'google' ? googleModel : selectedModel
  const isGoogle = aiProvider === 'google'

  // Determine page title based on pathname
  let pageTitle = 'Dashboard'
  if (pathname === '/history') pageTitle = 'Riwayat Analisis'
  else if (pathname === '/channels') pageTitle = 'Channel & Target'
  else if (pathname === '/settings') pageTitle = 'Pengaturan'

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 bg-white/80 dark:bg-card/80 backdrop-blur-md border-b border-slate-100 dark:border-border/50">
      {/* Left: Hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="size-5 text-slate-700 dark:text-slate-300" />
        </button>
        <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200 hidden sm:inline-block">
          {pageTitle}
        </span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-3">
        {/* Combined Model & Provider badge */}
        <div className="flex items-center h-9 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-border rounded-full overflow-hidden shadow-sm">
          {/* Provider side */}
          <div className={cn(
            "flex items-center gap-1.5 px-3 h-full border-r border-slate-200 dark:border-border transition-colors",
            isGoogle ? "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400" : "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400"
          )}>
            {isGoogle ? <Bot className="size-3.5" /> : <Server className="size-3.5" />}
            <span className="text-[10px] font-bold tracking-wide uppercase hidden sm:inline-block">
              {isGoogle ? 'Google AI' : '9Router'}
            </span>
          </div>
          {/* Model side */}
          <div className="flex items-center gap-1.5 px-3 h-full">
            <span className="flex h-1.5 w-1.5 relative">
              <span className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                isGoogle ? "bg-amber-400" : "bg-emerald-400"
              )} />
              <span className={cn(
                "relative inline-flex rounded-full h-1.5 w-1.5",
                isGoogle ? "bg-amber-500" : "bg-emerald-500"
              )} />
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {activeModel}
            </span>
          </div>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          aria-label="Toggle dark mode"
          className="size-9 shrink-0 rounded-full border border-slate-200 dark:border-border bg-white dark:bg-card text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm flex items-center justify-center transition-all hover:border-slate-300"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>
    </header>
  )
}
