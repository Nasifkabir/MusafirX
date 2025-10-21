import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Waves, Utensils } from "lucide-react"
import type { Hotel } from "@/lib/hotel-store"
import Link from "next/link"

interface HotelCardProps {
  hotel: Hotel
}

export function HotelCard({ hotel }: HotelCardProps) {
  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes("wifi")) return <Wifi className="h-3 w-3" />
    if (amenity.toLowerCase().includes("pool")) return <Waves className="h-3 w-3" />
    if (amenity.toLowerCase().includes("restaurant")) return <Utensils className="h-3 w-3" />
    return null
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all group">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Image */}
        <div className="relative h-64 md:h-auto overflow-hidden">
          <img
            src={`/ceholder-svg-height-300-width-400-.jpg?height=300&width=400&${hotel.image}`}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {hotel.featured && <Badge className="absolute top-4 left-4 bg-accent text-white border-0">Featured</Badge>}
        </div>

        {/* Details */}
        <div className="md:col-span-2 p-6 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {hotel.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {hotel.location}, {hotel.city}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-lg">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-bold text-foreground">{hotel.rating}</span>
                <span className="text-xs text-muted-foreground">({hotel.reviews})</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{hotel.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {hotel.amenities.slice(0, 4).map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs bg-muted/50">
                  {getAmenityIcon(amenity)}
                  <span className="ml-1">{amenity}</span>
                </Badge>
              ))}
              {hotel.amenities.length > 4 && (
                <Badge variant="outline" className="text-xs bg-muted/50">
                  +{hotel.amenities.length - 4} more
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-2">{hotel.roomType}</p>
          </div>

          <div className="flex items-end justify-between pt-4 border-t">
            <div>
              {hotel.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">₹{hotel.originalPrice.toLocaleString()}</p>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">₹{hotel.price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">per night</span>
              </div>
            </div>
            <Link href={`/hotels/${hotel.id}`}>
              <Button className="bg-gradient-to-r from-primary to-accent">View Details</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
