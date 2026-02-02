"use client"

import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { AdminSession } from "@/lib/types/admin"

interface AdminHeaderProps {
  adminSession: AdminSession
}

export function AdminHeader({ adminSession }: AdminHeaderProps) {
  const router = useRouter()
  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" })
    document.cookie = "admin_session=; path=/; max-age=0"
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-sm text-muted-foreground">Manage website content</p>
      </div>

      <div className="flex items-center gap-4">
        {/* View Site Button */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Button variant="secondary" size="sm">View Site</Button>
        </a>

        {/* Admin Info */}
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{adminSession.full_name}</p>
          <p className="text-xs text-muted-foreground capitalize">{adminSession.role}</p>
        </div>

        {/* User Avatar/Icon */}
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>

        {/* Logout Button */}
        <Button variant="outline" size="sm" onClick={handleLogout} className="ml-2">
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </Button>
      </div>
    </header>
  )
}
