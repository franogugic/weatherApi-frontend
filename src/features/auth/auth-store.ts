import type { User } from "@/entities/user/types"
import { create } from "zustand"
import { getAuthErrorMessage } from "./auth-error"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type LoginUserRequest = {
  email: string
  password: string
}

type RegisterUserRequest = {
  firstName: string
  lastName: string
  email: string
  password: string
}

type AuthStore = {
  user: User | null
  isLoadingUser: boolean
  hasLoadedCurrentUser: boolean
  setUser: (user: User | null) => void
  loadCurrentUser: () => Promise<User | null>
  login: (request: LoginUserRequest) => Promise<User>
  register: (request: RegisterUserRequest) => Promise<User>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoadingUser: false,
  hasLoadedCurrentUser: false,
  setUser: (user) => set({ user, hasLoadedCurrentUser: true }),
  loadCurrentUser: async () => {
    set({ isLoadingUser: true })

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        set({ user: null, isLoadingUser: false, hasLoadedCurrentUser: true })
        return null
      }

      const user = await response.json() as User
      set({ user, isLoadingUser: false, hasLoadedCurrentUser: true })
      return user
    } catch {
      set({ user: null, isLoadingUser: false, hasLoadedCurrentUser: true })
      return null
    }
  },
  login: async (request) => {
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
      throw new Error(getAuthErrorMessage(errorResponse, "Login failed."))
    }

    const user = await response.json() as User
    set({ user, hasLoadedCurrentUser: true })
    return user
  },
  register: async (request) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorResponse = await response.json().catch(() => null)
      throw new Error(getAuthErrorMessage(errorResponse, "Registration failed."))
    }

    return await response.json() as User
  },
  logout: async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => null)

    localStorage.clear()
    sessionStorage.clear()
    set({ user: null, hasLoadedCurrentUser: true })
  },
}))
