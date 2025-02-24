'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ImageSequence } from '../animations/ImageSequence'
import { useTina } from 'tinacms/dist/react'

gsap.registerPlugin(ScrollTrigger)

interface HomeSequenceData {
  projectConnection: {
    edges: Array<{
      node: {
        sequence: string[]
      }
    }>
  }
}

export function HomeHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const endSpacerRef = useRef<HTMLDivElement>(null)

  // Fetch sequence images from TinaCMS
  const { data } = useTina<HomeSequenceData>({
    query: `query GetHomeSequence {
      projectConnection {
        edges {
          node {
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

  // Get the first project's sequence images
  const sequenceImages = data?.projectConnection?.edges?.[0]?.node?.sequence || []

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
        {sequenceImages.length > 0 && (
          <ImageSequence
            images={sequenceImages}
            width={1920}
            height={1080}
          />
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