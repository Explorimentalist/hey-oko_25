'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type { ProcessSlide } from '@/data/processSlides'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ProcessProps {
  slides: ProcessSlide[];
  className?: string;
}

export function Process({ slides, className }: ProcessProps) {
  if (!slides?.length) return null

  const sectionClasses = ['w-full']
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  if (className) {
    sectionClasses.push(className)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    const triggers: ScrollTrigger[] = []

    itemRefs.current.forEach((item) => {
      if (!item) return

      const media = item.querySelector('[data-process-media]')
      const text = item.querySelector('[data-process-text]')
      const targets = [media, text].filter(Boolean) as Element[]

      gsap.set(targets, { opacity: 0, y: 30 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          end: 'top 55%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        }
      })

      tl.to(media, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out'
      }, 0).to(text, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out'
      }, 0.1)

      if (tl.scrollTrigger) {
        triggers.push(tl.scrollTrigger)
      }
    })

    return () => {
      triggers.forEach(trigger => trigger.kill())
    }
  }, [])

  const setItemRef = (index: number) => (el: HTMLDivElement | null) => {
    itemRefs.current[index] = el
  }

  return (
    <section
      className={sectionClasses.join(' ')}
      aria-label="Project process slides"
    >
      <div className="space-y-12 md:space-y-14 lg:space-y-16">
        {slides.map((slide, index) => {
          const isVideo = slide.mediaType === 'video' || slide.mediaUrl.endsWith('.mp4') || slide.mediaUrl.endsWith('.webm')
          const descriptionParts = slide.description.split(/\n{2,}/)

          return (
            <div
              ref={setItemRef(index)}
              key={`${slide.title}-${index}`}
              className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start"
            >
              <div
                data-process-media
                className="col-span-4 order-1 md:order-1 md:col-span-4 lg:col-span-8 lg:col-start-1 overflow-hidden"
              >
                <div className="relative w-full h-full aspect-[4/3] lg:aspect-[16/9]">
                  {isVideo ? (
                    <video
                      src={slide.mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={slide.mediaUrl}
                      alt={slide.title}
                      fill
                      sizes="(max-width: 1024px) 90vw, 70vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                  )}
                </div>
              </div>

              <div
                data-process-text
                className="col-span-3 order-2 md:order-2 md:col-span-3 md:col-start-5 lg:col-span-3 lg:col-start-10 flex flex-col gap-3 lg:gap-4 self-start"
              >
                <h5 className="text-h5 text-white">{slide.title}</h5>
                <div className="space-y-2 text-small text-white/70 leading-relaxed">
                  {descriptionParts.map((part, partIndex) => (
                    <p key={partIndex} className="break-words">
                      {part}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
