type Location = {
  id: number
  name: string
  latitude: number
  longitude: number
  altitude: number
  currentWeather?: {
    airTemperature: number | null
    weatherSymbol: string | null
  } | null
};

export type { Location }
