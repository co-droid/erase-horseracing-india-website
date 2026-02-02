// app/news/[slug]/page.tsx
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

export default function NewsArticlePage() {
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
      const res = await fetch(`/api/admin/posts`)
      if (res.ok) {
        const data = await res.json()
        const found = data.find((p: BlogPost) => p.slug === slug && p.published)
        setPost(found || null)
        setRelatedPosts(data.filter((p: BlogPost) => p.published && p.slug !== slug).slice(0, 3))
        if (!found) router.replace("/news")
      }
      setLoading(false)
    }
    fetchPost()
  }, [slug, router])

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
            <Link href="/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Link>
          </Button>
        </div>

        <article className="py-12 md:py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time>
                  {post.published_at ?? ""}
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

            <div className="prose prose-lg max-w-none whitespace-pre-line">
              {post!.content}
            </div>

            <div className="mt-12 pt-8 border-t flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="font-semibold">Share this article</h3>
                <p className="text-sm text-muted-foreground">Help spread awareness about this issue</p>
              </div>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="py-12 md:py-16 px-6 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <Card key={rp.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <Link href={`/news/${rp.slug}`}>
                      {rp.image_url && (
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                          <img src={rp.image_url} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <CardContent className="p-6 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <time>{rp.published_at ?? ""}</time>
                        </div>
                        <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{rp.title}</h3>
                      </CardContent>
                    </Link>
                  </Card>
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

