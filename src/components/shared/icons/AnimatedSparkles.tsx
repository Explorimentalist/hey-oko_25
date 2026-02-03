'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Sparkles } from 'lucide-react'

export function AnimatedSparkles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const svg = containerRef.current.querySelector('svg')
    if (!svg) return

    // Get all path elements from the Sparkles icon
    const paths = Array.from(svg.querySelectorAll('path'))
    if (paths.length < 2) return

    // paths[0] = main star, all other paths = the small plus lines
    const star = paths[0]
    const smallPlusParts = paths.slice(1)

    gsap.set([star, ...smallPlusParts], { transformOrigin: '50% 50%' })

    const tl = gsap.timeline({ repeat: -1 })

    // 0-3s: Star rotates 5 times (1800 degrees)
    tl.to(star, { rotation: 1800, duration: 3, ease: 'circ.inOut' }, 0)

    // 3s: All small plus parts appear staggered (scale up + fade in over 0.3s with 0.1s delay between each)
    tl.fromTo(smallPlusParts, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, stagger: 0.1 }, 3)

    // 3-6s: All stay still (no rotation)
    // Just hold the current state

    // 6s: All small plus parts disappear staggered (scale down + fade out over 0.3s with 0.1s delay between each)
    tl.to(smallPlusParts, { scale: 0, opacity: 0, duration: 0.3, stagger: 0.1 }, 6)
  }, [])

  return (
    <div ref={containerRef} className="w-8 h-8">
      <Sparkles size={32} strokeWidth={1.5} />
    </div>
  )
}
