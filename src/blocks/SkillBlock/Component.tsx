import React from 'react'
import { type SkillBlock, type Skill } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { SkillCarouselClient } from './Component.client'
import RichText from '@/components/RichText'

type Props = {
  block: SkillBlock | undefined | null
}

export const SkillBlockComponent: React.FC<Props> = async ({ block }) => {
  if (!block) {
    console.error('SkillBlockComponent received undefined block prop.')
    return null
  }

  const { title: blockTitle, richText, skills: skillRelation } = block
  const payload = await getPayload({ config: configPromise })

  let fetchedSkills: Skill[] = []

  if (skillRelation && skillRelation.length > 0) {
    try {
      const skillIDs = skillRelation
        .map((skill: number | Skill) => (typeof skill === 'object' ? skill.id : skill))
        .filter((id): id is number => typeof id === 'number')

      if (skillIDs.length > 0) {
        const skillsResult = await payload.find({
          collection: 'skills',
          where: {
            id: {
              in: skillIDs,
            },
          },
          depth: 0, // Only need title and icon now
          limit: skillIDs.length,
          pagination: false,
        })
        fetchedSkills = skillsResult.docs
      }
    } catch (error) {
      console.error('Error fetching skills for SkillBlock:', error)
    }
  }

  // Filter out any potentially invalid skill data before passing to client
  const validSkills = fetchedSkills.filter((skill): skill is Skill => !!skill.title && !!skill.icon)

  if (validSkills.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto">
        <div className="mb-8 md:mb-12 text-left">
          {blockTitle && <h2 className="text-3xl font-bold mb-4">{blockTitle}</h2>}
          {richText && <RichText data={richText} enableGutter={false} />}
        </div>
        <SkillCarouselClient skills={validSkills} />
      </div>
    </section>
  )
}
