// app/updates/page.tsx

"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import type { BlogPost } from "@/lib/types"


export default function UpdatesPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatDate = (dateString: string | null | undefined) => {
    try {
      if (!dateString) return ""
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString || ""
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/admin/posts")
        if (!res.ok) throw new Error("Failed to fetch posts")
        const data = await res.json()
        setPosts(
          data
            .filter((p: BlogPost) => p.published)
            .sort(
              (a: BlogPost, b: BlogPost) =>
                new Date(b.published_at ?? "").getTime() -
                new Date(a.published_at ?? "").getTime()
            )
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading posts")
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-32 px-6 border-b">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <h1 className="font-serif text-5xl md:text-6xl font-bold">
              Updates
            </h1>
            <p className="text-xl text-muted-foreground">
              Latest updates and announcements from Erase Horseracing India.
            </p>
          </div>
        </section>

        {/* Updates list */}
        <section className="py-16 md:py-24 px-6">
          <div className="container mx-auto max-w-6xl">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 font-semibold mb-2">Error loading updates</p>
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : posts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <Link href={`/updates/${post.slug}`}>
                      {post.image_url && (
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-6 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <time>{formatDate(post.published_at)}</time>
                        </div>
                        <h2 className="font-serif text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No updates available.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

