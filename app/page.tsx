'use client'

import dynamic from 'next/dynamic'
import ConnectWallet from '@/components/ConnectWallet'

// Dynamic import to prevent SSR issues with P5.js
const P5Sketch = dynamic(() => import('@/components/P5Sketch'), { 
  ssr: false,
  loading: () => <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-white">Loading sketch...</div>
  </div>
})

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-gray-900">
      <P5Sketch />
      <ConnectWallet />
      
      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg max-w-sm backdrop-blur-sm">
        <h1 className="text-xl font-bold mb-2">FlipFlop Prototype</h1>
        <p className="text-sm opacity-80">
          Interactive P5.js art on Base blockchain
        </p>
        <div className="mt-2 text-xs opacity-60">
          <p>• Click to clear canvas</p>
          <p>• Press 'S' to save screenshot</p>
          <p>• Press 'C' to clear</p>
        </div>
      </div>
    </main>
  )
}