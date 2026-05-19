type Location = {
  id: number
  name: string
  latitude: number
  longitude: number
  altitude: number | null
  currentWeather?: {
    airTemperature: number | null
    weatherSymbol: string | null
  } | null
};

export type { Location }
