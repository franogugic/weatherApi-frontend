import { CloudRain, Droplets, MapPin, Wind } from "lucide-react"
import type {
  WeatherForecastItem,
  WeatherMeta,
} from "@/entities/weather/model/types"
import { WeatherStat } from "@/entities/weather/ui/WeatherStat"
import { formatShortDate } from "@/shared/lib/format-date"
import { useLocation } from "@/features/location/model/location-context"

type CurrentForecastPanelProps = {
  forecast: WeatherForecastItem
  meta: WeatherMeta
}


export function CurrentForecastPanel({
  forecast,
  meta,
}: CurrentForecastPanelProps) {
  const formattedDate = formatShortDate(new Date())
  const locationName =  useLocation().selectedLocation.name
  return (
    <div className="xl:row-span-2 flex min-w-0 flex-col justify-between rounded-4xl bg-linear-to-b from-lightBlue to-blue p-6">
      <div className="text-[14px]">
        <p>Today, {formattedDate}</p>
        <div className="flex flex-wrap items-center gap-1 text-[14px] font-bold">
          <MapPin className="w-6" />
          <p className="break-words">{locationName}</p>
        </div>
      </div>

      <div className="mx-auto text-center">
        <div className="flex translate-y-2 flex-wrap items-end justify-center gap-1 text-5xl font-bold 2xl:text-6xl">
          <p className="text-6xl font-bold 2xl:text-7xl">
            {forecast.airTemperature} 
          </p>
          <p className="text-3xl font-semibold 2xl:text-4xl">
            {meta.air_temperature?.unitDisplayName}
          </p>
        </div>
        <img
          src={`/${forecast.weatherSymbol}.svg`}
          alt="weather icon"
          className="w-46 mx-auto -translate-y-8"
        />
      </div>

      <div className="mx-auto flex w-full flex-wrap gap-y-4 xl:flex-nowrap">
        <WeatherStat
          icon={<Wind size={34} />}
          value={forecast.windSpeed}
          unit={meta.wind_speed?.unitDisplayName}
          label="Wind"
          showDivider
        />
        <WeatherStat
          icon={<Droplets size={34} />}
          value={forecast.humidity}
          unit={meta.relative_humidity?.unitDisplayName}
          label="Humidity"
          showDivider
        />
        <WeatherStat
          icon={<CloudRain size={34} />}
          value={forecast.precipitationAmount}
          unit={meta.precipitation_amount?.unitDisplayName}
          label="Precipitation"
        />
      </div>
    </div>
  )
}
