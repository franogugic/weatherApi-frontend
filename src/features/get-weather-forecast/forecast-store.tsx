import type { WeatherForecastItem, WeatherForecastResponse, WeatherMeta } from "@/entities/weather/model/types"
import { API_BASE_URL } from "@/shared/config/api"
import { create } from "zustand"

type ForecastStore = {
    forecast: WeatherForecastItem[],
    meta: WeatherMeta
    isLoading: boolean
    loadedLocationId: number | null
    clearForecast: () => void
    fetchForecast: (locationId: number) => Promise<void>
}

export const useForecastStore = create<ForecastStore>((set, get) => ({  
    forecast: [],
    meta: {},
    isLoading: false,
    loadedLocationId: null,
    clearForecast: () => set({ forecast: [], meta: {}, isLoading: false, loadedLocationId: null }),
    fetchForecast: async (locationId: number) => {
        const { forecast, loadedLocationId, isLoading } = get()

        if (loadedLocationId === locationId && forecast.length > 0) {
            return
        }

        if (loadedLocationId === locationId && isLoading) {
            return
        }

        set({ forecast: [], meta: {}, isLoading: true })
        try {
            const response = await fetch(`${API_BASE_URL}/WeatherForecast?locationId=${locationId}`)
            if (!response.ok) {
                set({ forecast: [], meta: {}, loadedLocationId: null })
                return
            }

            const jsonData = await response.json() as WeatherForecastResponse
            set({ forecast: jsonData.items, meta: jsonData.meta, loadedLocationId: locationId })
        } catch (error) {
            console.error("Error fetching forecast:", error)
            set({ forecast: [], meta: {}, loadedLocationId: null })
        } finally {
            set({ isLoading: false })
        }
    }
}));
