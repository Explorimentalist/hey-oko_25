'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ImageSequence } from '../animations/ImageSequence'
import { useTina } from 'tinacms/dist/react'
import { fallbackImages, getFallbackImages } from '@/data/fallbackImages'

// Register GSAP plugins in a client-side only effect
const registerPlugins = () => {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
  }
}

// Helper function to determine optimal image subset based on device
const getOptimalImageSubset = (images: string[], deviceWidth: number): string[] => {
  // Skip every N frames based on screen size to reduce total images
  // This significantly reduces the number of images to load on smaller devices
  let skipFrames = 1; // Default: use all frames
  
  if (deviceWidth < 768) {
    // Mobile: Use 1/3 of the frames
    skipFrames = 3;
  } else if (deviceWidth < 1024) {
    // Tablet: Use 1/2 of the frames
    skipFrames = 2;
  }
  
  // Filter images to include only every Nth frame
  return images.filter((_, index) => index % skipFrames === 0);
}

interface HomeSequenceData {
  projectConnection: {
    edges: Array<{
      node: {
        _sys: {
          filename: string
        }
        title: string
        sequence: string[]
      }
    }>
  }
}

export function HomeHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const endSpacerRef = useRef<HTMLDivElement>(null)
  
  // Track whether Tina data has been attempted to load
  const [tinaAttempted, setTinaAttempted] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

  // Register window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Register GSAP plugins
  useEffect(() => {
    registerPlugins()
  }, [])

  // Use optimized subset of fallback images for better performance
  // For performance reasons, use fewer images on mobile/tablet
  const optimizedFallbackCount = windowWidth < 768 ? 600 : (windowWidth < 1024 ? 1200 : 1800)
  const optimizedFallbackImages = getFallbackImages(optimizedFallbackCount, 0)

  // Fetch sequence images from TinaCMS
  const { data } = useTina<HomeSequenceData>({
    query: `query GetHomeSequence {
      projectConnection {
        edges {
          node {
            _sys {
              filename
            }
            title
            sequence
          }
        }
      }
    }`,
    variables: {},
    data: {
      projectConnection: {
        edges: []
      }
    },
  })

  // Set tinaAttempted to true once data is loaded or failed
  useEffect(() => {
    setTinaAttempted(true)
  }, [data])

  // Find the project with filename "home-sequence" or with title "Home Page Sequence"
  const homeSequenceProject = data?.projectConnection?.edges?.find(edge => 
    edge?.node?._sys?.filename === 'home-sequence' || 
    edge?.node?.title === 'Home Page Sequence'
  );
  
  // Get sequence images from the specific project
  const sequenceImages = homeSequenceProject?.node?.sequence || []
  
  // Use Tina images if available, otherwise use fallback
  const allImages = sequenceImages.length > 0 ? sequenceImages : optimizedFallbackImages
  
  // Get optimized subset of images based on device width
  const displayImages = getOptimalImageSubset(allImages, windowWidth)
  
  // Debug log with more details - only on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log("ALL Projects Data:", { 
        dataExists: !!data,
        tinaAttempted,
        edgesLength: data?.projectConnection?.edges?.length,
        projectDetails: data?.projectConnection?.edges?.map(edge => ({
          filename: edge?.node?._sys?.filename,
          title: edge?.node?.title,
          sequenceLength: edge?.node?.sequence?.length || 0
        })),
        foundHomeSequence: !!homeSequenceProject,
        sequenceImagesLength: sequenceImages.length,
        usingTinaImages: sequenceImages.length > 0,
        fallbackImagesCount: optimizedFallbackImages.length,
        totalAvailableFallbackImages: fallbackImages.length,
        displayImagesCount: displayImages.length,
        imageIndexInfo: `Using images 0 to ${displayImages.length - 1} (total: ${displayImages.length})`
      })
    }
  }, [data, tinaAttempted, homeSequenceProject, sequenceImages, optimizedFallbackImages, displayImages])

  useEffect(() => {
    if (!heroRef.current || typeof window === 'undefined') return

    // Create individual ScrollTriggers for each text element
    textRefs.current.forEach((textRef, index) => {
      if (!textRef) return

      // Create timeline for fade out animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: textRef,
          start: "top top",
          endTrigger: index < textRefs.current.length - 1 ? textRefs.current[index + 1] : endSpacerRef.current,
          end: "top top",
          pin: true,
          pinSpacing: false,
          markers: false, // Ensure markers are disabled
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = Math.max(0, (self.progress - 0.90) * 50)
            gsap.to(textRef, {
              opacity: 1 - progress,
              scale: 1 - (progress * 0.02),
              duration: 0.1,
            })
          },
        }
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const setTextRef = (index: number) => (el: HTMLDivElement | null) => {
    textRefs.current[index] = el
  }

  return (
    <>
      <section 
        ref={heroRef} 
        className="relative min-h-[100vh]"
        data-sequence-container="true"
        data-nav-section="Welcome"
        id="hero-sequence-container"
      >
        {/* Image sequence component with added optimization props */}
        <ImageSequence
          images={displayImages}
          width={1280}
          height={720}
          fadeConfig={{
            innerRadius: 0.5,
            outerRadius: 0.9,
            fadeOpacity: 0.3
          }}
          batchSize={windowWidth < 768 ? 5 : 10}  // Smaller batches on mobile
          preloadCount={windowWidth < 768 ? 3 : 5} // Fewer preloaded images on mobile
        />
        
        {/* Development indicator showing data source (only visible in development) */}
        {false && process.env.NODE_ENV === 'development' && (
          <div className="absolute top-4 right-4 z-50 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-xs">
            <div>Images: {sequenceImages.length > 0 ? 'Tina CMS ✅' : 'Fallback ⚠️'}</div>
            {sequenceImages.length === 0 && (
              <div className="text-xs opacity-75">
                Using {optimizedFallbackImages.length} of {fallbackImages.length} fallback images
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-[100vh]">
          <div ref={setTextRef(0)} className="text-display md:text-display font-bold text-center h-[100vh] flex items-center justify-center">
            <div>Design is a hell of a drug.</div>
          </div>
          <div ref={setTextRef(1)} className="text-display md:text-display font-bold text-center h-[100vh] flex items-center justify-center">
            <div>I craft it</div>
          </div>
          <div ref={setTextRef(2)} className="text-display md:text-display font-bold text-center h-[100vh] flex items-center justify-center">
            <div>package it</div>
          </div>
          <div ref={setTextRef(3)} className="text-display md:text-display font-bold text-center h-[100vh] flex items-center justify-center">
            <div>and distribute it</div>
          </div>
          <div ref={setTextRef(4)} className="text-display md:text-display font-bold text-center h-[100vh] flex items-center justify-center">
            <div>systematically and at scale.</div>
          </div>
        </div>
        {/* End spacer for the last element's pin */}
        <div ref={endSpacerRef} className="h-[200vh]" />
      </section>
    </>
  )
} 