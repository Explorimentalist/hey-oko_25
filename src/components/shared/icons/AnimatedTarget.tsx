'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Target } from 'lucide-react'

export function AnimatedTarget() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const svg = containerRef.current.querySelector('svg')
    if (!svg) return

    // Get all circle elements (the 3 concentric circles)
    const circles = Array.from(svg.querySelectorAll('circle'))
    if (circles.length < 3) return

    // Use the 3 circles reversed (innermost/smallest to outermost/largest)
    const concentricCircles = circles.slice(0, 3).reverse()

    gsap.set(concentricCircles, { transformOrigin: '50% 50%' })

    const tl = gsap.timeline({ repeat: -1 })

    // 0-0.9s: Circles appear staggered (0.3s each with 0.3s stagger)
    tl.fromTo(
      concentricCircles,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, stagger: 0.3, ease: 'circ.inOut' },
      0
    )

    // 0.9-1.9s: All circles stay visible (1s hold)
    // Just hold the current state

    // 1.9-2.8s: Circles fade out staggered in same order (opacity only, no scale)
    tl.to(
      concentricCircles,
      { opacity: 0, duration: 0.3, stagger: 0.2, ease: 'circ.inOut' },
      1.9
    )
  }, [])

  return (
    <div ref={containerRef} className="w-8 h-8">
      <Target size={32} strokeWidth={1.5} />
    </div>
  )
}
