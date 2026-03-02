'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DecisionPointPlayer, type DecisionPointPlayerHandle } from '@/components/shared/DecisionPointPlayer'
import { getDecisionPointAudioUrls } from '@/lib/decisionPointAudio'

interface TextSegment {
  time: number
  text: string
}

const fallbackText: TextSegment[] = [{ time: 0, text: 'Loading transcript...' }]
const PROJECT_ID = 'aa-dp'
const { playbackSrc: DECISION_POINT_AUDIO_SRC, transcriptUrl: DECISION_POINT_TRANSCRIPT_URL } =
  getDecisionPointAudioUrls(PROJECT_ID)

export function AAProjectDecisionPoint() {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<DecisionPointPlayerHandle>(null)
  const [teleprompterText, setTeleprompterText] = useState<TextSegment[]>(fallbackText)
  const projectRootRef = useRef<HTMLElement | null>(null)
  const shouldBeOpenRef = useRef<boolean | null>(null)
  const hasUserInteractedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    async function fetchTranscript() {
      try {
        const staticRes = await fetch(DECISION_POINT_TRANSCRIPT_URL)
        if (staticRes.ok) {
          const staticData = await staticRes.json()
          if (!cancelled && Array.isArray(staticData) && staticData.length > 0) {
            setTeleprompterText(staticData)
            return
          }
        }

        const apiRes = await fetch(`/api/transcribe?project=${PROJECT_ID}`)
        const apiData = await apiRes.json()

        if (cancelled) return
        if (apiData?.transcript?.length > 0) {
          setTeleprompterText(apiData.transcript)
          return
        }

        setTeleprompterText([{ time: 0, text: 'Transcript unavailable.' }])
      } catch {
        if (!cancelled) {
          setTeleprompterText([{ time: 0, text: 'Transcript unavailable.' }])
        }
      }
    }

    fetchTranscript()
    return () => {
      cancelled = true
    }
  }, [])

  const syncOpenState = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    // projectRoot is optional — if no article/section ancestor is found,
    // we skip the "is the project section in viewport" check and only rely
    // on the hero boundary position below.
    const projectRoot = projectRootRef.current
    let isInProjectNow = true
    if (projectRoot) {
      const projectRect = projectRoot.getBoundingClientRect()
      isInProjectNow = projectRect.bottom > 0 && projectRect.top < window.innerHeight
    }

    const heroBoundaryRect = el.getBoundingClientRect()
    const isAfterHeroImageBottomNow = heroBoundaryRect.top < window.innerHeight

    const shouldBeOpen = hasUserInteractedRef.current && isInProjectNow && isAfterHeroImageBottomNow
    if (shouldBeOpenRef.current === shouldBeOpen) return
    shouldBeOpenRef.current = shouldBeOpen

    if (shouldBeOpen) playerRef.current?.open()
    else playerRef.current?.close()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    // Try increasingly broad selectors. Falls back to null, which syncOpenState
    // handles gracefully by skipping the project-boundary check.
    projectRootRef.current =
      container?.closest('article') ??
      container?.closest('[data-project-root]') ??
      container?.closest('section') ??
      null
    syncOpenState()
  }, [syncOpenState])

  useEffect(() => {
    const onUserScroll = () => {
      hasUserInteractedRef.current = true
      syncOpenState()
    }

    window.addEventListener('wheel', onUserScroll, { passive: true })
    window.addEventListener('touchmove', onUserScroll, { passive: true })
    window.addEventListener('scroll', onUserScroll, { passive: true })
    window.addEventListener('resize', onUserScroll, { passive: true })

    return () => {
      window.removeEventListener('wheel', onUserScroll)
      window.removeEventListener('touchmove', onUserScroll)
      window.removeEventListener('scroll', onUserScroll)
      window.removeEventListener('resize', onUserScroll)
    }
  }, [syncOpenState])

  return (
    <div ref={containerRef}>
      <DecisionPointPlayer
        ref={playerRef}
        projectTitle="AA. The Automobile Association"
        sectionLabel="Heuristic Evaluation"
        audioSrc={DECISION_POINT_AUDIO_SRC}
        teleprompterText={teleprompterText}
        showTriggerButton={false}
        initialMuted
      />
    </div>
  )
}
