import fs from "fs"
import path from "path"

export interface Partner {
  id: string
  code: string
  name: string
  type: "super_master" | "master" | "agent"
  contactPerson: string
  email: string
  phone: string
  city: string
  creditLimit: number
  balance: number
  markupPercentage: number
  parentPartnerId?: string | null
  status: "active" | "suspended" | "pending"
  createdAt: string
  totalBookings: number
}

const PARTNER_FILE = path.join(process.cwd(), "data", "partners.json")

const INITIAL_PARTNERS: Partner[] = [
  {
    id: "p-super-01",
    code: "MX-SUP-01",
    name: "MusafirX Global Travel Consortium",
    type: "super_master",
    contactPerson: "Nasif Kabir (Admin)",
    email: "admin@musafirx.com",
    phone: "+880 1711 000111",
    city: "Dhaka",
    creditLimit: 50000000,
    balance: 48200000,
    markupPercentage: 0,
    status: "active",
    createdAt: "2025-01-01T00:00:00Z",
    totalBookings: 1240,
  },
  {
    id: "p-mast-01",
    code: "MX-MST-01",
    name: "Bengal Wings Wholesalers",
    type: "master",
    contactPerson: "Rafiqul Islam",
    email: "rafiq@bengalwings.com",
    phone: "+880 1819 223344",
    city: "Chittagong",
    creditLimit: 10000000,
    balance: 7850000,
    markupPercentage: 3.5,
    parentPartnerId: "p-super-01",
    status: "active",
    createdAt: "2025-01-05T00:00:00Z",
    totalBookings: 320,
  },
  {
    id: "p-mast-02",
    code: "MX-MST-02",
    name: "Sylhet Aviation Network",
    type: "master",
    contactPerson: "Faruk Ahmed",
    email: "faruk@sylhetaviation.com",
    phone: "+880 1712 556677",
    city: "Sylhet",
    creditLimit: 8000000,
    balance: 6200000,
    markupPercentage: 4.0,
    parentPartnerId: "p-super-01",
    status: "active",
    createdAt: "2025-01-08T00:00:00Z",
    totalBookings: 245,
  },
  {
    id: "p-agt-01",
    code: "MX-AGT-01",
    name: "Padma Express Travels",
    type: "agent",
    contactPerson: "Kamal Hossain",
    email: "kamal@padmatravels.com",
    phone: "+880 1913 998877",
    city: "Dhaka (Motijheel)",
    creditLimit: 500000,
    balance: 342000,
    markupPercentage: 5.0,
    parentPartnerId: "p-mast-01",
    status: "active",
    createdAt: "2025-01-12T00:00:00Z",
    totalBookings: 84,
  },
  {
    id: "p-agt-02",
    code: "MX-AGT-02",
    name: "Cox's Sea Breeze Holidays",
    type: "agent",
    contactPerson: "Shahidul Alam",
    email: "shahid@seabreeze.com",
    phone: "+880 1611 445566",
    city: "Cox's Bazar",
    creditLimit: 400000,
    balance: 215000,
    markupPercentage: 5.5,
    parentPartnerId: "p-mast-01",
    status: "active",
    createdAt: "2025-01-15T00:00:00Z",
    totalBookings: 58,
  },
]

export function getPartners(): Partner[] {
  try {
    if (fs.existsSync(PARTNER_FILE)) {
      const data = fs.readFileSync(PARTNER_FILE, "utf-8")
      return JSON.parse(data)
    }
  } catch (e) {
    console.error("Error reading partners:", e)
  }
  // Initialize with defaults if not present
  savePartners(INITIAL_PARTNERS)
  return INITIAL_PARTNERS
}

export function savePartners(partners: Partner[]): void {
  try {
    const dir = path.dirname(PARTNER_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(PARTNER_FILE, JSON.stringify(partners, null, 2), "utf-8")
  } catch (e) {
    console.error("Error saving partners:", e)
  }
}
