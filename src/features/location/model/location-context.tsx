import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react"
import { DEFAULT_LOCATION } from "@/entities/location/model/constants/DEFAULT_LOCATION"
import type { Location } from "@/entities/location/model/types"
import { useLocations } from "./useLocations"

export type LocationContextType = {
  selectedLocation: Location
  locations: Location[]
  isLoading: boolean
  setSelectedLocation: (location: Location) => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)
const LOCATION_STORAGE_KEY = "selected-location"

// postavljanje lokacije pri pocetku cita iz storagea ako psotji
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
  const { locations, isLoading } = useLocations()

  useEffect(() => {
    localStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify(selectedLocation),
    )
  }, [selectedLocation])

  return (
    <LocationContext.Provider
      value={{
        locations: locations.length ? locations : [DEFAULT_LOCATION],
        isLoading,
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
