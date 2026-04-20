import type { WeatherForecastItem } from "@/entities/weather/model/types"

type NextHourlyPanelProps = {
  forecast: WeatherForecastItem[]
}

export function NextHourlysPanel( {forecast}: NextHourlyPanelProps) {
  
  return (
  <div className="row-span-2 bg-div rounded-4xl p-6">
    <div className="flex items-center justify-between mb-4">
      <p className="text-[22px] font-semibold">Next 12 Hours</p>
      <p className="text-[14px] underline cursor-pointer bg-linear-to-t from-blue to-lightBlue bg-clip-text text-transparent">See more</p>
    </div>

    <div className="flex items-center justify-between px-2 mb-2">
      <p className="text-[12px] text-subtext">Time</p>
      <p className="text-[12px] text-subtext">Weather</p>
      <p className="text-[12px] text-subtext">Temp</p>
    </div>

    {forecast.map((item, index) => (
      <div key={index} className="flex items-center justify-between rounded-full mb-1 px-2">
        <p className="font-light">{getHourFromForecastTime(item.forecastTime)}</p>
        <img
          src={`/${item.weatherSymbol}.svg`}
          alt="weather icon"
          className="w-10"
        />
        <p className="font-light">{item.airTemperature}°</p>
      </div>
    ))}

    <div className="bg-linear-to-b flex items-center justify-center from-lightBlue to-blue rounded-4xl py-2 mt-4 cursor-pointer">
      <p className="text-[18px] font-extralight">See all</p>
    </div>
  </div>
  )
}


function getHourFromForecastTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    hour12: false,
  })
}
