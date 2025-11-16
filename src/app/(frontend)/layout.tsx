import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { PostHogProvider } from '@/providers/PostHogProvider'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { SiteSetting } from '@/payload-types'
import { HeadScript } from '@/components/HeadScript/HeadScript'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const siteSettingsResult = await getCachedGlobal('site-settings', 2)()
  const siteSettingsData = siteSettingsResult as SiteSetting
  const headScript = siteSettingsData?.headScript || ''

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <!-- Load the widget script -->
<script
  src="https://unpkg.com/@franklinhelp/sdk-website@0.1.0-alpha.6/dist/index.global.js"
  async
></script>

<!-- Initialize manually - MUST be after the script tag -->
<script>
  (function() {
    function initFranklinWidget() {
      // Check if the function is available
      if (typeof window.FranklinWidgetInit === 'function') {
        console.log('[Franklin] Initializing widget...');
        window.FranklinWidgetInit({
          siteKey: "FRK_SITE_mi24l0kwknoyYZQ4gC1PPoTfNZThq5p2",
          assistantId: "m577jcfq4wf7awbp4jz39e4fwn7vgype",
          apiBaseUrl: "https://app.franklinhelp.com",
          position: "bottom-right"
        });
        return true;
      }
      return false;
    }
    
    // Try immediately
    if (!initFranklinWidget()) {
      // If not ready, wait and retry
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      const interval = setInterval(function() {
        attempts++;
        if (initFranklinWidget() || attempts >= maxAttempts) {
          clearInterval(interval);
          if (attempts >= maxAttempts) {
            console.error('[Franklin] Widget failed to load after 5 seconds');
          }
        }
      }, 100);
    }
  })();
</script>
        {headScript && <HeadScript script={headScript} />}
      </head>
      <body>
        <PostHogProvider>
          <Providers>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />

            <Header />
            {children}
            <Footer />
          </Providers>
        </PostHogProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
