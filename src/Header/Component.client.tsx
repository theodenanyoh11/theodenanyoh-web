'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/site/Button'
import { contactHref, primaryNav } from '@/components/site/nav'
import { Wordmark } from '@/components/site/Wordmark'
import { cn } from '@/utilities/ui'

const isCurrent = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

export const HeaderClient: React.FC = () => {
  const pathname = usePathname()
  const [openOn, setOpenOn] = useState<string | null>(null)
  // The menu belongs to the page it was opened on, so navigating closes it.
  const open = openOn === pathname
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const toggle = toggleRef.current
    menuRef.current?.querySelector<HTMLElement>('a')?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenOn(null)
        return
      }
      if (event.key !== 'Tab') return
      // Keep focus inside the menu and its close button while it is open.
      const focusable = [
        toggle,
        ...(menuRef.current?.querySelectorAll<HTMLElement>('a, button') ?? []),
      ].filter(Boolean) as HTMLElement[]
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    // The menu only exists below the desktop breakpoint. Close it if the window grows.
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onWiden = () => desktop.matches && setOpenOn(null)
    desktop.addEventListener('change', onWiden)

    document.addEventListener('keydown', onKeyDown)
    return () => {
      desktop.removeEventListener('change', onWiden)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      toggle?.focus()
    }
  }, [open])

  return (
    <header
      className={cn(
        // Sticky below desktop, so the menu button is always in reach on a phone.
        'sticky top-0 z-30 border-b lg:relative',
        open ? 'border-body bg-ink' : 'border-rule bg-paper',
      )}
    >
      <div className="site-container flex items-center justify-between py-4 lg:py-6">
        <Link aria-label="Theo Denanyoh, home" href="/">
          <Wordmark
            className="text-[28px] leading-8 lg:text-[32px]"
            tone={open ? 'paper' : 'ink'}
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          {primaryNav.map((item) => (
            <Link
              aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
              className="text-[15px] font-medium leading-[18px] text-ink hover:text-cobalt aria-[current=page]:text-cobalt"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Button href={contactHref} variant="ink">
            Get in touch
          </Button>
        </nav>

        <button
          aria-controls="site-menu"
          aria-expanded={open}
          className={cn(
            'rounded-pill px-[18px] py-[10px] text-[15px] font-semibold leading-[18px] lg:hidden',
            open ? 'bg-paper text-ink' : 'bg-ink text-paper',
          )}
          onClick={() => setOpenOn(open ? null : pathname)}
          ref={toggleRef}
          type="button"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <div
          className="absolute inset-x-0 top-full flex h-[calc(100dvh-100%)] flex-col justify-between overflow-y-auto bg-ink px-4 pb-8 pt-6 lg:hidden"
          id="site-menu"
          ref={menuRef}
        >
          <nav aria-label="Main" className="flex flex-col">
            {primaryNav.map((item) => (
              <Link
                aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
                className="border-b border-body py-5 font-display text-[40px] font-extrabold leading-[44px] tracking-[-0.035em] text-paper aria-[current=page]:text-[#8FA0FF]"
                href={item.href}
                key={item.href}
                onClick={() => setOpenOn(null)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button
            className="mt-10 w-full"
            href={contactHref}
            onClick={() => setOpenOn(null)}
            size="lg"
            variant="primary"
          >
            Get in touch
          </Button>
        </div>
      )}
    </header>
  )
}
