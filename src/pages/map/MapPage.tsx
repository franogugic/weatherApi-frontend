import type { WeatherForecastResponse } from "@/entities/weather/model/types"
import { useLocationStore } from "@/features/location/model/location-store"
import { getLocationSlug } from "@/shared/lib/get-lcoation-slug"
import { MapView, type MapMarker } from "@/shared/ui/map/MapView"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type LocationPreview = {
  temperatureText: string
  weatherSymbol: string
}

export function MapPage() {
  const locations = useLocationStore((state) => state.locations)
  const [locationForecasts, setLocationForecasts] = useState<Record<number, LocationPreview>>({})

  const mapMarkers: MapMarker[] = locations.map((location) => ({
    ...location,
    temperatureText: locationForecasts[location.id]?.temperatureText,
    weatherSymbol: locationForecasts[location.id]?.weatherSymbol,
  }))

  useEffect(() => {
    async function fetchLocationForecasts() {
      if (!locations.length) {
        setLocationForecasts({})
        return
      }

      try {
        const forecastEntries: Array<readonly [number, LocationPreview] | null> = await Promise.all(
          locations.map(async (location) => {
            const response = await fetch(`${API_BASE_URL}/WeatherForecast?locationId=${location.id}`)
            const jsonData = (await response.json()) as WeatherForecastResponse
            const currentForecast = jsonData.items[0]

            if (!currentForecast) {
              return null
            }

            return [
              location.id,
              {
                temperatureText: `${currentForecast.airTemperature}${jsonData.meta.air_temperature?.unitDisplayName ?? "°C"}`,
                weatherSymbol: currentForecast.weatherSymbol,
              } satisfies LocationPreview,
            ] as const
          }),
        )

        setLocationForecasts(
          Object.fromEntries(
            forecastEntries.filter((entry): entry is readonly [number, LocationPreview] => entry !== null),
          ),
        )
      } catch (error) {
        console.error("Error fetching map forecasts:", error)
      }
    }

    void fetchLocationForecasts()
  }, [locations])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <h1 className="mb-4 text-xl font-bold sm:text-2xl">Map Page</h1>
      <div className="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row">
        <div className="min-h-[320px] overflow-hidden rounded-4xl md:min-h-[420px] xl:min-h-0 xl:flex-1">
          <MapView markers={mapMarkers} zoom={7} />
        </div>

        <div className="flex max-h-[360px] min-h-0 flex-col rounded-4xl bg-div p-4 sm:max-h-[420px] sm:p-6 xl:h-full xl:max-h-none xl:w-[320px] xl:shrink-0">
          <p className="mb-4 bg-linear-to-b from-lightBlue to-blue bg-clip-text text-center text-xl text-transparent sm:mb-6 sm:text-[26px]">
            Available locations
          </p>
          <ul className="min-h-0 flex-1 overflow-y-auto">
          {locations.map((location) => (
            <li key={location.id} >
              <NavLink to={`/dashboard/${getLocationSlug(location)}`} className="block border-y border-white/20 p-4 transition-colors hover:bg-white/8">
                <p className="mb-2 text-base font-semibold sm:text-[18px]">{location.name}</p>
                <p className="text-[14px] font-semibold"><span className="text-subtext  font-light">latitude:</span> {location.latitude}</p>
                <p className="text-[14px] font-semibold"><span className="text-subtext font-light">longitude:</span> {location.longitude}</p>
                <p className="text-[14px] font-semibold"><span className="text-subtext font-light">altitude:</span> {location.altitude}</p>
              </NavLink>
            </li>
          ))}
          </ul>
      </div>
      </div>
    </div>
  )
}
