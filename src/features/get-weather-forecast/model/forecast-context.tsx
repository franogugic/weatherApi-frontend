import type {
    WeatherForecastItem,
    WeatherMeta,
} from "@/entities/weather/model/types"
import { useLocation } from "@/features/location/model/location-context"
import { useForecastDays } from "@/features/selected-forecast-days/model/days-context"
import React, { createContext } from "react"
import { useWeatherForecast } from "./useWeatherForecast"

type ForecastData = {
    forecast: WeatherForecastItem[]
    meta: WeatherMeta
}

export type ForecastContextType = ForecastData
  & {
    isLoading: boolean
  }

const ForecastContext = createContext<ForecastContextType | undefined>(undefined)

export function ForecastProvider({ children }: React.PropsWithChildren) {
    const { selectedLocation } = useLocation()
    const { selectedForecastDays } = useForecastDays()
    const fetchedData = useWeatherForecast(selectedLocation.id, selectedForecastDays)

    return (
        <ForecastContext.Provider
            value={{
                forecast: fetchedData.forecast,
                meta: fetchedData.meta,
                isLoading: fetchedData.isLoading,
            }}
        >
            {children}
        </ForecastContext.Provider>
    )
}

export function useForecast() {
    const context = React.useContext(ForecastContext)

    if (!context) {
        throw new Error("useForecast must be used within a ForecastProvider")
    }

    return context
}
