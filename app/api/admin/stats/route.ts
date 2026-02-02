import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // Handle cookie errors
            }
          },
        },
      }
    )

    const [horses, posts, racetracks, pledges] = await Promise.all([
      supabase.from("horses").select("id", { count: "exact", head: true }),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("racetracks").select("id", { count: "exact", head: true }),
      supabase.from("pledges").select("id", { count: "exact", head: true }),
    ])

    return NextResponse.json({
      totalMemorials: horses.count || 0,
      totalPosts: posts.count || 0,
      totalRacetracks: racetracks.count || 0,
      totalPledges: pledges.count || 0,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json(
      {
        totalMemorials: 0,
        totalPosts: 0,
        totalRacetracks: 0,
        totalPledges: 0,
      },
      { status: 200 }
    )
  }
}
