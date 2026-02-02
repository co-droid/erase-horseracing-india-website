"use client"
// app/memorials/[slug]/page.tsx
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import type { Horse } from "@/lib/types"


export default function MemorialPage() {
  const [memorial, setMemorial] = useState<Horse | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const slug = params?.slug

  useEffect(() => {
    if (!slug) return;
    const fetchMemorial = async () => {
      setLoading(true)
      const res = await fetch(`/api/admin/memorials`)
      if (res.ok) {
        const data = await res.json()
        const found = data.find((m: Horse) => m.slug === slug)
        setMemorial(found || null)
        if (!found) router.replace("/memorials")
      }
      setLoading(false)
    }
    fetchMemorial()
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

  if (!memorial) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <div className="container mx-auto px-6 pt-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/memorials">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Memorials
            </Link>
          </Button>
        </div>

        <article className="py-12 md:py-16 px-6">
          <div className="container mx-auto max-w-3xl">
            <h1 className="font-serif text-4xl font-bold mb-4">{memorial.name}</h1>

            <p className="text-sm text-muted-foreground mb-6">
              Born: {memorial.date_of_birth ?? "—"} • Died: {memorial.date_of_death ?? "—"}
            </p>

            {memorial.image_url && (
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
                <img
                  src={memorial.image_url.replace(/^\/+/, "")}
                  alt={memorial.name}
                  className="w-full h-full object-cover"
                />

              </div>
            )}

            <div className="prose max-w-none whitespace-pre-line mb-6">
              {memorial.story}
            </div>

            <div className="text-sm text-muted-foreground">
              <p><span className="font-semibold">Cause of death:</span> {memorial.cause_of_death ?? "Unknown"}</p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

