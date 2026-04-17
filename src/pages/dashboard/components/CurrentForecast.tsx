type CurrentForecastPropsWUnits = {
  forecast?: {
    airPressureAtSeaLevel: number
    airTemperature: number
    cloudiness: number
    forecastTime: string
    humidity: number
    precipitationAmount: number
    weatherSymbol: string
    windDirection: number
    windSpeed: number
  },
  meta: {
  [key: string]: {
    unitDisplayName: string
    unitDescription: string
  }
}
}

export function CurrentForecast({forecast, meta}: CurrentForecastPropsWUnits) {
  console.log("forecast: ", forecast)
  console.log("units: ", meta)
  return <div className="row-span-2 bg-linear-to-b from-[#6fbcff] to-[#4974ef]">
    <p>{forecast.airTemperature} {meta.air_temperature?.unitDisplayName}</p>
    <img src={`/${forecast.weatherSymbol}.svg`} alt="weather icon" />
  </div>
}
