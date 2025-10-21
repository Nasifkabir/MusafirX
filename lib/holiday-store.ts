import { Store } from "pullstate"

export interface HolidayPackage {
  id: string
  title: string
  destination: string
  duration: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  highlights: string[]
  inclusions: string[]
  category: "beach" | "adventure" | "cultural" | "luxury" | "family"
  featured?: boolean
}

const mockPackages: HolidayPackage[] = [
  {
    id: "1",
    title: "Goa Beach Paradise",
    destination: "Goa, India",
    duration: "5 Days / 4 Nights",
    price: 25000,
    originalPrice: 32000,
    image: "query=goa beach sunset palm trees",
    rating: 4.7,
    reviews: 450,
    highlights: ["Beach Activities", "Water Sports", "Nightlife", "Local Cuisine"],
    inclusions: ["Hotel Stay", "Breakfast", "Airport Transfer", "Sightseeing"],
    category: "beach",
    featured: true,
  },
  {
    id: "2",
    title: "Himalayan Adventure Trek",
    destination: "Manali, Himachal Pradesh",
    duration: "7 Days / 6 Nights",
    price: 35000,
    image: "query=himalayan mountains trekking adventure",
    rating: 4.8,
    reviews: 320,
    highlights: ["Trekking", "Mountain Views", "Camping", "Adventure Sports"],
    inclusions: ["Accommodation", "All Meals", "Trek Guide", "Equipment"],
    category: "adventure",
    featured: true,
  },
  {
    id: "3",
    title: "Rajasthan Royal Heritage",
    destination: "Jaipur-Udaipur-Jodhpur",
    duration: "6 Days / 5 Nights",
    price: 42000,
    originalPrice: 55000,
    image: "query=rajasthan palace heritage architecture",
    rating: 4.9,
    reviews: 580,
    highlights: ["Palace Tours", "Cultural Shows", "Desert Safari", "Local Markets"],
    inclusions: ["Heritage Hotels", "All Meals", "Guide", "Transfers"],
    category: "cultural",
    featured: true,
  },
  {
    id: "4",
    title: "Kerala Backwaters Retreat",
    destination: "Kerala, India",
    duration: "4 Days / 3 Nights",
    price: 28000,
    image: "query=kerala backwaters houseboat",
    rating: 4.6,
    reviews: 390,
    highlights: ["Houseboat Stay", "Ayurvedic Spa", "Nature Walks", "Local Cuisine"],
    inclusions: ["Houseboat", "All Meals", "Spa Session", "Transfers"],
    category: "luxury",
  },
  {
    id: "5",
    title: "Dubai Family Extravaganza",
    destination: "Dubai, UAE",
    duration: "5 Days / 4 Nights",
    price: 65000,
    originalPrice: 78000,
    image: "query=dubai burj khalifa skyline",
    rating: 4.8,
    reviews: 720,
    highlights: ["Theme Parks", "Desert Safari", "City Tour", "Shopping"],
    inclusions: ["4-Star Hotel", "Breakfast", "Park Tickets", "Transfers"],
    category: "family",
  },
  {
    id: "6",
    title: "Maldives Luxury Escape",
    destination: "Maldives",
    duration: "6 Days / 5 Nights",
    price: 95000,
    originalPrice: 120000,
    image: "query=maldives overwater bungalow beach",
    rating: 4.9,
    reviews: 890,
    highlights: ["Overwater Villa", "Snorkeling", "Spa", "Fine Dining"],
    inclusions: ["Luxury Resort", "All Inclusive", "Water Sports", "Transfers"],
    category: "luxury",
    featured: true,
  },
]

interface HolidayState {
  packages: HolidayPackage[]
  selectedCategory: string
}

export const HolidayStore = new Store<HolidayState>({
  packages: mockPackages,
  selectedCategory: "all",
})
