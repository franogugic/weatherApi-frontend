import { useEffect, useState } from "react"
import type { Location } from "@/entities/location/model/types"

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/weatherForecast/locations")
        const jsonData = (await response.json()) as Location[]
        setLocations(jsonData)
      } catch (error) {
        console.error("Error fetching locations:", error)
      }
    }

    void fetchLocations()
  }, [])

  return locations
}
