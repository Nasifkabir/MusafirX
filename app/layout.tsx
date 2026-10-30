import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Outfit } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: "MusafirX - Next-Gen GDS Travel & Flight Portal",
  description: "Bespoke online travel agency powered by Sabre GDS, real-time Bargain Finder Max flight shopping, and multi-tier B2B agent network.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${outfit.variable} antialiased`}>
      <body className="flex flex-col min-h-screen font-sans overflow-x-hidden max-w-full w-full">
        <SiteHeader />
        <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}

