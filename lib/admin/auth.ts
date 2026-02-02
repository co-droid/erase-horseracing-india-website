// Admin authentication and authorization utilities
import { jwtVerify } from "jose"
import type { AdminSession, AdminRole } from "./types/admin"

const SECRET_KEY = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "change-me-in-production")

export async function createAdminToken(adminId: string, email: string, role: AdminRole, fullName: string): Promise<string> {
  const now = Date.now()
  const token = {
    admin_id: adminId,
    email,
    role,
    full_name: fullName,
    iat: now,
    exp: now + 7 * 24 * 60 * 60 * 1000, // 7 days
  }

  // For production, use a proper JWT library
  // This is a simplified version - use jsonwebtoken or jose in production
  const payload = Buffer.from(JSON.stringify(token)).toString("base64")
  return `${payload}.${Buffer.from(JSON.stringify({ sig: "demo" })).toString("base64")}`
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const [payload] = token.split(".")
    if (!payload) return null
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString())
    if (decoded.exp < Date.now()) return null // Expired
    return decoded as AdminSession
  } catch {
    return null
  }
}

export function getAdminSession(cookies: Record<string, string>): AdminSession | null {
  const token = cookies["admin_session"]
  if (!token) return null
  try {
    const [payload] = token.split(".")
    if (!payload) return null
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString())
    if (decoded.exp < Date.now()) return null
    return decoded as AdminSession
  } catch {
    return null
  }
}
