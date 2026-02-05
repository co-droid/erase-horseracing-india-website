"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function PledgeForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setError("")

    const supabase = createClient()

    try {
      // Save pledge to database
      const { error: insertError } = await supabase.from("pledges").insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        city: formData.city || null,
        message: formData.message || null,
      })

      if (insertError) throw insertError

      // Send confirmation email
      const emailResponse = await fetch("/api/email/pledge-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
        }),
      })

      if (!emailResponse.ok) {
        console.error("Email sending failed, but pledge was recorded")
      }

      setStatus("success")
      // Redirect to success page after a brief delay
      setTimeout(() => {
        router.push("/pledge/success")
      }, 1500)
    } catch (err) {
      console.error("Pledge submission error:", err)
      setError("Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (status === "success") {
    return (
      <Card className="border-2 border-primary">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-serif text-2xl font-bold">Thank You for Taking the Pledge!</h3>
          <p className="text-muted-foreground">Redirecting you...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              disabled={status === "loading"}
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={status === "loading"}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={status === "loading"}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City (Optional)</Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                disabled={status === "loading"}
                placeholder="Your city"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Why are you taking this pledge? (Optional)</Label>
            <Textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              disabled={status === "loading"}
              placeholder="Share your reason for supporting this cause..."
            />
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting Pledge...
              </>
            ) : (
              "Sign the Pledge"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By signing, you agree to receive occasional updates about our campaigns. You can unsubscribe anytime.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
