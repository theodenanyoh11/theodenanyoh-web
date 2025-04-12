'use client'

import React, { useEffect, useState } from 'react'
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Skill } from '@/payload-types' // Use our Skill type
import {
  Code,
  Palette,
  BarChart3,
  LayoutDashboard,
  Megaphone,
  Users,
  Target,
  PiggyBank,
  // Add other icons used in your select field options here if needed
} from 'lucide-react'

type Props = {
  skills: Skill[]
}

// Map icon select values to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  design: Palette,
  product: LayoutDashboard,
  marketing: Megaphone,
  analytics: BarChart3,
  leadership: Users,
  strategy: Target,
  'fund-raising': PiggyBank,
  // Add other mappings here
}

export const SkillCarouselClient: React.FC<Props> = ({ skills = [] }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0) // Keep track of current slide

  useEffect(() => {
    if (!api) {
      return
    }

    // Auto-scroll effect
    const timer = setTimeout(() => {
      if (!api) return // Check api again inside timeout
      const lastSlide = api.scrollSnapList().length - 1
      const nextSlide = current === lastSlide ? 0 : current + 1
      api.scrollTo(nextSlide)
      setCurrent(nextSlide)
    }, 3000) // Adjust scroll interval (3000ms = 3 seconds)

    return () => clearTimeout(timer) // Cleanup timer on unmount
  }, [api, current])

  return (
    <Carousel
      setApi={setApi}
      className="w-full"
      opts={{
        align: 'start',
        loop: true, // Enable looping for continuous effect
      }}
    >
      <CarouselContent>
        {skills.map((skill) => {
          // Get the icon component based on the 'icon' value from the skill
          const Icon = iconMap[skill.icon || ''] || Target // Fallback to Target icon
          return (
            <CarouselItem key={skill.id} className="basis-1/4 md:basis-1/5 lg:basis-1/6">
              {' '}
              {/* Adjust basis for responsiveness */}
              <div className="flex rounded-md h-36 bg-muted items-center justify-center p-4 md:p-6">
                {' '}
                {/* Adjust padding */}
                <div className="flex flex-col items-center gap-2">
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />{' '}
                  {/* Adjust icon size/color */}
                  <span className="text-sm md:text-base text-center font-medium text-muted-foreground">
                    {skill.title} {/* Use skill.title */}
                  </span>
                </div>
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>
    </Carousel>
  )
}

// Reminder: Add CSS for .mask-gradient
/*
.mask-gradient {
  -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%);
  mask-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%);
}
*/
