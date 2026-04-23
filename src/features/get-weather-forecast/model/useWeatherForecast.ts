import { useEffect, useState } from "react"
import type { WeatherForecastResponse } from "@/entities/weather/model/types"

type UseWeatherForecastResult = {
  forecast: WeatherForecastResponse["items"]
  meta: WeatherForecastResponse["meta"]
  isLoading: boolean
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const DEFAULT_FORECAST_DAYS = Number(import.meta.env.VITE_FORECAST_DAYS ?? 10)

export function useWeatherForecast(locationId: number, days = DEFAULT_FORECAST_DAYS) {
  const [data, setData] = useState<UseWeatherForecastResult>({
    forecast: [],
    meta: {},
    isLoading: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      setData((current) => ({
        ...current,
        isLoading: true,
      }))

      try {
        const response = await fetch(
          `${API_BASE_URL}/WeatherForecast?locationId=${locationId}&days=${days}`,
        )
        const jsonData = (await response.json()) as WeatherForecastResponse
        setData({
          forecast: jsonData.items,
          meta: jsonData.meta,
          isLoading: false,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        setData({
          forecast: [],
          meta: {},
          isLoading: false,
        })
      }
    }

    void fetchData()
  }, [days, locationId])

  return data
}
