"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "./navigation"

export function SiteHeader() {
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) {
    return null
  }

  return <Navigation />
}
