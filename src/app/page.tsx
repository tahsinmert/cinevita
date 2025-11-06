import { searchMovies, type OmdbMovie } from '@/lib/omdb'
import MovieList from '@/components/movies/MovieList'
import { Suspense } from 'react'

export default async function Home({ searchParams }: { searchParams: { [key:string]: string | string[] | undefined } }) {
  const q = typeof searchParams.q === 'string' ? searchParams.q : 'movie'
  const movies = await searchMovies(q, 1)

  return (
    <Suspense fallback={null}>
      <MovieList initialMovies={movies.Search || []} />
    </Suspense>
  )
}
