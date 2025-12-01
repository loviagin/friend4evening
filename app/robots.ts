import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/meets/', '/api/'],
    },
    sitemap: 'https://f4e.io/sitemap.xml',
  }
}