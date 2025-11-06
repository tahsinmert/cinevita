import { Metadata } from 'next'
import { getMovieById } from '@/lib/omdb'
import MovieDetail from '@/components/movies/MovieDetail'

export async function generateMetadata({ params }: { params: { imdbID: string } }): Promise<Metadata> {
  const movie = await getMovieById(params.imdbID)
  return {
    title: movie.Title,
    description: movie.Plot,
    openGraph: {
      title: movie.Title,
      description: movie.Plot || '',
      images: [{ url: movie.Poster || '' }],
    },
  }
}

export default async function MovieDetailPage({ params }: { params: { imdbID: string } }) {
  const movie = await getMovieById(params.imdbID)
  return <MovieDetail movie={movie} />
}
