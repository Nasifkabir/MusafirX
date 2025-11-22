import { FlightSearchForm } from "@/components/flight-search-form"
import { RecentSearches } from "@/components/recent-searches"
import { Plane, Shield, Clock, Award } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-secondary py-20 md:py-32 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
              Hey, Where are going today?
            </h2>
            <p className="text-lg md:text-xl text-white/95 text-pretty max-w-2xl mx-auto">
              Search and compare flights from multiple airlines. Book with confidence and travel with ease.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <FlightSearchForm variant="hero" />
          </div>
        </div>
      </section>

      {/* Recent Searches Section */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <RecentSearches />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose MusafirX?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide the best flight booking experience with competitive prices and excellent service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
              <div className="h-14 w-14 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">Secure Booking</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your data is protected with industry-standard encryption
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
              <div className="h-14 w-14 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">24/7 Support</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our team is always ready to assist you with your bookings
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
              <div className="h-14 w-14 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">Best Prices</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Compare prices from multiple airlines to find the best deals
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
              <div className="h-14 w-14 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plane className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">Easy Booking</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Simple and intuitive interface for hassle-free bookings
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Popular Destinations</h3>
            <p className="text-lg text-muted-foreground">Explore the most sought-after travel destinations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                city: "Dubai",
                country: "UAE",
                image: "/images/dubai.jpg",
              },
              {
                city: "Singapore",
                country: "Singapore",
                image: "/images/singapore.jpg",
              },
              {
                city: "Bangkok",
                country: "Thailand",
                image: "images/bangkok.jpg",
              },
            ].map((destination) => (
              <Card
                key={destination.city}
                className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h4 className="text-3xl font-bold mb-2">{destination.city}</h4>
                    <p className="text-lg">{destination.country}</p>
                  </div>
                </div>
              </Card> 
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
