'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

export default function P5Sketch() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"
        strategy="beforeInteractive"
      />
      <Script 
        src="/p5/sketch.js" 
        strategy="afterInteractive"
      />
      <div ref={containerRef} className="w-full h-screen" />
    </>
  )
}