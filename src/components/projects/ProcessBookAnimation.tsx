'use client'

import { useEffect, useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ProcessBookAnimation.module.css'

gsap.registerPlugin(ScrollTrigger)

const COVER_CODE = 'set(FOLD,{transformOrigin:"50% 100%",scaleY:0}),set(CLIPS,{transformOrigin:"50% 0"}),set(".cannon__shirt",{opacity:0}),set(".cannon",{y:28}),set(".text--ordered .char",{y:"100%"});const SPEED=.15,FOLD_TL=()=>new timeline().to(LEFT_ARM,{duration:SPEED,rotateY:-180,transformOrigin:`${100*(22/65.3)}% 50%`},0).to(RIGHT_ARM,{duration:SPEED,rotateY:-180,transformOrigin:`${100*((65.3-22)/65.3)}% 50%`},SPEED).to(FOLD,{duration:SPEED/4,scaleY:1},2*SPEED).to(FOLD,{duration:SPEED,y:-47},2*SPEED+.01).to(CLIPS,{duration:SPEED,scaleY:.2},2*SPEED).to(".cannon",{duration:SPEED,y:0},2*SPEED),LOAD_TL=()=>new timeline().to(".button__shirt",{transformOrigin:"50% 13%",rotate:90,duration:.15}).to(".button__shirt",{duration:.15,y:60}).to(".t-shirt__cannon",{y:5,repeat:1,yoyo:!0,duration:.1}).to(".t-shirt__cannon",{y:50,duration:.5,delay:.1}),FIRE_TL=()=>new timeline().set(".t-shirt__cannon",{rotate:48,x:-85,scale:2.5}).set(".cannon__shirt",{opacity:1}).to(".t-shirt__cannon-content",{duration:1,y:-35}).to(".t-shirt__cannon-content",{duration:.25,y:-37.5}).to(".t-shirt__cannon-content",{duration:.015,y:-30.5}).to(".cannon__shirt",{onStart:()=>CLIP.play(),duration:.5,y:"-25vmax"},"<").to(".text--ordered .char",{duration:.15,stagger:.1,y:"0%"}).to("button",{duration:.15*7,"--hue":116,"--lightness":55},"<"),ORDER_TL=new timeline({paused:!0});ORDER_TL.set(".cannon__shirt",{opacity:0}),ORDER_TL.set("button",{"--hue":260,"--lightness":20}),ORDER_TL.to("button",{scale:300/BUTTON.offsetWidth,duration:SPEED}),ORDER_TL.to(".text--order .char",{stagger:.1,y:"100%",duration:.1}),ORDER_TL.to(SHIRT,{x:BUTTON.offsetWidth/2-33,duration:.2}),ORDER_TL.add(FOLD_TL()),ORDER_TL.add(LOAD_TL()),ORDER_TL.add(FIRE_TL()),BUTTON.addEventListener("click",()=>{1===ORDER_TL.progress()?(document.documentElement.style.setProperty("--hue",360*Math.random()),ORDER_TL.time(0),ORDER_TL.pause()):0===ORDER_TL.progress()&&ORDER_TL.play()});'

const DEFAULT_DEMOS = [
  { name: 'Kitkat', id: 'LYpNyvm' },
  { name: 'Newton', id: 'abzeaWJ' },
  { name: 'Launch', id: 'rNOqzbN' },
  { name: 'Birthday', id: 'BaobKOJ' },
  { name: 'Impossible', id: 'ZjLKGY' },
  { name: 'Care', id: 'RwPrOoz' },
  { name: 'Cubes', id: 'QWbRxXb' },
  { name: 'Elon', id: 'RwWMwvY' },
  { name: 'Gun', id: 'GRoKOyg' },
  { name: 'Moon', id: 'NWqemYK' },
  { name: 'Pokedex', id: 'eYpGQxr' },
  { name: 'Record', id: 'RwraKYZ' },
  { name: 'Tcannon', id: 'eYpmBxQ' },
  { name: 'Cloud', id: 'MWwRKvd' },
  { name: 'Fireflies', id: 'zYGQYWJ' },
  { name: 'Train', id: 'eYpdPWa' },
  { name: 'Pancake', id: 'jJVpWZ' },
  { name: 'Earth', id: 'aPzVme' },
  { name: 'Matryoshka', id: 'jOOYMLm' },
  { name: 'Truck', id: 'MWWowEb' },
]

export interface ProcessBookPage {
  href: string
  imgSrc: string
  alt?: string
}

export interface ProcessBookInsert {
  href: string
  imgSrc: string
  alt?: string
}

export interface ProcessBookAnimationProps {
  pages?: ProcessBookPage[]
  heading?: string
  className?: string
  style?: CSSProperties
  insert?: ProcessBookInsert
  coverCode?: string
}

const DEFAULT_PAGES: ProcessBookPage[] = DEFAULT_DEMOS.map((demo) => ({
  href: `https://codepen.io/jh3y/full/${demo.id}`,
  imgSrc: `https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/${demo.name}-sketch.svg`,
  alt: `${demo.name} sketch`,
}))

const DEFAULT_INSERT: ProcessBookInsert = {
  href: 'https://jhey.dev',
  imgSrc: 'https://assets.codepen.io/605876/bear-with-cap.svg',
  alt: 'Jhey logo',
}

export const DEFAULT_PROCESS_PAGES = DEFAULT_PAGES
export const DEFAULT_PROCESS_INSERT = DEFAULT_INSERT

const classNames = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(' ')

const getAbsoluteTop = (element: HTMLElement | null) => {
  if (!element) return 0
  const rect = element.getBoundingClientRect()
  return rect.top + (window.scrollY || window.pageYOffset || 0)
}

export function ProcessBookAnimation({
  pages,
  heading = 'Scroll',
  className,
  style,
  insert = DEFAULT_INSERT,
  coverCode = COVER_CODE,
}: ProcessBookAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<HTMLDivElement>(null)
  const frontCoverRef = useRef<HTMLDivElement>(null)
  const backCoverRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<Array<HTMLDivElement | null>>([])
  const logoRef = useRef<HTMLImageElement>(null)

  const normalizedPages = useMemo(() => {
    const source = pages && pages.length > 0 ? pages : DEFAULT_PAGES
    if (source.length % 2 === 0) return source
    return source.slice(0, source.length - 1)
  }, [pages])

  const pagePairs = useMemo(() => {
    const pairs: ProcessBookPage[][] = []
    for (let i = 0; i < normalizedPages.length; i += 2) {
      const front = normalizedPages[i]
      const back = normalizedPages[i + 1]
      if (back) {
        pairs.push([front, back])
      }
    }
    return pairs
  }, [normalizedPages])

  useEffect(() => {
    if (!bookRef.current || !containerRef.current || !viewportRef.current) return

    const ctx = gsap.context(() => {
      const segment = () => window.innerHeight * 0.25
      const base = () => getAbsoluteTop(containerRef.current)

      const allPages = [
        frontCoverRef.current,
        ...pageRefs.current.filter(Boolean),
        backCoverRef.current,
      ].filter(Boolean) as HTMLDivElement[]

      // Pin the viewport for the entire animation duration
      ScrollTrigger.create({
        trigger: containerRef.current,
        pin: viewportRef.current,
        start: () => base(),
        end: () => base() + (allPages.length + 1) * segment(),
        invalidateOnRefresh: true,
      })

      gsap.to(bookRef.current, {
        scrollTrigger: {
          scrub: 1,
          start: () => base(),
          end: () => base() + segment(),
          invalidateOnRefresh: true,
        },
        scale: 1.25,
        x: "15vmin", // Half the book width (30vmin / 2)
      })

      if (logoRef.current) {
        gsap.to(logoRef.current, {
          scrollTrigger: {
            scrub: true,
            start: () => base() + 13.5 * segment(),
            end: () => base() + 14 * segment(),
            invalidateOnRefresh: true,
          },
          opacity: 1,
        })
      }

      allPages.forEach((page, index) => {
        gsap.set(page, { z: index === 0 ? 13 : -index })

        if (index === allPages.length - 1) return

        gsap.to(page, {
          rotateY: `-=${180 - index / 2}`,
          scrollTrigger: {
            scrub: 1,
            start: () => base() + (index + 1) * segment(),
            end: () => base() + (index + 2) * segment(),
            invalidateOnRefresh: true,
          },
        })

        gsap.to(page, {
          z: index === 0 ? -13 : index,
          scrollTrigger: {
            scrub: 1,
            start: () => base() + (index + 1) * segment(),
            end: () => base() + (index + 1.5) * segment(),
            invalidateOnRefresh: true,
          },
        })
      })
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [pagePairs])

  pageRefs.current.length = pagePairs.length

  const wrapperStyle = useMemo(
    () => ({
      '--page-count': normalizedPages.length,
      ...style,
    }),
    [normalizedPages.length, style],
  ) as CSSProperties

  const setPageRef = (index: number) => (element: HTMLDivElement | null) => {
    pageRefs.current[index] = element
  }

  return (
    <div ref={containerRef} className={classNames(styles.wrapper, className)} style={wrapperStyle}>
      <h5 className={styles.processHeading}>Process</h5>

      <div ref={viewportRef} className={styles.bookViewport}>
        <div className={styles.bookFrame}>
          <div ref={bookRef} className={styles.book}>
            <div className={styles.bookSpine} />

            <div
              ref={frontCoverRef}
              className={classNames(styles.page, styles.bookPage, styles.bookCover, styles.bookCoverFront)}
              style={{ '--page-index': 1 } as CSSProperties}
            >
              <div className={classNames(styles.pageHalf, styles.pageHalfFront)}>
              </div>
              <div className={classNames(styles.pageHalf, styles.pageHalfBack)}>
                <div className={styles.bookInsert} />
              </div>
            </div>

          {pagePairs.map((pair, index) => {
            const frontNumber = index * 2 + 1
            const backNumber = index * 2 + 2

            return (
              <div
                key={`book-page-${frontNumber}`}
                ref={setPageRef(index)}
                className={classNames(styles.page, styles.bookPage)}
                style={{ '--page-index': index + 2 } as CSSProperties}
              >
                <div className={classNames(styles.pageHalf, styles.pageHalfFront)}>
                  <a
                    href={pair[0].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.pageLink}
                  >
                    <img src={pair[0].imgSrc} alt={pair[0].alt || `Page ${frontNumber}`} className={styles.pageImage} />
                  </a>
                  <span className={styles.pageNumber}>{frontNumber}</span>
                </div>
                <div className={classNames(styles.pageHalf, styles.pageHalfBack)}>
                  <a
                    href={pair[1].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.pageLink}
                  >
                    <img src={pair[1].imgSrc} alt={pair[1].alt || `Page ${backNumber}`} className={styles.pageImage} />
                  </a>
                  <span className={styles.pageNumber}>{backNumber}</span>
                </div>
              </div>
            )
          })}

          <div
            ref={backCoverRef}
            className={classNames(styles.page, styles.bookPage, styles.bookCover, styles.bookCoverBack)}
            style={{ '--page-index': pagePairs.length + 2 } as CSSProperties}
          >
            <div className={classNames(styles.pageHalf, styles.pageHalfFront)} />
            <div className={classNames(styles.pageHalf, styles.pageHalfBack)}>
            </div>
            <div className={styles.bookInsert}>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
