import Link from "next/link"
import { Plane, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground mb-4">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span>MusafirX</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Your trusted travel partner for flights, hotels, holidays, and visa services.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="#"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Flights
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/holidays" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Holidays
                </Link>
              </li>
              <li>
                <Link href="/visa" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Visa Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: support@MusafirX.com</li>
              <li>Phone: +8801901402XXX</li>
              <li>Address: Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MusafirX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
