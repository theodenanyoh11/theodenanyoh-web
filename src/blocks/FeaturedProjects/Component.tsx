import React from 'react'
import { Page, Project } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import RichText from '@/components/RichText'

// Import the client component
import { FeaturedProjectsClient } from './Component.client'

// Define the props based on the block's fields from Payload config
export type FeaturedProjectsBlockProps = Extract<
  Page['layout'][0],
  { blockType: 'featuredProjects' }
>

// This is the Server Component
// Adjust props to expect a single 'block' prop
export const FeaturedProjectsBlock: React.FC<{ block: FeaturedProjectsBlockProps }> = async ({
  block,
}) => {
  const { title, richText } = block // Destructure title and richText from the block prop

  let projects: Project[] = []

  try {
    const payload = await getPayload({ config: configPromise })
    const fetchedProjects = await payload.find({
      collection: 'projects',
      depth: 2, // Increase depth to populate technologies
      where: {
        featured: {
          equals: true,
        },
        // Add status filter back if/when versioning is re-enabled
        // _status: {
        //   equals: 'published',
        // },
      },
      sort: '-startDate',
    })
    projects = fetchedProjects.docs
  } catch (err) {
    console.error('Error fetching featured projects in Server Component:', err)
    // Optionally return null or an error message component
    // return null;
  }

  // Render the Client Component, passing the fetched data and richText
  return <FeaturedProjectsClient title={title} richText={richText} projects={projects} />
}
