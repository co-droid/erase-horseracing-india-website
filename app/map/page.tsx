// app/map/page.tsx

"use client"
import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DataAndMapSection } from "@/components/data-and-map-section"
import type { Racetrack } from "@/lib/types"


export default function MapPage() {
  const [racetracks, setRacetracks] = useState<Racetrack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRacetracks = async () => {
      setLoading(true)
      const res = await fetch("/api/admin/racetracks")
      if (res.ok) {
        const data = await res.json()
        setRacetracks(data)
      }
      setLoading(false)
    }
    fetchRacetracks()
  }, [])

  const totalDeaths = racetracks.reduce((sum, r) => sum + r.total_deaths, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading...</div>
        ) : (
          <DataAndMapSection
            totalDeaths={totalDeaths}
            racetracks={racetracks}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}
