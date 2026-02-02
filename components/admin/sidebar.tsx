"use client"

import { LayoutDashboard, Heart, FileText, MapPin, Mail, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AdminRole } from "@/lib/types/admin"
import { hasPermission } from "@/lib/types/admin"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  adminRole: AdminRole
}

export function Sidebar({ activeTab, onTabChange, adminRole }: SidebarProps) {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, permission: "view_dashboard" },
    { id: "memorials", label: "Horse Memorials", icon: Heart, permission: "manage_memorials" },
    { id: "posts", label: "News & Posts", icon: FileText, permission: "manage_posts" },
    { id: "racetracks", label: "Racetracks", icon: MapPin, permission: "manage_racetracks" },
    { id: "submissions", label: "Submissions", icon: Mail, permission: "view_pledges" },
  ]

  return (
    <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="font-serif text-lg font-bold text-foreground">Save Horses</h2>
        <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-auto">
        {menuItems.map((item) => {
          const canAccess = hasPermission(adminRole, item.permission)
          if (!canAccess) return null

          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => onTabChange(item.id as any)}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full text-xs" size="sm">
          <Settings className="h-3 w-3 mr-2" />
          Settings
        </Button>
      </div>
    </aside>
  )
}
