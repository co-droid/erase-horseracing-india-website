"use client"

import { useState, useEffect } from "react"
import type { Horse, BlogPost, Racetrack } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { DataAndMapSection } from "@/components/data-and-map-section"
import { HomeActionSection } from "@/components/home-action-section"
import { UpdatesSection } from "@/components/updates-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MemorialGrid } from "@/components/memorial-grid"



export default function HomePage() {
  const [horses, setHorses] = useState<Horse[]>([])
  const [racetracks, setRacetracks] = useState<Racetrack[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [totalDeaths, setTotalDeaths] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [horsesRes, racetracksRes, postsRes] = await Promise.all([
          fetch("/api/admin/memorials"),
          fetch("/api/admin/racetracks"),
          fetch("/api/admin/posts")
        ])
        let horsesData: Horse[] = []
        let racetracksData: Racetrack[] = []
        let postsData: BlogPost[] = []
        if (horsesRes.ok) horsesData = await horsesRes.json()
        if (racetracksRes.ok) racetracksData = await racetracksRes.json()
        if (postsRes.ok) postsData = (await postsRes.json()).filter((p: BlogPost) => p.published)
        setHorses(horsesData.slice(0, 3))
        setRacetracks(racetracksData)
        setPosts(postsData.slice(0, 3))
        setTotalDeaths(racetracksData.reduce((sum, r) => sum + (r.total_deaths || 0), 0))
      } catch (error) {
        console.error('[v0] Data fetch failed:', error)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <HeroSection />

        <DataAndMapSection totalDeaths={totalDeaths} racetracks={racetracks} />

        <HomeActionSection />

        {/* Remember Them Section */}
        {horses && horses.length > 0 && (
          <section className="py-20 md:py-32 px-6 bg-muted/30">
            <div className="container mx-auto max-w-7xl">
              <div className="text-center mb-12">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Remember Them</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Each horse had a name, a story, and a life worth living. These are their memorials.
                </p>
              </div>

              <MemorialGrid horses={horses} />

              <div className="text-center mt-12">
                <Button asChild size="lg" variant="outline">
                  <Link href="/memorials">
                    View All Memorials
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {posts && posts.length > 0 && <UpdatesSection posts={posts} />}

        <NewsletterSection />
      </main>

      <Footer />
    </div>
  )
}
