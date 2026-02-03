'use client'

import { AnimatedArrowBigDown } from '@/components/shared/icons/AnimatedArrowBigDown'
import { AnimatedArrowBigUp } from '@/components/shared/icons/AnimatedArrowBigUp'
import { AnimatedSparkles } from '@/components/shared/icons/AnimatedSparkles'

interface ImpactListProps {
  items: string
  upArrowIndices?: number[]
  sparklesIndices?: number[]
}

export function ImpactList({ items, upArrowIndices = [], sparklesIndices = [] }: ImpactListProps) {
  const impactItems = items.split('\n').filter(item => item.trim())

  return (
    <div>
      <h3 className="text-h4 tracking-wide mb-8 text-white/60">Impact</h3>
      <div className="space-y-6">
        {impactItems.map((item, index) => (
          <div key={index} className="flex gap-6 items-start">
            <div className="flex-shrink-0 pt-1">
              {sparklesIndices.includes(index) ? (
                <AnimatedSparkles />
              ) : upArrowIndices.includes(index) ? (
                <AnimatedArrowBigUp />
              ) : (
                <AnimatedArrowBigDown />
              )}
            </div>
            <p className="text-h5 text-white leading-relaxed flex-1">
              {item.trim()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
