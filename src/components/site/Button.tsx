import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'

type Variant = 'primary' | 'ink' | 'secondary' | 'onInk' | 'onCobalt'

/**
 * Site paths start with / or #. Anything else is an outside address, and one
 * typed without a scheme ("www.example.com") gets https added.
 */
export const resolveHref = (href: string): { href: string; external: boolean } => {
  if (href.startsWith('/') || href.startsWith('#')) return { href, external: false }
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return { href, external: true }
  return { href: `https://${href}`, external: true }
}

const variants: Record<Variant, string> = {
  primary: 'bg-cobalt text-paper hover:bg-[#1630e0]',
  ink: 'bg-ink text-paper hover:bg-[#242424]',
  secondary: 'bg-mist text-ink hover:bg-rule',
  onInk: 'bg-paper text-ink hover:bg-mist',
  onCobalt: 'bg-paper text-ink hover:bg-cobalt-soft',
}

const sizes = {
  md: 'px-[18px] py-[10px] text-[15px] leading-[18px]',
  lg: 'px-6 py-[18px] text-[17px] leading-[22px]',
}

type Props = {
  variant?: Variant
  size?: keyof typeof sizes
  className?: string
  children: React.ReactNode
} & (
  | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>)
)

/** Pill button. Renders a link when `href` is set, otherwise a button. */
export const Button: React.FC<Props> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}) => {
  const classes = cn(
    'inline-flex items-center justify-center gap-3 rounded-pill font-semibold transition-colors',
    variants[variant],
    sizes[size],
    className,
  )

  if (typeof rest.href === 'string') {
    const { href: rawHref, ...anchorProps } = rest
    const { href, external } = resolveHref(rawHref)
    if (external) {
      return (
        <a className={classes} href={href} {...anchorProps}>
          {children}
        </a>
      )
    }
    return (
      <Link className={classes} href={href} {...anchorProps}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}

/** Underlined text link, used beside buttons and at the end of sections. */
export const TextLink: React.FC<{
  href: string
  className?: string
  children: React.ReactNode
}> = ({ href: rawHref, className, children }) => {
  const { href, external } = resolveHref(rawHref)
  const classes = cn(
    'font-semibold text-ink underline decoration-1 underline-offset-4 hover:text-cobalt',
    className,
  )
  return external ? (
    <a className={classes} href={href}>
      {children}
    </a>
  ) : (
    <Link className={classes} href={href}>
      {children}
    </Link>
  )
}

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg aria-hidden="true" className={className} height="16" viewBox="0 0 14 16" width="14">
    <path d="M1 0 L14 8 L1 16 Z" fill="currentColor" />
  </svg>
)
