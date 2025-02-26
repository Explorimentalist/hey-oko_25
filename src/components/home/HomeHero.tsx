'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ImageSequence } from '../animations/ImageSequence'
import { useTina } from 'tinacms/dist/react'

gsap.registerPlugin(ScrollTrigger)

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

  // Hardcoded fallback images in case Tina fails
  const fallbackImages = [
    'https://res.cloudinary.com/da4fs4oyj/image/upload/v1740430513/image_sequence_00108000_wnbo9p.png',
    'https://res.cloudinary.com/da4fs4oyj/image/upload/v1740430513/image_sequence_00108001_fibtwh.png',
    'https://res.cloudinary.com/da4fs4oyj/image/upload/v1740430513/image_sequence_00108003_dwf5ue.png',
    'https://res.cloudinary.com/da4fs4oyj/image/upload/v1740430513/image_sequence_00108002_uihfhq.png'
  ]

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
  const displayImages = sequenceImages.length > 0 ? sequenceImages : fallbackImages
  
  // Debug log with more details
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
    displayImages
  })

  useEffect(() => {
    if (!heroRef.current) return

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
      <section ref={heroRef} className="relative min-h-[100vh]">
        {/* Image sequence component */}
        <ImageSequence
          images={displayImages}
          width={1280}
          height={720}
        />
        
        {/* Development indicator showing data source (only visible in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-4 right-4 z-50 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-xs">
            Images: {sequenceImages.length > 0 ? 'Tina CMS ✅' : 'Fallback ⚠️'}
          </div>
        )}
        
        <div className="space-y-[100vh]">
          <div ref={setTextRef(0)} className="text-display md:text-display font-bold text-center h-[100vh] flex items-center justify-center">
            <div>Design is a hell of a drug.</div>
          </div>
          <div ref={setTextRef(1)} className="text-display md:text-display font-bold text-center h-[100vh] flex items-center justify-center">
            <div>I craft it,...</div>
          </div>
          <div ref={setTextRef(2)} className="text-display md:text-display font-bold text-center h-[100vh] flex items-center justify-center">
            <div>package it,...</div>
          </div>
          <div ref={setTextRef(3)} className="text-display md:text-display font-bold text-center h-[100vh] flex items-center justify-center">
            <div>and distribute it,...</div>
          </div>
          <div ref={setTextRef(4)} className="text-display md:text-display font-bold text-center h-[100vh] flex items-center justify-center">
            <div>Systematically and at scale.</div>
          </div>
        </div>
        {/* End spacer for the last element's pin */}
        <div ref={endSpacerRef} className="h-[100vh]" />
      </section>
    </>
  )
} 