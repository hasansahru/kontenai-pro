'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/stores/useAppStore'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const isDark = useAppStore((s) => s.isDark)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-background text-slate-900 dark:text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
