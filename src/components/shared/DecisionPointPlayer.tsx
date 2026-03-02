'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback, useMemo } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import gsap from 'gsap'
import { Play, Pause, X, Volume2, VolumeOff } from 'lucide-react'
import { Button } from './Button'
import Image from 'next/image'

const FEED_AUDIO_ACTIVATION_KEY = 'decision-point-feed-audio-activated'

interface TextSegment {
  time: number
  text: string
}

interface DecisionPointPlayerProps {
  projectTitle: string
  sectionLabel: string
  audioSrc: string
  teleprompterText: TextSegment[]
  showTriggerButton?: boolean
  initialMuted?: boolean
}

export interface DecisionPointPlayerHandle {
  open: () => void
  close: () => void
  play: () => Promise<void>
  pause: () => void
}

export const DecisionPointPlayer = forwardRef<DecisionPointPlayerHandle, DecisionPointPlayerProps>(function DecisionPointPlayer({
  projectTitle,
  sectionLabel: _sectionLabel,
  audioSrc,
  teleprompterText,
  showTriggerButton = true,
  initialMuted = false,
}, ref) {
  const normalizedTeleprompterText = useMemo(() => {
    const normalized: TextSegment[] = []
    const punctuationOnlyPattern = /^[,.;:!?]+$/

    for (const segment of teleprompterText) {
      const text = segment.text.trim()
      if (!text) continue

      if (punctuationOnlyPattern.test(text) && normalized.length > 0) {
        const previous = normalized[normalized.length - 1]
        previous.text = `${previous.text}${text}`
        continue
      }

      normalized.push({ ...segment, text })
    }

    return normalized
  }, [teleprompterText])

  const displayTextSegments = useMemo(
    () => {
      const chunks: TextSegment[] = []
      for (let index = 0; index < normalizedTeleprompterText.length; index += 3) {
        const chunk = normalizedTeleprompterText.slice(index, index + 3)
        const text = chunk.map(item => item.text.trim()).filter(Boolean).join(' ')
        if (!text) continue
        chunks.push({
          time: chunk[0].time,
          text,
        })
      }
      return chunks
    },
    [normalizedTeleprompterText]
  )

  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(initialMuted)
  const [progress, setProgress] = useState(0)
  const [currentText, setCurrentText] = useState(displayTextSegments[0]?.text || '')
  const [isCompact, setIsCompact] = useState(false)
  const [isGifHovered, setIsGifHovered] = useState(false)
  const [needsUserActivation, setNeedsUserActivation] = useState(false)
  const [hasActivatedFeedAudio, setHasActivatedFeedAudio] = useState(false)
  const [isScrubberHovered, setIsScrubberHovered] = useState(false)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [scrubPreviewProgress, setScrubPreviewProgress] = useState<number | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const scrubberRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const textRef = useRef<HTMLParagraphElement>(null)
  const lastScrollTimeRef = useRef<number>(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const openCloseTlRef = useRef<gsap.core.Timeline | null>(null)
  const pendingGestureRetryRef = useRef(false)
  const hasEverPlayedRef = useRef(false)
  const isOpenRef = useRef(isOpen)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = isMuted
  }, [isMuted])

  useEffect(() => {
    try {
      const isActivated = window.localStorage.getItem(FEED_AUDIO_ACTIVATION_KEY) === '1'
      setHasActivatedFeedAudio(isActivated)
    } catch {
      setHasActivatedFeedAudio(false)
    }
  }, [])

  useEffect(() => {
    if (displayTextSegments.length === 0) return
    setCurrentText(displayTextSegments[0]?.text || '')
  }, [displayTextSegments])

  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  // Sync isPlaying state from DOM audio events.
  // The declarative autoplay path (audio.load() with the autoplay attribute)
  // bypasses our play() function, so we need the native 'play' and 'pause'
  // events to keep React state in sync and to mark that audio has started.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handlePlay = () => {
      hasEverPlayedRef.current = true
      audio.removeAttribute('autoplay')
      setIsPlaying(true)
    }
    const handlePause = () => setIsPlaying(false)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [])

  // Audio time updates for teleprompter sync
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime
      const duration = audio.duration || 1
      setProgress((currentTime / duration) * 100)

      const segment = [...displayTextSegments].reverse().find(s => currentTime >= s.time)
      if (segment && segment.text !== currentText) {
        if (textRef.current) {
          // Small component transition (text update)
          gsap.fromTo(textRef.current,
            { y: 8, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.2, ease: 'power3.out' }
          )
        }
        setCurrentText(segment.text)
      }
    }

    const handleEnded = () => {
      if (audioRef.current) audioRef.current.currentTime = 0
      setIsPlaying(false)
      setProgress(0)
      setCurrentText(displayTextSegments[0]?.text || '')
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [displayTextSegments, currentText, isCompact])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      audio.muted = isMuted

      // First-time muted play: use the declarative autoplay path.
      // Chrome's policy always permits muted declarative autoplay on all platforms,
      // including Chrome Android where programmatic audio.play() from non-gesture
      // contexts (IntersectionObserver, setTimeout) can be blocked even when muted.
      // Declarative path: set the autoplay attribute then call load() — Chrome
      // treats this like <audio autoplay muted> in HTML markup and allows it unconditionally.
      if (isMuted && !hasEverPlayedRef.current) {
        audio.setAttribute('autoplay', '')
        audio.load()
        pendingGestureRetryRef.current = false
        setNeedsUserActivation(false)
        return
      }

      // All subsequent plays: programmatic path
      if (audio.ended || (audio.duration && audio.currentTime >= audio.duration - 0.05)) {
        audio.currentTime = 0
      }
      await audio.play()
      pendingGestureRetryRef.current = false
      setNeedsUserActivation(false)
      setIsPlaying(true)
    } catch (error) {
      const notAllowed = error instanceof DOMException && error.name === 'NotAllowedError'
      if (notAllowed) {
        pendingGestureRetryRef.current = true
        setNeedsUserActivation(true)
      } else {
        console.warn('DecisionPointPlayer: audio playback was blocked by the browser.', error)
      }
      setIsPlaying(false)
    }
  }, [isMuted])

  const markFeedAudioActivated = useCallback(() => {
    setHasActivatedFeedAudio(true)
    try {
      window.localStorage.setItem(FEED_AUDIO_ACTIVATION_KEY, '1')
    } catch {
      // Ignore storage failures.
    }
  }, [])

  const handleEnableFeedAudio = useCallback(() => {
    markFeedAudioActivated()
    pendingGestureRetryRef.current = false
    setNeedsUserActivation(false)
    void play()
  }, [markFeedAudioActivated, play])

  useEffect(() => {
    const retryAutoplayOnGesture = () => {
      if (!pendingGestureRetryRef.current) return
      if (!isOpenRef.current) return
      if (!hasActivatedFeedAudio) return
      void play()
    }

    window.addEventListener('pointerdown', retryAutoplayOnGesture, { capture: true })
    window.addEventListener('click', retryAutoplayOnGesture, { capture: true })
    window.addEventListener('keydown', retryAutoplayOnGesture, { capture: true })
    window.addEventListener('touchend', retryAutoplayOnGesture, { capture: true })

    return () => {
      window.removeEventListener('pointerdown', retryAutoplayOnGesture, { capture: true } as EventListenerOptions)
      window.removeEventListener('click', retryAutoplayOnGesture, { capture: true } as EventListenerOptions)
      window.removeEventListener('keydown', retryAutoplayOnGesture, { capture: true } as EventListenerOptions)
      window.removeEventListener('touchend', retryAutoplayOnGesture, { capture: true } as EventListenerOptions)
    }
  }, [hasActivatedFeedAudio, play])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    setIsPlaying(false)
  }, [])

  const seekFromClientX = useCallback((clientX: number) => {
    const audio = audioRef.current
    const scrubber = scrubberRef.current
    if (!audio || !scrubber) return

    const rect = scrubber.getBoundingClientRect()
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
    const ratio = rect.width > 0 ? x / rect.width : 0
    const nextProgress = ratio * 100

    setScrubPreviewProgress(nextProgress)

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = ratio * audio.duration
      setProgress(nextProgress)
    }
  }, [])

  useEffect(() => {
    if (!isScrubbing) return

    const handlePointerMove = (event: PointerEvent) => {
      seekFromClientX(event.clientX)
    }

    const stopScrubbing = () => {
      setIsScrubbing(false)
      setScrubPreviewProgress(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopScrubbing)
    window.addEventListener('pointercancel', stopScrubbing)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', stopScrubbing)
      window.removeEventListener('pointercancel', stopScrubbing)
    }
  }, [isScrubbing, seekFromClientX])

  const handleScrubberPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsScrubbing(true)
    seekFromClientX(event.clientX)
  }, [seekFromClientX])

  const displayedProgress = scrubPreviewProgress ?? progress

  // Scroll listener for compact state
  useEffect(() => {
    if (!isOpen) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      lastScrollTimeRef.current = Date.now()

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Transition to compact when scrolled past threshold
      if (scrollY > 100 && !isCompact) {
        setIsCompact(true)
      }

      // Transition to full when scrolled back up
      if (scrollY <= 100 && isCompact) {
        setIsCompact(false)
        return
      }

      // Set timeout to return to full state after 3s of no scrolling
      if (isCompact) {
        scrollTimeoutRef.current = setTimeout(() => {
          setIsCompact(false)
        }, 3000)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isOpen, isCompact])

  // Expand/Collapse animations for state transitions
  // Component size: MEDIUM (state transition, faster than initial open)
  // Duration: 0.3s expand, 0.2s collapse | Easing: power2
  // Border-radius: Two-value system (36px compact = pill, 16px full = rounded)
  useEffect(() => {
    if (!isOpen) return
    const player = playerRef.current
    if (!player) return

    // Get the content elements that should hide/show
    const contentToHide = [
      contentRefs.current[1], // Header + labels
      contentRefs.current[2], // Divider
      contentRefs.current[3], // Teleprompter
    ].filter(Boolean)

    // Border-radius values: 36px (pill, 50% of 72px height) ↔ 16px (rounded-2xl)
    const compactHeight = 72
    const compactRadius = 36 // Perfect pill shape (half of height)
    const fullRadius = 16 // rounded-2xl (1rem)

    if (isCompact) {
      // COLLAPSING: Full → Compact
      const tl = gsap.timeline()

      // 1. Hide content first (fade out + slide down, reverse stagger)
      tl.to([...contentToHide].reverse(), {
        opacity: 0,
        y: 8,
        duration: 0.18,
        stagger: 0.02,
        ease: 'power2.in'
      })

      // 2. Shrink height AND round corners simultaneously (no huge intermediate values!)
      tl.to(player, {
        height: compactHeight,
        borderRadius: `${compactRadius}px`,
        duration: 0.25,
        ease: 'power2.in'
      }, '-=0.1')

    } else {
      // EXPANDING: Compact → Full
      const tl = gsap.timeline()

      // Measure full height
      gsap.set(player, { height: 'auto' })
      const fullHeight = player.offsetHeight

      // Reset to compact state before animating
      gsap.set(player, { height: compactHeight, borderRadius: `${compactRadius}px` })

      // 1. Expand height AND tighten corners simultaneously
      tl.to(player, {
        height: fullHeight,
        borderRadius: `${fullRadius}px`,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(player, { height: 'auto' })
        }
      })

      // 2. Reveal content with stagger (fade in + slide up)
      tl.fromTo(contentToHide, {
        opacity: 0,
        y: 8
      }, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        stagger: 0.03,
        ease: 'power2.out'
      }, '-=0.15')
    }
  }, [isCompact, isOpen])

  // Open animation
  // Component size: LARGE (modal-like overlay)
  // Duration: 0.4s open, 0.27s close | Easing: power1 | Y: 24px | Scale: 0.98
  const open = useCallback(() => {
    if (isOpen) {
      void play()
      return
    }

    setIsOpen(true)
    const player = playerRef.current
    if (!player) return

    openCloseTlRef.current?.kill()
    gsap.killTweensOf([player, ...contentRefs.current.filter(Boolean)])

    // Set initial state BEFORE making visible (prevents flicker!)
    gsap.set(player, {
      opacity: 0,
      scale: 0.98,
      y: 24,
      display: 'flex' // Set display at the same time as initial state
    })

    // Set initial state for content items
    gsap.set(contentRefs.current.filter(Boolean), {
      opacity: 0,
      y: 16
    })

    void play()

    const tl = gsap.timeline()
    openCloseTlRef.current = tl

    // Large component opening
    tl.to(player, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: 'power1.out'
    })

    // Content items (small items inside component, stagger: 0.03s)
    tl.to(contentRefs.current.filter(Boolean), {
      y: 0,
      opacity: 1,
      duration: 0.3,
      stagger: 0.03,
      ease: 'power2.out'
    }, '-=0.1')
  }, [isOpen, play])

  const close = useCallback(() => {
    if (!isOpen) return

    const player = playerRef.current
    if (!player) return

    openCloseTlRef.current?.kill()
    gsap.killTweensOf([player, ...contentRefs.current.filter(Boolean)])
    pendingGestureRetryRef.current = false
    pause()

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(player, { display: 'none' })
        setIsOpen(false)
      }
    })
    openCloseTlRef.current = tl

    // Content items close first (closing stagger: 0.02s)
    tl.to([...contentRefs.current].filter(Boolean).reverse(),
      { y: 16, opacity: 0, duration: 0.2, stagger: 0.02, ease: 'power2.in' }
    )
    // Large component closing (0.27s = 0.68x of 0.4s opening)
    tl.to(player,
      { opacity: 0, scale: 0.98, y: 24, duration: 0.27, ease: 'power1.in' },
      '-=0.1'
    )
  }, [isOpen, pause])

  useImperativeHandle(ref, () => ({
    open,
    close,
    play,
    pause,
  }), [open, close, play, pause])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) pause()
    else play()
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(!isMuted)
  }

  return (
    <>
      <audio ref={audioRef} src={audioSrc} preload="metadata" muted={isMuted} />

      {/* Scrollable button (not fixed) */}
      {!isOpen && showTriggerButton && (
        <Button
          onClick={open}
          variant="secondary-bordered"
          size="sm"
          icon={<Play className="w-4 h-4 fill-current" />}
        >
          Decision Point
        </Button>
      )}

      {/* Fixed player */}
      <div
        ref={playerRef}
        className="hidden fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-8 md:left-auto md:right-8 md:translate-x-0 z-30 md:z-50 flex-col w-80 bg-zinc-950/80 backdrop-blur-md text-zinc-100 shadow-2xl overflow-hidden"
        style={{ borderRadius: '16px' }}
      >
        {/* Header area - only visible in full state */}
        {!isCompact && (
          <div
            ref={el => { contentRefs.current[1] = el }}
            className="px-5 pt-5 pb-4 text-left"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-small text-zinc-400 truncate">{projectTitle}</p>
              <button
                onClick={close}
                className="flex-shrink-0 -mt-1 p-1 text-zinc-400 hover:text-zinc-100 transition-colors duration-sm ease-power3-out"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-h5 font-semibold mt-1 truncate">Decisions narrated</h3>
          </div>
        )}

        {/* Divider - only in full state */}
        {!isCompact && (
          <div
            ref={el => { contentRefs.current[2] = el }}
            className="h-px bg-zinc-700 mx-5"
          />
        )}

        {/* Teleprompter area - only visible in full state */}
        {!isCompact && (
          <div
            ref={el => { contentRefs.current[3] = el }}
            className="relative px-5 pt-4 pb-4 overflow-hidden text-left"
          >
            <p ref={textRef} className="text-body leading-relaxed min-h-[6rem]">
              {currentText}
            </p>
          </div>
        )}

        {/* Controls */}
        <div
          ref={el => { contentRefs.current[0] = el }}
          className={`flex items-center gap-3 ${
            isCompact ? 'p-4' : 'px-5 py-4'
          }`}
        >
          {/* Play button / GIF */}
          {isCompact ? (
            isPlaying ? (
              // Show GIF when playing
              <div
                className="relative flex-shrink-0 w-10 h-10 cursor-pointer"
                onClick={togglePlayPause}
                onMouseEnter={() => setIsGifHovered(true)}
                onMouseLeave={() => setIsGifHovered(false)}
              >
                <Image
                  src="/images/play animation.gif"
                  alt="Play animation"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                  unoptimized
                />
                {/* Hover overlay */}
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-zinc-100 text-zinc-950 rounded-full transition-opacity duration-sm ease-power3-out ${
                    isGifHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Pause className="w-4 h-4 fill-current" />
                </div>
              </div>
            ) : (
              // Show static button when paused
              <button
                onClick={togglePlayPause}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-zinc-100 text-zinc-950 rounded-full hover:bg-zinc-200 transition-colors duration-sm ease-power3-out"
                aria-label="Play"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            )
          ) : (
            <button
              onClick={togglePlayPause}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-zinc-100 text-zinc-950 rounded-full hover:bg-zinc-200 transition-colors duration-sm ease-power3-out"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
          )}

          {/* Progress bar (full state) or Teleprompter text (compact state) */}
          {isCompact ? (
            <p
              ref={textRef}
              className={`flex-1 leading-snug px-2 line-clamp-2 text-left ${
                isPlaying ? 'text-small' : 'text-h6'
              }`}
            >
              {isPlaying ? currentText : 'Decisions narrated'}
            </p>
          ) : (
            <div
              ref={scrubberRef}
              className={`relative flex-1 rounded-full overflow-hidden cursor-pointer transition-all duration-xs ${
                isScrubberHovered || isScrubbing ? 'h-2 bg-zinc-600' : 'h-1.5 bg-zinc-700'
              }`}
              onPointerDown={handleScrubberPointerDown}
              onPointerEnter={() => setIsScrubberHovered(true)}
              onPointerLeave={() => setIsScrubberHovered(false)}
            >
              <div
                className="h-full rounded-full bg-zinc-100 transition-[width] duration-xs"
                style={{ width: `${displayedProgress}%` }}
              />
              <div
                className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-zinc-100 shadow transition-opacity duration-xs ${
                  isScrubberHovered || isScrubbing ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ left: `${displayedProgress}%` }}
              />
            </div>
          )}

          {/* Volume button */}
          <button
            onClick={toggleMute}
            className="flex-shrink-0 p-1 text-zinc-400 hover:text-zinc-100 transition-colors duration-sm ease-power3-out"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeOff className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {needsUserActivation && !hasActivatedFeedAudio && (
          <div className="px-5 pb-4 flex flex-col items-start gap-2">
            <p className="text-small text-zinc-400 text-left">
              Enable feed audio once for TikTok-style autoplay.
            </p>
            <Button
              onClick={handleEnableFeedAudio}
              variant="secondary-bordered"
              size="sm"
            >
              Enable feed audio
            </Button>
          </div>
        )}
      </div>
    </>
  )
})
