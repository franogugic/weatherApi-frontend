import type { WeatherForecastItem, WeatherForecastResponse, WeatherMeta } from "@/entities/weather/model/types"
import { create } from "zustand"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type ForecastStore = {
    forecast: WeatherForecastItem[],
    meta: WeatherMeta
    isLoading: boolean
    loadedLocationId: number | null
    hasLoadedForecast: boolean
    clearForecast: () => void
    fetchForecast: (locationId: number) => Promise<void>
}

export const useForecastStore = create<ForecastStore>((set, get) => ({  
    forecast: [],
    meta: {},
    isLoading: false,
    loadedLocationId: null,
    hasLoadedForecast: false,
    clearForecast: () => set({ forecast: [], meta: {}, isLoading: false, loadedLocationId: null, hasLoadedForecast: false }),
    fetchForecast: async (locationId: number) => {
        const { forecast, loadedLocationId, isLoading } = get()

        if (loadedLocationId === locationId && forecast.length > 0) {
            return
        }

        if (loadedLocationId === locationId && isLoading) {
            return
        }

        set({ forecast: [], meta: {}, isLoading: true, hasLoadedForecast: false })
        try {
            const response = await fetch(`${API_BASE_URL}/WeatherForecast?locationId=${locationId}`)
            if (!response.ok) {
                set({ forecast: [], meta: {}, loadedLocationId: null, hasLoadedForecast: true })
                return
            }

            const jsonData = await response.json() as WeatherForecastResponse
            set({ forecast: jsonData.items, meta: jsonData.meta, loadedLocationId: locationId, hasLoadedForecast: true })
        } catch (error) {
            console.error("Error fetching forecast:", error)
            set({ forecast: [], meta: {}, loadedLocationId: null, hasLoadedForecast: true })
        } finally {
            set({ isLoading: false })
        }
    }
}));
