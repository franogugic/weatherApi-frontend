export type TimezoneOption = {
  value: string
  label: string
}

const fallbackTimezones = [
  "Etc/GMT+12",
  "Pacific/Pago_Pago",
  "Pacific/Honolulu",
  "Pacific/Marquesas",
  "America/Anchorage",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Halifax",
  "America/St_Johns",
  "America/Sao_Paulo",
  "Atlantic/South_Georgia",
  "Atlantic/Azores",
  "Europe/London",
  "Europe/Paris",
  "Europe/Zagreb",
  "Europe/Moscow",
  "Asia/Tehran",
  "Asia/Dubai",
  "Asia/Kabul",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Kathmandu",
  "Asia/Dhaka",
  "Asia/Yangon",
  "Asia/Bangkok",
  "Asia/Shanghai",
  "Australia/Eucla",
  "Asia/Tokyo",
  "Australia/Adelaide",
  "Australia/Sydney",
  "Australia/Lord_Howe",
  "Pacific/Noumea",
  "Pacific/Auckland",
  "Pacific/Chatham",
  "Pacific/Apia",
  "Pacific/Kiritimati",
]

function normalizeOffset(offset: string) {
  if (offset === "GMT") {
    return "UTC+00:00"
  }

  const normalized = offset.replace("GMT", "UTC")
  const match = normalized.match(/^UTC([+-])(\d{1,2})(?::(\d{2}))?$/)

  if (!match) {
    return normalized
  }

  const [, sign, hours, minutes = "00"] = match
  return `UTC${sign}${hours.padStart(2, "0")}:${minutes}`
}

function getTimezoneOffsetLabel(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    timeZoneName: "shortOffset",
    hour: "2-digit",
  }).formatToParts(new Date())

  const offset = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT"
  return normalizeOffset(offset)
}

function formatTimezoneLabel(timeZone: string) {
  const offset = getTimezoneOffsetLabel(timeZone)
  const location = timeZone.replaceAll("_", " ").replaceAll("/", " / ")

  return `${offset} · ${location}`
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = fallbackTimezones.map((timeZone) => ({
  value: timeZone,
  label: formatTimezoneLabel(timeZone),
}))

export const DEFAULT_TIMEZONE =
  fallbackTimezones.find(
    (timeZone) => timeZone === Intl.DateTimeFormat().resolvedOptions().timeZone,
  ) ?? "Europe/Zagreb"
