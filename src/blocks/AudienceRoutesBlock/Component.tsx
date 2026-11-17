import React from 'react'

import type { AudienceRoutesBlock } from '@/payload-types'

import { AudienceRoutes } from '@/components/site/AudienceRoutes'

export const AudienceRoutesBlockComponent: React.FC<AudienceRoutesBlock> = ({ title }) => (
  <AudienceRoutes title={title} />
)
