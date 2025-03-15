'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Inner component that uses useSearchParams
function ScrollRestorationContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Primary effect to handle scroll restoration on page load/refresh
  useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined') return
    
    // Set browser's native scroll restoration to manual
    // This gives us control over the scroll position
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    // Function to scroll to top
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto' // Use 'auto' instead of 'smooth' for immediate scroll
      })
    }

    // Method 1: Use Performance API to detect page refresh
    let isRefresh = false
    if (window.performance && performance.getEntriesByType) {
      try {
        const navigationEntries = performance.getEntriesByType('navigation')
        if (navigationEntries.length > 0) {
          const navType = (navigationEntries[0] as PerformanceNavigationTiming).type
          isRefresh = navType === 'reload'
        }
      } catch (e) {
        console.error('Error using Performance API:', e)
      }
    }

    // Method 2: Check sessionStorage for refresh indicator
    const isRefreshing = sessionStorage.getItem('isRefreshing') === 'true'
    if (isRefreshing) {
      sessionStorage.removeItem('isRefreshing')
      isRefresh = true
    }

    // Method 3: First visit detection
    const storageKey = 'scrollRestorationVisited'
    const hasVisited = sessionStorage.getItem(storageKey)
    const isFirstVisit = !hasVisited

    // If this is a refresh or first visit, scroll to top
    if (isRefresh || isFirstVisit) {
      // Use requestAnimationFrame to ensure the scroll happens after the DOM is ready
      requestAnimationFrame(() => {
        scrollToTop()
      })
    }

    // Set visited flag for future checks
    if (isFirstVisit) {
      sessionStorage.setItem(storageKey, 'true')
    }

    // No cleanup needed for this effect
  }, []) // Only run on mount

  // Effect to handle beforeunload event
  useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined') return

    const handleBeforeUnload = () => {
      // Store the fact that we're about to refresh
      sessionStorage.setItem('isRefreshing', 'true')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, []) // Only run on mount

  // Effect to handle URL changes (not needed for refresh, but kept for completeness)
  useEffect(() => {
    // This effect intentionally does nothing for URL changes
    // It's here to show we're aware of URL changes but don't want to scroll on them
  }, [pathname, searchParams])

  return null // This component doesn't render anything
}

// Main component that wraps the content in a Suspense boundary
export function ScrollRestoration() {
  return (
    <Suspense fallback={null}>
      <ScrollRestorationContent />
    </Suspense>
  )
} 