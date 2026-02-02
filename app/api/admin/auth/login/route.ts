import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    console.log("Login attempt for:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

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
              // Handle cookie setting errors
            }
          },
        },
      }
    )

    // Query admin_users table
    const { data: adminUser, error: queryError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single()

    console.log("Query error:", queryError)
    console.log("Admin user found:", adminUser)

    if (queryError || !adminUser) {
      console.log("User not found or query error")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In production, use proper password hashing (bcrypt)
    // This is a simplified demo version
    const isPasswordValid = password === adminUser.password_hash
    console.log("Password check - Input:", password, "DB:", adminUser.password_hash, "Match:", isPasswordValid)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session token
    const token = Buffer.from(
      JSON.stringify({
        admin_id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        full_name: adminUser.full_name,
        iat: Date.now(),
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      })
    ).toString("base64")

    const response = NextResponse.json({
      token,
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        full_name: adminUser.full_name,
      },
    })

    // Set httpOnly cookie on server side
    response.cookies.set("admin_session", token, {
      httpOnly: false,  // Allow JS access for now (set to true in production)
      secure: false,    // Set to true in production with HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
