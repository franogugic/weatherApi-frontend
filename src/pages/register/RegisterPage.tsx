import type { FormEvent } from "react"
import { useMemo, useState } from "react"
import { Check, Lock, Mail, UserRound } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/features/auth/auth-store"
import { AuthInput } from "@/shared/ui/auth-input/AuthInput"

export function RegisterPage(){
    const { t } = useTranslation()
    const register = useAuthStore((state) => state.register)
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const passwordRules = useMemo(() => ({
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasNumber: /\d/.test(password),
        passwordsMatch: password.length > 0 && password === confirmPassword,
    }), [password, confirmPassword])

    const isFormValid = useMemo(() => {
        const normalizedEmail = email.trim()
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)

        return (
            firstName.trim().length >= 2 &&
            lastName.trim().length >= 2 &&
            isEmailValid &&
            Object.values(passwordRules).every(Boolean)
        )
    }, [email, firstName, lastName, passwordRules])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!isFormValid || isSubmitting) {
            return
        }

        setIsSubmitting(true)
        setErrorMessage("")
        setSuccessMessage("")

        try {
            await register({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password,
            })

            setSuccessMessage(t("auth.registerSuccess"))
            navigate("/login")
        } catch (error) {
            console.error("Registration failed:", error)
            setErrorMessage(error instanceof Error ? error.message : t("auth.registerFailed"))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex h-full min-h-0 items-center justify-center">
            <div className="bg-div rounded-2xl p-6">
                <h1 className="text-[28px] text-center font-semibold">{t("auth.registerTitle")}</h1>
                <h2 className="text-[14px] mt-1 mb-6 text-center font-extralight text-white/40">{t("auth.registerSubtitle")}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex gap-8">
                        <AuthInput
                            label={t("auth.firstName")}
                            name="firstName"
                            placeholder={t("auth.firstName")}
                            icon={UserRound}
                            autoComplete="given-name"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            required
                        />
                        <AuthInput
                            label={t("auth.lastName")}
                            name="lastName"
                            placeholder={t("auth.lastName")}
                            icon={UserRound}
                            autoComplete="family-name"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            required
                        />
                    </div>
                    <AuthInput
                        label={t("auth.email")}
                        name="email"
                        placeholder={t("auth.emailPlaceholder")}
                        icon={Mail}
                        type="email"
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
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                    <AuthInput
                        label={t("auth.confirmPassword")}
                        name="confirmPassword"
                        placeholder={t("auth.confirmPasswordPlaceholder")}
                        icon={Lock}
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                    />
                    <PasswordRequirements rules={passwordRules} />
                    {errorMessage && (
                        <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-[13px] text-red-300">{errorMessage}</p>
                    )}
                    {successMessage && (
                        <p className="rounded-lg border border-accent-secondary/20 bg-accent-secondary/10 px-3 py-2 text-[13px] text-accent-secondary">{successMessage}</p>
                    )}
                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className="relative mt-2 overflow-hidden rounded-lg bg-linear-to-b from-accent-secondary to-accent-primary p-3 text-center font-semibold text-white transition-opacity before:absolute before:inset-0 before:bg-black/20 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        <span className="relative z-10">{isSubmitting ? t("auth.creatingAccount") : t("auth.createAccount")}</span>
                    </button>
                </form>
                <p className="mt-5 text-center text-[13px] text-white/50">
                    {t("auth.alreadyHaveAccount")}{" "}
                    <Link
                        to="/login"
                        className="bg-linear-to-b from-accent-secondary to-accent-primary bg-clip-text font-medium text-transparent"
                    >
                        {t("common.login")}
                    </Link>
                </p>
            </div>
        </div>
    )
}

type PasswordRules = {
    minLength: boolean
    hasUppercase: boolean
    hasNumber: boolean
    passwordsMatch: boolean
}

type PasswordRequirementsProps = {
    rules: PasswordRules
}

function PasswordRequirements({ rules }: PasswordRequirementsProps){
    const { t } = useTranslation()
    const requirements = [
        { label: t("auth.passwordRuleMinLength"), isValid: rules.minLength },
        { label: t("auth.passwordRuleUppercase"), isValid: rules.hasUppercase },
        { label: t("auth.passwordRuleNumber"), isValid: rules.hasNumber },
        { label: t("auth.passwordRuleMatch"), isValid: rules.passwordsMatch },
    ]

    return (
        <div>
            <p className="mb-2 text-[14px] font-light ">{t("auth.passwordMustContain")}</p>
            <div className="flex flex-col gap-2">
                {requirements.map((requirement) => (
                    <div
                        key={requirement.label}
                        className="flex items-center gap-2 text-[12px] text-white/60"
                    >
                        <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                requirement.isValid
                                    ? "border-accent-secondary bg-linear-to-b from-accent-secondary to-accent-primary text-white"
                                    : "border-white/40 text-transparent"
                            }`}
                        >
                            <Check className="h-3 w-3" />
                        </span>
                        <span>{requirement.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
