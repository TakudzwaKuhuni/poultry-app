"use client"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("freddy@farm.com")
  const [password, setPassword] = useState("owner123")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = () => {
    const ok = login(email, password)
    if (ok) {
      router.push("/")
    } else {
      setError("Wrong email or password. Try demo accounts below.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md rounded-[24px] border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-black">POULTRY OS Login</h1>
        <p className="mt-1 text-sm text-zinc-500">Freddy's Farm - Role based access</p>

        <div className="mt-6 space-y-4">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-full border px-4 py-3 text-sm outline-none focus:border-zinc-900" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-full border px-4 py-3 text-sm outline-none focus:border-zinc-900" />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button onClick={handleLogin} className="w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white">Login →</button>
        </div>

        <div className="mt-8 rounded-xl bg-zinc-50 p-4 text-xs">
          <p className="font-bold mb-2">DEMO LOGINS - Click to fill:</p>
          <div className="space-y-2">
            <button onClick={() => { setEmail("freddy@farm.com"); setPassword("owner123") }} className="w-full text-left">👑 <b>Freddy Owner</b> - freddy@farm.com / owner123</button>
            <button onClick={() => { setEmail("manager@farm.com"); setPassword("manager123") }} className="w-full text-left">📋 <b>Manager</b> - manager@farm.com / manager123</button>
            <button onClick={() => { setEmail("worker@farm.com"); setPassword("worker123") }} className="w-full text-left">🌾 <b>Worker</b> - worker@farm.com / worker123</button>
            <button onClick={() => { setEmail("vet@farm.com"); setPassword("vet123") }} className="w-full text-left">🩺 <b>Vet</b> - vet@farm.com / vet123</button>
          </div>
        </div>
      </div>
    </div>
  )
}