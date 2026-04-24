export type ForecastDayOption = {
  value: number
  label: string
}

export const FORECAST_DAY_OPTIONS: ForecastDayOption[] = [
  { value: 1, label: "1 day" },
  { value: 2, label: "2 days" },
  { value: 3, label: "3 days" },
  { value: 4, label: "4 days" },
  { value: 5, label: "5 days" },
  { value: 6, label: "6 days" },
  { value: 7, label: "7 days" },
  { value: 8, label: "8 days" },
  { value: 9, label: "9 days" },
  { value: 10, label: "10 days" },
]

export const DEFAULT_FORECAST_DAYS = 3
