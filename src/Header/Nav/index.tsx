'use client'

import React, { useState, useEffect } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, MenuIcon, XIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <nav className="flex gap-4 items-center">
      <div className="hidden md:flex gap-3 items-center">
        {navItems.map(({ link }, i) => {
          const appearance = link.appearance || 'link'
          return <CMSLink key={i} {...link} appearance={appearance} />
        })}
        <Link href="/search" aria-label="Search">
          <SearchIcon className="w-5 text-primary" />
        </Link>
      </div>

      <div className="md:hidden flex items-center">
        <Link href="/search" aria-label="Search" className="mr-2">
          <SearchIcon className="w-5 text-primary" />
        </Link>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[340px] p-6">
            <SheetClose
              asChild
              className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
            >
              <Button variant="ghost" size="icon" aria-label="Close menu">
                <XIcon className="h-8 w-8" />
              </Button>
            </SheetClose>
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="mb-6 pt-2 text-lg font-medium border-b pb-4">Menu</div>
            <div className="flex flex-col space-y-3">
              {navItems.map(({ link }, i) => {
                const mobileAppearance = link.appearance || 'link'
                return (
                  <SheetClose asChild key={i}>
                    <CMSLink
                      {...link}
                      appearance={mobileAppearance}
                      className="w-full text-left px-4 py-2 rounded-md hover:bg-muted"
                    />
                  </SheetClose>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
