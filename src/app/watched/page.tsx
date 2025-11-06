"use client"
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'
import { getMovieById, type OmdbMovieFull } from '@/lib/omdb'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'

export default function WatchedPage() {
  const watched = useAppStore((s) => s.watchedHistory)
  const clearWatched = useAppStore((s) => s.clearWatchedHistory)
  const [movies, setMovies] = useState<OmdbMovieFull[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false
    async function fetchWatched() {
      const details: OmdbMovieFull[] = []
      for (const id of watched) {
        if (cancelled) break
        const d = await getMovieById(id)
        details.push(d)
      }
      if (!cancelled) setMovies(details)
      if (!cancelled) setLoading(false)
    }
    fetchWatched()
    return () => { cancelled = true }
  }, [watched])

  if (loading) {
    return <div className="text-center py-10">Loading watched movies...</div>
  }

  if (movies.length === 0) {
    return <div className="text-center py-10 text-neutral-500">No movies marked as watched yet.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Watched</h1>
        <Button variant="destructive" onClick={() => { clearWatched(); toast.success('Cleared watched history') }}>Clear</Button>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {movies.map((m) => (
          <Link href={`/movie/${m.imdbID}`} key={m.imdbID} className="block">
            {m.Poster && m.Poster !== 'N/A' ? (
              <Image width={500} height={500} src={m.Poster} alt={m.Title} className="w-full h-56 object-cover" />
            ) : (
              <div className="w-full h-56 bg-neutral-200" />
            )}
            <div className="p-2">
              <div className="font-medium">{m.Title}</div>
              <div className="text-sm text-neutral-500">IMDb {m.imdbRating || 'N/A'}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
