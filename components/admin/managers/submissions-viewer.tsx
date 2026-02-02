"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Pledge, Report } from "@/lib/types"

export function SubmissionsViewer() {
  const [pledges, setPledges] = useState<Pledge[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true)
      const [pledgesRes, reportsRes] = await Promise.all([
        fetch("/api/admin/submissions/pledges"),
        fetch("/api/admin/submissions/reports"),
      ])

      if (pledgesRes.ok) {
        const data = await pledgesRes.json()
        setPledges(data)
      }

      if (reportsRes.ok) {
        const data = await reportsRes.json()
        setReports(data)
      }
    } catch (err) {
      setError("Failed to fetch submissions")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Submissions & Support</h2>
        <p className="text-muted-foreground mt-1">View pledges and incident reports from the community</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Tabs defaultValue="pledges" className="w-full">
          <TabsList>
            <TabsTrigger value="pledges">
              Pledges <Badge className="ml-2">{pledges.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reports">
              Reports <Badge className="ml-2">{reports.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Pledges Tab */}
          <TabsContent value="pledges" className="space-y-4">
            {pledges.length > 0 ? (
              <div className="grid gap-4">
                {pledges.map((pledge) => (
                  <Card key={pledge.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{pledge.full_name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Mail className="h-3 w-3" />
                            {pledge.email}
                          </CardDescription>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(pledge.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {pledge.phone && (
                          <div>
                            <p className="text-muted-foreground">Phone</p>
                            <p className="font-medium">{pledge.phone}</p>
                          </div>
                        )}
                        {pledge.city && (
                          <div>
                            <p className="text-muted-foreground">City</p>
                            <p className="font-medium">{pledge.city}</p>
                          </div>
                        )}
                      </div>
                      {pledge.message && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Message</p>
                          <p className="text-sm bg-muted p-3 rounded-lg">{pledge.message}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>No pledges yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            {reports.length > 0 ? (
              <div className="grid gap-4">
                {reports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {report.racetrack_name}
                            <Badge
                              variant={
                                report.status === "verified"
                                  ? "default"
                                  : report.status === "pending"
                                    ? "secondary"
                                    : report.status === "dismissed"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {report.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {report.reporter_name && `Reported by ${report.reporter_name} • `}
                            {report.incident_date && `Date: ${report.incident_date}`}
                          </CardDescription>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Incident Type</p>
                        <Badge className="capitalize">{report.incident_type}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Description</p>
                        <p className="text-sm bg-muted p-3 rounded-lg">{report.description}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reporter Email</p>
                        <p className="text-sm font-mono">{report.reporter_email}</p>
                      </div>
                      {report.evidence_urls && report.evidence_urls.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Evidence</p>
                          <div className="space-y-1">
                            {report.evidence_urls.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline block truncate"
                              >
                                {url}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>No incident reports yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
