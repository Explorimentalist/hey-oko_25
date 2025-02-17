'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cursorRef.current) return

    const cursor = cursorRef.current
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed w-4 h-4 bg-black rounded-full pointer-events-none mix-blend-difference z-50 -translate-x-1/2 -translate-y-1/2"
    />
  )
} 