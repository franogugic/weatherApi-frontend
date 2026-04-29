export const CROATIA_TIME_ZONE = "Europe/Zagreb"

export function capitalizeFirstLetter(value: string) {
  if (!value) {
    return value
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatShortDate(date: Date, locale = "en-GB") {
  // tipa 02 May 24
  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    timeZone: CROATIA_TIME_ZONE,
  })
}
