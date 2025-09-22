import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AppKitProvider from '@/components/AppKitProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlipFlop Prototype',
  description: 'Interactive P5.js NFT Art on Base blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppKitProvider>
          {children}
        </AppKitProvider>
      </body>
    </html>
  )
}
