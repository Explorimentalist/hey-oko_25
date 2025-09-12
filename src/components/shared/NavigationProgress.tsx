'use client'

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

// Base sections that are always available
const baseSections = [
  { id: 'hero-sequence-container', label: 'Welcome' },
  { id: 'about', label: 'About' }
]

// Register GSAP plugins in a client-side only effect
const registerPlugins = () => {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollToPlugin)
  }
}

export function NavigationProgress() {
  const [activeSection, setActiveSection] = useState('')
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const labelRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({})
  
  // Use state for sections to support dynamic additions
  const [sections, setSections] = useState(baseSections)

  // Register GSAP plugins
  useEffect(() => {
    registerPlugins()
  }, [])

  // Initialize window.__navigationSections in a separate effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.__navigationSections = [...baseSections]
    }
  }, [])

  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window === 'undefined') return

    // Set up observer to track which section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.15 } // Lower threshold to make sections activate sooner, especially for hero
    )
    
    // Create a separate observer with even lower threshold specifically for hero
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.05 } // Much lower threshold for hero section
    )
    
    // Listen for navigation sections updates from HomeProject components
    const handleSectionsUpdate = (event: CustomEvent) => {
      const updatedSections = event.detail.sections
      setSections(updatedSections)
      
      // Re-observe all sections
      observer.disconnect()
      heroObserver.disconnect()
      updatedSections.forEach(({ id }: { id: string }) => {
        const element = document.getElementById(id)
        if (element) {
          // Use appropriate observer based on section id
          if (id === 'hero-sequence-container') {
            heroObserver.observe(element)
          } else {
            observer.observe(element)
          }
        }
      })
    }
    
    // Observe initial sections with appropriate observers
    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        if (id === 'hero-sequence-container') {
          heroObserver.observe(element)
        } else {
          observer.observe(element)
        }
      }
    })
    
    // Add event listener for dynamic section updates
    window.addEventListener('navigationSectionsUpdated', handleSectionsUpdate as EventListener)

    return () => {
      observer.disconnect()
      heroObserver.disconnect()
      window.removeEventListener('navigationSectionsUpdated', handleSectionsUpdate as EventListener)
    }
  }, [sections])

  const handleHover = (id: string, isEntering: boolean) => {
    setHoveredSection(isEntering ? id : null)
    
    if (isEntering && labelRefs.current[id]) {
      gsap.fromTo(
        labelRefs.current[id],
        { 
          opacity: 0,
          x: -10
        },
        { 
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        }
      )
    }
  }

  const handleClick = (sectionId: string) => {
    if (typeof window !== 'undefined') {
      gsap.to(window, {
        duration: 1,
        scrollTo: `#${sectionId}`,
        ease: 'power2.inOut'
      })
    }
  }

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40 hidden md:flex">
      {sections.map(({ id, label }) => (
        <div
          key={id}
          className="relative group flex justify-end"
          onMouseEnter={() => handleHover(id, true)}
          onMouseLeave={() => handleHover(id, false)}
          onClick={() => handleClick(id)}
        >
          <div 
            className={`
              // Base styles for the navigation dot/pill
              relative cursor-pointer rounded-full
              transition-all duration-300 ease-out flex items-center

              // Dynamic height: expands to h-8 when hovered, otherwise stays as a 3px dot
              ${hoveredSection === id ? 'h-8' : 'h-[3px]'}

              // Dynamic width: expands to fit content when hovered, otherwise stays as a fixed w-8
              ${hoveredSection === id ? 'w-fit' : 'w-8'}

              // Background color logic (dark mode only):
              ${activeSection === id 
                ? 'bg-white' 
                : 'bg-zinc-600'}
            `}
          >
            <span 
              ref={(el: HTMLSpanElement | null) => { labelRefs.current[id] = el }}
              className={`
                text-sm px-4
                ${hoveredSection === id ? 'block' : 'hidden'}
                ${activeSection === id && hoveredSection === id 
                  ? 'text-black' 
                  : 'text-zinc-200'}
              `}
            >
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
} 
