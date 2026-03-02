'use client'

import { useEffect, useRef, useState } from 'react'
import { DecisionPointPlayer, type DecisionPointPlayerHandle } from '@/components/shared/DecisionPointPlayer'
import { getDecisionPointAudioUrls } from '@/lib/decisionPointAudio'

interface TextSegment {
  time: number
  text: string
}

const fallbackText: TextSegment[] = [
  { time: 0, text: "Loading transcript..." },
]
const PROJECT_ID = 'aa'
const { playbackSrc: DECISION_POINT_AUDIO_SRC } = getDecisionPointAudioUrls(PROJECT_ID)

export default function DecisionPointPlayerDemo() {
  const [teleprompterText, setTeleprompterText] = useState<TextSegment[]>(fallbackText)
  const [error, setError] = useState<string | null>(null)
  const playerRef = useRef<DecisionPointPlayerHandle>(null)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    async function fetchTranscript() {
      try {
        const res = await fetch(`/api/transcribe?project=${PROJECT_ID}`)
        const data = await res.json()

        if (data.error) {
          setError(data.error)
          return
        }

        if (data.transcript?.length > 0) {
          setTeleprompterText(data.transcript)
        }
      } catch (err) {
        setError('Failed to fetch transcript')
        console.error(err)
      }
    }

    fetchTranscript()
  }, [])

  // Scroll-triggered autoplay.
  // IntersectionObserver fires when the hero section fully exits or re-enters
  // the viewport. Because initialMuted={true}, audio.play() is called on a
  // muted element — Chrome allows muted autoplay without a user gesture
  // (per Chrome's autoplay policy: "Muted autoplay is always allowed").
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Hero fully scrolled out of view → open & play (muted)
          playerRef.current?.open()
        } else {
          // Hero back in view → close player
          playerRef.current?.close()
        }
      },
      { threshold: 0 }
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Hero section — ref tracked so IntersectionObserver can fire on scroll */}
      <section
        ref={heroRef}
        className="h-screen flex items-center justify-center p-8"
      >
        <div className="max-w-2xl text-center">
          <h1 className="text-display font-semibold mb-6">Decision Point Player</h1>
          <p className="text-h4 text-zinc-400 mb-8">
            A floating audio widget with synchronized teleprompter
          </p>
          {error && (
            <p className="text-small text-red-400 mb-4">{error}</p>
          )}
          <p className="text-small text-zinc-500">↓ Scroll to play</p>
          {/*
            showTriggerButton={false} — the scroll trigger is the entry point.
            initialMuted={true}       — critical: lets audio.play() succeed in
                                        Chrome without a user gesture.
          */}
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
      </section>

      {/* Content sections to test scroll */}
      {[1, 2, 3, 4].map((i) => (
        <section key={i} className="min-h-screen p-8 border-t border-zinc-800">
          <div className="max-w-4xl mx-auto">
            <span className="text-small uppercase tracking-wide text-zinc-500">Section {i}</span>
            <h2 className="text-h2 font-semibold mt-2 mb-8">Content Block {i}</h2>
            <div className="grid gap-6">
              {[1, 2, 3].map((j) => (
                <p key={j} className="text-body text-zinc-400 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  )
}
