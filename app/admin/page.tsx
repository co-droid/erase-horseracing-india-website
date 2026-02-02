"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { MemorialsManager } from "@/components/admin/managers/memorials-manager"
import { PostsManager } from "@/components/admin/managers/posts-manager"
import { RacetracksManager } from "@/components/admin/managers/racetracks-manager"
import { SubmissionsViewer } from "@/components/admin/managers/submissions-viewer"
import { DashboardOverview } from "@/components/admin/dashboard-overview"
import type { AdminSession } from "@/lib/types/admin"

type TabType = "overview" | "memorials" | "posts" | "racetracks" | "submissions"

export default function AdminPage() {
  const router = useRouter()
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get admin session from cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_session="))
      ?.split("=")[1]

    if (!token) {
      router.push("/admin/login")
      return
    }

    try {
      // Token is base64 encoded JSON
      const decoded = JSON.parse(Buffer.from(token, "base64").toString())
      setAdminSession(decoded)
      setIsLoading(false)
    } catch (error) {
      console.error("Token parse error:", error)
      router.push("/admin/login")
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!adminSession) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} adminRole={adminSession.role} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader adminSession={adminSession} />

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            {activeTab === "overview" && <DashboardOverview />}
            {activeTab === "memorials" && <MemorialsManager />}
            {activeTab === "posts" && <PostsManager />}
            {activeTab === "racetracks" && <RacetracksManager />}
            {activeTab === "submissions" && <SubmissionsViewer />}
          </div>
        </main>
      </div>
    </div>
  )
}
