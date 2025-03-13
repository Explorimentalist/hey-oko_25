'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { loadImageControlled, preloadPriorityImages, getAdaptiveBatchSize } from '@/utils/imageLoader'

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
  batchSize?: number     // Number of images to load in each batch
  preloadCount?: number  // Number of images to preload initially
}

export function ImageSequence({ 
  images, 
  width, 
  height, 
  fadeConfig = {},
  batchSize = 10,        // Default batch size
  preloadCount = 5       // Default preload count
}: ImageSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sequenceRef = useRef({
    frame: 0,
    images: [] as HTMLImageElement[],
    loadedIndexes: new Set<number>(),  // Track which images are already loaded
  })
  
  // Default fade configuration
  const { 
    innerRadius = 0.4, 
    outerRadius = 0.95, 
    fadeOpacity = 1 
  } = fadeConfig

  // Add state for frame debug display and loading tracking
  const [currentFrame, setCurrentFrame] = useState(0)
  const [totalFrames, setTotalFrames] = useState(images.length)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Add state to track loaded image batches
  const [loadedBatches, setLoadedBatches] = useState(0)
  const [isLoadingBatch, setIsLoadingBatch] = useState(false)

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
    
    // Reset the image array when images array changes
    sequenceRef.current.images = new Array(images.length).fill(null)
    sequenceRef.current.loadedIndexes = new Set()
    
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
    
    // Determine adaptive batch size based on device capabilities and network
    const adaptiveBatchSize = getAdaptiveBatchSize(batchSize)
    
    // Progressive loading strategy with intelligent batching
    const loadImageBatch = async (startIndex: number, count: number) => {
      if (startIndex >= images.length) return
      
      setIsLoadingBatch(true)
      
      const endIndex = Math.min(startIndex + count, images.length)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Loading image batch ${startIndex} to ${endIndex - 1}...`)
      }
      
      // Only load images that haven't been loaded yet
      const imagesToLoad = []
      for (let i = startIndex; i < endIndex; i++) {
        if (!sequenceRef.current.loadedIndexes.has(i)) {
          imagesToLoad.push({ src: images[i], index: i })
        }
      }
      
      if (imagesToLoad.length === 0) {
        setIsLoadingBatch(false)
        return
      }
      
      // Load images with controlled concurrency
      const loadPromises = imagesToLoad.map(({ src, index }) => {
        return loadImageControlled(src).then(img => {
          // Store the loaded image
          sequenceRef.current.images[index] = img
          sequenceRef.current.loadedIndexes.add(index)
          
          // Update loading progress
          const newProgress = Math.round((sequenceRef.current.loadedIndexes.size / images.length) * 100)
          setLoadingProgress(newProgress)
          
          return img
        })
      })
      
      await Promise.all(loadPromises)
      
      // Draw the first frame if it's the first batch
      if (startIndex === 0 && sequenceRef.current.images[0]) {
        const canvasWidth = canvas.width
        const canvasHeight = canvas.height
        drawImage(sequenceRef.current.images[0], canvasWidth, canvasHeight)
        
        if (process.env.NODE_ENV === 'development') {
          console.log("First frame drawn")
        }
      }
      
      setLoadedBatches(Math.ceil(endIndex / adaptiveBatchSize))
      setIsLoadingBatch(false)
      
      // Load next batch if needed with intelligent throttling
      if (endIndex < images.length) {
        // Add some delay to prevent blocking the main thread
        // Use longer delay on slower connections or if user isn't currently viewing this frame area
        const currentFrameIndex = Math.round(sequenceRef.current.frame)
        const isNearCurrentView = Math.abs(endIndex - currentFrameIndex) < adaptiveBatchSize * 2
        
        setTimeout(() => {
          loadImageBatch(endIndex, adaptiveBatchSize)
        }, isNearCurrentView ? 50 : 200)
      }
    }
    
    // Start by preloading priority images (first few frames)
    const startPreload = async () => {
      const priorityCount = Math.min(preloadCount, images.length)
      if (priorityCount === 0) return
      
      const priorityImages = images.slice(0, priorityCount)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Preloading ${priorityCount} priority images...`)
      }
      
      const loadedImages = await preloadPriorityImages(priorityImages)
      
      // Store preloaded images
      loadedImages.forEach((img, index) => {
        sequenceRef.current.images[index] = img
        sequenceRef.current.loadedIndexes.add(index)
      })
      
      // Draw first frame
      if (loadedImages[0]) {
        const canvasWidth = canvas.width
        const canvasHeight = canvas.height
        drawImage(loadedImages[0], canvasWidth, canvasHeight)
      }
      
      // Start loading the rest of the images
      loadImageBatch(priorityCount, adaptiveBatchSize)
    }
    
    // Start preloading
    startPreload()
    
    // Create GSAP animation with intelligent frame prediction
    const tl = gsap.to(sequenceRef.current, {
      frame: images.length - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: "[data-sequence-container]",
        start: "top top",
        end: () => {
          const baseDistance = 3000
          const multiplier = 10
          const calculatedDistance = Math.max(baseDistance, images.length * multiplier)
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`Dynamic scroll distance: ${calculatedDistance}px for ${images.length} images`)
          }
          
          return `+=${calculatedDistance}`
        },
        scrub: 0.5,
        markers: false,
        onUpdate: (self) => {
          const currentFrame = Math.round(self.progress * (images.length - 1))
          
          // Load images ahead in the direction of scrolling
          // This creates a more intelligent preloading that predicts scroll direction
          const previousFrame = Math.round(sequenceRef.current.frame)
          const scrollingForward = currentFrame >= previousFrame
          
          // Calculate which batch we need based on current frame and scroll direction
          let requiredBatch
          if (scrollingForward) {
            // When scrolling forward, load ahead of current position
            requiredBatch = Math.ceil((currentFrame + preloadCount) / adaptiveBatchSize)
          } else {
            // When scrolling backward, load before current position
            requiredBatch = Math.floor((currentFrame - preloadCount) / adaptiveBatchSize)
          }
          
          // Ensure we have the required batch loaded
          if (requiredBatch >= 0 && requiredBatch > loadedBatches && !isLoadingBatch) {
            const startIndex = loadedBatches * adaptiveBatchSize
            loadImageBatch(startIndex, adaptiveBatchSize)
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`ScrollTrigger progress: ${self.progress.toFixed(3)}, Frame: ${currentFrame}/${images.length - 1}, Required batch: ${requiredBatch}, Loaded batches: ${loadedBatches}`)
          }
        }
      },
      onUpdate: () => {
        const frameIndex = Math.round(sequenceRef.current.frame)
        const image = sequenceRef.current.images[frameIndex]
        setCurrentFrame(frameIndex)
        
        if (process.env.NODE_ENV === 'development' && frameIndex % 10 === 0) {
          console.log(`Rendering frame ${frameIndex}/${images.length-1}`)
        }
        
        if (image) {
          const canvasWidth = canvas.width
          const canvasHeight = canvas.height
          drawImage(image, canvasWidth, canvasHeight)
        } else if (!isLoadingBatch) {
          // If we don't have the image yet and we're not already loading, try to load it
          const batchIndex = Math.floor(frameIndex / adaptiveBatchSize)
          const startIndex = batchIndex * adaptiveBatchSize
          
          if (startIndex >= loadedBatches * adaptiveBatchSize) {
            loadImageBatch(startIndex, adaptiveBatchSize)
          }
          
          console.log(`No image available for frame ${frameIndex}, attempting to load batch ${batchIndex}`)
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
  }, [images, width, height, batchSize, preloadCount])

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
      
      {/* Loading indicator - only visible during initial loading */}
      {loadingProgress > 0 && loadingProgress < 100 && (
        <div className="absolute bottom-8 left-0 right-0 mx-auto w-48 bg-black bg-opacity-50 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-white" 
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}
      
      {/* Debug info - only visible in explicit development debug mode */}
      {false && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 z-50 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-xs">
          <div>Frame: {currentFrame + 1}/{totalFrames}</div>
          <div>Progress: {Math.round((currentFrame / (totalFrames - 1)) * 100)}%</div>
          <div>Loaded: {loadingProgress}%</div>
          <div>Fade: {Math.round(innerRadius * 100)}% - {Math.round(outerRadius * 100)}%</div>
        </div>
      )}
    </div>
  )
} 