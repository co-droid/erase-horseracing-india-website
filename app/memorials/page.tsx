
"use client"
// app/memorials/page.tsx
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MemorialGrid } from "@/components/memorial-grid"
import type { Horse } from "@/lib/types"

import { useEffect, useState } from "react"


export default function MemorialsPage() {
  const [memorials, setMemorials] = useState<Horse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMemorials = async () => {
      setLoading(true)
      const res = await fetch("/api/admin/memorials")
      if (res.ok) {
        const data = await res.json()
        setMemorials(
          data
            .slice()
            .sort((a: Horse, b: Horse) => {
              const da = a.date_of_death ? new Date(a.date_of_death).getTime() : 0
              const db = b.date_of_death ? new Date(b.date_of_death).getTime() : 0
              return db - da // newest first
            })
        )
      }
      setLoading(false)
    }
    fetchMemorials()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-32 px-6 border-b">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <h1 className="font-serif text-5xl md:text-6xl font-bold">
              Memorials
            </h1>
            <p className="text-xl text-muted-foreground">
              Each horse had a name, a story, and a life worth remembering.
            </p>
            <p className="text-base text-muted-foreground">
              Total memorials recorded: {" "}
              <span className="font-semibold text-foreground">
                {memorials.length}
              </span>
            </p>
          </div>
        </section>

        {/* Memorial grid */}
        <section className="py-16 md:py-24 px-6">
          <div className="container mx-auto max-w-7xl">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : memorials.length > 0 ? (
              <MemorialGrid horses={memorials} />
            ) : (
              <p className="text-center text-muted-foreground">
                No memorials available.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

