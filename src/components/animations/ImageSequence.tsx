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

  // Debug log for props
  console.log("ImageSequence Props:", { 
    imagesCount: images.length, 
    firstImage: images[0],
    width, 
    height 
  })

  useEffect(() => {
    console.log("ImageSequence effect running with images:", images.length);
    
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      console.error("Canvas or context not available")
      return
    }

    // Set canvas dimensions
    canvas.width = width
    canvas.height = height
    console.log("Canvas dimensions set:", { width, height })

    // Load all images
    const loadImages = async () => {
      console.log("Starting to load images...")
      const loadedImages = await Promise.all(
        images.map((src, index) => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
              console.log(`Image ${index} loaded:`, src)
              resolve(img)
            }
            img.onerror = (err) => {
              console.error(`Failed to load image ${index}:`, src, err)
              // Try with cors attribute
              console.log(`Trying with CORS attribute for image ${index}`)
              img.crossOrigin = "anonymous"
              img.onload = () => {
                console.log(`Image ${index} loaded with CORS attribute:`, src)
                resolve(img)
              }
              img.onerror = () => {
                console.error(`Failed to load image ${index} even with CORS attribute:`, src)
                // Resolve with a dummy image to prevent the entire process from failing
                resolve(img)
              }
            }
            img.src = src
          })
        })
      )
      console.log(`Loaded ${loadedImages.length} images`)
      sequenceRef.current.images = loadedImages

      // Draw first frame
      if (loadedImages[0]) {
        context.drawImage(loadedImages[0], 0, 0, width, height)
        console.log("First frame drawn")
      } else {
        console.error("No images were loaded successfully")
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
        markers: true,
        onEnter: () => console.log("ScrollTrigger: entered"),
        onLeave: () => console.log("ScrollTrigger: left"),
        onEnterBack: () => console.log("ScrollTrigger: entered back"),
        onLeaveBack: () => console.log("ScrollTrigger: left back"),
        onUpdate: (self) => console.log("ScrollTrigger progress:", self.progress)
      },
      onUpdate: () => {
        const frameIndex = Math.round(sequenceRef.current.frame)
        const image = sequenceRef.current.images[frameIndex]
        console.log(`Rendering frame ${frameIndex}/${images.length-1}`)
        if (image) {
          context.clearRect(0, 0, width, height)
          context.drawImage(image, 0, 0, width, height)
        } else {
          console.error(`No image available for frame ${frameIndex}`)
        }
      },
    })

    console.log("GSAP animation set up")

    return () => {
      tl.kill()
    }
  }, [images, width, height])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ 
          zIndex: -1,
          backgroundColor: 'rgba(0,0,0,0.1)' // Slight background to show the canvas area
        }}
      />
      {/* Visual verification that images are being processed */}
      {images.length === 0 && (
        <div className="absolute top-4 left-4 bg-red-500 text-white p-2 z-50 rounded">
          No images loaded for sequence
        </div>
      )}
    </>
  )
} 