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
  const containerRef = useRef<HTMLDivElement>(null)
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

    // Set canvas dimensions based on aspect ratio
    const updateCanvasDimensions = () => {
      const container = canvas.parentElement
      if (!container) return
      
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight
      
      // Maintain aspect ratio of original dimensions
      const aspectRatio = width / height
      
      let canvasWidth, canvasHeight
      
      if (containerWidth / containerHeight > aspectRatio) {
        // Container is wider than the aspect ratio
        canvasHeight = Math.min(containerHeight, height)
        canvasWidth = canvasHeight * aspectRatio
      } else {
        // Container is taller than the aspect ratio
        canvasWidth = Math.min(containerWidth, width)
        canvasHeight = canvasWidth / aspectRatio
      }
      
      // Set canvas dimensions
      canvas.width = canvasWidth
      canvas.height = canvasHeight
      
      console.log("Canvas dimensions updated:", { canvasWidth, canvasHeight })
      
      // Redraw current frame if images are loaded
      const frameIndex = Math.round(sequenceRef.current.frame)
      const image = sequenceRef.current.images[frameIndex]
      if (image) {
        drawImage(image, canvasWidth, canvasHeight)
      }
    }
    
    // Initial update
    updateCanvasDimensions()
    
    // Update on resize
    window.addEventListener('resize', updateCanvasDimensions)
    
    // Helper function to draw image with proper scaling
    const drawImage = (image: HTMLImageElement, canvasWidth: number, canvasHeight: number) => {
      if (!context) return
      
      context.clearRect(0, 0, canvasWidth, canvasHeight)
      
      // Calculate scaling to maintain aspect ratio
      const scale = Math.min(
        canvasWidth / image.width,
        canvasHeight / image.height
      )
      
      // Calculate centered position
      const x = (canvasWidth - image.width * scale) / 2
      const y = (canvasHeight - image.height * scale) / 2
      
      // Draw image with proper scaling and centering
      context.drawImage(
        image, 
        0, 0, image.width, image.height,
        x, y, image.width * scale, image.height * scale
      )
    }

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
        const canvasWidth = canvas.width
        const canvasHeight = canvas.height
        drawImage(loadedImages[0], canvasWidth, canvasHeight)
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
        trigger: "[data-sequence-container]", // Use the section with data-sequence-container attribute
        start: "top top",
        end: "bottom bottom", // Use the natural end of the container
        scrub: 0.5,
        markers: false, // Always hide markers
        onUpdate: (self) => {
          // Only log in development to reduce console noise
          if (process.env.NODE_ENV === 'development') {
            console.log("ScrollTrigger progress:", self.progress)
          }
        }
      },
      onUpdate: () => {
        const frameIndex = Math.round(sequenceRef.current.frame)
        const image = sequenceRef.current.images[frameIndex]
        // Only log in development to reduce console noise
        if (process.env.NODE_ENV === 'development') {
          console.log(`Rendering frame ${frameIndex}/${images.length-1}`)
        }
        if (image) {
          const canvasWidth = canvas.width
          const canvasHeight = canvas.height
          drawImage(image, canvasWidth, canvasHeight)
        } else {
          console.error(`No image available for frame ${frameIndex}`)
        }
      },
    })

    // Create a separate ScrollTrigger to control visibility
    // This ensures the sequence fades out when scrolling past the HomeHero section
    gsap.fromTo(
      containerRef.current,
      { opacity: 1, visibility: 'visible' },
      {
        opacity: 0,
        visibility: 'hidden',
        scrollTrigger: {
          trigger: "[data-sequence-container]",
          start: "bottom bottom", // Start fading out when the bottom of the hero section reaches the bottom of the viewport
          end: "bottom+=10% bottom", // Complete fade out shortly after
          scrub: true,
          markers: false, // Always hide markers
          onUpdate: (self) => {
            if (process.env.NODE_ENV === 'development') {
              console.log("Opacity ScrollTrigger progress:", self.progress)
            }
            
            // Set visibility based on opacity to ensure it's completely hidden
            if (self.progress >= 0.99) {
              if (containerRef.current) {
                containerRef.current.style.visibility = 'hidden';
              }
            } else {
              if (containerRef.current) {
                containerRef.current.style.visibility = 'visible';
              }
            }
          }
        }
      }
    )

    console.log("GSAP animation set up")

    return () => {
      window.removeEventListener('resize', updateCanvasDimensions)
      tl.kill()
    }
  }, [images, width, height])

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full object-contain"
        style={{ 
          zIndex: -1,
          backgroundColor: process.env.NODE_ENV === 'development' ? 'rgba(0,0,0,0.05)' : 'transparent'
        }}
      />
      {/* Visual verification that images are being processed */}
      {false && images.length === 0 && (
        <div className="absolute top-4 left-4 bg-red-500 text-white p-2 z-50 rounded">
          No images loaded for sequence
        </div>
      )}
    </div>
  )
} 