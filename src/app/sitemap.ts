import type { MetadataRoute } from 'next'
import { searchMovies } from '@/lib/omdb'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://cinevita.netlify.app'
  const routes = [
    '',
    '/watchlist',
    '/watched',
  ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }))

  if (process.env.CI === 'true') {
    return routes
  }

  const movies = await searchMovies('movie', 1)
  const movieRoutes = movies.Search?.map((movie) => ({
    url: `${base}/movie/${movie.imdbID}`,
    lastModified: new Date(),
  })) || []

  return [...routes, ...movieRoutes]
}
