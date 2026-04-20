export type WeatherUnitMeta = {
  unitDisplayName: string
  unitDescription: string
}

export type WeatherMeta = {
  [key: string]: WeatherUnitMeta
}

export type WeatherForecastItem = {
  airPressureAtSeaLevel: number
  airTemperature: number
  cloudiness: number
  forecastTime: string
  humidity: number
  precipitationAmount: number
  weatherSymbol: string
  windDirection: number
  windSpeed: number
}

export type WeatherForecastResponse = {
  meta: WeatherMeta
  items: WeatherForecastItem[]
}
