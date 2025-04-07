import clsx from 'clsx'
import React from 'react'
import type { Media as MediaType } from '@/payload-types'
import { Media } from '../Media'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  logoResource?: MediaType | null
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className, logoResource } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  const hasLogo = logoResource && typeof logoResource === 'object'

  return (
    <div className={clsx('max-w-[9.375rem] w-auto flex items-center', className)}>
      {hasLogo ? (
        <Media
          resource={logoResource}
          priority={priority === 'high'}
          loading={loading}
          className="invert dark:invert-0 w-auto"
          imgClassName="w-auto h-[34px]"
        />
      ) : (
        /* eslint-disable @next/next/no-img-element */
        <img
          alt="Theo Denanyoh Logo Fallback"
          width={193}
          height={34}
          loading={loading}
          fetchPriority={priority}
          decoding="async"
          className={clsx('w-auto h-[34px] invert dark:invert-0', className)}
          src="https://theodenanyohdotcom.s3.us-east-1.amazonaws.com/media/Td%20Logo%20White.svg"
        />
      )}
    </div>
  )
}
