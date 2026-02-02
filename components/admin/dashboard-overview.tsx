"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, FileText, MapPin, Users } from "lucide-react"

export function DashboardOverview() {
  const [stats, setStats] = useState({
    totalMemorials: 0,
    totalPosts: 0,
    totalRacetracks: 0,
    totalPledges: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Horse Memorials",
      value: stats.totalMemorials,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "News Articles",
      value: stats.totalPosts,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Racetracks",
      value: stats.totalRacetracks,
      icon: MapPin,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Pledges",
      value: stats.totalPledges,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Welcome to Admin Dashboard</h2>
        <p className="text-muted-foreground mt-2">Monitor and manage all website content from here</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "-" : stats.totalMemorials}</div>
                <p className="text-xs text-muted-foreground mt-1">Total items</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <h3 className="font-semibold flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Add Memorial
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Honor a horse's memory</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                Write Post
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Share news and updates</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                Update Track
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Manage racetrack data</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                View Submissions
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Check pledges and reports</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Use the sidebar to navigate between different content sections</p>
          <p>• Each role has different permissions - contact admin if you need access to features</p>
          <p>• Your session expires after 7 days of inactivity</p>
          <p>• For issues, contact: support@savehorses.org</p>
        </CardContent>
      </Card>
    </div>
  )
}
