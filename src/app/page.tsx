"use client"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const auth = useAuth()
  const user = auth?.user
  const logout = auth?.logout
  const router = useRouter()
  const [batches, setBatches] = useState<any[]>([])
  const [feedLogs, setFeedLogs] = useState<any[]>([])
  const [eggLogs, setEggLogs] = useState<any[]>([])
  const [healthLogs, setHealthLogs] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAdd, setShowAdd] = useState(false)
  const [newCode, setNewCode] = useState("")
  const [newBreed, setNewBreed] = useState("Cobb 500")
  const [newStarted, setNewStarted] = useState("")
  const [feedKg, setFeedKg] = useState("")
  const [eggs, setEggs] = useState("")
  const [healthNote, setHealthNote] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { 
      const saved = localStorage.getItem("poultry_user")
      if (!saved) { router.push("/login"); return }
    }
    setLoading(false)
    fetchAll()
    if (user?.role === "Worker") setActiveTab("mywork")
    if (user?.role === "Vet") setActiveTab("health")
  }, [user])

  const fetchAll = async () => {
    try {
      const { data: b } = await supabase.from("batches").select("*").order("created_at", { ascending: false })
      const { data: f } = await supabase.from("feed_logs").select("*, batches(code)").order("created_at", { ascending: false }).limit(50)
      const { data: e } = await supabase.from("egg_collection").select("*, batches(code)").order("created_at", { ascending: false }).limit(50)
      const { data: h } = await supabase.from("health_logs").select("*, batches(code)").order("created_at", { ascending: false }).limit(50)
      if (b) setBatches(b)
      if (f) setFeedLogs(f)
      if (e) setEggLogs(e)
      if (h) setHealthLogs(h)
    } catch (err) {
      console.log("Fetch error, ignoring", err)
    }
  }

  const handleAddBatch = async () => {
    if (user?.role === "Worker" || user?.role === "Vet") return alert("Not allowed")
    if (!newCode || !newStarted) return alert("Fill all")
    try {
      await supabase.from("batches").insert({ code: newCode, breed: newBreed, started_with: Number(newStarted), live_count: Number(newStarted), feed_kg: 0, revenue: 0, created_by: user?.id })
      setShowAdd(false); setNewCode(""); setNewStarted(""); fetchAll()
    } catch (e) { alert("Error adding batch") }
  }

  const handleFeed = async () => {
    if (!feedKg) return alert("Enter KG")
    const batchId = batches[0]?.id
    if (!batchId) return alert("Create a batch first")
    try {
      await supabase.from("feed_logs").insert({ batch_id: batchId, kg: Number(feedKg), logged_by: user?.id })
      setFeedKg(""); fetchAll(); alert("Feed saved")
    } catch (e) { alert("Error") }
  }

  const handleEggs = async () => {
    if (!eggs) return alert("Enter count")
    const batchId = batches[0]?.id
    if (!batchId) return alert("Create a batch first")
    try {
      await supabase.from("egg_collection").insert({ batch_id: batchId, count: Number(eggs), collected_by: user?.id })
      setEggs(""); fetchAll(); alert("Eggs saved")
    } catch (e) { alert("Error") }
  }

  const handleHealth = async () => {
    if (!healthNote) return alert("Enter note")
    const batchId = batches[0]?.id
    if (!batchId) return alert("Create a batch first")
    try {
      await supabase.from("health_logs").insert({ batch_id: batchId, type: "Checkup", description: healthNote, vet_id: user?.id })
      setHealthNote(""); fetchAll(); alert("Saved")
    } catch (e) { alert("Error") }
  }

  if (loading) return <div className="p-8 text-sm">Loading...</div>
  if (!user) return null

  if (user.role === "Worker") {
    const myFeed = feedLogs.filter((f:any)=>f.logged_by===user.id)
    const myEggs = eggLogs.filter((e:any)=>e.collected_by===user.id)
    return (
      <div className="min-h-screen bg-zinc-50 p-4"><div className="mx-auto max-w-md space-y-4">
        <div className="flex justify-between bg-white p-4 rounded-2xl border"><div><p className="font-bold">{user.name} - Worker</p><p className="text-xs text-zinc-500">Feed & Eggs Only</p></div><button onClick={logout} className="text-xs underline">Logout</button></div>
        <div className="rounded-2xl bg-white p-5 border space-y-4"><p className="font-bold">My Tasks</p>
          <div className="flex gap-2"><input value={feedKg} onChange={e=>setFeedKg(e.target.value)} type="number" placeholder="KG" className="flex-1 rounded-full border px-4 py-3 text-sm"/><button onClick={handleFeed} className="rounded-full bg-zinc-900 px-6 text-white text-sm">Save</button></div>
          <div className="flex gap-2"><input value={eggs} onChange={e=>setEggs(e.target.value)} type="number" placeholder="Eggs" className="flex-1 rounded-full border px-4 py-3 text-sm"/><button onClick={handleEggs} className="rounded-full bg-green-600 px-6 text-white text-sm">Save</button></div>
        </div>
        <div className="rounded-2xl bg-white p-5 border text-sm"><p className="font-bold">My History</p><p className="text-xs mt-2">Feed: {myFeed.reduce((a:any,b:any)=>a+Number(b.kg),0)} KG</p><p className="text-xs">Eggs: {myEggs.reduce((a:any,b:any)=>a+Number(b.count),0)}</p></div>
      </div></div>
    )
  }

  if (user.role === "Vet") {
    return (
      <div className="min-h-screen bg-zinc-50 p-4"><div className="mx-auto max-w-md space-y-4">
        <div className="flex justify-between bg-white p-4 rounded-2xl border"><div><p className="font-bold">{user.name} - Vet</p><p className="text-xs">Health Only</p></div><button onClick={logout} className="text-xs underline">Logout</button></div>
        <div className="rounded-2xl bg-white p-5 border space-y-3"><input value={healthNote} onChange={e=>setHealthNote(e.target.value)} placeholder="Health note" className="w-full rounded-full border px-4 py-3 text-sm"/><button onClick={handleHealth} className="w-full rounded-full bg-purple-600 py-3 text-white text-sm">Save</button></div>
      </div></div>
    )
  }

  const totalFeed = feedLogs.reduce((a,b)=>a+Number(b.kg),0)
  const totalEggs = eggLogs.reduce((a,b)=>a+Number(b.count),0)

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto max-w-7xl flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div><h1 className="text-xl font-black">POULTRY OS <span className={`ml-2 rounded-full px-2.5 py-1 text-xs text-white ${user.role==="Owner"?"bg-green-600":"bg-blue-600"}`}>{user.role}</span></h1><p className="text-xs text-zinc-500">{user.name}</p></div>
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={()=>setShowAdd(true)} className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white">+ New Batch</button>
            <Link href="/workspace" className="rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white">Workspace</Link>
            <Link href="/team" className="rounded-full border px-5 py-2.5 text-sm">Team</Link>
            <button onClick={logout} className="rounded-full border px-5 py-2.5 text-sm">Logout</button>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 md:px-8 flex gap-2 overflow-x-auto pb-3">
          {["dashboard","feed","eggs","health","reports"].map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold capitalize ${activeTab===t?"bg-zinc-900 text-white":"bg-zinc-100"}`}>{t}</button>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border bg-white p-5"><p className="text-xs">Batches</p><p className="text-2xl font-bold">{batches.length}</p></div>
          <div className="rounded-2xl border bg-white p-5"><p className="text-xs">Live</p><p className="text-2xl font-bold">{batches.reduce((a:any,b:any)=>a+(b.live_count||0),0)}</p></div>
          {user.role==="Owner"?<div className="rounded-2xl border bg-green-50 p-5"><p className="text-xs text-green-700">Revenue</p><p className="text-2xl font-bold">$2,000</p></div>:<div className="rounded-2xl border bg-blue-50 p-5"><p className="text-xs">Manager</p><p className="font-bold">No Revenue</p></div>}
          <div className="rounded-2xl border bg-white p-5"><p className="text-xs">Feed/Eggs</p><p className="font-bold">{totalFeed}KG / {totalEggs}</p></div>
        </div>
        {activeTab==="dashboard" && <div className="rounded-2xl border bg-white"><div className="p-5 border-b font-bold">Batches - {batches.length===0?"No batches yet - Click + New Batch":""}</div><div className="divide-y">{batches.map((b:any)=><div key={b.id} className="flex justify-between p-4 text-sm"><div><p className="font-bold">{b.code}</p><p className="text-xs text-zinc-500">{b.breed}</p></div><span className="text-xs">{b.live_count} live</span></div>)}</div></div>}
        {activeTab==="feed" && <div className="rounded-2xl border bg-white"><div className="p-5 border-b font-bold">Feed {totalFeed}KG</div><div className="divide-y">{feedLogs.map((f:any)=><div key={f.id} className="flex justify-between p-4 text-sm"><p>{f.kg}KG</p><p className="text-xs">{new Date(f.created_at).toLocaleString()}</p></div>)}</div></div>}
        {activeTab==="eggs" && <div className="rounded-2xl border bg-white"><div className="p-5 border-b font-bold">Eggs {totalEggs}</div><div className="divide-y">{eggLogs.map((e:any)=><div key={e.id} className="flex justify-between p-4 text-sm"><p>{e.count} eggs</p><p className="text-xs">{new Date(e.created_at).toLocaleString()}</p></div>)}</div></div>}
        {activeTab==="health" && <div className="rounded-2xl border bg-white"><div className="p-5 border-b font-bold">Health</div><div className="divide-y">{healthLogs.map((h:any)=><div key={h.id} className="p-4 text-sm">{h.description}</div>)}</div></div>}
        {activeTab==="reports" && <div className="rounded-2xl border bg-white p-6"><h2 className="font-bold">{user.role} Reports</h2><p className="text-sm mt-2">{user.role==="Owner"?"Full access":"No revenue"}</p></div>}
      </main>
      {showAdd && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-md rounded-[20px] bg-white p-6 space-y-3"><div className="flex justify-between"><h3 className="font-bold">Add Batch</h3><button onClick={()=>setShowAdd(false)}>✕</button></div><input value={newCode} onChange={e=>setNewCode(e.target.value)} placeholder="Flock-2026" className="w-full rounded-full border px-4 py-3 text-sm"/><input value={newStarted} onChange={e=>setNewStarted(e.target.value)} type="number" placeholder="3000" className="w-full rounded-full border px-4 py-3 text-sm"/><button onClick={handleAddBatch} className="w-full rounded-full bg-zinc-900 py-3 text-white font-bold">Create</button></div></div>}
    </div>
  )
}