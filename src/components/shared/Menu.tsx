'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin)
}

const menuItems = [
  { label: 'Hero', path: '#hero' },
  { label: 'About', path: '#about' },
  { label: 'AA (The Automobile Association)', path: '#project-aa' },
  { label: 'Pillsure', path: '#project-3' },
  { label: 'Maserati', path: '#project-1' },
  { label: 'Sópu & Elanji-Minnya', path: '#project-2' },
  { label: 'Archive', path: '#project-4' },
  { label: 'brianoko@gmail.com', path: 'mailto:brianoko@gmail.com' },
]

export function Menu() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isNearFooter, setIsNearFooter] = useState(false)
  const menuRef = useRef<HTMLElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        toggleMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    const items = itemsRef.current
    if (!items) return

    // Initial setup
    gsap.set(items, { 
      display: 'none',
      opacity: 0
    })

    gsap.set(itemRefs.current, {
      y: 20,
      opacity: 0
    })

    return () => {
      if (items) {
        gsap.killTweensOf([items, ...itemRefs.current])
      }
    }
  }, [])

  // Add effect to check if menu is near footer
  useEffect(() => {
    const checkFooterPosition = () => {
      const footer = document.querySelector('footer')
      if (!footer || !menuRef.current) return
      
      const footerRect = footer.getBoundingClientRect()
      const menuRect = menuRef.current.getBoundingClientRect()
      
      // Check if menu is overlapping or close to footer
      const isOverlapping = menuRect.bottom >= footerRect.top - 20
      
      if (isOverlapping !== isNearFooter) {
        setIsNearFooter(isOverlapping)
      }
    }
    
    // Check on initial load and on scroll
    checkFooterPosition()
    window.addEventListener('scroll', checkFooterPosition)
    window.addEventListener('resize', checkFooterPosition)
    
    return () => {
      window.removeEventListener('scroll', checkFooterPosition)
      window.removeEventListener('resize', checkFooterPosition)
    }
  }, [isNearFooter])

  const toggleMenu = () => {
    const items = itemsRef.current
    if (!items) return

    if (!isOpen) {
      // Opening animation
      gsap.set(items, { display: 'flex' })
      
      // Fade in the container
      gsap.to(items, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      })

      // Animate each item with stagger
      gsap.to(itemRefs.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power3.out'
      })
    } else {
      // Closing animation
      gsap.to(itemRefs.current, {
        y: 20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.03,
        ease: 'power3.in'
      })

      gsap.to(items, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(items, { display: 'none' })
        }
      })
    }

    setIsOpen(!isOpen)
  }

  const handleItemClick = (path: string) => {
    // Close the menu
    toggleMenu()
    
    // Check if it's a hash link for scrolling
    if (path.startsWith('#')) {
      // Smooth scroll to the section
      gsap.to(window, {
        duration: 1,
        scrollTo: path,
        ease: 'power2.inOut'
      })
    } else {
      // Navigate to a different page
      window.location.href = path
    }
  }

  return (
    <nav 
      ref={menuRef} 
      className={`fixed left-1/2 -translate-x-1/2 transition-all duration-300 ${
        isNearFooter ? 'bottom-[calc(100vh-100vh+180px)]' : 'bottom-8'
      } z-40 md:hidden`}
    >
      <div
        ref={itemsRef}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col gap-4 w-[min(400px,calc(100vw-2rem))] px-5 py-4 bg-zinc/80 backdrop-blur-md rounded-2xl overflow-hidden"
      >
        {menuItems.map((item, index) => (
          <button
            key={item.path}
            ref={(el) => {
              itemRefs.current[index] = el
            }}  
            onClick={() => handleItemClick(item.path)}
            className={`px-5 py-3 text-xl font-normal rounded-xl transition-colors ${
              pathname === item.path
                ? 'bg-white text-black'
                : 'text-zinc-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <button
        onClick={toggleMenu}
        className="w-20 h-10 bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/90 transition-colors text-white"
      >
        Menu
      </button>
    </nav>
  )
} 
