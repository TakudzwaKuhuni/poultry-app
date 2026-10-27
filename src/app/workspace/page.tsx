"use client"
import Link from "next/link"
export default function WorkspacePage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/" className="text-sm underline">← Back to Dashboard</Link>
        <h1 className="text-2xl font-black">Workspace</h1>
        <p className="text-sm text-zinc-500">Owner & Manager only workspace</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white border p-6"><p className="font-bold">Tasks</p><p className="text-xs text-zinc-500 mt-1">Assign to workers</p></div>
          <div className="rounded-2xl bg-white border p-6"><p className="font-bold">Reports</p><p className="text-xs text-zinc-500 mt-1">Weekly performance</p></div>
        </div>
      </div>
    </div>
  )
}