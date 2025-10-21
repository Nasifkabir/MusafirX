"use client"

import { VisaStore } from "@/lib/visa-store"
import { VisaCard } from "@/components/visa/visa-card"
import { Card } from "@/components/ui/card"
import { FileCheck, Clock, Shield, HeadphonesIcon } from "lucide-react"

export default function VisaPage() {
  const services = VisaStore.useState((s) => s.services)
  const popularServices = services.filter((s) => s.popular)
  const otherServices = services.filter((s) => !s.popular)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-secondary py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
              Hassle-Free Visa Services
            </h1>
            <p className="text-lg md:text-xl text-white/95 text-pretty max-w-2xl mx-auto mb-8">
              Get your visa processed quickly and efficiently. We handle all the paperwork for you.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Our Visa Services?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make visa processing simple and stress-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
              <div className="h-14 w-14 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileCheck className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Expert Assistance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional guidance throughout the process
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
              <div className="h-14 w-14 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Fast Processing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Quick turnaround time for all visas</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
              <div className="h-14 w-14 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Secure Process</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Your documents are safe with us</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
              <div className="h-14 w-14 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Always here to help you</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Visa Services */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Popular Visa Services</h2>
            <p className="text-muted-foreground">Most requested visa services by our customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {popularServices.map((service) => (
              <VisaCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Other Visa Services</h2>
            <p className="text-muted-foreground">Explore more destinations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherServices.map((service) => (
              <VisaCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
