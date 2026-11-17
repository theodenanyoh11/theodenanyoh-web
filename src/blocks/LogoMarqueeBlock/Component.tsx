import React from 'react'

import type { LogoMarqueeBlock, SiteSetting } from '@/payload-types'

import { LogoMarquee } from '@/components/site/LogoMarquee'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const LogoMarqueeBlockComponent: React.FC<LogoMarqueeBlock> = async ({ label }) => {
  const settings = (await getCachedGlobal('site-settings', 2)()) as SiteSetting | null
  return <LogoMarquee items={settings?.logoStrip ?? []} label={label} />
}
