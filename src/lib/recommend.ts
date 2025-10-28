import type { OmdbMovieFull } from './omdb'

export function recommendMovies(seed: OmdbMovieFull, candidates: OmdbMovieFull[], limit = 10) {
  const seedVec = toFeatureVector(seed)
  const scored = candidates
    .filter((m) => m.imdbID !== seed.imdbID)
    .map((m) => {
      const v = toFeatureVector(m)
      const cosine = cosineSimilarity(seedVec, v)
      const content = contentOverlapScore(seed, m)
      const rating = normalizeRating(m.imdbRating)
      const score = cosine * 0.6 + content * 0.3 + rating * 0.1
      return { movie: m, score }
    })
    .sort((a, b) => b.score - a.score)
  return mmr(scored, 0.7, limit).map((x) => x.movie)
}

export function buildUserProfile(watched: OmdbMovieFull[], ratings?: Record<string, number>) {
  if (watched.length === 0) return undefined
  const vectors = watched.map((m) => toFeatureVector(m))
  const avg: Record<string, number> = {}
  for (const v of vectors) for (const [k, val] of Object.entries(v)) avg[k] = (avg[k] || 0) + val
  for (const k of Object.keys(avg)) avg[k] /= vectors.length
  if (ratings) {
    for (const m of watched) {
      const r = ratings[m.imdbID]
      if (!r) continue
      const v = toFeatureVector(m)
      for (const [k, val] of Object.entries(v)) avg[k] = avg[k] + (val * (r - 3)) / 10
    }
  }
  return avg
}

export function recommendForUser(userProfile: Record<string, number>, candidates: OmdbMovieFull[], excludeIds: Set<string>, limit = 12) {
  const scored = candidates
    .filter((m) => !excludeIds.has(m.imdbID))
    .map((m) => {
      const v = toFeatureVector(m)
      const cos = cosineSimilarity(userProfile, v)
      const rating = normalizeRating(m.imdbRating)
      return { movie: m, score: cos * 0.85 + rating * 0.15 }
    })
    .sort((a, b) => b.score - a.score)
  return mmr(scored, 0.75, limit).map((x) => x.movie)
}

function toFeatureVector(m: OmdbMovieFull): Record<string, number> {
  const vec: Record<string, number> = {}
  for (const g of splitCSV(m.Genre)) vec[`genre:${g}`] = 1
  for (const d of splitCSV(m.Director)) vec[`dir:${d}`] = 1
  for (const a of splitCSV(m.Actors)) vec[`actor:${a}`] = 1
  for (const w of (m.Title || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)) vec[`w:${w}`] = (vec[`w:${w}`] || 0) + 0.2
  const year = Number(m.Year?.slice(0, 4) || '0')
  if (year) vec[`year:${Math.floor(year / 10) * 10}s`] = 1
  return vec
}

function cosineSimilarity(a: Record<string, number>, b: Record<string, number>) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  let dot = 0, na = 0, nb = 0
  for (const k of keys) {
    const va = a[k] || 0
    const vb = b[k] || 0
    dot += va * vb
    na += va * va
    nb += vb * vb
  }
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

function contentOverlapScore(a: OmdbMovieFull, b: OmdbMovieFull) {
  const g = jaccard(splitCSV(a.Genre), splitCSV(b.Genre))
  const d = jaccard(splitCSV(a.Director), splitCSV(b.Director))
  const ac = jaccard(splitCSV(a.Actors), splitCSV(b.Actors))
  return g * 0.5 + d * 0.3 + ac * 0.2
}

function jaccard(a: string[], b: string[]) {
  if (!a.length && !b.length) return 0
  const sa = new Set(a)
  const sb = new Set(b)
  const inter = [...sa].filter((x) => sb.has(x)).length
  const uni = new Set([...a, ...b]).size
  return inter / uni
}

function normalizeRating(r?: string) {
  const n = parseFloat(r || '0')
  if (Number.isNaN(n) || n <= 0) return 0
  return Math.min(1, n / 10)
}

function mmr(items: { movie: OmdbMovieFull; score: number }[], lambda: number, k: number) {
  const selected: { movie: OmdbMovieFull; score: number }[] = []
  const rest = [...items]
  while (selected.length < k && rest.length) {
    let bestIdx = 0
    let bestVal = -Infinity
    for (let i = 0; i < rest.length; i++) {
      const candidate = rest[i]
      const penalty = selected.length
        ? Math.max(...selected.map((s) => contentOverlapScore(s.movie, candidate.movie)))
        : 0
      const mmrScore = lambda * candidate.score - (1 - lambda) * penalty
      if (mmrScore > bestVal) { bestVal = mmrScore; bestIdx = i }
    }
    selected.push(rest.splice(bestIdx, 1)[0])
  }
  return selected
}

function splitCSV(value?: string) {
  if (!value) return [] as string[]
  return value.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
}


