import type { Location } from "@/entities/location/types"
import { create } from "zustand"
import { LAST_VIEWED_LOCATION_ID_KEY } from "./last-viewed-location"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type LocationStore = {
    selectedLocation: Location | null
    locations: Location[]
    isLoading: boolean
    setSelectedLocation: (location: Location | null) => void
    fetchLocations: () => Promise<void>
}

export const useLocationStore = create<LocationStore>((set) => ({
    selectedLocation: null,
    locations: [],
    isLoading: false,
    setSelectedLocation: (location) => set({ selectedLocation: location }),
    fetchLocations: async () => {
        set({ isLoading: true })

        try {
            const response = await fetch(`${API_BASE_URL}/WeatherForecast/locations`)
            const jsonData = (await response.json()) as Location[]
            const storedLocationId = localStorage.getItem(LAST_VIEWED_LOCATION_ID_KEY)

            if (!storedLocationId && jsonData[0]) {
                localStorage.setItem(LAST_VIEWED_LOCATION_ID_KEY, String(jsonData[0].id))
            }

            set({ locations: jsonData })
        } catch (error) {
            console.error("Error fetching locations:", error)
        } finally {
            set({ isLoading: false })
        }
    },
}))
