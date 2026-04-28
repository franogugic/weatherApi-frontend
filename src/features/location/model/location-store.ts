import { DEFAULT_LOCATION } from "@/entities/location/model/constants/DEFAULT_LOCATION"
import type { Location } from "@/entities/location/model/types"
import { create } from "zustand"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type LocationStore = {
    selectedLocation: Location
    locations: Location[]
    isLoading: boolean
    setSelectedLocation: (location: Location) => void
    fetchLocations: () => Promise<void>
}

export const useLocationStore = create<LocationStore>((set) => ({
    selectedLocation: DEFAULT_LOCATION ,
    locations: [],
    isLoading: false,
    setSelectedLocation: (location) => set({ selectedLocation: location }),
    fetchLocations: async () => {
        set({ isLoading: true })

        try {
            const response = await fetch(`${API_BASE_URL}/WeatherForecast/locations`)
            const jsonData = (await response.json()) as Location[]
            set((state) => ({
                locations: jsonData,
                selectedLocation:
                    state.selectedLocation.id === DEFAULT_LOCATION.id && jsonData.length > 0
                        ? jsonData[0]
                        : state.selectedLocation,
            }))
        } catch (error) {
            console.error("Error fetching locations:", error)
        } finally {
            set({ isLoading: false })
        }
    },
}))
