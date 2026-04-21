export function parseForecastDate(dateString: string) {
  const hasTimezoneInfo = /(?:Z|[+-]\d{2}:\d{2})$/.test(dateString)

  return new Date(hasTimezoneInfo ? dateString : `${dateString}Z`)
}
