import type { User } from "@/entities/user/types"
import { getAuthErrorMessage } from "./auth-error"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  })

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null)
    throw new Error(getAuthErrorMessage(errorResponse, "Could not load current user."))
  }

  return await response.json() as User
}
