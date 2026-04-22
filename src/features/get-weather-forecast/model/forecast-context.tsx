import type {
    WeatherForecastItem,
    WeatherForecastResponse,
    WeatherMeta,
} from "@/entities/weather/model/types"
import { useLocation } from "@/features/selected-location/model/location-context"
import React, { createContext, useEffect } from "react"

type ForecastData = {
    forecast: WeatherForecastItem[]
    meta: WeatherMeta
}

export type ForecastContextType = {
    forecast: WeatherForecastItem[]
    meta: WeatherMeta
    setForecast: (data: ForecastData) => void
}

const ForecastContext = createContext<ForecastContextType | undefined>(undefined)

export function ForecastProvider({ children }: React.PropsWithChildren) {
    const { selectedLocation } = useLocation()
    const [forecastData, setForecastData] = React.useState<ForecastData>({
        forecast: [],
        meta: {},
    })

    const setForecast = (data: ForecastData) => {
        setForecastData(data)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/WeatherForecast?locationId=${selectedLocation.id}&days=10`,
                )
                const jsonData = (await response.json()) as WeatherForecastResponse
                setForecast({
                    forecast: jsonData.items,
                    meta: jsonData.meta,
                })
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        void fetchData()
    }, [selectedLocation.id])

    return (
        <ForecastContext.Provider
            value={{
                forecast: forecastData.forecast,
                meta: forecastData.meta,
                setForecast,
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
