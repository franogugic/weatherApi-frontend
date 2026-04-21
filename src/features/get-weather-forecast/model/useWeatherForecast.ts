import { useEffect, useState } from "react"
import type { WeatherForecastResponse } from "@/entities/weather/model/types"

export function useWeatherForecast(locationId: number) {
  const [data, setData] = useState<WeatherForecastResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/WeatherForecast?locationId=${locationId}`,
        )
        const jsonData = (await response.json()) as WeatherForecastResponse
        setData(jsonData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    void fetchData()
  }, [locationId])

  return data
}
