"use client"

import { useEffect, useState } from "react"
import { getRecentSearches, type RecentSearch } from "@/lib/recent-searches"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight, Users } from "lucide-react"
import { FlightStore } from "@/lib/store"
import { useRouter } from "next/navigation"

export function RecentSearches() {
  const [searches, setSearches] = useState<RecentSearch[]>([])
  const router = useRouter()

  useEffect(() => {
    setSearches(getRecentSearches())
  }, [])

  if (searches.length === 0) return null

  const handleSelectSearch = (search: RecentSearch) => {
    FlightStore.update((s) => {
      s.searchData.origin = search.origin
      s.searchData.destination = search.destination
      s.searchData.departureDate = search.departureDate
      s.searchData.passengers = search.passengers
    })
    router.push("/flight/search")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Recent Searches</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searches.map((search) => (
          <Card
            key={search.id}
            className="p-4 hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer"
            onClick={() => handleSelectSearch(search)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-foreground">{search.origin.code}</div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm font-medium text-foreground">{search.destination.code}</div>
              </div>
            </div>

            <div className="space-y-1 text-xs text-muted-foreground">
              <div>
                {search.origin.city} → {search.destination.city}
              </div>
              <div>{new Date(search.departureDate).toLocaleDateString()}</div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>
                  {search.passengers.adults + search.passengers.children + search.passengers.infants} passenger
                  {search.passengers.adults + search.passengers.children + search.passengers.infants > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              className="w-full mt-3 text-primary hover:text-primary hover:bg-primary/10"
            >
              Search Again
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
