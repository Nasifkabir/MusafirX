import { HotelSearchForm } from "@/components/hotel/hotel-search-form"
import { Building2, Award, Shield, HeadphonesIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function HotelsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-secondary/95 to-primary py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
              Find Your Perfect Stay
            </h2>
            <p className="text-lg md:text-xl text-white/95 text-pretty max-w-2xl mx-auto">
              Discover amazing hotels, resorts, and accommodations at the best prices
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <HotelSearchForm />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Book Hotels With Us?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer the best hotel booking experience with verified properties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
              <div className="h-14 w-14 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">Verified Hotels</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All properties are verified and quality checked
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
              <div className="h-14 w-14 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">Best Price</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get the best deals and exclusive discounts
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
              <div className="h-14 w-14 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">Secure Booking</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">Your booking is safe and secure with us</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
              <div className="h-14 w-14 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">24/7 Support</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">Round the clock customer assistance</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Popular Hotel Destinations</h3>
            <p className="text-lg text-muted-foreground">Explore top cities for your next stay</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {["Goa", "Dubai", "Maldives", "Bali", "Paris", "London", "New York", "Tokyo"].map((city) => (
              <Card
                key={city}
                className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
              >
                <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{city}</h4>
                <p className="text-sm text-muted-foreground mt-1">View Hotels</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
