export function formatShortDate(date: Date, locale = "en-GB") {
  // tipa 02 May 24
  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  })
}
