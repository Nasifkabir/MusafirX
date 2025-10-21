"use client"

import { HotelStore } from "@/lib/hotel-store"
import { HotelCard } from "@/components/hotel/hotel-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal } from "lucide-react"
import { useState } from "react"

export default function HotelSearchPage() {
  const hotels = HotelStore.useState((s) => s.hotels)
  const searchData = HotelStore.useState((s) => s.searchData)
  const [priceRange, setPriceRange] = useState([0, 15000])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const filteredHotels = hotels.filter((hotel) => {
    const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
    const matchesAmenities =
      selectedAmenities.length === 0 || selectedAmenities.some((amenity) => hotel.amenities.includes(amenity))
    return matchesPrice && matchesAmenities
  })

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-secondary to-primary py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Hotels in {searchData.destination || "All Cities"}
          </h1>
          <p className="text-white/90 text-sm">
            {searchData.checkIn && searchData.checkOut
              ? `${searchData.checkIn.toLocaleDateString()} - ${searchData.checkOut.toLocaleDateString()}`
              : "Select your dates"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Filters</h3>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="mb-4 block">Price Range (per night)</Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={15000}
                  step={500}
                  className="mb-4"
                  minStepsBetweenThumbs={1}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <Label className="mb-4 block">Amenities</Label>
                <div className="space-y-3">
                  {["Free WiFi", "Pool", "Spa", "Restaurant", "Gym", "Parking"].map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <Label htmlFor={amenity} className="text-sm cursor-pointer">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setPriceRange([0, 15000])
                  setSelectedAmenities([])
                }}
              >
                Clear Filters
              </Button>
            </Card>
          </div>

          {/* Hotel Listings */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredHotels.length}</span> hotels
              </p>
            </div>

            <div className="space-y-6">
              {filteredHotels.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-lg text-muted-foreground">No hotels found matching your criteria</p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent"
                    onClick={() => {
                      setPriceRange([0, 15000])
                      setSelectedAmenities([])
                    }}
                  >
                    Clear Filters
                  </Button>
                </Card>
              ) : (
                filteredHotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
