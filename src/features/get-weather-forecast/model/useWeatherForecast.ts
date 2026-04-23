import { useEffect } from "react"
import type { WeatherForecastResponse } from "@/entities/weather/model/types"
import { useForecast } from "./forecast-context"

export function useWeatherForecast(locationId: number) {
  const {setForecast} = useForecast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/WeatherForecast?locationId=${locationId}`,
        )
        const jsonData = (await response.json()) as WeatherForecastResponse
        setForecast({
          forecast: jsonData.items,
          meta: jsonData.meta,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    void fetchData()
  }, [locationId])

}
