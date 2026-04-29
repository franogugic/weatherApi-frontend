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
  label: string
  description: string
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
  { kind: WeatherKind; label: string; description: string }
> = {
  clearsky: {
    kind: "clearSky",
    label: "Clear sky",
    description: "Clear sky conditions",
  },
  fair: {
    kind: "fair",
    label: "Fair weather",
    description: "Mostly clear and pleasant weather",
  },
  partlycloudy: {
    kind: "partlyCloudy",
    label: "Partly cloudy",
    description: "Partly cloudy conditions",
  },
  cloudy: {
    kind: "cloudy",
    label: "Cloudy",
    description: "Cloudy conditions",
  },
  fog: {
    kind: "fog",
    label: "Fog",
    description: "Foggy conditions",
  },
}

const WEATHER_NOUNS: Record<Exclude<WeatherKind, "clearSky" | "fair" | "partlyCloudy" | "cloudy" | "fog" | "unknown">, string> = {
  rain: "rain",
  sleet: "sleet",
  snow: "snow",
}

function capitalizeWords(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase())
}

function getWeatherTimeSuffix(symbol: string) {
  const suffix = Object.keys(WEATHER_TIME_SUFFIXES).find((candidate) =>
    symbol.endsWith(candidate),
  )

  return suffix ?? null
}

function getTimeOfDayLabel(timeOfDay: WeatherTimeOfDay) {
  if (timeOfDay === "polarTwilight") {
    return "polar twilight"
  }

  return timeOfDay
}

function getFallbackWeatherInfo(symbol: string, timeOfDay: WeatherTimeOfDay): WeatherSymbolInfo {
  const readable = capitalizeWords(symbol.replaceAll("_", " "))
  const timeLabel = getTimeOfDayLabel(timeOfDay)

  return {
    symbol,
    baseSymbol: symbol,
    label: readable,
    description: timeLabel ? `${readable} during ${timeLabel}` : readable,
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
    const timeLabel = getTimeOfDayLabel(timeOfDay)

    return {
      symbol,
      baseSymbol,
      label: specialInfo.label,
      description: timeLabel
        ? `${specialInfo.description} during ${timeLabel}`
        : specialInfo.description,
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

  const intensityLabel = intensity ? `${intensity} ` : ""
  const noun = WEATHER_NOUNS[kind]
  const baseLabel = isShowers
    ? `${intensityLabel}${noun} showers`
    : `${intensityLabel}${noun}`
  const thunderLabel = hasThunder ? " and thunder" : ""
  const label = capitalizeWords(`${baseLabel}${thunderLabel}`)
  const timeLabel = getTimeOfDayLabel(timeOfDay)

  return {
    symbol,
    baseSymbol,
    label,
    description: timeLabel ? `${label} during ${timeLabel}` : label,
    timeOfDay,
    intensity,
    kind,
    isShowers,
    hasThunder,
  }
}
