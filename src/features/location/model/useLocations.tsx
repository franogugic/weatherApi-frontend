import { useEffect, useState } from "react"
import type { Location } from "@/entities/location/model/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true)

      try {
        const response = await fetch(`${API_BASE_URL}/WeatherForecast/locations`)
        const jsonData = (await response.json()) as Location[]
        setLocations(jsonData)
      } catch (error) {
        console.error("Error fetching locations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchLocations()
  }, [])

  return {
    locations,
    isLoading,
  }
}
