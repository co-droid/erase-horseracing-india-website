"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, MapPin, Phone, User, Loader2, AlertCircle, Download } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Pledge {
  id: string
  full_name: string
  email: string
  phone?: string
  city?: string
  message?: string
  created_at: string
}

export function PledgesViewer() {
  const [pledges, setPledges] = useState<Pledge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedPledge, setSelectedPledge] = useState<Pledge | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPledges()
  }, [])

  const fetchPledges = async () => {
    try {
      setIsLoading(true)
      setError("")
      const response = await fetch("/api/admin/submissions/pledges")
      if (!response.ok) throw new Error("Failed to fetch pledges")
      const data = await response.json()
      setPledges(data)
    } catch (err) {
      console.error("Fetch error:", err)
      setError("Failed to load pledges")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPledges = pledges.filter(
    (pledge) =>
      pledge.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pledge.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pledge.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "City", "Message", "Date"]
    const rows = pledges.map((pledge) => [
      pledge.full_name,
      pledge.email,
      pledge.phone || "",
      pledge.city || "",
      pledge.message || "",
      new Date(pledge.created_at).toLocaleDateString(),
    ])

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pledges-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pledges</CardTitle>
              <CardDescription>View and manage all pledge submissions</CardDescription>
            </div>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="search">Search Pledges</Label>
            <Input
              id="search"
              placeholder="Search by name, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredPledges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {pledges.length === 0
                  ? "No pledges yet. They'll appear here when users submit them."
                  : "No pledges match your search."}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPledges.map((pledge) => (
                    <TableRow key={pledge.id}>
                      <TableCell className="font-medium">{pledge.full_name}</TableCell>
                      <TableCell>{pledge.email}</TableCell>
                      <TableCell>{pledge.city || "-"}</TableCell>
                      <TableCell>{new Date(pledge.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPledge(pledge)
                            setIsDialogOpen(true)
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Total pledges: <Badge variant="secondary">{pledges.length}</Badge>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pledge Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pledge Details</DialogTitle>
            <DialogDescription>Full information from the pledge submission</DialogDescription>
          </DialogHeader>

          {selectedPledge && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Full Name</span>
                  </div>
                  <p className="text-lg font-semibold">{selectedPledge.full_name}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-lg font-semibold">{selectedPledge.email}</p>
                </div>

                {selectedPledge.phone && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-medium">Phone</span>
                    </div>
                    <p className="text-lg font-semibold">{selectedPledge.phone}</p>
                  </div>
                )}

                {selectedPledge.city && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">City</span>
                    </div>
                    <p className="text-lg font-semibold">{selectedPledge.city}</p>
                  </div>
                )}
              </div>

              {/* Message */}
              {selectedPledge.message && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Message</span>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm leading-relaxed">{selectedPledge.message}</p>
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Pledged on {new Date(selectedPledge.created_at).toLocaleString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <a href={`mailto:${selectedPledge.email}`}>Send Email</a>
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
