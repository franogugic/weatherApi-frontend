import { create } from "zustand"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type WeatherChatRequest = {
  message: string
  locationId: number
  language?: string
}

type WeatherChatResponse = {
  answer: string
  locationName: string
  dataUpdatedAt: string | null
}

type WeatherChatStore = {
  isSending: boolean
  sendMessage: (request: WeatherChatRequest) => Promise<WeatherChatResponse>
}

export const useWeatherChatStore = create<WeatherChatStore>((set) => ({
  isSending: false,
  sendMessage: async (request) => {
    set({ isSending: true })

    try {
      const response = await fetch(`${API_BASE_URL}/WeatherChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null)
        const message = errorResponse?.message ?? "Weather assistant is unavailable."
        throw new Error(message)
      }

      return await response.json() as WeatherChatResponse
    } finally {
      set({ isSending: false })
    }
  },
}))
