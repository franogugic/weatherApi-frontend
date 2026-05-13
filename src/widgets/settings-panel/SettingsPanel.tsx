import type { User } from "@/entities/user/types"
import { useAuthStore } from "@/features/auth/auth-store"
import { LANGUAGE_OPTIONS } from "@/features/language/language-options"
import { useLanguageStore } from "@/features/language/language-store"
import { Check, Globe2, LogOut, Settings } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"

type SettingsPanelProps = {
  user: User | null
}

export function SettingsPanel({ user }: SettingsPanelProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        event.target instanceof Node &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  async function handleLogout() {
    await logout()
    setIsUserMenuOpen(false)
    navigate("/")
  }

  return (
    <div className="flex justify-end gap-4">
      <div>
        {user ? (
          <div ref={userMenuRef} className="relative">
            <div className="flex items-center justify-center gap-2">
              <p className="pt-1 text-[16px] font-light text-white">
                <span className="text-[20px] font-extralight">{user.firstName} {user.lastName}</span>
              </p>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((current) => !current)}
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-accent-secondary to-accent-primary text-white transition hover:brightness-110"
                aria-expanded={isUserMenuOpen}
                aria-label={t("settings.title")}
              >
                <span className="text-[26px] font-black">{user.firstName[0]}</span>
              </button>
            </div>

            {isUserMenuOpen ? (
              <div className="absolute right-0 top-full z-[9999] mt-2 w-72 overflow-hidden rounded-3xl border border-white/10 bg-[#1F2026]/95 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl">
                <div className="mb-1 rounded-2xl bg-white/5 px-3 py-3">
                  <p className="text-[13px] font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-[11px] text-white/45">{user.email}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    navigate("/settings")
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-white/62 transition hover:bg-white/7 hover:text-white"
                >
                  <Settings size={16} className="text-accent-primary" />
                  <span className="text-[13px] font-semibold">{t("common.settings")}</span>
                </button>

                <div className="my-1 border-t border-white/10" />

                <div className="px-3 py-2">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
                    <Globe2 size={13} />
                    {t("common.language")}
                  </div>
                  <div className="space-y-1">
                    {LANGUAGE_OPTIONS.map((option) => {
                      const isSelected = option.value === language

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setLanguage(option.value)}
                          className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left transition ${
                            isSelected
                              ? "bg-linear-to-br from-accent-secondary/22 to-accent-primary/18 text-white"
                              : "text-white/62 hover:bg-white/7 hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-2 text-[13px] font-semibold">
                            <span>{option.flag}</span>
                            {option.label}
                          </span>
                          {isSelected ? (
                            <span className="flex size-6 items-center justify-center rounded-full bg-linear-to-br from-accent-secondary to-accent-primary text-white">
                              <Check size={13} />
                            </span>
                          ) : null}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="my-1 border-t border-white/10" />

                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-red-300/85 transition hover:bg-red-500/10 hover:text-red-200"
                >
                  <LogOut size={16} />
                  <span className="text-[13px] font-semibold">{t("common.logout")}</span>
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-2xl border border-white/10 px-4 py-2 text-[14px] font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
            >
              {t("common.login")}
            </Link>
            <Link
              to="/register"
              className="rounded-2xl bg-linear-to-b from-accent-secondary to-accent-primary px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              {t("common.register")}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
