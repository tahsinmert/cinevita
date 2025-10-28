import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://cinevita.netlify.app'
  const routes = [
    '',
    '/watchlist',
    '/watched',
  ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }))

  return routes
}


