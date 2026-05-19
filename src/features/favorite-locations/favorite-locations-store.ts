import { create } from "zustand"
import type { Location } from "@/entities/location/types"
import { API_BASE_URL } from "@/shared/config/api";

type FavoriteLocationStore = {
    favoriteLocations: Location[],
    isLoadingFavorites: boolean,
    hasLoadedFavorites: boolean,
    loadFavoriteLocations: () => Promise<void>
    clearFavoriteLocations: () => void
    addFavoriteLocation: (locationId: number) => Promise<void>
    removeFavoriteLocation: (locationId: number) => Promise<void>
}

export const useFavoriteLocationStore = create<FavoriteLocationStore>((set) => ({
    favoriteLocations: [],
    isLoadingFavorites: false,
    hasLoadedFavorites: false,
    loadFavoriteLocations: async () => {
        set({isLoadingFavorites: true})
        try{

            var response = await fetch(`${API_BASE_URL}/user-favorite-locations`, {
                method: "GET",
                credentials: "include"
            })
            
            if(!response.ok){
                set({isLoadingFavorites: false, hasLoadedFavorites: true})
                return;
            }
            
            var jsonData = await response.json() as Location[]
            set({favoriteLocations: jsonData, isLoadingFavorites:false, hasLoadedFavorites: true})
        } catch {
            set({ favoriteLocations: [], isLoadingFavorites: false, hasLoadedFavorites: true })
            return
        }
    },
    clearFavoriteLocations: () => {
        set({ favoriteLocations: [], isLoadingFavorites: false, hasLoadedFavorites: false })
    },
    addFavoriteLocation: async (locationId) => {
        var response = await fetch(`${API_BASE_URL}/user-favorite-locations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ locationId }),
        })

        if (!response.ok) {
            throw new Error("Could not add favorite location.")
        }

        var addedLocation = await response.json() as Location
        set((state) => ({
            favoriteLocations: state.favoriteLocations.some((location) => location.id === addedLocation.id)
                ? state.favoriteLocations
                : [...state.favoriteLocations, addedLocation],
        }))
    },
    removeFavoriteLocation: async (locationId) => {
        var response = await fetch(`${API_BASE_URL}/user-favorite-locations/${locationId}`, {
            method: "DELETE",
            credentials: "include",
        })

        if (!response.ok) {
            throw new Error("Could not remove favorite location.")
        }

        set((state) => ({
            favoriteLocations: state.favoriteLocations.filter((location) => location.id !== locationId),
        }))
    }
}))
