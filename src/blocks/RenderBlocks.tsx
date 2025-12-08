import React from 'react'

import type { Page, FormBlock as FormBlockType } from '@/payload-types'

import { ArchiveBlock } from './ArchiveBlock/Component'
import { CallToActionBlock } from './CallToAction/Component'
import { ContentBlock } from './Content/Component'
import { MediaBlock } from './MediaBlock/Component'
import { FeaturedProjectsBlock } from './FeaturedProjects/Component'
import { FormBlock } from './Form/Component'
import { SkillBlockComponent } from './SkillBlock/Component'
import { ProductBlockComponent } from './ProductBlock/Component'
import { FeaturedPostsBlockComponent } from './FeaturedPostsBlock/Component'

const blockComponents: {
  [key: string]: React.FC<Record<string, unknown> & { disableInnerContainer?: boolean }>
} = {
  archive: ArchiveBlock as unknown as React.FC<
    Record<string, unknown> & { disableInnerContainer?: boolean }
  >,
  content: ContentBlock as unknown as React.FC<
    Record<string, unknown> & { disableInnerContainer?: boolean }
  >,
  cta: CallToActionBlock as unknown as React.FC<
    Record<string, unknown> & { disableInnerContainer?: boolean }
  >,
  formBlock: FormBlock as unknown as React.FC<
    Record<string, unknown> & { disableInnerContainer?: boolean }
  >,
  mediaBlock: MediaBlock as unknown as React.FC<
    Record<string, unknown> & { disableInnerContainer?: boolean }
  >,
  featuredProjects: FeaturedProjectsBlock as unknown as React.FC<
    Record<string, unknown> & { disableInnerContainer?: boolean }
  >,
  skillBlock: SkillBlockComponent as unknown as React.FC<
    Record<string, unknown> & { disableInnerContainer?: boolean }
  >,
  productBlock: ProductBlockComponent as unknown as React.FC<
    Record<string, unknown> & { disableInnerContainer?: boolean }
  >,
  featuredPostsBlock: FeaturedPostsBlockComponent as unknown as React.FC<
    Record<string, unknown> & { disableInnerContainer?: boolean }
  >,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <>
        {blocks.map((block, index) => {
          // Skip invalid blocks early
          if (!block || typeof block !== 'object') {
            console.warn(`[RenderBlocks] Block at index ${index} is invalid (null/undefined).`)
            return null
          }

          const { blockType } = block

          if (!blockType || typeof blockType !== 'string') {
            console.warn(`[RenderBlocks] Block at index ${index} is missing blockType.`)
            return null
          }

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              // Special handling for formBlock
              if (blockType === 'formBlock') {
                const { form, enableIntro, introContent } = block as FormBlockType
                const formId = typeof form === 'object' ? form?.id : form
                if (formId) {
                  return (
                    <div className="my-16" key={index}>
                      <Block
                        blockType={blockType}
                        formId={formId}
                        enableIntro={enableIntro}
                        introContent={introContent}
                        disableInnerContainer
                      />
                    </div>
                  )
                } else {
                  console.warn('[RenderBlocks] FormBlock is missing a valid form ID.')
                  return null
                }
              }

              // Default rendering for other blocks
              // Add error boundary to prevent build failures from malformed blocks
              try {
                if (!block || typeof block !== 'object') {
                  console.warn(`[RenderBlocks] Block at index ${index} is invalid.`)
                  return null
                }
                return (
                  <div className="my-16" key={index}>
                    <Block {...block} disableInnerContainer />
                  </div>
                )
              } catch (error) {
                console.error(
                  `[RenderBlocks] Error rendering block ${blockType} at index ${index}:`,
                  error,
                )
                return null
              }
            }
          }
          // console.warn(`[RenderBlocks] No component found for blockType: ${blockType}`) // Keep commented out or remove
          return null
        })}
      </>
    )
  }

  return null
}
