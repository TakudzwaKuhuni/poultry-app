"use client"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginLanding() {
  const { login } = useAuth() || {}
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const handle = async (e: any) => {
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      const ok = await login(email, password)
      if (ok) {
        router.push("/dashboard")
      } else {
        setErr("Wrong email or password")
      }
    } catch {
      setErr("Login failed")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <form onSubmit={handle} className="w-full max-w-sm rounded-[24px] bg-white border p-6 space-y-4 shadow-sm">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black">POULTRY OS</h1>
          <p className="text-xs text-zinc-500">Freddy's Farm Management</p>
        </div>
        
        <div className="space-y-3 pt-2">
          <input
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="freddy@farm.com"
            className="w-full rounded-full border px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
            required
          />
          <input
            value={password}
            onChange={e=>setPassword(e.target.value)}
            type="password"
            placeholder="password"
            className="w-full rounded-full border px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
            required
          />
        </div>

        {err && <p className="text-xs text-red-600 text-center bg-red-50 py-2 rounded-full">{err}</p>}

        <button
          disabled={loading}
          className="w-full rounded-full bg-zinc-900 py-3.5 text-white text-sm font-bold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login →"}
        </button>

        <div className="pt-4 border-t space-y-1">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Demo Accounts</p>
          <div className="text-[11px] text-zinc-500 space-y-1 bg-zinc-50 p-3 rounded-xl">
            <p><span className="font-bold">Owner:</span> freddy@farm.com / owner123</p>
            <p><span className="font-bold">Manager:</span> manager@farm.com / manager123</p>
            <p><span className="font-bold">Worker:</span> worker@farm.com / worker123</p>
            <p><span className="font-bold">Vet:</span> vet@farm.com / vet123</p>
          </div>
        </div>
      </form>
    </div>
  )
}