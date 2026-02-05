import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { X } from 'lucide-react'
import { Button } from '@/components/shared/Button'

interface TeamRole {
  id: string
  role: string
}

interface CollaborationData {
  teamInvolvement: string[]
  rituals: string[]
  communicationChannels: string[]
  keyActivities: string[]
  myImpact: string[]
}

interface CollaborationDetailsProps {
  teamRoles: TeamRole[]
  collaborationData: CollaborationData
}

/**
 * CollaborationDetails Component
 *
 * Displays a team card with role badges and a modal containing detailed collaboration information.
 * The modal uses a bento box layout for organized information presentation.
 *
 * Usage:
 * <CollaborationDetails
 *   teamRoles={[
 *     { id: 'pm', role: 'PM' },
 *     { id: 'dev', role: 'Dev' },
 *   ]}
 *   collaborationData={{
 *     teamInvolvement: ['Led design direction', 'Collaborated with 3 engineers'],
 *     rituals: ['Weekly sync', 'Daily standups'],
 *     communicationChannels: ['Slack', 'Figma'],
 *     keyActivities: ['Design sprints', 'User research'],
 *     myImpact: ['Increased conversion by 25%', 'Improved UX score'],
 *   }}
 * />
 */

const CollaborationModal = ({
  isOpen,
  onClose,
  collaborationData,
}: {
  isOpen: boolean
  onClose: () => void
  collaborationData: CollaborationData
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])

  // Handle body scroll lock
  useEffect(() => {
    if (!isOpen) {
      // Always restore to auto when modal closes
      document.body.style.overflow = 'auto'
      return
    }

    // Lock scroll when modal opens
    document.body.style.overflow = 'hidden'

    return () => {
      // Cleanup function
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  // Animate modal entrance
  useEffect(() => {
    if (!isOpen || !contentRef.current) return

    const tl = gsap.timeline()

    // Backdrop and modal body fade in and scale
    tl.to(contentRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    })

    // Stagger in each section card
    sectionsRef.current.forEach((section, index) => {
      if (section) {
        tl.to(
          section,
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          },
          0.15 + index * 0.08 // Stagger timing
        )
      }
    })
  }, [isOpen])

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  interface BentoSection {
    title: string
    items: string[]
  }

  const bentoSections: BentoSection[] = [
    { title: 'Team & Involvement', items: collaborationData.teamInvolvement },
    { title: 'Rituals & Cadence', items: collaborationData.rituals },
    { title: 'Communication Channels', items: collaborationData.communicationChannels },
    { title: 'Key Activities', items: collaborationData.keyActivities },
  ]

  const modalContent = (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Collaboration details"
      onClick={handleBackdropClick}
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-4xl max-h-[90vh] rounded-lg overflow-y-auto border border-white/15 shadow-2xl bg-zinc-950 opacity-0 scale-95"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-[10000] p-2 text-white/60 hover:text-white transition-colors"
          aria-label="Close collaboration details"
        >
          <X size={24} />
        </button>

        {/* Modal Content */}
        <div className="p-6 md:p-10 pt-16 md:pt-12">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-medium text-white mb-2">
              Collaboration Details
            </h2>
            <p className="text-white/60 text-sm md:text-base">
              Overview of teamwork, rituals, and key contributions
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {bentoSections.map((section, index) => (
              <div
                key={section.title}
                ref={(el) => {
                  sectionsRef.current[index] = el
                }}
                className={`
                  rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm
                  p-5 md:p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20
                  opacity-0
                  ${
                    index === 4 && 'md:col-span-2 lg:col-span-1'
                  } /* Last section spans 2 on tablet, 1 on desktop */
                `}
              >
                {/* Section Title */}
                <h3 className="text-sm md:text-base font-medium text-white mb-4 tracking-wide">
                  {section.title}
                </h3>

                {/* Items List */}
                <ul className="space-y-2.5 md:space-y-3">
                  {section.items.length > 0 ? (
                    section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-sm text-white/70 leading-relaxed"
                      >
                        {item}
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-white/50 italic">
                      No details provided
                    </p>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Render modal at document body level using portal
  return createPortal(modalContent, document.body)
}

export default function CollaborationDetails({
  teamRoles,
  collaborationData,
}: CollaborationDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Team Card */}
      <div className="col-span-6 md:col-span-4 md:col-start-5 lg:col-span-2 lg:col-start-3">
        {/* Label */}
        <p className="text-small tracking-wide text-white/60 mb-4">Team</p>

        {/* Team Roles Grid */}
        <div className="flex flex-col gap-4">
          {/* Roles */}
          <div className="flex flex-wrap gap-2">
            {teamRoles.map((role) => (
              <div
                key={role.id}
                className="bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-small w-fit transition-all duration-200 hover:bg-white/20"
              >
                {role.role}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <Button
              type="button"
              onClick={() => setIsModalOpen(true)}
              variant="secondary-bordered"
              size="sm"
              className="w-fit"
            >
              Collab details
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CollaborationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        collaborationData={collaborationData}
      />
    </>
  )
}

/**
 * INSERTION INSTRUCTION:
 *
 * Location: Replace the existing "Contribution" section in HomeProject.tsx
 *
 * In src/components/home/HomeProject.tsx (around line 386):
 * Replace this section:
 *
 *   {label && (
 *     <div className="col-span-6 md:col-span-4 md:col-start-5 lg:col-span-2 lg:col-start-3 text-white">
 *       <p className="text-small tracking-wide text-white/60 mb-3">Contribution</p>
 *       ... pill rendering ...
 *     </div>
 *   )}
 *
 * With:
 *
 *   {label && (
 *     <CollaborationDetails
 *       teamRoles={[
 *         { id: 'pm', role: 'PM' },
 *         { id: 'dev', role: 'Dev' },
 *         { id: 'ui', role: 'UI' },
 *         { id: 'client', role: 'Client' },
 *       ]}
 *       collaborationData={{
 *         teamInvolvement: [
 *           'Led end-to-end design process',
 *           'Collaborated with 2 engineers and 1 PM',
 *           'Conducted user interviews',
 *         ],
 *         rituals: [
 *           'Weekly design reviews (Tuesdays 10am)',
 *           'Daily async updates in Slack',
 *           'Bi-weekly roadmap planning',
 *         ],
 *         communicationChannels: [
 *           'Slack (primary)',
 *           'Figma comments & FigJam',
 *           'Google Drive for documentation',
 *         ],
 *         keyActivities: [
 *           'Design sprints (week 1-2)',
 *           'Prototyping & testing (week 3)',
 *           'Iteration based on feedback',
 *           'Final handoff & documentation',
 *         ],
 *         myImpact: [
 *           'Improved user onboarding completion by 30%',
 *           'Reduced support tickets by 40%',
 *           'Established design system for future projects',
 *         ],
 *       }}
 *     />
 *   )}
 *
 * Import at the top of HomeProject.tsx:
 *   import CollaborationDetails from '@/components/home/CollaborationDetails'
 *
 * The component should be placed immediately below the hero section image
 * and above any other project metadata sections.
 */
