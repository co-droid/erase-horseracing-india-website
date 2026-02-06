"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { RacetrackMapLeaflet } from "@/components/racetrack-map-leaflet"
import { AlertTriangle } from "lucide-react"
import type { Racetrack } from "@/lib/types"

export default function KillingMapPage() {
  const [racetracks, setRacetracks] = useState<Racetrack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRacetracks = async () => {
      try {
        const res = await fetch("/api/admin/racetracks")
        if (res.ok) {
          const data = await res.json()
          setRacetracks(data)
        }
      } catch (error) {
        console.error("Failed to fetch racetracks:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRacetracks()
  }, [])

  const maxDeaths = racetracks.length > 0 ? Math.max(...racetracks.map((t) => t.total_deaths)) : 100
  const totalDeaths = racetracks.reduce((sum, t) => sum + t.total_deaths, 0)

  // Group racetracks by state
  const tracksByState = racetracks.reduce(
    (acc, track) => {
      const state = track.state || "Unknown"
      if (!acc[state]) {
        acc[state] = []
      }
      acc[state].push(track)
      return acc
    },
    {} as Record<string, Racetrack[]>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading map data...</p>
            </div>
          </div>
        ) : (
          <>
        {/* Hero */}
        <section className="py-20 md:py-32 px-6 bg-gradient-to-br from-destructive/5 via-transparent to-accent/5 border-b relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-10 w-72 h-72 bg-destructive/10 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto max-w-4xl text-center space-y-6 relative z-10">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground">
              Killing Map
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Interactive map of documented deaths across Indian racing tracks
            </p>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16 md:py-24 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20 hover:border-destructive/40 transition-all hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="font-serif text-xl font-bold">Documented Deaths</h3>
                </div>
                <p className="text-4xl font-bold text-destructive">{totalDeaths}+</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Across tracked facilities (from Supabase)
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertTriangle className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-serif text-xl font-bold">States Affected</h3>
                </div>
                <p className="text-4xl font-bold text-accent">{Object.keys(tracksByState).length}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Indian states with tracked racetracks
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold">Tracked Tracks</h3>
                </div>
                <p className="text-4xl font-bold text-primary">
                  {racetracks.length}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Racetracks documented
                </p>
              </div>
            </div>

            {/* Map + List */}
            <div className="mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-center">
                Interactive Map - Deaths by Track
              </h2>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Map - Takes up 2 columns on large screens */}
                <div className="lg:col-span-2">
                  <RacetrackMapLeaflet racetracks={racetracks} />
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Click on markers to see detailed information about each racetrack
                  </p>
                </div>

                {/* List - Grouped by State */}
                <div className="space-y-6 lg:overflow-y-auto lg:max-h-[600px] pr-2">
                  {Object.entries(tracksByState)
                    .sort((a, b) => {
                      const totalA = a[1].reduce((sum, t) => sum + t.total_deaths, 0)
                      const totalB = b[1].reduce((sum, t) => sum + t.total_deaths, 0)
                      return totalB - totalA
                    })
                    .map(([state, tracks]) => {
                      const stateTotal = tracks.reduce((sum, t) => sum + t.total_deaths, 0)
                      return (
                        <div key={state} className="border-l-4 border-destructive/40 pl-4">
                          <div className="flex justify-between mb-3">
                            <h3 className="font-bold text-lg text-foreground">{state}</h3>
                            <p className="text-lg font-bold text-destructive">{stateTotal}</p>
                          </div>
                          <div className="space-y-2">
                            {tracks
                              .sort((a, b) => b.total_deaths - a.total_deaths)
                              .map((track, idx) => {
                                const pct = (track.total_deaths / maxDeaths) * 100
                                return (
                                  <div
                                    key={idx}
                                    className="p-3 rounded-lg border border-border/40 hover:border-destructive/40 transition-all bg-muted/20"
                                  >
                                    <div className="flex justify-between mb-2">
                                      <p className="text-sm font-semibold">{track.name}</p>
                                      <p className="text-sm font-bold text-destructive">
                                        {track.total_deaths}
                                      </p>
                                    </div>
                                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-destructive to-accent"
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                  </div>
                                )
                              })}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>

            {/* Context */}
            <div className="p-8 rounded-2xl bg-gradient-to-r from-muted/30 to-muted/10 border border-border/40">
              <h3 className="font-serif text-2xl font-bold mb-2">
                Understanding the Data
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Official death records in Indian racing are severely underreported.
                Many incidents occur in training or secondary facilities and never
                enter public statistics. The true toll is likely far higher.
              </p>
            </div>
          </div>
        </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

