import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  title: 'ZPL to PDF Converter',
  description: 'Convert ZPL (Zebra Programming Language) code to PDF instantly. Paste your ZPL text or upload a .zpl file.',
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${_inter.variable} ${_jetbrainsMono.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
