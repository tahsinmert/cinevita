import axios from 'axios'

const OMDB_BASE = 'https://www.omdbapi.com/'

export type OmdbMovie = {
  Title: string
  Year: string
  imdbID: string
  Type: 'movie' | 'series' | 'episode' | string
  Poster: string
}

export type OmdbMovieFull = OmdbMovie & {
  Rated?: string
  Released?: string
  Runtime?: string
  Genre?: string
  Director?: string
  Writer?: string
  Actors?: string
  Plot?: string
  Language?: string
  Country?: string
  Awards?: string
  Ratings?: { Source: string; Value: string }[]
  Metascore?: string
  imdbRating?: string
  imdbVotes?: string
  DVD?: string
  BoxOffice?: string
  Production?: string
  Website?: string
}

export async function searchMovies(query: string, page = 1) {
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY
  if (process.env.CI && !apiKey) {
    return { Search: [], totalResults: 0 }
  }
  const { data } = await axios.get(OMDB_BASE, { params: { s: query, page, apikey: apiKey } })
  if (data.Response === 'False') return { Search: [], totalResults: 0, Error: data.Error }
  return data as { Search: OmdbMovie[]; totalResults: number; Error?: string }
}

export async function getMovieById(imdbID: string) {
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY
  const { data } = await axios.get(OMDB_BASE, { params: { i: imdbID, plot: 'full', apikey: apiKey } })
  return data as OmdbMovieFull
}
