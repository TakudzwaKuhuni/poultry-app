"use client"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

export default function WorkspacePage(){
  const { user } = useAuth() as any
  if(!user) return null

  if(user.role==="Worker") return <div className="p-8"><h1 className="font-bold">Not Allowed</h1><p className="text-sm mt-2">Workers cannot access Workspace. Go back to your tasks.</p><Link href="/" className="mt-4 inline-block rounded-full bg-zinc-900 px-5 py-2.5 text-sm text-white">← Back</Link></div>
  if(user.role==="Vet") return <div className="p-8"><h1 className="font-bold">Not Allowed</h1><p className="text-sm mt-2">Vet access is Health only.</p><Link href="/" className="mt-4 inline-block rounded-full bg-zinc-900 px-5 py-2.5 text-sm text-white">← Back</Link></div>

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm underline">← Back to Dashboard</Link>
        <h1 className="mt-4 text-2xl font-black">Workspace - {user.role} Access</h1>
        <p className="text-sm text-zinc-500">Only Owner & Manager can see this</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white border p-6"><p className="font-bold">Tasks</p><p className="text-xs text-zinc-500 mt-1">Assign tasks to workers</p></div>
          <div className="rounded-2xl bg-white border p-6"><p className="font-bold">Reports</p><p className="text-xs text-zinc-500 mt-1">Weekly performance</p></div>
        </div>
      </div>
    </div>
  )
}