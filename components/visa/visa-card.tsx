import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Calendar, Check } from "lucide-react"
import type { VisaService } from "@/lib/visa-store"

interface VisaCardProps {
  service: VisaService
}

export function VisaCard({ service }: VisaCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={`/ceholder-svg-height-250-width-400-.jpg?height=250&width=400&${service.image}`}
          alt={service.country}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {service.popular && (
          <Badge className="absolute top-4 left-4 bg-accent text-white border-0 shadow-lg">Popular</Badge>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {service.country}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{service.visaType}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Processing</p>
              <p className="text-sm font-semibold text-foreground">{service.processingTime}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Validity</p>
              <p className="text-sm font-semibold text-foreground">{service.validity}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold text-muted-foreground">REQUIREMENTS</p>
          </div>
          <div className="space-y-1">
            {service.requirements.slice(0, 3).map((req) => (
              <div key={req} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3 w-3 text-green-600" />
                <span>{req}</span>
              </div>
            ))}
            {service.requirements.length > 3 && (
              <p className="text-xs text-muted-foreground ml-5">+{service.requirements.length - 3} more</p>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Starting from</p>
            <span className="text-2xl font-bold text-primary">₹{service.price.toLocaleString()}</span>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent">Apply Now</Button>
        </div>
      </div>
    </Card>
  )
}
