import { CloudRain, Droplets, MapPin, Wind } from "lucide-react"
import type {
  WeatherForecastItem,
  WeatherMeta,
} from "@/entities/weather/model/types"
import { WeatherStat } from "@/entities/weather/ui/WeatherStat"
import { formatShortDate } from "@/shared/lib/format-date"
import { useLocation } from "@/features/selected-location/model/location-context"
import { useTimezone } from "@/features/selected-timezone/model/timezone-context"

type CurrentForecastPanelProps = {
  forecast: WeatherForecastItem
  meta: WeatherMeta
}


export function CurrentForecastPanel({
  forecast,
  meta,
}: CurrentForecastPanelProps) {
  const { selectedTimezone } = useTimezone()
  const formattedDate = formatShortDate(new Date(), selectedTimezone)
  const locationName =  useLocation().selectedLocation.name
  return (
    <div className="row-span-2 flex flex-col justify-between bg-linear-to-b from-lightBlue to-blue rounded-4xl p-6">
      <div className="text-[14px]">
        <p>Today, {formattedDate}</p>
        <div className="flex cursor-pointer items-center gap-1 text-[14px] font-bold">
          <MapPin className="w-6" />
          <p>{locationName} &#9662;</p>
        </div>
      </div>

      <div className="mx-auto text-center">
        <div className="translate-y-5 text-6xl font-bold flex gap-1">
          <p>
            {forecast.airTemperature} 
          </p>
          <p className="text-4xl font-semibold">
            {meta.air_temperature?.unitDisplayName}
          </p>
        </div>
        <img
          src={`/${forecast.weatherSymbol}.svg`}
          alt="weather icon"
          className="w-46 mx-auto -translate-y-8"
        />
      </div>

      <div className="mx-auto flex w-full">
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
