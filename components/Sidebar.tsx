'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Clapperboard, LayoutDashboard, History, Users, FileText,
  Settings, Key, HelpCircle, Plus, Sparkles, Play
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/stores/useAppStore'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Sparkles, label: 'Master Prompt Studio', href: '/prompts' },
  { icon: History, label: 'Riwayat Analisis', href: '/history' },
  { icon: Users, label: 'Channel & Target', href: '/channels' },
]

const systemItems = [
  { icon: Settings, label: 'Pengaturan', href: '/settings' },
  { icon: Key, label: 'Model & API', href: '/settings' },
  { icon: HelpCircle, label: 'Bantuan', href: '#' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const platform = useAppStore((s: any) => s.platform)
  const activeChannel = useAppStore((s: any) => s.activeChannel)
  const analyses = useAppStore((s: any) => s.analyses)
  const isMobileMenuOpen = useAppStore((s: any) => s.isMobileMenuOpen)
  const setMobileMenuOpen = useAppStore((s: any) => s.setMobileMenuOpen)

  const isYouTube = platform === 'youtube'

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-[280px] bg-white dark:bg-card border-r border-slate-200 dark:border-border flex flex-col shrink-0 h-screen fixed md:sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 transition-transform duration-300",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg shrink-0 transition-colors bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-red-600 dark:text-red-400">
              <Play className="size-5 fill-current" />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold mb-0.5 text-red-500">
                AI Content Engine
              </div>
              <h1 className="text-sm font-extrabold tracking-tight leading-none text-slate-900 dark:text-slate-100">
                KontenAI{' '}
                <span className="text-red-600 dark:text-red-400">
                  Pro
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {/* New Analysis button */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center w-full h-11 px-4 rounded-xl mb-4 font-semibold text-sm text-white shadow-md transition-all bg-red-600 hover:bg-red-700 shadow-red-500/20"
          >
            <Sparkles className="size-4 mr-2" />
            Analisis Baru
          </Link>

          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'group flex items-center w-full h-10 px-2.5 rounded-lg text-sm font-medium transition-all relative',
                  isActive
                    ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <item.icon className={cn(
                  'size-4 mr-3 transition-colors',
                  isActive
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                )} />
                {item.label}
                {isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500" />
                )}
              </Link>
            )
          })}

          {/* System section */}
          <div className="pt-6 pb-2">
            <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Sistem
            </div>
            {systemItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center w-full h-10 px-2.5 rounded-lg text-sm font-medium transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <item.icon className="size-4 mr-3 text-slate-400" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Active Channel & Tips */}
        <div className="p-4 border-t border-slate-100 dark:border-border/50">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-3 border border-slate-100 dark:border-border">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="size-3.5 text-amber-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Channel Aktif</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeChannel.emoji}</span>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{activeChannel.name}</div>
                <div className="text-[10px] text-slate-500 leading-relaxed line-clamp-1">{activeChannel.description}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
