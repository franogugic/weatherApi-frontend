import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react"
import { DEFAULT_TIMEZONE } from "@/features/selected-timezone/model/timezones"

export type TimezoneContextType = {
  selectedTimezone: string
  setSelectedTimezone: (timezone: string) => void
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined)
const TIMEZONE_STORAGE_KEY = "selected-timezone"

function getInitialTimezone() {
  const storedTimezone = localStorage.getItem(TIMEZONE_STORAGE_KEY)

  if (!storedTimezone) {
    localStorage.setItem(TIMEZONE_STORAGE_KEY, DEFAULT_TIMEZONE)
    return DEFAULT_TIMEZONE
  }

  return storedTimezone
}

export function TimezoneProvider({ children }: PropsWithChildren) {
  const [selectedTimezone, setSelectedTimezone] = useState<string>(getInitialTimezone)

  useEffect(() => {
    localStorage.setItem(TIMEZONE_STORAGE_KEY, selectedTimezone)
  }, [selectedTimezone])

  return (
    <TimezoneContext.Provider
      value={{
        selectedTimezone,
        setSelectedTimezone,
      }}
    >
      {children}
    </TimezoneContext.Provider>
  )
}

export function useTimezone() {
  const context = useContext(TimezoneContext)

  if (!context) {
    throw new Error("useTimezone must be used within a TimezoneProvider")
  }

  return context
}
