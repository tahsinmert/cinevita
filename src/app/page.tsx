"use client"
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { searchMovies, getMovieById, type OmdbMovieFull } from '@/lib/omdb'
import { buildUserProfile, recommendForUser } from '@/lib/recommend'
import { useAppStore } from '@/store/useAppStore'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'

export default function Home() {
  const params = useSearchParams()
  const q = params.get('q') || 'movie'
  const addSearchTerm = useAppStore((s) => s.addSearchTerm)
  const watchedHistory = useAppStore((s) => s.watchedHistory)
  const ratings = useAppStore((s) => s.ratings)
  const addToWatchlist = useAppStore((s) => s.addToWatchlist)

  const query = useInfiniteQuery({
    queryKey: ['search', q],
    queryFn: async ({ pageParam = 1 }) => searchMovies(q, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last, all) => {
      const total = Number(last.totalResults || 0)
      const loaded = all.length * 10
      return loaded < total ? all.length + 1 : undefined
    },
    staleTime: 60000,
    gcTime: 300000,
  })

  const items = useMemo(() => (query.data?.pages.flatMap((p) => p.Search) ?? []), [query.data])
  const apiError = (query.data?.pages[0] as any)?.Error as string | undefined
  const [personalized, setPersonalized] = useState<OmdbMovieFull[]>([])
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set())

  useEffect(() => {
    function onScroll() {
      if (query.isFetchingNextPage || !query.hasNextPage) return
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 600
      if (nearBottom) query.fetchNextPage()
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [query])

  useEffect(() => { if (q) addSearchTerm(q) }, [q])

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        if (watchedHistory.length === 0) return
        const recentIds = watchedHistory.slice(0, 5)
        const recentDetails: OmdbMovieFull[] = []
        for (const id of recentIds) recentDetails.push(await getMovieById(id))
        const profile = buildUserProfile(recentDetails, ratings)
        if (!profile) return
        const pool: OmdbMovieFull[] = []
        for (const s of items.slice(0, 20)) pool.push(await getMovieById(s.imdbID))
        const exclude = new Set<string>([...watchedHistory])
        const recs = recommendForUser(profile, pool, exclude, 12)
        if (!cancelled) setPersonalized(recs)
      } catch {}
    }
    run()
    return () => { cancelled = true }
  }, [watchedHistory, ratings, items])

  const noResults = !query.isLoading && items.length === 0

  return (
    <div className="space-y-10">
      {apiError && (
        <div className="text-center text-red-500 py-10">{apiError === 'Invalid API key!' ? 'OMDb API anahtarınız geçersiz. .env dosyasında NEXT_PUBLIC_OMDB_API_KEY değerini kontrol edin.' : apiError}</div>
      )}
      {noResults && !apiError && (
        <div className="text-center text-neutral-500 py-10">No results. Try another search.</div>
      )}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 place-items-center touch-target">
        {items.map((m) => (
          <motion.div
            key={m.imdbID}
            className="relative flex flex-col items-center gap-3"
            initial="rest"
            animate="rest"
            whileHover="hover"
          >
            <Link href={`/movie/${m.imdbID}`} className="block">
              <div className="h-56 w-56 rounded-full overflow-hidden border border-neutral-200/60 bg-white/40 backdrop-blur">
                {m.Poster && m.Poster !== 'N/A' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <motion.img
                    src={m.Poster}
                    alt={m.Title}
                    className="h-full w-full object-cover"
                    initial={false}
                    animate={justAdded.has(m.imdbID) ? { scale: 1.03 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  />
                ) : (
                  <div className="h-full w-full bg-neutral-200" />
                )}
              </div>
            </Link>
            <div className="text-center">
              <motion.div
                className="text-sm font-medium leading-tight max-w-[14rem] truncate"
                variants={{ rest: { x: 0 }, hover: { x: -16 } }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                {m.Title}
              </motion.div>
              <div className="text-xs text-neutral-500">{m.Year}</div>
            </div>
            <div className="absolute bottom-3 right-3">
              <motion.div initial={false} animate={justAdded.has(m.imdbID) ? { scale: 1.05 } : { scale: 1 }}>
                <Button
                  className={`h-9 w-9 rounded-full p-0 ${justAdded.has(m.imdbID) ? 'bg-emerald-600 text-white border-emerald-600' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (justAdded.has(m.imdbID)) return
                    addToWatchlist(m.imdbID);
                    toast.success('Added to Watchlist', { description: m.Title });
                    setJustAdded((prev) => {
                      const next = new Set(prev); next.add(m.imdbID); return next
                    })
                    setTimeout(() => setJustAdded((prev) => { const next = new Set(prev); next.delete(m.imdbID); return next }), 1400)
                  }}
                >
                  {justAdded.has(m.imdbID) ? '✓' : '+'}
                </Button>
              </motion.div>
              <AnimatePresence>
                {justAdded.has(m.imdbID) && (
                  <motion.span
                    key="pulse"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.35, scale: 1.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute inset-0 -z-10 rounded-full bg-emerald-400"
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </section>

      {personalized.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Because you watched</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {personalized.map((m) => (
              <Link href={`/movie/${m.imdbID}`} key={m.imdbID} className="block">
                {m.Poster && m.Poster !== 'N/A' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.Poster} alt={m.Title} className="w-full h-56 object-cover" />
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
        </section>
      )}
    </div>
  )
}
