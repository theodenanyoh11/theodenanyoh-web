'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Technology } from '@/payload-types'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useDebounce } from '@/hooks/useDebounce'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Define valid status values and type (consider moving to shared place)
const validStatuses = ['idea', 'in_progress', 'active', 'closed'] as const
type ProjectStatus = (typeof validStatuses)[number]

interface ProjectFiltersProps {
  allTechnologies: Technology[]
  currentSearch?: string
  currentTechnologies?: string[] // Expecting slugs
  currentStatus?: ProjectStatus | 'all' // Add status prop, allow 'all'
  currentFeatured?: boolean
}

// Helper to get display label for status
const getStatusLabel = (status: ProjectStatus | 'all'): string => {
  switch (status) {
    case 'idea':
      return 'Idea'
    case 'in_progress':
      return 'In Progress'
    case 'active':
      return 'Active'
    case 'closed':
      return 'Closed'
    case 'all':
      return 'All Statuses'
    default:
      return 'Unknown'
  }
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  allTechnologies,
  currentSearch = '',
  currentTechnologies = [],
  currentStatus = 'all', // Default to showing all statuses
  currentFeatured = false,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(currentSearch)
  const [selectedTechSlugs, setSelectedTechSlugs] = useState<Set<string>>(
    new Set(currentTechnologies),
  )
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'all'>(currentStatus)
  const [isFeaturedChecked, setIsFeaturedChecked] = useState(currentFeatured)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Function to update URL query parameters
  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Update search
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm)
    else params.delete('search')

    // Update technologies
    if (selectedTechSlugs.size > 0)
      params.set('technologies', Array.from(selectedTechSlugs).join(','))
    else params.delete('technologies')

    // Update status
    if (selectedStatus && selectedStatus !== 'all') params.set('status', selectedStatus)
    else params.delete('status')

    // Update featured flag
    if (isFeaturedChecked) params.set('featured', 'true')
    else params.delete('featured')

    // Reset page to 1
    params.delete('page')

    router.push(`${pathname}?${params.toString()}`)
  }, [
    debouncedSearchTerm,
    selectedTechSlugs,
    selectedStatus,
    isFeaturedChecked,
    router,
    pathname,
    searchParams,
  ])

  // Effect to update URL when filters change
  useEffect(() => {
    updateQueryParams()
  }, [debouncedSearchTerm, selectedTechSlugs, selectedStatus, isFeaturedChecked, updateQueryParams])

  // Handler for technology checkbox changes
  const handleTechChange = (techSlug: string, checked: boolean | 'indeterminate') => {
    setSelectedTechSlugs((prev) => {
      const newSet = new Set(prev)
      if (checked) newSet.add(techSlug)
      else newSet.delete(techSlug)
      return newSet
    })
  }

  // Handler for status change
  const handleStatusChange = (value: string) => {
    // Check if the value is a valid status or 'all'
    if (validStatuses.includes(value as ProjectStatus) || value === 'all') {
      setSelectedStatus(value as ProjectStatus | 'all')
    }
  }

  // Handler for featured checkbox change
  const handleFeaturedChange = (checked: boolean | 'indeterminate') => {
    setIsFeaturedChecked(!!checked) // Convert indeterminate to false
  }

  // Handler for clearing all filters
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTechSlugs(new Set())
    setSelectedStatus('all')
    setIsFeaturedChecked(false)
    // updateQueryParams will be triggered by state changes
  }

  return (
    <div className="mb-8 p-4 md:p-6 border rounded-lg bg-card">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-end">
        {/* Search Input */}
        <div>
          <Label htmlFor="project-search" className="mb-2 block font-medium">
            Search
          </Label>
          <Input
            id="project-search"
            type="text"
            placeholder="By name or summary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div>
          <Label htmlFor="status-filter" className="mb-2 block font-medium">
            Status
          </Label>
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Filter by status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {validStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {getStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Technology Filter */}
        <div>
          <Label className="mb-2 block font-medium">Technologies</Label>
          {allTechnologies.length > 0 ? (
            <ScrollArea className="h-40 rounded-md border p-3">
              {/* Removed space-y-2 to use Checkbox + Label pattern better */}
              {allTechnologies.map((tech) => (
                <div key={tech.id} className="flex items-center space-x-2 mb-1.5">
                  <Checkbox
                    id={`tech-${tech.slug}`}
                    checked={selectedTechSlugs.has(tech.slug || tech.id.toString())}
                    onCheckedChange={(checked) =>
                      handleTechChange(tech.slug || tech.id.toString(), checked)
                    }
                  />
                  <Label
                    htmlFor={`tech-${tech.slug}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {tech.name}
                  </Label>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">No technologies.</p>
          )}
        </div>

        {/* Featured & Clear Button Area */}
        <div className="flex flex-col justify-between h-full">
          {/* Featured Checkbox */}
          <div className="flex items-center space-x-2 mb-2 pt-7">
            {' '}
            {/* Adjust pt for alignment */}
            <Checkbox
              id="featured-filter"
              checked={isFeaturedChecked}
              onCheckedChange={handleFeaturedChange}
            />
            <Label htmlFor="featured-filter" className="text-sm font-normal cursor-pointer">
              Only Featured
            </Label>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm ||
            selectedTechSlugs.size > 0 ||
            selectedStatus !== 'all' ||
            isFeaturedChecked) && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-sm w-full justify-start p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-foreground mt-auto"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
