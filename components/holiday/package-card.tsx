import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, Check } from "lucide-react"
import type { HolidayPackage } from "@/lib/holiday-store"

interface PackageCardProps {
  package: HolidayPackage
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={`/ceholder-svg-height-300-width-400-.jpg?height=300&width=400&${pkg.image}`}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {pkg.featured && (
          <Badge className="absolute top-4 left-4 bg-accent text-white border-0 shadow-lg">Featured</Badge>
        )}
        {pkg.originalPrice && (
          <Badge className="absolute top-4 right-4 bg-green-600 text-white border-0 shadow-lg">
            Save {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}%
          </Badge>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {pkg.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span>{pkg.destination}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{pkg.duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-lg">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-bold text-foreground">{pkg.rating}</span>
            <span className="text-xs text-muted-foreground">({pkg.reviews})</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">HIGHLIGHTS</p>
          <div className="flex flex-wrap gap-2">
            {pkg.highlights.slice(0, 3).map((highlight) => (
              <Badge key={highlight} variant="outline" className="text-xs bg-muted/50">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">INCLUSIONS</p>
          <div className="space-y-1">
            {pkg.inclusions.slice(0, 3).map((inclusion) => (
              <div key={inclusion} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3 w-3 text-green-600" />
                <span>{inclusion}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between pt-4 border-t">
          <div>
            {pkg.originalPrice && (
              <p className="text-sm text-muted-foreground line-through">₹{pkg.originalPrice.toLocaleString()}</p>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">₹{pkg.price.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">per person</span>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent">View Details</Button>
        </div>
      </div>
    </Card>
  )
}
