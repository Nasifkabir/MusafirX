import type { Airport } from "./store"

// Mock airport data for autocomplete
export const AIRPORTS: Airport[] = [
  // Bangladesh Domestic
  { code: "DAC", name: "Hazrat Shahjalal International Airport", city: "Dhaka", country: "Bangladesh" },
  { code: "CXB", name: "Cox's Bazar Airport", city: "Cox's Bazar", country: "Bangladesh" },
  { code: "CGP", name: "Shah Amanat International Airport", city: "Chittagong", country: "Bangladesh" },
  { code: "ZYL", name: "Osmani International Airport", city: "Sylhet", country: "Bangladesh" },
  { code: "JSR", name: "Jessore Airport", city: "Jessore", country: "Bangladesh" },
  { code: "SPD", name: "Saidpur Airport", city: "Saidpur", country: "Bangladesh" },
  { code: "BZL", name: "Barisal Airport", city: "Barisal", country: "Bangladesh" },
  { code: "RJH", name: "Shah Makhdum Airport", city: "Rajshahi", country: "Bangladesh" },

  // Middle East & Gulf
  { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "UAE" },
  { code: "SHJ", name: "Sharjah International Airport", city: "Sharjah", country: "UAE" },
  { code: "DOH", name: "Hamad International Airport", city: "Doha", country: "Qatar" },
  { code: "JED", name: "King Abdulaziz International Airport", city: "Jeddah", country: "Saudi Arabia" },
  { code: "MED", name: "Prince Mohammad Bin Abdulaziz Airport", city: "Medina", country: "Saudi Arabia" },
  { code: "RUH", name: "King Khalid International Airport", city: "Riyadh", country: "Saudi Arabia" },
  { code: "MCT", name: "Muscat International Airport", city: "Muscat", country: "Oman" },
  { code: "KWI", name: "Kuwait International Airport", city: "Kuwait City", country: "Kuwait" },

  // Southeast Asia & Far East
  { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand" },
  { code: "DMK", name: "Don Mueang International Airport", city: "Bangkok", country: "Thailand" },
  { code: "SIN", name: "Singapore Changi Airport", city: "Singapore", country: "Singapore" },
  { code: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia" },
  { code: "DPS", name: "Ngurah Rai International Airport", city: "Bali", country: "Indonesia" },
  { code: "MLE", name: "Velana International Airport", city: "Malé", country: "Maldives" },
  { code: "CAN", name: "Guangzhou Baiyun International Airport", city: "Guangzhou", country: "China" },

  // South Asia
  { code: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi", country: "India" },
  { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", country: "India" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "India" },
  { code: "MAA", name: "Chennai International Airport", city: "Chennai", country: "India" },
  { code: "KTM", name: "Tribhuvan International Airport", city: "Kathmandu", country: "Nepal" },
  { code: "CMB", name: "Bandaranaike International Airport", city: "Colombo", country: "Sri Lanka" },

  // Europe & Americas
  { code: "LHR", name: "London Heathrow Airport", city: "London", country: "United Kingdom" },
  { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "USA" },
  { code: "YYZ", name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada" },
  { code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey" },
]

export function searchAirports(query: string): Airport[] {
  if (!query || query.trim().length === 0) return AIRPORTS.slice(0, 12)

  const cleanQuery = query.toLowerCase().replace(/[()]/g, " ").trim()
  const tokens = cleanQuery.split(/\s+/).filter(Boolean)

  return AIRPORTS.filter((airport) => {
    const text = `${airport.code} ${airport.city} ${airport.name} ${airport.country}`.toLowerCase()
    return tokens.some((t) => text.includes(t))
  }).slice(0, 15)
}
