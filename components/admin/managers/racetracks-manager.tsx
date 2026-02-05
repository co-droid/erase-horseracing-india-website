"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Loader2, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Racetrack } from "@/lib/types"

export function RacetracksManager() {
  const [racetracks, setRacetracks] = useState<Racetrack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
    description: "",
    total_deaths: 0,
    status: "active" as "active" | "closed",
  })

  useEffect(() => {
    fetchRacetracks()
  }, [])

  const fetchRacetracks = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/racetracks")
      if (response.ok) {
        const data = await response.json()
        setRacetracks(data)
      }
    } catch (err) {
      setError("Failed to fetch racetracks")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const endpoint = editingId ? `/api/admin/racetracks/${editingId}` : "/api/admin/racetracks"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          total_deaths: parseInt(formData.total_deaths.toString()),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save racetrack")
      }

      await fetchRacetracks()
      setIsDialogOpen(false)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving racetrack")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this racetrack? This cannot be undone.")) return

    try {
      const response = await fetch(`/api/admin/racetracks/${id}`, { method: "DELETE" })
      if (response.ok) {
        setRacetracks(racetracks.filter((r) => r.id !== id))
      }
    } catch (err) {
      setError("Failed to delete racetrack")
    }
  }

  const handleEdit = (racetrack: Racetrack) => {
    setFormData({
      name: racetrack.name,
      city: racetrack.city,
      state: racetrack.state,
      latitude: racetrack.latitude?.toString() || "",
      longitude: racetrack.longitude?.toString() || "",
      description: racetrack.description || "",
      total_deaths: racetrack.total_deaths,
      status: racetrack.status,
    })
    setEditingId(racetrack.id)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      city: "",
      state: "",
      latitude: "",
      longitude: "",
      description: "",
      total_deaths: 0,
      status: "active",
    })
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Racetracks</h2>
          <p className="text-muted-foreground mt-1">Manage racetrack locations and incident tracking</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Racetrack
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Racetrack" : "Add New Racetrack"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the racetrack information" : "Register a new racetrack"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Racetrack Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Region *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="13.0827"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="77.6151"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_deaths">Total Deaths Recorded</Label>
                  <Input
                    id="total_deaths"
                    type="number"
                    value={formData.total_deaths}
                    onChange={(e) => setFormData({ ...formData, total_deaths: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Racetracks List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : racetracks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {racetracks.map((track) => (
            <Card key={track.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{track.name}</CardTitle>
                <CardDescription>
                  {track.city}, {track.state}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Deaths Recorded</p>
                    <p className="font-semibold text-lg text-red-600">{track.total_deaths}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <span className={`text-sm font-semibold ${track.status === "active" ? "text-green-600" : "text-gray-600"}`}>
                      {track.status === "active" ? "🟢 Active" : "🔴 Closed"}
                    </span>
                  </div>
                </div>
                {track.description && <p className="text-xs text-muted-foreground">{track.description}</p>}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(track)} className="gap-2 flex-1">
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(track.id)} className="gap-2">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>No racetracks registered yet. Add one to track incidents.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
