import { useLocationStore } from "@/features/location/location-store"
import { useWeatherChatStore } from "@/features/weather-chat/weather-chat-store"
import type { WeatherChatMessage } from "@/features/weather-chat/weather-chat-store"
import { Bot, CloudSun, Send, UserRound } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function WeatherChatPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const selectedLocation = useLocationStore((state) => state.selectedLocation)
  const sendMessage = useWeatherChatStore((state) => state.sendMessage)
  const isSending = useWeatherChatStore((state) => state.isSending)
  const messagesByLocationId = useWeatherChatStore((state) => state.messagesByLocationId)
  const setLocationMessages = useWeatherChatStore((state) => state.setLocationMessages)
  const addLocationMessage = useWeatherChatStore((state) => state.addLocationMessage)
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)
  const locationId = Number(id)

  const initialMessage = useMemo<WeatherChatMessage>(() => ({
    id: "initial",
    role: "assistant",
    content: t("weatherChat.initialMessage", {
      location: selectedLocation?.name ?? t("forecast.locationUnavailable"),
    }),
  }), [selectedLocation?.name, t])

  const messages = Number.isInteger(locationId) && locationId > 0
    ? messagesByLocationId[locationId] ?? []
    : []

  useEffect(() => {
    if (Number.isInteger(locationId) && locationId > 0 && !messagesByLocationId[locationId]) {
      setLocationMessages(locationId, [initialMessage])
    }
  }, [initialMessage, locationId, messagesByLocationId, setLocationMessages])

  useEffect(() => {
    setError(null)
    setDraft("")
  }, [locationId])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const message = draft.trim()
    if (!message || isSending || !Number.isInteger(locationId) || locationId <= 0) {
      return
    }

    setError(null)
    setDraft("")
    addLocationMessage(locationId, { id: createMessageId(), role: "user", content: message })

    try {
      const response = await sendMessage({
        message,
        locationId,
        language: i18n.language,
      })

      addLocationMessage(locationId, { id: createMessageId(), role: "assistant", content: response.answer })
    } catch (sendError) {
      const fallbackMessage = sendError instanceof Error
        ? sendError.message
        : t("weatherChat.error")

      setError(fallbackMessage)
      addLocationMessage(locationId, { id: createMessageId(), role: "assistant", content: t("weatherChat.error") })
    }
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-col rounded-4xl bg-div p-4 sm:p-6 lg:h-full">
      <header className="mb-5 flex shrink-0 flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-accent-secondary">
            <CloudSun size={18} />
            <span>{t("weatherChat.eyebrow")}</span>
          </div>
          <h2 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">
            {selectedLocation?.name ?? t("forecast.locationUnavailable")}
          </h2>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">
          {t("weatherChat.dataSource")}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="flex flex-col gap-4">
          {messages.map((message) => {
            const isUser = message.role === "user"
            const Icon = isUser ? UserRound : Bot

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser ? (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-primary/20 text-accent-secondary">
                    <Icon size={20} />
                  </div>
                ) : null}
                <div
                  className={`max-w-[min(760px,calc(100%-3rem))] rounded-[22px] px-4 py-3 text-sm leading-6 shadow-[0_10px_28px_rgba(0,0,0,0.22)] sm:text-base ${
                    isUser
                      ? "bg-accent-primary text-white"
                      : "border border-white/10 bg-[#25272d] text-white/90"
                  }`}
                >
                  {message.content}
                </div>
                {isUser ? (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                    <Icon size={20} />
                  </div>
                ) : null}
              </div>
            )
          })}

          {isSending ? (
            <div className="flex items-center gap-3 text-sm text-white/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-primary/20 text-accent-secondary">
                <Bot size={20} />
              </div>
              <span>{t("weatherChat.thinking")}</span>
            </div>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 flex shrink-0 gap-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t("weatherChat.placeholder")}
          className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#25272d] px-4 py-3 text-white outline-none transition placeholder:text-white/45 focus:border-accent-secondary"
        />
        <button
          type="submit"
          disabled={!draft.trim() || isSending}
          aria-label={t("weatherChat.send")}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-primary text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}
