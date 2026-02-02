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

<<<<<<< HEAD
// Mock data for frontend development
const mockHorses: Horse[] = [
  {
    id: "1",
    name: "Star",
    slug: "star-bangalore",
    image_url: "horse-memorial.jpg",
    date_of_birth: "2015-01-15",
    date_of_death: "2020-06-10",
    cause_of_death: "Track injury – leg fracture",
    story:
      "Star was a promising racer until a catastrophic leg injury ended her life at just 5 years old.",
    racetrack_id: null,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "2",
    name: "Thunder",
    slug: "thunder-delhi",
    image_url: "horse-racing-finish.png",
    date_of_birth: "2016-03-20",
    date_of_death: "2021-09-05",
    cause_of_death: "Collapsed during race",
    story:
      "Thunder collapsed on the track during a race, pushing his body beyond its limits.",
    racetrack_id: null,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "3",
    name: "Luna",
    slug: "luna-mumbai",
    image_url: "horse-in-field.jpg",
    date_of_birth: "2017-07-10",
    date_of_death: "2022-04-18",
    cause_of_death: "Euthanized due to track injury",
    story:
      "Luna's promising career was cut short by a severe injury that left her unable to recover.",
    racetrack_id: null,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
]


const mockRacetracks: Racetrack[] = [
  {
    id: "1",
    name: "Bangalore Turf Club",
    city: "Bangalore",
    state: "Karnataka",
    latitude: 13.0827,
    longitude: 77.6151,
    description: null,
    total_deaths: 24,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "2",
    name: "Delhi Race Club",
    city: "Delhi",
    state: "Delhi",
    latitude: 28.5244,
    longitude: 77.0855,
    description: null,
    total_deaths: 18,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "3",
    name: "Royal Western India Turf Club",
    city: "Mumbai",
    state: "Maharashtra",
    latitude: 19.1136,
    longitude: 72.8697,
    description: null,
    total_deaths: 31,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "4",
    name: "Madras Horse Racing Club",
    city: "Chennai",
    state: "Tamil Nadu",
    latitude: 13.0827,
    longitude: 80.2707,
    description: null,
    total_deaths: 15,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "5",
    name: "Kolkata Racing Association",
    city: "Kolkata",
    state: "West Bengal",
    latitude: 22.5726,
    longitude: 88.3639,
    description: null,
    total_deaths: 12,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "6",
    name: "Pune Race Course",
    city: "Pune",
    state: "Maharashtra",
    latitude: 18.5204,
    longitude: 73.8567,
    description: null,
    total_deaths: 9,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
]


const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Hidden Cost of Horse Racing in India",
    excerpt: "Behind the glamour of horse racing lies a tragic reality of injury and death.",
    content: "Full article content here...",
    slug: "hidden-cost-horse-racing",
    image_url: "horse-racing-track.jpg",
    published: true,
    published_at: "2024-01-15",
    author: "Erase Horseracing India",
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
  },
  {
    id: "2",
    title: "Racing Injury Statistics Nobody Talks About",
    excerpt: "An analysis of documented and undocumented injuries in Indian horse racing.",
    content: "Full article content here...",
    slug: "racing-injury-statistics",
    image_url: "/statistical-analysis.jpg",
    published: true,
    published_at: "2024-01-10",
    author: "Erase Horseracing India",
    created_at: "2024-01-10",
    updated_at: "2024-01-10",
  },
  {
    id: "3",
    title: "International Standards for Horse Welfare",
    excerpt: "How India's racing standards compare to other countries.",
    content: "Full article content here...",
    slug: "international-horse-standards",
    image_url: "international-standards.jpg",
    published: true,
    published_at: "2024-01-05",
    author: "Erase Horseracing India",
    created_at: "2024-01-05",
    updated_at: "2024-01-05",
  },
]

=======


>>>>>>> upstream/feature/login-setup
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
