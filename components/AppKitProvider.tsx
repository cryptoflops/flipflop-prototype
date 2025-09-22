'use client'

import { ReactNode } from 'react'
import '@/lib/appkit'

export default function AppKitProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}