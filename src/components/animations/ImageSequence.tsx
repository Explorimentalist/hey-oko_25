'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins in a client-side only effect
const registerPlugins = () => {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
  }
}

interface ImageSequenceProps {
  images: string[]
  width: number
  height: number
  fadeConfig?: {
    innerRadius?: number // Value between 0-1, default 0.4
    outerRadius?: number // Value between 0-1, default 0.95
    fadeOpacity?: number // Value between 0-1, default 1
  }
}

export function ImageSequence({ images, width, height, fadeConfig = {} }: ImageSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sequenceRef = useRef({
    frame: 0,
    images: [] as HTMLImageElement[],
  })
  
  // Default fade configuration
  const { 
    innerRadius = 0.4, 
    outerRadius = 0.95, 
    fadeOpacity = 1 
  } = fadeConfig

  // Add state for frame debug display
  const [currentFrame, setCurrentFrame] = useState(0)
  const [totalFrames, setTotalFrames] = useState(images.length)

  // Register GSAP plugins
  useEffect(() => {
    registerPlugins()
  }, [])

  // Debug log for props - only on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log("ImageSequence Props:", { 
        imagesCount: images.length, 
        firstImage: images[0],
        width, 
        height 
      })
      setTotalFrames(images.length)
    }
  }, [images, width, height])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (process.env.NODE_ENV === 'development') {
      console.log("ImageSequence effect running with images:", images.length);
    }
    
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      console.error("Canvas or context not available")
      return
    }

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
      
      // Save the current context state
      context.save()
      
      // Create a radial gradient for the fade effect
      const centerX = canvasWidth / 2
      const centerY = canvasHeight / 2
      // Calculate the radius to be the distance from center to the furthest corner
      const radius = Math.sqrt(Math.pow(canvasWidth, 2) + Math.pow(canvasHeight, 2)) / 2
      // Create a gradient that starts small and fully opaque, then fades to transparent
      const gradient = context.createRadialGradient(
        centerX, centerY, radius * innerRadius, // Inner circle (fully opaque)
        centerX, centerY, radius * outerRadius  // Outer circle (transparent)
      )
      
      gradient.addColorStop(0, `rgba(255, 255, 255, ${fadeOpacity})`) // Fully opaque at center
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)') // Transparent at edges
      
      // Draw image with proper scaling and centering
      context.drawImage(
        image, 
        0, 0, image.width, image.height,
        x, y, image.width * scale, image.height * scale
      )
      
      // Apply the gradient mask using destination-in compositing
      context.globalCompositeOperation = 'destination-in'
      context.fillStyle = gradient
      context.fillRect(0, 0, canvasWidth, canvasHeight)
      
      // Restore the context to its original state
      context.restore()
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
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Canvas dimensions updated:", { canvasWidth, canvasHeight })
      }
      
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
    
    // Load all images
    const loadImages = async () => {
      if (process.env.NODE_ENV === 'development') {
        console.log("Starting to load images...")
      }
      
      const loadedImages = await Promise.all(
        images.map((src, index) => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
              if (process.env.NODE_ENV === 'development') {
                console.log(`Image ${index} loaded:`, src)
              }
              resolve(img)
            }
            img.onerror = (err) => {
              console.error(`Failed to load image ${index}:`, src, err)
              // Try with cors attribute
              if (process.env.NODE_ENV === 'development') {
                console.log(`Trying with CORS attribute for image ${index}`)
              }
              img.crossOrigin = "anonymous"
              img.onload = () => {
                if (process.env.NODE_ENV === 'development') {
                  console.log(`Image ${index} loaded with CORS attribute:`, src)
                }
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
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Loaded ${loadedImages.length} images`)
      }
      
      sequenceRef.current.images = loadedImages

      // Draw first frame
      if (loadedImages[0]) {
        const canvasWidth = canvas.width
        const canvasHeight = canvas.height
        drawImage(loadedImages[0], canvasWidth, canvasHeight)
        
        if (process.env.NODE_ENV === 'development') {
          console.log("First frame drawn")
        }
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
        end: () => {
          // Calculate a dynamic end based on number of images
          // The formula creates a proportional relationship between sequence length and scroll distance
          const baseDistance = 3000; // Base scroll distance
          const multiplier = 10; // Multiplier for each image
          const calculatedDistance = Math.max(baseDistance, images.length * multiplier);
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`Dynamic scroll distance: ${calculatedDistance}px for ${images.length} images`);
          }
          
          return `+=${calculatedDistance}`;
        },
        scrub: 0.5,
        markers: false, // Hide markers in all environments
        onUpdate: (self) => {
          // Only log in development to reduce console noise
          if (process.env.NODE_ENV === 'development') {
            console.log(`ScrollTrigger progress: ${self.progress.toFixed(3)}, Frame: ${Math.round(self.progress * (images.length - 1))}/${images.length - 1}`);
          }
        }
      },
      onUpdate: () => {
        const frameIndex = Math.round(sequenceRef.current.frame);
        const image = sequenceRef.current.images[frameIndex];
        // Update current frame for debug display
        setCurrentFrame(frameIndex);
        
        // Only log in development to reduce console noise
        if (process.env.NODE_ENV === 'development' && frameIndex % 10 === 0) {
          console.log(`Rendering frame ${frameIndex}/${images.length-1}`);
        }
        if (image) {
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          drawImage(image, canvasWidth, canvasHeight);
        } else {
          console.error(`No image available for frame ${frameIndex}`);
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
          start: "bottom-=2% bottom", // Start fading out earlier, before reaching HomeAbout
          end: "bottom-=0% bottom", // Complete fade out before the bottom of the hero section
          scrub: true,
          markers: false, // Always hide markers
          onUpdate: (self) => {
            if (process.env.NODE_ENV === 'development') {
              console.log("Opacity ScrollTrigger progress:", self.progress);
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

    if (process.env.NODE_ENV === 'development') {
      console.log("GSAP animation set up")
    }

    return () => {
      window.removeEventListener('resize', updateCanvasDimensions)
      tl.kill()
    }
  }, [images, width, height])

  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full z-0 select-none pointer-events-none"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-contain"
        style={{ 
          background: 'transparent' 
        }}
      />
      
      {/* Debug info - only visible in explicit development debug mode */}
      {false && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 z-50 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-xs">
          <div>Frame: {currentFrame + 1}/{totalFrames}</div>
          <div>Progress: {Math.round((currentFrame / (totalFrames - 1)) * 100)}%</div>
          <div>Fade: {Math.round(innerRadius * 100)}% - {Math.round(outerRadius * 100)}%</div>
        </div>
      )}
    </div>
  )
} 