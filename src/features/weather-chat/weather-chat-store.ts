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
  source: string
}

export type WeatherChatMessage = {
  id: string
  role: "assistant" | "user"
  content: string
}

type WeatherChatStore = {
  isSending: boolean
  messagesByLocationId: Record<number, WeatherChatMessage[]>
  setLocationMessages: (locationId: number, messages: WeatherChatMessage[]) => void
  addLocationMessage: (locationId: number, message: WeatherChatMessage) => void
  sendMessage: (request: WeatherChatRequest) => Promise<WeatherChatResponse>
}

export const useWeatherChatStore = create<WeatherChatStore>((set) => ({
  isSending: false,
  messagesByLocationId: {},
  setLocationMessages: (locationId, messages) => set((state) => ({
    messagesByLocationId: {
      ...state.messagesByLocationId,
      [locationId]: messages,
    },
  })),
  addLocationMessage: (locationId, message) => set((state) => ({
    messagesByLocationId: {
      ...state.messagesByLocationId,
      [locationId]: [
        ...(state.messagesByLocationId[locationId] ?? []),
        message,
      ],
    },
  })),
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
