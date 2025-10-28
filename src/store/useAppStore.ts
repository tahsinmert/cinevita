import { create } from 'zustand'

type AppState = {
  watchlist: string[]
  addToWatchlist: (id: string) => void
  removeFromWatchlist: (id: string) => void
  moveInWatchlist: (fromIndex: number, toIndex: number) => void
  ratings: Record<string, number>
  rateMovie: (id: string, rating: number) => void
  liked: Set<string>
  disliked: Set<string>
  likeMovie: (id: string) => void
  dislikeMovie: (id: string) => void
  watchedHistory: string[]
  markWatched: (id: string) => void
  removeFromWatched: (id: string) => void
  clearWatched: () => void
  searchHistory: string[]
  addSearchTerm: (term: string) => void
}

const STORAGE_KEY = 'cineverse_next_state_v1'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw)
    return {
      watchlist: Array.isArray(data.watchlist) ? data.watchlist : [],
      ratings: typeof data.ratings === 'object' && data.ratings ? data.ratings : {},
      watchedHistory: Array.isArray(data.watchedHistory) ? data.watchedHistory : [],
      searchHistory: Array.isArray(data.searchHistory) ? data.searchHistory : [],
      liked: new Set<string>(Array.isArray(data.liked) ? data.liked : []),
      disliked: new Set<string>(Array.isArray(data.disliked) ? data.disliked : []),
    }
  } catch {
    return {}
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  watchlist: [],
  ratings: {},
  liked: new Set<string>(),
  disliked: new Set<string>(),
  watchedHistory: [],
  searchHistory: [],
  ...loadInitial(),
  addToWatchlist: (id) => {
    const next = Array.from(new Set([...get().watchlist, id]))
    set({ watchlist: next }); persist()
  },
  removeFromWatchlist: (id) => {
    set({ watchlist: get().watchlist.filter((x) => x !== id) }); persist()
  },
  moveInWatchlist: (from, to) => {
    const list = [...get().watchlist]
    if (from < 0 || to < 0 || from >= list.length || to >= list.length) return
    const [item] = list.splice(from, 1)
    list.splice(to, 0, item)
    set({ watchlist: list }); persist()
  },
  rateMovie: (id, rating) => {
    const ratings = { ...get().ratings, [id]: Math.max(1, Math.min(5, Math.round(rating))) }
    set({ ratings }); persist()
  },
  likeMovie: (id) => {
    const liked = new Set(get().liked); const disliked = new Set(get().disliked)
    liked.add(id); disliked.delete(id); set({ liked, disliked }); persist()
  },
  dislikeMovie: (id) => {
    const liked = new Set(get().liked); const disliked = new Set(get().disliked)
    disliked.add(id); liked.delete(id); set({ liked, disliked }); persist()
  },
  markWatched: (id) => {
    const history = [...get().watchedHistory]
    if (!history.includes(id)) history.unshift(id)
    set({ watchedHistory: history.slice(0, 200) }); persist()
  },
  removeFromWatched: (id) => {
    set({ watchedHistory: get().watchedHistory.filter((x) => x !== id) }); persist()
  },
  clearWatched: () => {
    set({ watchedHistory: [] }); persist()
  },
  addSearchTerm: (term) => {
    const t = term.trim(); if (!t) return
    const list = [t, ...get().searchHistory.filter((x) => x.toLowerCase() !== t.toLowerCase())]
    set({ searchHistory: list.slice(0, 10) }); persist()
  },
}))

function persist() {
  try {
    const s = useAppStore.getState()
    const toSave = {
      watchlist: s.watchlist,
      ratings: s.ratings,
      watchedHistory: s.watchedHistory,
      searchHistory: s.searchHistory,
      liked: Array.from(s.liked),
      disliked: Array.from(s.disliked),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {}
}


