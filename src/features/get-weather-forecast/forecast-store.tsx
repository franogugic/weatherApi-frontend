import type { WeatherForecastItem, WeatherForecastResponse, WeatherMeta } from "@/entities/weather/model/types"
import { create } from "zustand"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type ForecastStore = {
    forecast: WeatherForecastItem[],
    meta: WeatherMeta
    isLoading: boolean
    fetchForecast: (locationId: number) => Promise<void>
}

export const useForecastStore = create<ForecastStore>((set) => ({  
    forecast: [],
    meta: {},
    isLoading: false,
    fetchForecast: async (locationId: number) => {
        set({ isLoading: true })
        try {
            const response = await fetch(`${API_BASE_URL}/WeatherForecast?locationId=${locationId}`)
            const jsonData = await response.json() as WeatherForecastResponse
            set({ forecast: jsonData.items, meta: jsonData.meta })
        } catch (error) {
            console.error("Error fetching forecast:", error)
        } finally {
            set({ isLoading: false })
        }
    }
}));