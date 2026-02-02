// Admin user types with role-based access control

export type AdminRole = "super_admin" | "editor" | "viewer"

export interface AdminUser {
  id: string
  email: string
  password_hash?: string // Never expose this to client
  role: AdminRole
  full_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AdminSession {
  admin_id: string
  email: string
  role: AdminRole
  full_name: string
  created_at: string
}

// Permissions by role
export const ADMIN_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: [
    "view_dashboard",
    "manage_memorials",
    "manage_posts",
    "manage_racetracks",
    "view_pledges",
    "view_reports",
    "manage_admins",
    "manage_settings",
  ],
  editor: [
    "view_dashboard",
    "manage_memorials",
    "manage_posts",
    "manage_racetracks",
    "view_pledges",
    "view_reports",
  ],
  viewer: [
    "view_dashboard",
    "view_pledges",
    "view_reports",
  ],
}

export function hasPermission(role: AdminRole, permission: string): boolean {
  return ADMIN_PERMISSIONS[role]?.includes(permission) ?? false
}
