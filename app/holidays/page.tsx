"use client"

import { HolidayStore } from "@/lib/holiday-store"
import { PackageCard } from "@/components/holiday/package-card"
import { Button } from "@/components/ui/button"
import { Palmtree, Mountain, Landmark, Crown, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HolidaysPage() {
  const packages = HolidayStore.useState((s) => s.packages)
  const selectedCategory = HolidayStore.useState((s) => s.selectedCategory)

  const categories = [
    { id: "all", label: "All Packages", icon: Palmtree },
    { id: "beach", label: "Beach", icon: Palmtree },
    { id: "adventure", label: "Adventure", icon: Mountain },
    { id: "cultural", label: "Cultural", icon: Landmark },
    { id: "luxury", label: "Luxury", icon: Crown },
    { id: "family", label: "Family", icon: Users },
  ]

  const filteredPackages =
    selectedCategory === "all" ? packages : packages.filter((pkg) => pkg.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent via-accent/95 to-secondary py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
              Discover Amazing Holiday Packages
            </h1>
            <p className="text-lg md:text-xl text-white/95 text-pretty max-w-2xl mx-auto mb-8">
              Curated travel experiences for every type of traveler. From beaches to mountains, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-background border-b sticky top-16 z-40 backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={cn(
                    "whitespace-nowrap",
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-primary to-accent"
                      : "bg-transparent hover:bg-muted",
                  )}
                  onClick={() => {
                    HolidayStore.update((s) => {
                      s.selectedCategory = category.id
                    })
                  }}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.label}
                </Button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {selectedCategory === "all"
                ? "All Holiday Packages"
                : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Packages`}
            </h2>
            <p className="text-muted-foreground">
              Showing {filteredPackages.length} package{filteredPackages.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>

          {filteredPackages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">No packages found in this category</p>
              <Button
                variant="outline"
                onClick={() => {
                  HolidayStore.update((s) => {
                    s.selectedCategory = "all"
                  })
                }}
              >
                View All Packages
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
