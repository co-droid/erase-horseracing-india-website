"use client"

import { useEffect, useRef } from "react"
import type { Racetrack } from "@/lib/types"

// Dynamically import L only on client
let L: any = null

export function RacetrackMapLeaflet({ racetracks }: { racetracks: Racetrack[] }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    // Import Leaflet only on client side
    import("leaflet").then((module) => {
      L = module.default
      initializeMap()
    })

    const initializeMap = () => {
      if (!mapContainer.current || !L || map.current) return

      // Initialize map centered on India
      map.current = L.map(mapContainer.current).setView([20.5937, 78.9629], 5)

      // Add tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map.current)

      // Add markers for each racetrack
      racetracks.forEach((track) => {
        if (!map.current || !track.latitude || !track.longitude) return

        const lat = track.latitude
        const lng = track.longitude
        const deaths = track.total_deaths

        // Create custom icon with death count
        const iconColor = deaths > 300 ? "#dc2626" : deaths > 150 ? "#ea580c" : "#f97316"

        const customIcon = L.divIcon({
          html: `
            <div style="
              background-color: ${iconColor};
              color: white;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 14px;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              ${deaths}
            </div>
          `,
          iconSize: [50, 50],
          className: "custom-marker",
        })

        // Create marker
        const marker = L.marker([lat, lng], { icon: customIcon })
          .addTo(map.current)
          .bindPopup(`
            <div style="font-family: system-ui, sans-serif; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
                ${track.name}
              </h3>
              <p style="margin: 4px 0; color: #666; font-size: 14px;">
                <strong>State:</strong> ${track.state || "Unknown"}
              </p>
              <p style="margin: 4px 0; color: #dc2626; font-size: 14px; font-weight: bold;">
                <strong>Documented Deaths:</strong> ${track.total_deaths}
              </p>
            </div>
          `)

        // Highlight on hover
        marker.on("mouseover", function (this: any) {
          this.openPopup()
        })
        marker.on("mouseout", function (this: any) {
          // Keep popup open if user hovers near it
        })
      })
    }

    return () => {
      // Cleanup
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [racetracks])

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "0.5rem",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}
    />
  )
}
