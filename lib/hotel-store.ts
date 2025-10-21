import { Store } from "pullstate"

export interface Hotel {
  id: string
  name: string
  location: string
  city: string
  rating: number
  reviews: number
  price: number
  originalPrice?: number
  image: string
  amenities: string[]
  roomType: string
  description: string
  featured?: boolean
}

export interface HotelSearchData {
  destination: string
  checkIn: Date | null
  checkOut: Date | null
  guests: {
    adults: number
    children: number
  }
}

interface HotelState {
  searchData: HotelSearchData
  hotels: Hotel[]
  selectedHotel: Hotel | null
}

const mockHotels: Hotel[] = [
  {
    id: "1",
    name: "The Grand Palace Hotel",
    location: "Connaught Place",
    city: "New Delhi",
    rating: 4.8,
    reviews: 1250,
    price: 8500,
    originalPrice: 12000,
    image: "query=luxury hotel lobby delhi",
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Gym", "Room Service"],
    roomType: "Deluxe Room",
    description: "Experience luxury at its finest with stunning views and world-class amenities",
    featured: true,
  },
  {
    id: "2",
    name: "Seaside Resort & Spa",
    location: "Baga Beach",
    city: "Goa",
    rating: 4.6,
    reviews: 890,
    price: 6200,
    originalPrice: 8500,
    image: "query=beach resort goa",
    amenities: ["Beach Access", "Pool", "Spa", "Restaurant", "Bar"],
    roomType: "Ocean View Room",
    description: "Beachfront paradise with breathtaking ocean views and tropical ambiance",
    featured: true,
  },
  {
    id: "3",
    name: "Mountain View Retreat",
    location: "Mall Road",
    city: "Shimla",
    rating: 4.5,
    reviews: 650,
    price: 4800,
    image: "query=mountain hotel shimla",
    amenities: ["Free WiFi", "Restaurant", "Parking", "Fireplace"],
    roomType: "Mountain View Room",
    description: "Cozy mountain retreat with panoramic views of the Himalayas",
  },
  {
    id: "4",
    name: "Business Hub Hotel",
    location: "Whitefield",
    city: "Bangalore",
    rating: 4.4,
    reviews: 720,
    price: 5500,
    image: "query=modern business hotel",
    amenities: ["Free WiFi", "Conference Room", "Gym", "Restaurant"],
    roomType: "Executive Room",
    description: "Modern hotel perfect for business travelers with excellent connectivity",
  },
  {
    id: "5",
    name: "Heritage Palace",
    location: "Old City",
    city: "Jaipur",
    rating: 4.7,
    reviews: 980,
    price: 7200,
    originalPrice: 9500,
    image: "query=heritage palace hotel jaipur",
    amenities: ["Pool", "Spa", "Restaurant", "Cultural Shows", "Garden"],
    roomType: "Royal Suite",
    description: "Stay in a restored palace with royal treatment and authentic Rajasthani hospitality",
    featured: true,
  },
  {
    id: "6",
    name: "Backwater Villa",
    location: "Alleppey",
    city: "Kerala",
    rating: 4.6,
    reviews: 540,
    price: 5800,
    image: "query=kerala backwater villa",
    amenities: ["Lake View", "Restaurant", "Boat Rides", "Ayurvedic Spa"],
    roomType: "Villa Room",
    description: "Tranquil villa overlooking serene backwaters with authentic Kerala experience",
  },
]

export const HotelStore = new Store<HotelState>({
  searchData: {
    destination: "",
    checkIn: null,
    checkOut: null,
    guests: {
      adults: 2,
      children: 0,
    },
  },
  hotels: mockHotels,
  selectedHotel: null,
})
