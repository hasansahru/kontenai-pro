import { Inter, Space_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KontenAI Pro — YouTube Content Intelligence',
  description: 'Analisis video YouTube dengan AI, generate skrip, judul, strategi, dan paket konten siap upload. Powered by 9Router.',
  keywords: ['AI konten', 'YouTube', 'skrip video', 'analisis konten', 'content creator'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
