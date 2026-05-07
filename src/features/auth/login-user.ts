import type { User } from "@/entities/user/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type LoginUserRequest = {
    email: string
    password: string
}

export async function loginUser(request: LoginUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(request),
    })

    if (!response.ok) {
        const errorResponse = await response.json().catch(() => null)
        throw new Error(errorResponse?.message ?? "Login failed.")
    }

    return await response.json() as User
}
