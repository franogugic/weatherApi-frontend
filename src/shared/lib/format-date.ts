export function formatShortDate(date: Date) {
  // tipa 02 May 24
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  })
}
