import type { Airport } from "./store"

export interface RecentSearch {
  id: string
  origin: Airport
  destination: Airport
  departureDate: Date
  passengers: {
    adults: number
    children: number
    infants: number
  }
  timestamp: number
}

const STORAGE_KEY = "skybook_recent_searches"
const MAX_RECENT_SEARCHES = 5

export function saveRecentSearch(search: Omit<RecentSearch, "id" | "timestamp">): void {
  if (typeof window === "undefined") return

  const recentSearches = getRecentSearches()
  const newSearch: RecentSearch = {
    ...search,
    id: Date.now().toString(),
    timestamp: Date.now(),
  }

  // Remove duplicate searches (same origin and destination)
  const filtered = recentSearches.filter(
    (s) => !(s.origin.code === search.origin.code && s.destination.code === search.destination.code),
  )

  // Add new search at the beginning
  const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function getRecentSearches(): RecentSearch[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const searches = JSON.parse(stored) as RecentSearch[]
    // Convert date strings back to Date objects
    return searches.map((s) => ({
      ...s,
      departureDate: new Date(s.departureDate),
    }))
  } catch (error) {
    console.error("[v0] Error loading recent searches:", error)
    return []
  }
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
