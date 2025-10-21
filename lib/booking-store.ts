import { Store } from "pullstate"

export interface PassengerDetails {
  id: string
  type: "adult" | "child" | "infant"
  title: string
  firstName: string
  lastName: string
  dateOfBirth: Date | null
  nationality: string
  passportNumber: string
  passportExpiry: Date | null
}

export interface ContactDetails {
  email: string
  phone: string
  countryCode: string
}

export interface AddOns {
  meals: { passengerId: string; mealType: string }[]
  baggage: { passengerId: string; weight: number }[]
  seats: { passengerId: string; seatNumber: string }[]
  insurance: boolean
}

export interface PaymentDetails {
  method: "card" | "upi" | "netbanking" | "wallet"
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
}

interface BookingState {
  currentStep: number
  passengers: PassengerDetails[]
  contact: ContactDetails
  addOns: AddOns
  payment: PaymentDetails | null
  bookingReference: string | null
}

export const BookingStore = new Store<BookingState>({
  currentStep: 1,
  passengers: [],
  contact: {
    email: "",
    phone: "",
    countryCode: "+91",
  },
  addOns: {
    meals: [],
    baggage: [],
    seats: [],
    insurance: false,
  },
  payment: null,
  bookingReference: null,
})
