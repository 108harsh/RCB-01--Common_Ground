import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReactNode } from 'react'
import { ClientSidebar } from './ClientSidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CareerOS',
  description: 'AI Career Operating System',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#0A0A0F] flex`}>
        <ClientSidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
          {children}
        </main>
      </body>
    </html>
  )
}
