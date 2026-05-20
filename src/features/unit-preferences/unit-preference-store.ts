import { create } from "zustand"
import { API_BASE_URL } from "@/shared/config/api"
import { getAuthHeaders } from "@/shared/config/auth-token"
import type { UnitPreferences, UnitPreferenceStore } from "./unit-preferences-types"
import { getAuthErrorMessage } from "../auth/auth-error"

const DEFAULT_UNIT_PREFERENCES: UnitPreferences = {
  temperatureUnit: "celsius",
  windSpeedUnit: "metersPerSecond",
  pressureUnit: "hectopascal",
  cloudinessUnit: "percent",
  precipitationUnit: "millimeter",
}

function applyPreferences(preferences: UnitPreferences) {
  return {
    preferences,
    hasLoadedPreferences: true,
  }
}

export const useUnitPreferenceStore = create<UnitPreferenceStore>((set, get) => ({
  preferences: DEFAULT_UNIT_PREFERENCES,
  isLoadingPreferences: false,
  hasLoadedPreferences: false,
  setPreference: (key, value) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        [key]: value,
      },
    })),
  setPreferences: (preferences) =>
    set({
      preferences,
      hasLoadedPreferences: true,
    }),
  loadPreferences: async () => {
    set({ isLoadingPreferences: true })

    try {
      const response = await fetch(`${API_BASE_URL}/user-preferences`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        set({ isLoadingPreferences: false, hasLoadedPreferences: true })
        return null
      }

      const preferences = await response.json() as UnitPreferences
      set({
        ...applyPreferences(preferences),
        isLoadingPreferences: false,
      })

      return preferences
    } catch (error) {
      console.error("Error loading user preferences:", error)
      set({ isLoadingPreferences: false, hasLoadedPreferences: true })
      return null
    }
  },
  updatePreferences: async (preferences) => {
    const previousPreferences = get().preferences

    set(applyPreferences(preferences))

    const response = await fetch(`${API_BASE_URL}/user-preferences`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(preferences),
    })

    if (!response.ok) {
      const errorResponse = await response.json().catch(() => null)
      set(applyPreferences(previousPreferences))
      throw new Error(getAuthErrorMessage(errorResponse, "Could not update preferences."))
    }

    const updatedPreferences = await response.json() as UnitPreferences
    set(applyPreferences(updatedPreferences))

    return updatedPreferences
  },
}))
