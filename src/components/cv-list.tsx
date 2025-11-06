"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface CVItem {
  role: string
  companyName: string
  sector?: string
  period: string
}

interface CVListProps {
  items: CVItem[]
  heading?: string
  columnCount?: 3 | 4
  headers?: {
    role: string
    companyName: string
    sector?: string
    period: string
  }
}

function CVRow({
  item,
  index,
  columnCount = 4,
}: {
  item: CVItem
  index: number
  columnCount?: 3 | 4
}) {
  const rowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = rowRef.current
    if (!el) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // Just show elements immediately for reduced motion
      const line = el.querySelector('.anim-line')
      const colSelector = columnCount === 4 
        ? '.anim-col1, .anim-col2, .anim-col3, .anim-col4'
        : '.anim-col1, .anim-col2, .anim-col4'
      const cols = el.querySelectorAll(colSelector)
      gsap.set(line, { scaleX: 1 })
      gsap.set(cols, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      // Get animation elements
      const line = el.querySelector('.anim-line')
      const columns = [
        el.querySelector('.anim-col1'),
        el.querySelector('.anim-col2'),
        columnCount === 4 ? el.querySelector('.anim-col3') : null,
        el.querySelector('.anim-col4'),
      ].filter(Boolean)

      // Set initial states
      gsap.set(line, { scaleX: 0, transformOrigin: "left center" })
      gsap.set(columns, { 
        opacity: 0, 
        y: 8,
        force3D: true 
      })

      // Create staggered animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top bottom-=10%",
          end: "center center",
          once: true
        }
      })

      // Base delay for staggering rows
      const baseDelay = index * 0.12

      // Add line animation
      tl.to(line, {
        scaleX: 1,
        duration: 0.4,
        ease: "power2.out"
      }, baseDelay)

      // Add column animations with stagger
      columns.forEach((col, colIndex) => {
        const delay = baseDelay + 0.2 + (colIndex * 0.15)
        tl.to(col, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        }, delay)
      })
    }, el)

    return () => ctx.revert()
  }, [index, columnCount])

  const gridCols = columnCount === 4 ? "grid-cols-3 md:grid-cols-4" : "grid-cols-3"
  
  return (
    <div
      ref={rowRef}
      className={`grid ${gridCols} gap-4 py-4 relative overflow-hidden cursor-pointer border border-transparent group`}
    >
      {/* Hover background */}
      <div className="absolute inset-0 bg-white origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100" />

      {/* Grey separating line (animated left -> right) */}
      <div className="anim-line pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-white/20 origin-left" />

      {/* FIRST COLUMN */}
      <div className="anim-col1 text-base font-light relative z-10 text-white transition-all duration-250 group-hover:text-black group-hover:pl-4 will-change-transform">
        {item.role}
      </div>

      {/* SECOND COLUMN */}
      <div className="anim-col2 text-base font-light relative z-10 text-white transition-colors duration-250 group-hover:text-black will-change-transform">
        {item.companyName}
      </div>

      {/* THIRD COLUMN - Only show if 4 columns and sector exists */}
      {columnCount === 4 && item.sector && (
        <div className="anim-col3 text-base font-light relative z-10 text-white transition-colors duration-250 group-hover:text-black hidden md:block will-change-transform">
          {item.sector}
        </div>
      )}

      {/* LAST COLUMN */}
      <div className="anim-col4 text-base font-light relative z-10 text-white transition-all duration-250 group-hover:text-black text-right group-hover:pr-4 will-change-transform">
        {item.period}
      </div>
    </div>
  )
}

export function CVList({ 
  items, 
  heading, 
  columnCount = 4,
  headers = {
    role: "Role",
    companyName: "Company Name", 
    sector: "Sector",
    period: "Period"
  }
}: CVListProps) {
  const gridCols = columnCount === 4 ? "grid-cols-3 md:grid-cols-4" : "grid-cols-3"
  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const headerRowRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const container = containerRef.current
    const headingEl = headingRef.current
    const headerRowEl = headerRowRef.current
    
    if (!container) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // Show elements immediately for reduced motion
      if (headingEl) gsap.set(headingEl, { opacity: 1 })
      if (headerRowEl) gsap.set(headerRowEl, { opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      // Set initial states for heading elements
      if (headingEl) {
        gsap.set(headingEl, { opacity: 0 })
      }
      if (headerRowEl) {
        gsap.set(headerRowEl, { opacity: 0 })
      }

      // Create timeline for heading animations
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top bottom-=20%",
          end: "top center",
          once: true
        }
      })

      // Add heading animation
      if (headingEl) {
        headerTl.to(headingEl, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        })
      }

      // Add header row animation with slight delay
      if (headerRowEl) {
        headerTl.to(headerRowEl, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out"
        }, "-=0.3") // Start 0.3s before previous animation ends
      }
    }, container)

    return () => ctx.revert()
  }, [])
  
  return (
    <div ref={containerRef} className="bg-black px-5 py-8">
      <div className="mx-auto w-full">
        {/* Section Heading */}
        {heading && (
          <h3 ref={headingRef} className="text-white text-2xl md:text-3xl font-light mb-8 md:mb-12">
            {heading}
          </h3>
        )}
        
        {/* Header Row */}
        <div ref={headerRowRef} className={`grid ${gridCols} gap-4 border-b border-white/20 pb-4`}>
          <div className="text-white/60 text-sm font-medium uppercase tracking-wider">{headers.role}</div>
          <div className="text-white/60 text-sm font-medium uppercase tracking-wider">{headers.companyName}</div>
          {columnCount === 4 && headers.sector && (
            <div className="text-white/60 text-sm font-medium uppercase tracking-wider hidden md:block">{headers.sector}</div>
          )}
          <div className="text-white/60 text-sm font-medium uppercase tracking-wider text-right">{headers.period}</div>
        </div>

        {/* CV Items */}
        <div>
          {items.map((item, index) => (
            <CVRow key={index} item={item} index={index} columnCount={columnCount} />
          ))}
        </div>
      </div>

    </div>
  )
}
