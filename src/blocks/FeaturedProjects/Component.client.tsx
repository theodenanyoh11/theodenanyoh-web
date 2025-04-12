'use client'

import React from 'react'
import { Project, Technology, FeaturedProjectsBlock } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ExternalLinkIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import RichText from '@/components/RichText'

// Define the props expected by the Client Component
interface FeaturedProjectsClientProps {
  title?: string | null
  richText?: FeaturedProjectsBlock['richText']
  projects: Project[] // Expect projects to be passed in
}

// Helper function to map status to badge variant
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

// Helper function to map status value to display text
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

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// This is the Client Component
export const FeaturedProjectsClient: React.FC<FeaturedProjectsClientProps> = ({
  title,
  richText,
  projects,
}) => {
  const hasProjects = projects && projects.length > 0

  return (
    <div className="py-8 md:py-16">
      <div className="container mx-auto">
        <div className="mb-8 md:mb-12 text-left">
          {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
          {richText && <RichText data={richText} enableGutter={false} />}
        </div>

        {hasProjects ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project: Project) => {
              // Ensure external link URL has a protocol for this card
              let externalUrl = project.projectLink?.url
              if (
                externalUrl &&
                !externalUrl.startsWith('http://') &&
                !externalUrl.startsWith('https://')
              ) {
                externalUrl = `https://${externalUrl}`
              }

              return (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-300"
                  whileHover={{ y: -5 }}
                >
                  {/* Link wrapping main visual content */}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex flex-col flex-grow focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
                  >
                    {/* Image container */}
                    {typeof project.mainImage === 'object' && project.mainImage !== null && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Media
                          resource={project.mainImage}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                      </div>
                    )}

                    {/* Content Area (inside Link) */}
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="text-xl font-semibold leading-tight">{project.name}</h3>
                        {project.status && (
                          <Badge
                            variant={getStatusVariant(project.status)}
                            className="shrink-0 text-xs"
                          >
                            {getStatusLabel(project.status)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3 flex-grow mb-4">
                        {project.summary}
                      </p>
                    </div>
                  </Link>
                  {/* End of Link wrapper */}

                  {/* Footer section (outside the main link) */}
                  <div className="p-4 pt-3 border-t border-border/50 flex justify-between items-center">
                    {/* Technology Tags */}
                    <div className="flex flex-wrap gap-1">
                      {project.technologies?.slice(0, 3).map((tech) => {
                        // Ensure tech is an object and has an id/name before rendering
                        if (typeof tech === 'object' && tech !== null && tech.id) {
                          const techDoc = tech as Technology
                          return (
                            <Badge
                              key={techDoc.id}
                              variant="secondary"
                              className="text-xs px-1.5 py-0.5"
                            >
                              {techDoc.name}
                            </Badge>
                          )
                        }
                        return null
                      })}
                    </div>

                    {/* External Link Icon */}
                    {externalUrl && (
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit project ${project.name} (opens in new tab)`}
                        className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ml-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLinkIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <p className="text-center text-muted-foreground">No featured projects found.</p>
        )}

        {/* "View All" Button */}
        <div className="mt-12 md:mt-16 text-center">
          <Link href="/projects" passHref legacyBehavior>
            <Button variant="default">View All Projects</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
