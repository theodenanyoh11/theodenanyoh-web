'use client' // Add client directive for Framer Motion

import React from 'react'
import Link from 'next/link'
import { Project, Technology } from '@/payload-types'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkIcon } from 'lucide-react'
import { motion } from 'framer-motion'

// Reusable helper functions (Consider moving to a shared utils file)
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

interface ProjectCardProps {
  project: Project
}

// Framer motion variant for individual card entrance (can be simpler than featured)
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Ensure external link URL has a protocol
  let externalUrl = project.projectLink?.url
  if (externalUrl && !externalUrl.startsWith('http://') && !externalUrl.startsWith('https://')) {
    externalUrl = `https://${externalUrl}`
  }

  return (
    <motion.div
      variants={cardVariants} // Apply entrance animation
      // Removed initial/animate props if handled by parent grid
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-300"
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
              <Badge variant={getStatusVariant(project.status)} className="shrink-0 text-xs">
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
        <div className="flex flex-wrap gap-1 overflow-hidden mr-2">
          {' '}
          {/* Added overflow hidden & margin */}
          {project.technologies?.slice(0, 3).map((tech) => {
            if (typeof tech === 'object' && tech !== null && tech.id) {
              const techDoc = tech as Technology
              return (
                <Badge
                  key={techDoc.id}
                  variant="secondary"
                  className="text-xs px-1.5 py-0.5 whitespace-nowrap"
                >
                  {' '}
                  {/* Prevent wrapping */}
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
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ml-auto" /* Push icon right */
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </a>
        )}
      </div>
    </motion.div>
  )
}
