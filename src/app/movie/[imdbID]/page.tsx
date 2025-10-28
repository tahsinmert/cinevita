"use client"
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

import { getMovieById, type OmdbMovieFull } from '@/lib/omdb'
import { recommendMovies } from '@/lib/recommend'
import { useAppStore } from '@/store/useAppStore'
import Spinner from '@/components/Spinner'

export default function MovieDetailPage() {
  const params = useParams<{ imdbID: string }>()
  const imdbID = params?.imdbID || ''

  const add = useAppStore((s) => s.addToWatchlist)
  const rate = useAppStore((s) => s.rateMovie)
  const like = useAppStore((s) => s.likeMovie)
  const dislike = useAppStore((s) => s.dislikeMovie)
  const likedSet = useAppStore((s) => s.liked)
  const dislikedSet = useAppStore((s) => s.disliked)
  const markWatched = useAppStore((s) => s.markWatched)
  const watchedHistory = useAppStore((s) => s.watchedHistory)
  const storeRatings = useAppStore((s) => s.ratings)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movie', imdbID],
    queryFn: () => getMovieById(imdbID),
    enabled: Boolean(imdbID),
  })

  const [related, setRelated] = useState<OmdbMovieFull[]>([])
  const [relatedLoading, setRelatedLoading] = useState<boolean>(false)
  const [lastRated, setLastRated] = useState<number | null>(null)
  const [likeBurst, setLikeBurst] = useState<number>(0)
  const [dislikeBurst, setDislikeBurst] = useState<number>(0)
  const [watchedFx, setWatchedFx] = useState<number>(0)
  const [watchedActive, setWatchedActive] = useState<boolean>(false)
  const isWatched = watchedActive || watchedHistory.includes(imdbID)

  useEffect(() => {
    let cancelled = false
    async function fetchRelated() {
      if (!data) return
      setRelatedLoading(true)
      const genre = (data.Genre || '').split(',')[0]?.trim() || 'movie'
      const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(genre)}&page=1&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`)
      const j = await res.json()
      const details: OmdbMovieFull[] = []
      if (Array.isArray(j.Search)) {
        for (const item of j.Search.slice(0, 12)) {
          const d = await getMovieById(item.imdbID)
          details.push(d)
        }
      }
      if (!cancelled) setRelated(recommendMovies(data, details, 12))
      if (!cancelled) setRelatedLoading(false)
    }
    fetchRelated()
    return () => { cancelled = true }
  }, [data])

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center gap-4">
        <Spinner />
        <div className="text-sm text-neutral-600">Loading movie...</div>
      </div>
    )
  }

  if (isError || !data) {
    return <div className="py-10 text-center text-red-500">Failed to load movie.</div>
  }

  const info = [
    { label: 'Year', value: data.Year },
    { label: 'Genre', value: data.Genre },
    { label: 'Director', value: data.Director },
    { label: 'Actors', value: data.Actors },
    { label: 'IMDb', value: data.imdbRating },
    { label: 'Runtime', value: data.Runtime },
  ].filter((x) => x.value && x.value !== 'N/A')

  return (
    <div className="space-y-10">
      {/* Circular hero */}
      <section className="flex flex-col items-center gap-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="relative">
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-white/10" />
          {data.Poster && data.Poster !== 'N/A' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.Poster} alt={data.Title} className="h-64 w-64 rounded-full object-cover border border-neutral-200/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)]" />
          ) : (
            <div className="h-64 w-64 rounded-full bg-neutral-200 border border-neutral-200/60" />
          )}
          <div className="absolute -bottom-3 -right-3">
            <Button className="h-10 w-10 rounded-full" onClick={() => { add(data.imdbID); toast.success('Added to Watchlist', { description: data.Title }) }}>+</Button>
          </div>
        </motion.div>

        <div className="text-center space-y-3 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight">{data.Title}</h1>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {info.map((x) => (
              <span key={x.label} className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 bg-white/60 backdrop-blur text-neutral-700">
                <span className="font-medium mr-1">{x.label}:</span> {x.value}
              </span>
            ))}
          </div>
          {data.Plot && (
            <p className="leading-relaxed text-neutral-800/90">
              {data.Plot}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <div className="relative">
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Button
                className={`rounded-full ${isWatched ? 'bg-emerald-600 text-white border-emerald-600' : ''}`}
                variant="secondary"
                onClick={() => {
                  markWatched(data.imdbID);
                  toast.success('Marked as watched');
                  setWatchedFx((n) => n + 1);
                  setWatchedActive(true);
                }}
              >
                {isWatched ? 'Watched ✓' : 'Mark Watched'}
              </Button>
            </motion.div>
            {/* Expanding ripple rings */}
            <AnimatePresence>
              {[...Array(3)].map((_, i) => (
                <motion.span
                  key={`ring-${watchedFx}-${i}`}
                  initial={{ opacity: 0.35, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.9 + i * 0.25 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 + i * 0.15, ease: 'easeOut' }}
                  className="pointer-events-none absolute -inset-2 rounded-full border-2 border-emerald-400/60"
                />
              ))}
            </AnimatePresence>
            {/* Confetti dots burst */}
            <AnimatePresence>
              {[...Array(10)].map((_, i) => (
                <motion.span
                  key={`watched-dot-${watchedFx}-${i}`}
                  initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
                  animate={{ opacity: 0.9, scale: 1, x: (Math.random()*80-40), y: (Math.random()*-60-15) }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -ml-1 rounded-full bg-emerald-500"
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="inline-flex items-center gap-1 relative">
            <span className="text-sm mr-1">Rate:</span>
            <div className="relative flex gap-1">
              <AnimatePresence>
                {typeof (storeRatings[imdbID] ?? lastRated) === 'number' && (
                  <motion.span
                    key={`glow-${storeRatings[imdbID] ?? lastRated}`}
                    layoutId="rating-glow"
                    className="absolute inset-0 -z-10 rounded-full"
                    style={{ filter: 'blur(8px)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.25 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
              {[1,2,3,4,5].map((r) => (
                <motion.div key={r} whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    variant="outline"
                    className={((storeRatings[imdbID] ?? lastRated) === r) ? 'border-emerald-500' : ''}
                    onClick={() => {
                      rate(data.imdbID, r); setLastRated(r); toast.success(`Rated ${r}/5`)
                    }}
                  >{r}</Button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}>
              <Button
                variant="outline"
                className={likedSet.has(imdbID) ? 'bg-emerald-600 text-white border-emerald-600' : ''}
                onClick={() => {
                  if (!likedSet.has(imdbID)) {
                    like(data.imdbID); setLikeBurst((n) => n + 1); toast.success('You liked this')
                  }
                }}
              >
                {likedSet.has(imdbID) ? 'Liked ✓' : 'Like'}
              </Button>
            </motion.div>
            <AnimatePresence>
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={`like-${likeBurst}-${i}`}
                  initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
                  animate={{ opacity: 0.9, scale: 1, x: (Math.random()*40-20), y: (Math.random()*-40-10) }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -ml-1 rounded-full bg-emerald-500"
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="relative">
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}>
              <Button
                variant="destructive"
                className={dislikedSet.has(imdbID) ? 'bg-red-600 text-white border-red-600' : ''}
                onClick={() => {
                  if (!dislikedSet.has(imdbID)) {
                    dislike(data.imdbID); setDislikeBurst((n) => n + 1); toast.message('Disliked')
                  }
                }}
              >
                {dislikedSet.has(imdbID) ? 'Disliked ✕' : 'Dislike'}
              </Button>
            </motion.div>
            <AnimatePresence>
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={`dislike-${dislikeBurst}-${i}`}
                  initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
                  animate={{ opacity: 0.9, scale: 1, x: (Math.random()*40-20), y: (Math.random()*-40-10) }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -ml-1 rounded-full bg-red-500"
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Circular recommendations */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-center">Because you liked this</h2>
        {relatedLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-neutral-700">
              <Spinner />
              <span className="text-sm">Finding similar films…</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 place-items-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 w-32 rounded-full overflow-hidden">
                  <Skeleton className="h-full w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 place-items-center">
          {related.map((m) => (
            <Link href={`/movie/${m.imdbID}`} key={m.imdbID} className="block group">
              <div className="relative h-40 w-40 rounded-full overflow-hidden border border-neutral-200/60 bg-white/40 backdrop-blur">
                {m.Poster && m.Poster !== 'N/A' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <motion.img src={m.Poster} alt={m.Title} className="h-full w-full object-cover" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }} />
                ) : (
                  <div className="h-full w-full bg-neutral-200" />
                )}
              </div>
              <div className="mt-2 text-center text-xs">
                <div className="font-medium truncate max-w-[10rem]">{m.Title}</div>
                <div className="text-neutral-500">IMDb {m.imdbRating || 'N/A'}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}


