import { MetadataRoute } from 'next'

// Dynamically generate robots.txt
export default function robots(): MetadataRoute.Robots {
  // Use the frontend public URL variable
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL

  if (!siteUrl) {
    console.warn(
      // Update warning message
      'NEXT_PUBLIC_SERVER_URL is not set. Sitemap URL will not be included in robots.txt.',
    )
    // Return basic rules if the frontend URL is missing
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/admin/',
        },
      ],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        // Allow crawling everything except the admin panel
        disallow: '/admin/',
      },
    ],
    // Point to the standard Next.js sitemap location
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
