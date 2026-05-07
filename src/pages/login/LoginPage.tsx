import { loginUser } from "@/features/auth/login-user"
import { AuthInput } from "@/shared/ui/auth-input/AuthInput"
import { Lock, Mail } from "lucide-react"
import { useMemo, useState, type FormEvent } from "react"
import { Link } from "react-router-dom"

export function LoginPage(){
    const [email, setEmail] = useState("root@root.com")
    const [password, setPassword] = useState("Root1234")
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
     
    const isFormValid = useMemo(() => {
        const normalizedEmail = email.trim()
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)

        return isEmailValid && password
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
            await loginUser({
                email: email.trim(),
                password,
            })

            setSuccessMessage("Logged in successfully.")
        } catch (error) {
            console.error("Login failed:", error)
            setErrorMessage(
                error instanceof Error
                    ? error.stack ?? error.message
                    : JSON.stringify(error)
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex h-full min-h-0 items-center justify-center">
            <div className="bg-div rounded-2xl p-6 lg:min-w-[500px]">
                <h1 className="text-[28px] text-center font-semibold">Welcome back</h1>
                <h2 className="text-[14px] mt-1 mb-6 text-center font-extralight text-white/40">Login to continue tracking your favorite weather locations.</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <AuthInput
                        label="Email"
                        name="email"
                        placeholder="you@example.com"
                        icon={Mail}
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <AuthInput
                        label="Password"
                        name="password"
                        placeholder="Enter your password"
                        icon={Lock}
                        autoComplete="current-password"
                        value={password}
                        type="password"
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                    {errorMessage && (
                        <p className="text-[13px] text-red-400">{errorMessage}</p>
                    )}
                    {successMessage && (
                        <p className="text-[13px] text-accent-secondary">{successMessage}</p>
                    )}
                    <Link
                        to="/login"
                        className="underline text-end text-[12px] bg-linear-to-b from-accent-secondary to-accent-primary bg-clip-text font-medium text-transparent"
                    >
                        Forgot your password?
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting || !isFormValid}
                        className="relative overflow-hidden rounded-lg bg-linear-to-b from-accent-secondary to-accent-primary p-3 text-center font-semibold text-white transition-opacity before:absolute before:inset-0 before:bg-black/20 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        <span className="relative z-10">{isSubmitting ? "Logging in..." : "Login"}</span>
                    </button>
                </form>
                <p className="mt-5 text-center text-[13px] text-white/50">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="bg-linear-to-b from-accent-secondary to-accent-primary bg-clip-text font-medium text-transparent"
                    >
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    )
}
