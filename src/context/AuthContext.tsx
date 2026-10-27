"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type User = { id: string, name: string, role: string, email: string }
const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem("poultry_user")
    if (saved) { try { setUser(JSON.parse(saved)) } catch {} }
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("email", email).eq("password", password).single()
    if (!data) return false
    const u = { id: data.id, name: data.name, role: data.role, email: data.email }
    setUser(u)
    localStorage.setItem("poultry_user", JSON.stringify(u))
    return true
  }

  const logout = () => {
    localStorage.removeItem("poultry_user")
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)