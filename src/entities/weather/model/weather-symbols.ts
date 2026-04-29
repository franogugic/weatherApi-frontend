type WeatherTimeOfDay = "day" | "night" | "polarTwilight" | null
type WeatherIntensity = "light" | "heavy" | null
type WeatherKind =
  | "clearSky"
  | "fair"
  | "partlyCloudy"
  | "cloudy"
  | "fog"
  | "rain"
  | "sleet"
  | "snow"
  | "unknown"

export type WeatherSymbolInfo = {
  symbol: string
  baseSymbol: string
  timeOfDay: WeatherTimeOfDay
  intensity: WeatherIntensity
  kind: WeatherKind
  isShowers: boolean
  hasThunder: boolean
}

const WEATHER_TIME_SUFFIXES: Record<string, WeatherTimeOfDay> = {
  "_day": "day",
  "_night": "night",
  "_polartwilight": "polarTwilight",
}

const SPECIAL_WEATHER_BASES: Record<
  string,
  { kind: WeatherKind }
> = {
  clearsky: {
    kind: "clearSky",
  },
  fair: {
    kind: "fair",
  },
  partlycloudy: {
    kind: "partlyCloudy",
  },
  cloudy: {
    kind: "cloudy",
  },
  fog: {
    kind: "fog",
  },
}

function getWeatherTimeSuffix(symbol: string) {
  const suffix = Object.keys(WEATHER_TIME_SUFFIXES).find((candidate) =>
    symbol.endsWith(candidate),
  )

  return suffix ?? null
}

function getFallbackWeatherInfo(symbol: string, timeOfDay: WeatherTimeOfDay): WeatherSymbolInfo {
  return {
    symbol,
    baseSymbol: symbol,
    timeOfDay,
    intensity: null,
    kind: "unknown",
    isShowers: false,
    hasThunder: false,
  }
}

export function getWeatherSymbolInfo(symbol: string): WeatherSymbolInfo {
  const timeSuffix = getWeatherTimeSuffix(symbol)
  const timeOfDay = timeSuffix ? WEATHER_TIME_SUFFIXES[timeSuffix] : null
  const baseSymbol = timeSuffix ? symbol.slice(0, -timeSuffix.length) : symbol

  const specialInfo = SPECIAL_WEATHER_BASES[baseSymbol]

  if (specialInfo) {
    return {
      symbol,
      baseSymbol,
      timeOfDay,
      intensity: null,
      kind: specialInfo.kind,
      isShowers: false,
      hasThunder: false,
    }
  }

  let normalizedBase = baseSymbol
  let hasThunder = false
  let isShowers = false
  let intensity: WeatherIntensity = null
  let kind: WeatherKind = "unknown"

  if (normalizedBase.endsWith("andthunder")) {
    hasThunder = true
    normalizedBase = normalizedBase.slice(0, -"andthunder".length)
  }

  if (normalizedBase.endsWith("showers")) {
    isShowers = true
    normalizedBase = normalizedBase.slice(0, -"showers".length)
  }

  if (normalizedBase === "lightrain") {
    intensity = "light"
    kind = "rain"
  } else if (normalizedBase === "heavyrain") {
    intensity = "heavy"
    kind = "rain"
  } else if (normalizedBase === "rain") {
    kind = "rain"
  } else if (normalizedBase === "lightsleet" || normalizedBase === "lightssleet") {
    intensity = "light"
    kind = "sleet"
  } else if (normalizedBase === "heavysleet") {
    intensity = "heavy"
    kind = "sleet"
  } else if (normalizedBase === "sleet") {
    kind = "sleet"
  } else if (normalizedBase === "lightsnow" || normalizedBase === "lightssnow") {
    intensity = "light"
    kind = "snow"
  } else if (normalizedBase === "heavysnow") {
    intensity = "heavy"
    kind = "snow"
  } else if (normalizedBase === "snow") {
    kind = "snow"
  }

  if (kind === "unknown") {
    return getFallbackWeatherInfo(symbol, timeOfDay)
  }

  return {
    symbol,
    baseSymbol,
    timeOfDay,
    intensity,
    kind,
    isShowers,
    hasThunder,
  }
}
