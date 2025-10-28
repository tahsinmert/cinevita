"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'
import { getMovieById, type OmdbMovieFull } from '@/lib/omdb'

export default function WatchlistPage() {
  const ids = useAppStore((s) => s.watchlist)
  const remove = useAppStore((s) => s.removeFromWatchlist)
  const move = useAppStore((s) => s.moveInWatchlist)
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
        <h1 className="text-2xl font-semibold">Watchlist</h1>
      </div>
      {movies.length === 0 && <div className="text-neutral-500">No movies yet.</div>}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {movies.map((m, idx) => (
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
              <Button variant="secondary" disabled={idx === 0} onClick={() => move(idx, idx - 1)}>↑</Button>
              <Button variant="secondary" disabled={idx === ids.length - 1} onClick={() => move(idx, idx + 1)}>↓</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}


