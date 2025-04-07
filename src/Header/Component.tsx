import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header, SiteSetting } from '@/payload-types'

export async function Header() {
  // Fetch both header and site settings data
  const [headerResult, siteSettingsResult] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedGlobal('site-settings', 2)(),
  ])

  // Assert types after fetching
  const headerData = headerResult as Header
  const siteSettingsData = siteSettingsResult as SiteSetting

  // Pass props individually
  return <HeaderClient headerData={headerData} siteSettingsData={siteSettingsData} />
}
