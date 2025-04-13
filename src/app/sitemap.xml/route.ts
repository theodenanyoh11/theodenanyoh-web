import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Page, Post, Product, Project } from '@/payload-types'

// Define the base URL from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Set revalidation time (e.g., 1 hour)
// This means the sitemap will be regenerated at most once per hour,
// unless revalidation is triggered via webhook.
export const revalidate = 3600

// Helper function to generate XML sitemap string
function generateSitemapXml(
  entries: { url: string; lastModified?: string | Date | undefined }[],
): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

  entries.forEach((entry) => {
    xml += `  <url>\n`
    xml += `    <loc>${entry.url}</loc>\n`
    if (entry.lastModified) {
      const date = new Date(entry.lastModified).toISOString()
      xml += `    <lastmod>${date}</lastmod>\n`
    }
    // Add changefreq and priority if needed based on entry type
    xml += `  </url>\n`
  })

  xml += `</urlset>`
  return xml
}

export async function GET() {
  const payload = await getPayload({ config: configPromise })
  const entries: { url: string; lastModified?: string | Date }[] = []

  try {
    // --- Fetch Pages ---
    const pages = await payload.find({
      collection: 'pages',
      limit: 1000, // Adjust limit as needed
      depth: 0,
      where: {
        slug: { not_equals: 'home' }, // Exclude homepage if handled separately
        // Add excludeFromSitemap filter if you add that field:
        // excludeFromSitemap: { not_equals: true }
      },
    })
    pages.docs.forEach((page: Page) => {
      if (page.slug) {
        entries.push({
          url: `${BASE_URL}/${page.slug}`,
          lastModified: page.updatedAt,
        })
      }
    })
    // Add homepage explicitly
    entries.push({ url: BASE_URL, lastModified: new Date() }) // Or fetch homepage doc updatedAt

    // --- Fetch Posts ---
    const posts = await payload.find({
      collection: 'posts',
      limit: 1000, // Adjust limit
      depth: 0,
      where: {
        // excludeFromSitemap: { not_equals: true }
      },
    })
    posts.docs.forEach((post: Post) => {
      if (post.slug) {
        entries.push({
          url: `${BASE_URL}/posts/${post.slug}`,
          lastModified: post.updatedAt,
        })
      }
    })

    // --- Fetch Projects ---
    const projects = await payload.find({
      collection: 'projects',
      limit: 1000, // Adjust limit
      depth: 0,
      where: {
        // excludeFromSitemap: { not_equals: true }
      },
    })
    projects.docs.forEach((project: Project) => {
      if (project.slug) {
        entries.push({
          url: `${BASE_URL}/projects/${project.slug}`,
          lastModified: project.updatedAt,
        })
      }
    })

    // --- Fetch Products ---
    const products = await payload.find({
      collection: 'products',
      limit: 1000, // Adjust limit
      depth: 0,
      where: {
        // excludeFromSitemap: { not_equals: true }
      },
    })
    products.docs.forEach((product: Product) => {
      if (product.slug) {
        entries.push({
          url: `${BASE_URL}/products/${product.slug}`,
          lastModified: product.updatedAt,
        })
      }
    })

    // Generate the XML
    const sitemapXml = generateSitemapXml(entries)

    // Return the XML response
    return new Response(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
