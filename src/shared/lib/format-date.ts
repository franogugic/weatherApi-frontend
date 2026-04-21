export function formatShortDate(date: Date, timeZone: string) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    timeZone,
  })
}
