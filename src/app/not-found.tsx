'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function NotFoundContent() {
  // useSearchParams is now safely wrapped in a component that will be rendered inside Suspense
  const searchParams = useSearchParams()
  
  // You can use searchParams here if needed
  const referrer = searchParams.get('from') || ''
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-6xl font-bold mb-6">404</h1>
      <h2 className="text-2xl mb-8">Page Not Found</h2>
      <p className="mb-8 max-w-md text-zinc-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6">404</h1>
          <h2 className="text-2xl mb-8">Page Not Found</h2>
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    }>
      <NotFoundContent />
    </Suspense>
  )
} 