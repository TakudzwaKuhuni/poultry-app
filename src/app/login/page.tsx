"use client"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage(){
  const { login } = useAuth()
  const router = useRouter()
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [err,setErr]=useState("")

  const handle = async (e:any) => {
    e.preventDefault()
    setErr("")
    const ok = await login(email,password)
    if(ok){ router.push("/") } else { setErr("Wrong email or password") }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <form onSubmit={handle} className="w-full max-w-sm rounded-2xl bg-white border p-6 space-y-4">
        <h1 className="text-xl font-black">POULTRY OS LOGIN</h1>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="freddy@farm.com" className="w-full rounded-full border px-4 py-3 text-sm"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="owner123" className="w-full rounded-full border px-4 py-3 text-sm"/>
        {err && <p className="text-xs text-red-600">{err}</p>}
        <button className="w-full rounded-full bg-zinc-900 py-3 text-white text-sm font-bold">Login</button>
        <div className="text-[10px] text-zinc-500 space-y-1">
          <p>Owner: freddy@farm.com / owner123</p>
          <p>Manager: manager@farm.com / manager123</p>
          <p>Worker: worker@farm.com / worker123</p>
          <p>Vet: vet@farm.com / vet123</p>
        </div>
      </form>
    </div>
  )
}