'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ImageSequenceProps {
  images: string[]
  width: number
  height: number
}

export function ImageSequence({ images, width, height }: ImageSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sequenceRef = useRef({
    frame: 0,
    images: [] as HTMLImageElement[],
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    // Set canvas dimensions
    canvas.width = width
    canvas.height = height

    // Load all images
    const loadImages = async () => {
      const loadedImages = await Promise.all(
        images.map((src) => {
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.src = src
          })
        })
      )
      sequenceRef.current.images = loadedImages

      // Draw first frame
      if (loadedImages[0]) {
        context.drawImage(loadedImages[0], 0, 0, width, height)
      }
    }

    loadImages()

    // Create GSAP animation
    const tl = gsap.to(sequenceRef.current, {
      frame: images.length - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: canvas,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
      onUpdate: () => {
        const frameIndex = Math.round(sequenceRef.current.frame)
        const image = sequenceRef.current.images[frameIndex]
        if (image) {
          context.clearRect(0, 0, width, height)
          context.drawImage(image, 0, 0, width, height)
        }
      },
    })

    return () => {
      tl.kill()
    }
  }, [images, width, height])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full object-cover -z-10"
    />
  )
} 