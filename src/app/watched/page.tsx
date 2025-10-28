"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'
import { getMovieById, type OmdbMovieFull } from '@/lib/omdb'

export default function WatchedPage() {
  const ids = useAppStore((s) => s.watchedHistory)
  const remove = useAppStore((s) => s.removeFromWatched)
  const clearAll = useAppStore((s) => s.clearWatched)
  const [movies, setMovies] = useState<OmdbMovieFull[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const details: OmdbMovieFull[] = []
      for (const id of ids) details.push(await getMovieById(id))
      if (!cancelled) setMovies(details)
    }
    load()
    return () => { cancelled = true }
  }, [ids])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Watched</h1>
        {ids.length > 0 && (
          <Button variant="destructive" onClick={clearAll}>Clear all</Button>
        )}
      </div>
      {movies.length === 0 && <div className="text-neutral-500">You haven't marked anything as watched yet.</div>}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {movies.map((m) => (
          <Card key={m.imdbID} className="overflow-hidden">
            <Link href={`/movie/${m.imdbID}`} className="block">
              {m.Poster && m.Poster !== 'N/A' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.Poster} alt={m.Title} className="w-full h-56 object-cover" />
              ) : (
                <div className="w-full h-56 bg-neutral-200" />
              )}
              <div className="p-4">
                <div className="font-medium">{m.Title}</div>
                <div className="text-sm text-neutral-500">{m.Year}</div>
              </div>
            </Link>
            <div className="p-4 pt-0 flex gap-2">
              <Button variant="secondary" onClick={() => remove(m.imdbID)}>Remove</Button>
              <Button onClick={() => useAppStore.getState().addToWatchlist(m.imdbID)}>+ Watchlist</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}


