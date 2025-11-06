"use client"
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'
import { getMovieById, type OmdbMovieFull } from '@/lib/omdb'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AnimatePresence, Reorder } from 'framer-motion'
import { toast } from 'sonner'
import Image from 'next/image'

export default function WatchlistPage() {
  const watchlist = useAppStore((s) => s.watchlist)
  const reorderWatchlist = useAppStore((s) => s.reorderWatchlist)
  const removeFromWatchlist = useAppStore((s) => s.removeFromWatchlist)
  const clearWatchlist = useAppStore((s) => s.clearWatchlist)
  const [movies, setMovies] = useState<OmdbMovieFull[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false
    async function fetchWatchlist() {
      const details: OmdbMovieFull[] = []
      for (const id of watchlist) {
        if (cancelled) break
        const d = await getMovieById(id)
        details.push(d)
      }
      if (!cancelled) setMovies(details)
      if (!cancelled) setLoading(false)
    }
    fetchWatchlist()
    return () => { cancelled = true }
  }, [watchlist])

  function handleReorder(newOrder: OmdbMovieFull[]) {
    setMovies(newOrder)
    reorderWatchlist(newOrder.map((m) => m.imdbID))
  }

  if (loading) {
    return <div className="text-center py-10">Loading watchlist...</div>
  }

  if (movies.length === 0) {
    return <div className="text-center py-10 text-neutral-500">No movies in watchlist yet.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Watchlist</h1>
        <Button variant="destructive" onClick={() => { clearWatchlist(); toast.success('Cleared watchlist') }}>Clear</Button>
      </div>
      <Reorder.Group axis="y" values={movies} onReorder={handleReorder}>
        <AnimatePresence>
          {movies.map((m) => (
            <Reorder.Item key={m.imdbID} value={m}>
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-neutral-100">
                <Link href={`/movie/${m.imdbID}`} className="block">
                  {m.Poster && m.Poster !== 'N/A' ? (
                    <Image width={500} height={500} src={m.Poster} alt={m.Title} className="w-24 h-24 object-cover rounded-md" />
                  ) : (
                    <div className="w-24 h-24 bg-neutral-200 rounded-md" />
                  )}
                </Link>
                <div className="flex-1">
                  <div className="font-medium">{m.Title}</div>
                  <div className="text-sm text-neutral-500">IMDb {m.imdbRating || 'N/A'}</div>
                </div>
                <Button variant="ghost" onClick={() => { removeFromWatchlist(m.imdbID); toast.success('Removed from watchlist') }}>Remove</Button>
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  )
}
