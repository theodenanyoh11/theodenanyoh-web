'use client'

import React from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  // baseUrl: string
  // searchParams?: { [key: string]: string | string[] | undefined }
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  // baseUrl, // Prefixed as unused
  // searchParams = {}, // Prefixed as unused
}) => {
  const router = useRouter()
  const pathname = usePathname() // Use pathname for current route base
  const currentSearchParams = useSearchParams() // Use hook to get current params object

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(currentSearchParams.toString())
    params.set('page', String(newPage))
    router.push(`${pathname}?${params.toString()}`)
  }

  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages

  if (totalPages <= 1) {
    return null // Don't render controls if only one page
  }

  return (
    <div className="mt-8 flex items-center justify-center space-x-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!canGoPrev}
        aria-label="Go to previous page"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </Button>
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Go to next page"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </Button>
    </div>
  )
}
