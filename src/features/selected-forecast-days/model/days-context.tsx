import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react"
import {
  DEFAULT_FORECAST_DAYS,
  FORECAST_DAY_OPTIONS,
} from "@/features/selected-forecast-days/model/days"

export type ForecastDaysContextType = {
  selectedForecastDays: number
  setSelectedForecastDays: (days: number) => void
}

const ForecastDaysContext = createContext<ForecastDaysContextType | undefined>(undefined)
const FORECAST_DAYS_STORAGE_KEY = "selected-forecast-days"

function getInitialForecastDays() {
  const storedValue = localStorage.getItem(FORECAST_DAYS_STORAGE_KEY)
  const parsedValue = storedValue ? Number(storedValue) : NaN
  const isValidOption = FORECAST_DAY_OPTIONS.some((option) => option.value === parsedValue)

  if (!isValidOption) {
    localStorage.setItem(FORECAST_DAYS_STORAGE_KEY, String(DEFAULT_FORECAST_DAYS))
    return DEFAULT_FORECAST_DAYS
  }

  return parsedValue
}

export function ForecastDaysProvider({ children }: PropsWithChildren) {
  const [selectedForecastDays, setSelectedForecastDays] = useState<number>(getInitialForecastDays)

  useEffect(() => {
    localStorage.setItem(FORECAST_DAYS_STORAGE_KEY, String(selectedForecastDays))
  }, [selectedForecastDays])

  return (
    <ForecastDaysContext.Provider
      value={{
        selectedForecastDays,
        setSelectedForecastDays,
      }}
    >
      {children}
    </ForecastDaysContext.Provider>
  )
}

export function useForecastDays() {
  const context = useContext(ForecastDaysContext)

  if (!context) {
    throw new Error("useForecastDays must be used within a ForecastDaysProvider")
  }

  return context
}
