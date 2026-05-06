import type { User } from "@/entities/user/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type RegisterUserRequest = {
    firstName: string
    lastName: string
    email: string
    password: string
}

export async function registerUser(request: RegisterUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    })

    if (!response.ok) {
        const errorResponse = await response.json().catch(() => null)
        throw new Error(errorResponse?.message ?? "Registration failed.")
    }

    return await response.json() as User
}
