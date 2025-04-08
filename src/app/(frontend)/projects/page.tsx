import React, { JSX } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'

import { Technology } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ProjectCard } from './ProjectCard' // Corrected path
import { ProjectFilters } from './ProjectFilters.client' // Corrected path
import { PaginationControls } from '@/components/PaginationControls' // Assuming this path is correct

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore a collection of projects.',
}

// Define expected search parameters
interface SearchParams {
  search?: string
  technologies?: string // Comma-separated slugs
  status?: string // e.g., 'active', 'idea'
  featured?: string // 'true'
  page?: string
}

// Define Props type reflecting Next.js 15 async page behavior
type Props = {
  searchParams?: Promise<SearchParams>
}

// Default projects per page
const PROJECTS_PER_PAGE = 9

// Define valid status values for type safety
const validStatuses = ['idea', 'in_progress', 'active', 'closed'] as const
type ProjectStatus = (typeof validStatuses)[number]

// Use Props type and await searchParams
const ProjectsPage = async ({ searchParams }: Props): Promise<JSX.Element> => {
  const resolvedSearchParams = (await searchParams) || {} // Await and provide default
  const { isEnabled: isDraftMode } = await draftMode() // Correctly await draftMode
  const payload = await getPayload({ config: configPromise })

  const page = parseInt(resolvedSearchParams.page || '1', 10)
  const search = resolvedSearchParams.search
  const technologySlugs = resolvedSearchParams.technologies?.split(',').filter(Boolean) || []
  const status = resolvedSearchParams.status as ProjectStatus | undefined
  const featured = resolvedSearchParams.featured === 'true' // Convert to boolean

  let technologyIDs: string[] = []

  // Fetch Technology IDs based on slugs if provided
  if (technologySlugs.length > 0) {
    try {
      const fetchedTechs = await payload.find({
        collection: 'technologies',
        depth: 0,
        limit: 100, // Assume max 100 techs for filter
        where: {
          slug: { in: technologySlugs }, // Assuming technologies have slugs
          // If using names: name: { in: technologyNames }
        },
        pagination: false,
      })
      technologyIDs = fetchedTechs.docs.map((doc) => String(doc.id)) // Convert ID to string
    } catch (error) {
      console.error('Error fetching technology IDs for filter:', error)
    }
  }

  // Construct the where clause for projects query
  const whereClause: any = {
    // ...(isDraftMode ? {} : { _status: { equals: 'published' } }), // Keep commented if versioning is off
  }
  if (search) {
    whereClause.or = [{ name: { contains: search } }, { summary: { contains: search } }]
  }
  if (technologyIDs.length > 0) {
    whereClause.technologies = { in: technologyIDs }
  }
  // Add status filter if valid status is provided
  if (status && validStatuses.includes(status)) {
    whereClause.status = { equals: status }
  }
  // Add featured filter if requested
  if (featured) {
    whereClause.featured = { equals: true }
  }

  let projectsData
  try {
    projectsData = await payload.find({
      collection: 'projects',
      depth: 2, // Need depth for image, technologies etc.
      page,
      limit: PROJECTS_PER_PAGE,
      where: whereClause,
      sort: '-startDate', // Or '-createdAt' or other default sort
      draft: isDraftMode,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    // Handle error display if needed
    projectsData = { docs: [], totalPages: 0, totalDocs: 0 }
  }

  // Fetch all technologies for the filter options
  let allTechnologies: Technology[] = []
  try {
    const techResult = await payload.find({
      collection: 'technologies',
      depth: 0,
      limit: 100,
      pagination: false,
      sort: 'name',
    })
    allTechnologies = techResult.docs
  } catch (error) {
    console.error('Error fetching all technologies:', error)
  }

  return (
    <div className="py-10 md:py-16">
      <div className="container mx-auto">
        <header className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">Projects</h1>
          {/* Optional intro text */}
        </header>

        {/* Filters - Client Component */}
        <ProjectFilters
          allTechnologies={allTechnologies}
          currentSearch={search}
          currentTechnologies={technologySlugs}
          currentStatus={status} // Pass current status
          currentFeatured={featured} // Pass current featured flag
        />

        {/* Project List */}
        {projectsData.docs.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {projectsData.docs.map((project) => (
              // Use a dedicated card component for better organization
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-center text-muted-foreground">
            No projects found matching your criteria.
          </p>
        )}

        {/* Pagination */}
        <PaginationControls currentPage={page} totalPages={projectsData.totalPages} />
      </div>
    </div>
  )
}

export default ProjectsPage
