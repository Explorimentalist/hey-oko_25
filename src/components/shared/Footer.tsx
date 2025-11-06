"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"

const UNIQUE_LOGO_COUNT = 12
const LOOP_DUPLICATE_COUNT = 2
const TOTAL_LOGO_FRAMES = UNIQUE_LOGO_COUNT * LOOP_DUPLICATE_COUNT
const PIXELS_PER_SECOND = 110

interface HorizontalLoopConfig {
  repeat?: number
  paused?: boolean
  speed?: number
  snap?: number | false
  paddingRight?: number
  reversed?: boolean
}

type HorizontalLoopTimeline = gsap.core.Timeline & {
  next: (vars?: gsap.TweenVars) => gsap.core.Tween
  previous: (vars?: gsap.TweenVars) => gsap.core.Tween
  toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween
  current: () => number
  times: number[]
}

const parseGapValue = (gapValue: string) => {
  if (!gapValue || gapValue === "normal") return 0
  const [primary = "0"] = gapValue.split(" ")
  const parsed = parseFloat(primary)
  return Number.isFinite(parsed) ? parsed : 0
}

const horizontalLoop = (
  items: gsap.utils.SelectorTarget,
  config: HorizontalLoopConfig = {}
): HorizontalLoopTimeline => {
  const elements = gsap.utils.toArray<HTMLElement>(items)
  const tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
  }) as HorizontalLoopTimeline

  tl.next = (vars) => tl.tweenTo(tl.time(), vars)
  tl.previous = (vars) => tl.tweenTo(tl.time(), vars)
  tl.toIndex = (index, vars) => tl.tweenTo(tl.time(), vars)
  tl.current = () => 0
  tl.times = []

  const length = elements.length
  if (!length) {
    return tl
  }

  const startX = elements[0].offsetLeft
  const times: number[] = []
  const widths: number[] = []
  const xPercents: number[] = []
  let curIndex = 0
  const speed = config.speed ?? 1
  const pixelsPerSecond = (speed || 1) * 100
  const snap =
    config.snap === false
      ? (value: number) => value
      : gsap.utils.snap(config.snap || 1)
  let totalWidth = 0

  gsap.set(elements, {
    xPercent: (index, el) => {
      const width =
        (widths[index] = Number(gsap.getProperty(el, "width")) ||
        el.getBoundingClientRect().width ||
        1)
      const rawX = Number(gsap.getProperty(el, "x"))
      const xPercentCurrent = Number(gsap.getProperty(el, "xPercent"))
      const x =
        ((isFinite(rawX) ? rawX : 0) / width) * 100 +
        (isFinite(xPercentCurrent) ? xPercentCurrent : 0)
      const value = snap(isFinite(x) ? x : 0)
      xPercents[index] = value
      return value
    },
  })

  gsap.set(elements, { x: 0 })

  const lastIndex = length - 1
  const lastElement = elements[lastIndex]
  const lastScale = Number(gsap.getProperty(lastElement, "scaleX")) || 1
  totalWidth =
    lastElement.offsetLeft +
    (xPercents[lastIndex] / 100) * widths[lastIndex] -
    startX +
    lastElement.offsetWidth * lastScale +
    (config.paddingRight ?? 0)

  for (let index = 0; index < length; index += 1) {
    const element = elements[index]
    const width = widths[index] || 1
    const xPercent = xPercents[index]
    const scaleX = Number(gsap.getProperty(element, "scaleX")) || 1
    const currentX = (xPercent / 100) * width
    const distanceToStart = element.offsetLeft + currentX - startX
    const distanceToLoop = distanceToStart + width * scaleX

    tl.to(
      element,
      {
        xPercent: snap(((currentX - distanceToLoop) / width) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        element,
        {
          xPercent: snap(
            ((currentX - distanceToLoop + totalWidth) / width) * 100
          ),
        },
        {
          xPercent,
          duration:
            (currentX - distanceToLoop + totalWidth - currentX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add(`label${index}`, distanceToStart / pixelsPerSecond)

    times[index] = distanceToStart / pixelsPerSecond
  }

  const toIndex = (index: number, vars?: gsap.TweenVars) => {
    const configVars = vars ? { ...vars } : {}
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length
    }
    const newIndex = gsap.utils.wrap(0, length, index)
    let time = times[newIndex]
    if ((time > tl.time()) !== (index > curIndex)) {
      configVars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) }
      time += tl.duration() * (index > curIndex ? 1 : -1)
    }
    curIndex = newIndex
    configVars.overwrite = true
    return tl.tweenTo(time, configVars)
  }

  tl.next = (vars) => toIndex(curIndex + 1, vars)
  tl.previous = (vars) => toIndex(curIndex - 1, vars)
  tl.toIndex = (index, vars) => toIndex(index, vars)
  tl.current = () => curIndex
  tl.times = times

  tl.progress(1, true).progress(0, true)
  if (config.reversed) {
    tl.vars.onReverseComplete?.()
    tl.reverse()
  }

  return tl
}

export function Footer() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || typeof window === "undefined") return

    let ctx: gsap.Context | null = null
    let resizeTimeout: number | undefined
    let cleanupImageListeners: (() => void) | undefined
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const init = () => {
      const target = trackRef.current
      if (!target) return

      if (reducedMotionQuery.matches) {
        ctx?.revert()
        ctx = null
        return
      }

      const images = Array.from(
        target.querySelectorAll("img")
      ) as HTMLImageElement[]
      if (
        images.some((img) => !img.complete || img.naturalWidth === 0)
      ) {
        return
      }

      const elements = Array.from(target.children) as HTMLElement[]
      if (!elements.length) return

      const computedStyle = window.getComputedStyle(target)
      const gapValue = parseGapValue(computedStyle.gap || computedStyle.columnGap || "0")
      ctx?.revert()
      ctx = null

      ctx = gsap.context(() => {
        horizontalLoop(elements, {
          repeat: -1,
          speed: PIXELS_PER_SECOND / 100,
          paddingRight: gapValue,
        })
      }, target)
    }

    const waitForImages = () => {
      const images = Array.from(
        track.querySelectorAll("img")
      ) as HTMLImageElement[]
      if (!images.length) {
        init()
        return
      }

      const unloaded = images.filter((img) => !img.complete)
      if (!unloaded.length) {
        init()
        return
      }

      let remaining = unloaded.length
      const handle = () => {
        remaining -= 1
        if (remaining <= 0) {
          init()
        }
      }
      unloaded.forEach((img) => {
        img.addEventListener("load", handle)
        img.addEventListener("error", handle)
      })
      cleanupImageListeners = () => {
        unloaded.forEach((img) => {
          img.removeEventListener("load", handle)
          img.removeEventListener("error", handle)
        })
      }
    }

    const handleResize = () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout)
      }
      resizeTimeout = window.setTimeout(() => {
        init()
      }, 150)
    }

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (event.matches) {
        ctx?.revert()
      } else {
        init()
      }
    }

    waitForImages()
    window.addEventListener("resize", handleResize)
    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", handleMotionPreference)
    } else if (typeof reducedMotionQuery.addListener === "function") {
      reducedMotionQuery.addListener(handleMotionPreference)
    }

    return () => {
      cleanupImageListeners?.()
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout)
      }
      window.removeEventListener("resize", handleResize)
      if (typeof reducedMotionQuery.removeEventListener === "function") {
        reducedMotionQuery.removeEventListener("change", handleMotionPreference)
      } else if (typeof reducedMotionQuery.removeListener === "function") {
        reducedMotionQuery.removeListener(handleMotionPreference)
      }
      ctx?.revert()
      ctx = null
    }
  }, [])

  return (
    <footer className="py-8 mt-16 relative">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-zinc-600 mb-4">Do you need some supply?</h2>
          <div className="space-x-4">
            <a
              href="mailto:ngatye@hey-oko.com"
              className="text-sm text-zinc-600 hover:text-white transition-colors"
            >
           Ngatye@hey-oko.com
            </a>
            <a
              href="https://www.linkedin.com/in/ngatye-brian-oko-64051b14/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div className="footer-marquee pointer-events-none" aria-hidden="true">
          <div ref={trackRef} className="footer-marquee__track">
            {Array.from({ length: TOTAL_LOGO_FRAMES }).map((_, index) => (
              <Image
                key={`footer-marquee-logo-${index}`}
                src="/favicon.svg"
                alt=""
                width={240}
                height={240}
                className="footer-marquee__logo"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 text-center text-sm text-zinc-600">
        © {new Date().getFullYear()} Hey-Oko. All rights reserved.
      </div>
    </footer>
  )
}
