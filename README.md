# CineVita — AI‑powered Movie Discovery (Next.js + TypeScript + Tailwind + shadcn/ui)

A minimal, magazine‑inspired cinema experience with advanced recommendations, buttery‑smooth animations, and a delightfully rounded visual language.

## ✨ Highlights
- Ultra‑clean, rounded UI with glassy cards and circular artwork
- Advanced content‑based recommendations (cosine similarity, Jaccard, MMR)
- Watchlist + Watched with persistent local state
- Movie Detail with radial info layout and premium micro‑interactions
- Infinite search with React Query, OMDb API integration
- shadcn/ui for consistent components; Framer Motion for elegant motion
- Global transitions, animated navbar (oval on scroll), add‑to‑top orbital FAB
- Production‑grade SEO (OpenGraph, Twitter, JSON‑LD, robots, sitemap)

## 🧱 Tech Stack
- Framework: Next.js 16 (App Router, Turbopack)
- Language: TypeScript
- Styling: Tailwind CSS, custom globals
- UI Kit: shadcn/ui
- Animations: Framer Motion
- Data: @tanstack/react‑query + Axios
- State: Zustand
- API: OMDb (`https://www.omdbapi.com`)

## 🚀 Quick Start
```bash
# 1) Install
npm i

# 2) Dev
npm run dev

# 3) Build & Start
npm run build && npm run start
```

## 🔐 Environment
Create `.env.local` and set:
```env
NEXT_PUBLIC_OMDB_API_KEY=YOUR_KEY
NEXT_PUBLIC_SITE_URL=https://cinevita.netlify.app
```

## 🗂️ Project Structure (key paths)
```
src/app/
  layout.tsx            # Global layout, SEO, JSON‑LD, <Header/>, Suspense
  page.tsx              # Home: search, grid, infinite scroll, recos
  movie/[imdbID]/page.tsx# Movie detail: actions, loaders, chic UI
  watchlist/page.tsx    # Watchlist
  watched/page.tsx      # Watched history
  robots.ts             # robots.txt
  sitemap.ts            # sitemap.xml
components/
  Header.tsx            # Animated, transparent navbar (oval on scroll)
  ScrollToTop.tsx       # Orbital floating action button (to top)
  Spinner.tsx           # Chic global spinner
lib/
  omdb.ts               # Axios client, typed helpers
  recommend.ts          # Similarity + MMR engine
store/
  useAppStore.ts        # Zustand state (watchlist, liked/disliked, etc.)
public/
  favicon.png           # Favicon / Apple touch icon
  bg.png                # Site background image
```

## 🔎 Search & Data Fetching
- Debounced search via header input; infinite pagination with React Query
- Network and cache boundaries tuned (staleTime/gcTime)
- 401 handling for wrong OMDb keys with friendly UI message

## 🧠 Recommendations (Overview)
- Profile signals: genres, directors, actors, ratings, watch history
- Similarity: cosine on vectorized tags + Jaccard on sets
- MMR reranking to balance relevance and novelty
- Exclusion set to avoid seen items

## 🎬 Interactions & Motion
- Movie cards: circular artwork, micro‑scale pulses, hover title slide
- Add to Watchlist: animated pulse + toast
- Movie Detail: radial badges, particle bursts, ripple/confetti
- Mark Watched: permanent state, non‑reverting stylization
- Navbar: transparent; becomes oval with spacing/scale on scroll
- Right‑dock actions (scrolled): vertical, corkscrew entrance trail
- ScrollToTop: orbital aura + comet trail with hover spark

## 🧭 SEO
- OpenGraph, Twitter Card, canonical, robots rules
- metadataBase bound to `NEXT_PUBLIC_SITE_URL` (fallback: `https://cinevita.netlify.app`)
- JSON‑LD: Organization + WebSite (SearchAction)
- `robots.ts` and `sitemap.ts` auto‑generated

## 🧪 Quality
- Type‑safe by default; client hooks wrapped in Suspense
- Lint safe (checked via project tools)

## 📦 Scripts
```jsonc
npm run dev     // start dev server
npm run build   // production build
npm run start   // start production server
```

## ☁️ Deployment (Netlify)
- Set environment variables in Netlify dashboard:
  - `NEXT_PUBLIC_OMDB_API_KEY`
  - `NEXT_PUBLIC_SITE_URL=https://cinevita.netlify.app`
- Build command: `npm run build`
- Publish directory: `.next`

## 🔧 Troubleshooting
- Favicon not showing: clear site data and hard refresh; `<head>` includes explicit `icon`, `apple-touch-icon`, and `manifest`.
- OMDb 401: ensure `NEXT_PUBLIC_OMDB_API_KEY` is valid and redeploy.
- Missing Suspense warning: ensure client components using `useSearchParams` are wrapped (handled in `layout.tsx`).

## 🗺️ Roadmap Ideas
- Server‑side history/profile with auth
- Multi‑provider data blend (TMDB)
- Offline cache and PWA install banner
- A/B animation profiles, reduced‑motion support refinements

---
Built with care for cinema lovers. If you ship this publicly, consider replacing `favicon.png` with a bespoke OG image and legal text for OMDb usage.
