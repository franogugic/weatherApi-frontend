import { useAuthStore } from "@/features/auth/auth-store"
import { useUnitPreferenceStore } from "@/features/unit-preferences/unit-preference-store"
import { LAST_VIEWED_LOCATION_ID_KEY } from "@/features/location/last-viewed-location"
import { AuthInput } from "@/shared/ui/auth-input/AuthInput"
import { Lock, Mail } from "lucide-react"
import { useMemo, useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"

export function LoginPage(){
    const { t } = useTranslation()
    const login = useAuthStore((state) => state.login)
    const loadPreferences = useUnitPreferenceStore((state) => state.loadPreferences)
    const navigate = useNavigate()
    const [email, setEmail] = useState("root@root.com")
    const [password, setPassword] = useState("Root1234")
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
     
    const isFormValid = useMemo(() => {
        const normalizedEmail = email.trim()
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)

        return isEmailValid && password.trim().length >= 8
    }, [email, password])

    async function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()

        if (!isFormValid || isSubmitting) {
            return
        }

        setIsSubmitting(true)
        setErrorMessage("")
        setSuccessMessage("")
        
        try {
            await login({
                email: email.trim(),
                password,
            })
            await loadPreferences()

            setSuccessMessage(t("auth.loginSuccess"))
            const lastViewedLocationId = localStorage.getItem(LAST_VIEWED_LOCATION_ID_KEY)
            navigate(lastViewedLocationId ? `/${lastViewedLocationId}` : "/map")
        } catch (error) {
            console.error("Login failed:", error)
            setErrorMessage(error instanceof Error ? error.message : t("auth.loginFailed"))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-1.5rem)] items-center justify-center py-6 lg:h-full lg:min-h-0 lg:py-0">
            <div className="w-full max-w-[500px] rounded-2xl bg-div p-5 sm:p-6">
                <h1 className="text-center text-2xl font-semibold sm:text-[28px]">{t("auth.loginTitle")}</h1>
                <h2 className="text-[14px] mt-1 mb-6 text-center font-extralight text-white/40">{t("auth.loginSubtitle")}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <AuthInput
                        label={t("auth.email")}
                        name="email"
                        placeholder={t("auth.emailPlaceholder")}
                        icon={Mail}
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <AuthInput
                        label={t("auth.password")}
                        name="password"
                        placeholder={t("auth.passwordPlaceholder")}
                        icon={Lock}
                        autoComplete="current-password"
                        value={password}
                        type="password"
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                    {errorMessage && (
                        <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-[13px] text-red-300">{errorMessage}</p>
                    )}
                    {successMessage && (
                        <p className="rounded-lg border border-accent-secondary/20 bg-accent-secondary/10 px-3 py-2 text-[13px] text-accent-secondary">{successMessage}</p>
                    )}
                    <Link
                        to="/login"
                        className="underline text-end text-[12px] bg-linear-to-b from-accent-secondary to-accent-primary bg-clip-text font-medium text-transparent"
                    >
                        {t("auth.forgotPassword")}
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting || !isFormValid}
                        className="relative overflow-hidden rounded-lg bg-linear-to-b from-accent-secondary to-accent-primary p-3 text-center font-semibold text-white transition-opacity before:absolute before:inset-0 before:bg-black/20 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        <span className="relative z-10">{isSubmitting ? t("auth.loggingIn") : t("auth.loginSubmit")}</span>
                    </button>
                </form>
                <p className="mt-5 text-center text-[13px] text-white/50">
                    {t("auth.noAccount")}{" "}
                    <Link
                        to="/register"
                        className="bg-linear-to-b from-accent-secondary to-accent-primary bg-clip-text font-medium text-transparent"
                    >
                        {t("auth.createAccountLink")}
                    </Link>
                </p>
            </div>
        </div>
    )
}
