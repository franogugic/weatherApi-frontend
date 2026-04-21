import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react"
import { DEFAULT_LOCATION } from "@/entities/location/model/constants/DEFAULT_LOCATION"
import type { Location } from "@/entities/location/model/types"

export type LocationContextType = {
  selectedLocation: Location
  setSelectedLocation: (location: Location) => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)
const LOCATION_STORAGE_KEY = "selected-location"

function getInitialLocation() {
  const storedLocation = localStorage.getItem(LOCATION_STORAGE_KEY)

  if (!storedLocation) {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(DEFAULT_LOCATION))
    return DEFAULT_LOCATION
  }

  try {
    return JSON.parse(storedLocation) as Location
  } catch {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(DEFAULT_LOCATION))
    return DEFAULT_LOCATION
  }
}

export function LocationProvider({ children }: PropsWithChildren) {
  const [selectedLocation, setSelectedLocation] = useState<Location>(getInitialLocation)

  useEffect(() => {
    localStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify(selectedLocation),
    )
  }, [selectedLocation])

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)

  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider")
  }

  return context
}
