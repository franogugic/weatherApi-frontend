import i18n from "@/shared/i18n/i18n"
import { create } from "zustand"

type LanguageStore = {
    language: string
    setLanguage: (language: string) => void
}

export const useLanguageStore = create<LanguageStore>((set) => ({
    language: localStorage.getItem("language") || "en",
    setLanguage: (language) => {
        set({ language }),
        localStorage.setItem("language", language)
        void i18n.changeLanguage(language)
    }
}))