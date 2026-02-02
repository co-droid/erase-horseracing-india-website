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
import type { Horse } from "@/lib/types"

export function MemorialsManager() {
  const [memorials, setMemorials] = useState<Horse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    date_of_death: "",
    cause_of_death: "",
    story: "",
    racetrack_id: "",
  })

  useEffect(() => {
    fetchMemorials()
  }, [])

  const fetchMemorials = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/memorials")
      if (response.ok) {
        const data = await response.json()
        setMemorials(data)
      }
    } catch (err) {
      setError("Failed to fetch memorials")
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
      const endpoint = editingId ? `/api/admin/memorials/${editingId}` : "/api/admin/memorials"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save memorial")
      }

      await fetchMemorials()
      setIsDialogOpen(false)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving memorial")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return

    try {
      const response = await fetch(`/api/admin/memorials/${id}`, { method: "DELETE" })
      if (response.ok) {
        setMemorials(memorials.filter((m) => m.id !== id))
      }
    } catch (err) {
      setError("Failed to delete memorial")
    }
  }

  const handleEdit = (memorial: Horse) => {
    setFormData({
      name: memorial.name,
      slug: memorial.slug,
      date_of_death: memorial.date_of_death || "",
      cause_of_death: memorial.cause_of_death || "",
      story: memorial.story,
      racetrack_id: memorial.racetrack_id || "",
    })
    setEditingId(memorial.id)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      date_of_death: "",
      cause_of_death: "",
      story: "",
      racetrack_id: "",
    })
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Horse Memorials</h2>
          <p className="text-muted-foreground mt-1">Honor and document horses that have passed</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Memorial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Memorial" : "Add New Memorial"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the horse memorial" : "Create a new horse memorial entry"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Horse Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="horse-name-lowercase"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_death">Date of Death</Label>
                  <Input
                    id="date_of_death"
                    type="date"
                    value={formData.date_of_death}
                    onChange={(e) => setFormData({ ...formData, date_of_death: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="racetrack_id">Racetrack</Label>
                  <Input
                    id="racetrack_id"
                    value={formData.racetrack_id}
                    onChange={(e) => setFormData({ ...formData, racetrack_id: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cause_of_death">Cause of Death</Label>
                <Textarea
                  id="cause_of_death"
                  value={formData.cause_of_death}
                  onChange={(e) => setFormData({ ...formData, cause_of_death: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="story">Story / Details *</Label>
                <Textarea
                  id="story"
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  rows={4}
                  required
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

      {/* Memorials List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : memorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memorials.map((memorial) => (
            <Card key={memorial.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{memorial.name}</CardTitle>
                <CardDescription>{memorial.date_of_death || "Date not specified"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{memorial.story}</p>
                {memorial.cause_of_death && (
                  <p className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                    <strong>Cause:</strong> {memorial.cause_of_death}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(memorial)} className="gap-2 flex-1">
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(memorial.id)} className="gap-2">
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
            <p>No memorials yet. Create your first one to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
