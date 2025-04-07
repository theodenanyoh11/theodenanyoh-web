import React, { JSX } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Project, Media as MediaType, Technology } from '@/payload-types' // Removed unused Page import
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns' // For date formatting
import { ExternalLinkIcon } from 'lucide-react'

// Force dynamic rendering if draft mode is enabled
export const dynamic = 'force-dynamic'

// --- Generate Static Params ---
export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const projects = await payload.find({
      collection: 'projects',
      limit: 1000, // Adjust limit as needed
      depth: 0, // Only need slug for params
      where: {
        // Remove _status filter since versioning is disabled
        // _status: { equals: 'published' },
      },
    })

    return projects.docs.map(({ slug }) => ({ slug }))
  } catch (error) {
    console.error('Error generating static params for projects:', error)
    return []
  }
}

// --- Generate Metadata ---
// Apply Next.js 15 async pattern to props
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params // Await params
  const { slug } = resolvedParams
  const { isEnabled: isDraftMode } = await draftMode()

  let project: Project | null = null

  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'projects',
      limit: 1,
      depth: 1, // Need depth 1 for mainImage for meta
      where: {
        slug: { equals: slug },
        // Remove _status filter since versioning is disabled
        // ...(isDraftMode ? {} : { _status: { equals: 'published' } }),
      },
      draft: isDraftMode,
    })
    project = docs[0] || null
  } catch (error) {
    console.error('Error fetching project for metadata:', error)
  }

  const ogImage =
    typeof project?.mainImage === 'object' && project?.mainImage !== null
      ? (project.mainImage.url ?? undefined) // Use populated URL if available
      : undefined

  return {
    title: project?.name ? `${project.name} | Project` : 'Project',
    description: project?.summary || 'Project details.',
    openGraph: {
      title: project?.name || 'Project',
      description: project?.summary || '',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  }
}

// Define standard Props type reflecting Next.js 15 async page behavior
type Props = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

// --- Main Page Component ---
// Use the Props type alias and await params
const ProjectPage = async ({ params /* , searchParams */ }: Props): Promise<JSX.Element> => {
  const resolvedParams = await params // Await the params prop
  const { slug } = resolvedParams
  const { isEnabled: isDraftMode } = await draftMode() // Await draftMode()
  let project: Project | null = null

  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'projects',
      limit: 1,
      depth: 2, // Need depth 2 for gallery images and technologies
      where: {
        slug: { equals: slug },
        // Remove _status filter since versioning is disabled
        // ...(isDraftMode ? {} : { _status: { equals: 'published' } }),
      },
      draft: isDraftMode,
    })
    project = docs[0] || null
  } catch (error) {
    console.error('Error fetching project page:', error)
    // Optionally render an error state or specific message
  }

  if (!project) {
    return notFound()
  }

  // Helper function mapping (copied from client component, consider moving to utils)
  const getStatusVariant = (
    status: Project['status'],
  ): 'default' | 'secondary' | 'outline' | 'destructive' => {
    switch (status) {
      case 'active':
        return 'default'
      case 'in_progress':
        return 'secondary'
      case 'idea':
        return 'outline'
      case 'closed':
        return 'destructive'
      default:
        return 'outline'
    }
  }
  const getStatusLabel = (status: Project['status']): string => {
    switch (status) {
      case 'idea':
        return 'Idea'
      case 'in_progress':
        return 'In Progress'
      case 'active':
        return 'Active'
      case 'closed':
        return 'Closed'
      default:
        return status || 'Unknown'
    }
  }

  const formatDate = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null
    try {
      return format(new Date(dateString), 'MMMM yyyy')
    } catch (e) {
      console.error('Error formatting date:', e)
      return null
    }
  }

  const startDateFormatted = formatDate(project.startDate)
  const endDateFormatted = formatDate(project.endDate)

  // Ensure external link URL has a protocol
  let externalUrl = project.projectLink?.url
  if (externalUrl && !externalUrl.startsWith('http://') && !externalUrl.startsWith('https://')) {
    externalUrl = `https://${externalUrl}`
  }

  return (
    <div className="py-10 md:py-16">
      <article className="container mx-auto">
        {/* Header Section */}
        <header className="mb-8 md:mb-12 border-b pb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.name}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
            {project.status && (
              <Badge variant={getStatusVariant(project.status)}>
                {getStatusLabel(project.status)}
              </Badge>
            )}
            {(startDateFormatted || endDateFormatted) && (
              <span>
                {startDateFormatted}
                {endDateFormatted ? ` - ${endDateFormatted}` : ' - Present'}
              </span>
            )}
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                aria-label={`Visit project ${project.name} (opens in new tab)`}
              >
                <ExternalLinkIcon className="h-4 w-4" />
                <span>{project.projectLink?.label || 'Visit Link'}</span>
              </a>
            )}
          </div>
          {project.summary && (
            <p className="mt-4 text-lg text-muted-foreground">{project.summary}</p>
          )}
        </header>

        {/* Main Image */}
        {typeof project.mainImage === 'object' && project.mainImage !== null && (
          <div className="mb-8 md:mb-12 rounded-lg overflow-hidden shadow-md aspect-[16/9] md:aspect-[21/9]">
            <Media resource={project.mainImage} className="w-full h-full object-cover" priority />
          </div>
        )}

        {/* Technologies */}
        {Array.isArray(project.technologies) && project.technologies.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => {
                const techDoc = tech as Technology // Type assertion
                return (
                  <Badge key={techDoc.id} variant="secondary">
                    {techDoc.name}
                  </Badge>
                )
              })}
            </div>
          </section>
        )}

        {/* Detailed Description */}
        <section className="prose dark:prose-invert max-w-none mb-8 md:mb-12">
          <RichText data={project.description} />
        </section>

        {/* Gallery */}
        {Array.isArray(project.gallery) && project.gallery.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {project.gallery.map((item, index) => {
                const image = item.image as MediaType // Type assertion
                if (typeof image === 'object' && image !== null) {
                  return (
                    <div key={index} className="aspect-square overflow-hidden rounded-md shadow">
                      <Media resource={image} className="w-full h-full object-cover" />
                      {/* Optional: Add item.caption here if you implement it */}
                    </div>
                  )
                }
                return null
              })}
            </div>
          </section>
        )}

        {/* Optional: Add related projects section here */}
      </article>
    </div>
  )
}

export default ProjectPage
