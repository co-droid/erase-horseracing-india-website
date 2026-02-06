// app/updates/[slug]/page.tsx
"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"

import type { BlogPost } from "@/lib/types"

export default function UpdateArticlePage() {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const params = useParams<{ slug: string }>()
  const slug = params?.slug
  const router = useRouter()

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/posts`)
        if (!res.ok) throw new Error("Failed to fetch post")
        const data = await res.json()
        const found = data.find((p: BlogPost) => p.slug === slug && p.published)
        setPost(found || null)
        setRelatedPosts(data.filter((p: BlogPost) => p.published && p.slug !== slug).slice(0, 3))
        if (!found) {
          router.replace("/updates")
        }
      } catch (err) {
        console.error("Error fetching post:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug, router])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <div className="container mx-auto px-6 pt-6">
            <p className="text-center text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <div className="container mx-auto px-6 pt-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/updates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Updates
            </Link>
          </Button>
        </div>

        <article className="py-12 md:py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time>
                  {formatDate(post.published_at)}
                </time>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author ?? "Erase Horseracing India"}</span>
              </div>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {post.title}
            </h1>

            {post.excerpt && <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>}

            {post.image_url && (
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted mb-12">
                <img src={post!.image_url} alt={post!.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="mb-12 leading-relaxed text-base">
              {post.content ? (
                <div className="space-y-5">
                  {post.content.split('\n').map((paragraph, i) => (
                    paragraph.trim() && (
                      <p key={i} className="text-foreground">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No content available</p>
              )}
            </div>

            {/* Share section */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h3 className="font-semibold">Share this update</h3>
                  <p className="text-sm text-muted-foreground">Help spread awareness about this issue</p>
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <section className="py-12 md:py-16 px-6 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Related Updates</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} href={`/updates/${rp.slug}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col group">
                      {rp.image_url && (
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                          <img 
                            src={rp.image_url} 
                            alt={rp.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                      )}
                      <CardContent className="p-6 space-y-3 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <time>{formatDate(rp.published_at)}</time>
                        </div>
                        <h3 className="font-serif text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {rp.title}
                        </h3>
                        {rp.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                            {rp.excerpt}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
