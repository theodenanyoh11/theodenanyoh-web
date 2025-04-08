import React, { Fragment } from 'react'

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
  [key: string]: React.FC<any>
} = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  featuredProjects: FeaturedProjectsBlock,
  skillBlock: SkillBlockComponent,
  productBlock: ProductBlockComponent,
  featuredPostsBlock: FeaturedPostsBlockComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

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
              return (
                <div className="my-16" key={index}>
                  <Block block={block} disableInnerContainer />
                </div>
              )
            }
          }
          // console.warn(`[RenderBlocks] No component found for blockType: ${blockType}`) // Keep commented out or remove
          return null
        })}
      </Fragment>
    )
  }

  return null
}
