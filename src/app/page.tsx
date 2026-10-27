"use client"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const { user, logout } = useAuth()
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

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    fetchAll()
    // Set default tab per role
    if (user.role==="Worker") setActiveTab("mywork")
    if (user.role==="Vet") setActiveTab("health")
    if (user.role==="Manager") setActiveTab("dashboard")
  }, [user])

  const fetchAll = async () => {
    const { data: b } = await supabase.from("batches").select("*").order("created_at", { ascending: false })
    const { data: f } = await supabase.from("feed_logs").select("*, batches(code)").order("created_at", { ascending: false }).limit(50)
    const { data: e } = await supabase.from("egg_collection").select("*, batches(code)").order("created_at", { ascending: false }).limit(50)
    const { data: h } = await supabase.from("health_logs").select("*, batches(code)").order("created_at", { ascending: false }).limit(50)
    if (b) setBatches(b)
    if (f) setFeedLogs(f)
    if (e) setEggLogs(e)
    if (h) setHealthLogs(h)
  }

  const handleDelete = async (id: string) => {
    if (user.role !== "Owner") return alert("Only Freddy Owner")
    await supabase.from("batches").delete().eq("id", id)
    fetchAll()
  }

  const handleAddBatch = async () => {
    if (user.role==="Worker" || user.role==="Vet") return alert("Not allowed")
    if (!newCode || !newStarted) return alert("Fill all")
    await supabase.from("batches").insert({ code: newCode, breed: newBreed, started_with: Number(newStarted), live_count: Number(newStarted), feed_kg: 0, revenue: 0, created_by: user.id })
    setShowAdd(false); setNewCode(""); setNewStarted(""); fetchAll()
  }

  const handleFeed = async () => {
    if (!feedKg || !batches[0]) return
    await supabase.from("feed_logs").insert({ batch_id: batches[0].id, kg: Number(feedKg), logged_by: user.id })
    setFeedKg(""); fetchAll(); alert("Feed saved")
  }

  const handleEggs = async () => {
    if (!eggs || !batches[0]) return
    await supabase.from("egg_collection").insert({ batch_id: batches[0].id, count: Number(eggs), collected_by: user.id })
    setEggs(""); fetchAll(); alert("Eggs saved")
  }

  const handleHealth = async () => {
    if (!healthNote || !batches[0]) return
    await supabase.from("health_logs").insert({ batch_id: batches[0].id, type: "Checkup", description: healthNote, vet_id: user.id })
    setHealthNote(""); fetchAll(); alert("Health saved")
  }

  if (!user) return null

  // ============= WORKER - STRICT DASHBOARD =============
  if (user.role === "Worker") {
    const myFeed = feedLogs.filter((f:any)=>f.logged_by===user.id)
    const myEggs = eggLogs.filter((e:any)=>e.collected_by===user.id)
    return (
      <div className="min-h-screen w-full bg-zinc-50 p-4">
        <div className="mx-auto max-w-md space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border">
            <div><p className="font-bold">{user.name} - Worker</p><p className="text-xs text-zinc-500">Only Feed & Eggs</p></div>
            <button onClick={logout} className="text-xs underline">Logout</button>
          </div>
          <div className="rounded-2xl bg-white p-5 border space-y-4">
            <h2 className="font-bold">My Tasks Only</h2>
            <div><label className="text-xs font-bold">Feed Entry (KG)</label><div className="flex gap-2 mt-1"><input value={feedKg} onChange={e=>setFeedKg(e.target.value)} type="number" placeholder="25" className="flex-1 rounded-full border px-4 py-3 text-sm"/><button onClick={handleFeed} className="rounded-full bg-zinc-900 px-6 text-white text-sm">Save</button></div></div>
            <div><label className="text-xs font-bold">Egg Collection</label><div className="flex gap-2 mt-1"><input value={eggs} onChange={e=>setEggs(e.target.value)} type="number" placeholder="1850" className="flex-1 rounded-full border px-4 py-3 text-sm"/><button onClick={handleEggs} className="rounded-full bg-green-600 px-6 text-white text-sm">Save</button></div></div>
          </div>
          <div className="rounded-2xl bg-white p-5 border">
            <p className="font-bold text-sm">My History - No Reports Access</p>
            <p className="text-xs mt-2">Feed logged: {myFeed.reduce((a:any,b:any)=>a+Number(b.kg),0)} KG ({myFeed.length} entries)</p>
            <p className="text-xs mt-1">Eggs collected: {myEggs.reduce((a:any,b:any)=>a+Number(b.count),0)} ({myEggs.length} entries)</p>
          </div>
        </div>
      </div>
    )
  }

  // ============= VET - STRICT DASHBOARD =============
  if (user.role === "Vet") {
    return (
      <div className="min-h-screen w-full bg-zinc-50 p-4">
        <div className="mx-auto max-w-md space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border">
            <div><p className="font-bold">{user.name} - Vet</p><p className="text-xs text-zinc-500">Health Only</p></div>
            <button onClick={logout} className="text-xs underline">Logout</button>
          </div>
          <div className="rounded-2xl bg-white p-5 border space-y-3">
            <h2 className="font-bold">Vet Panel - No Feed/Eggs/Reports</h2>
            <input value={healthNote} onChange={e=>setHealthNote(e.target.value)} placeholder="Vaccination note..." className="w-full rounded-full border px-4 py-3 text-sm"/>
            <button onClick={handleHealth} className="w-full rounded-full bg-purple-600 py-3 text-white text-sm">Save Health Log</button>
          </div>
          <div className="rounded-2xl bg-white border">
            <div className="p-4 border-b font-bold text-sm">Health Logs - {healthLogs.length}</div>
            <div className="divide-y">{healthLogs.map((h:any)=><div key={h.id} className="p-3 text-sm"><p className="font-bold">{h.description}</p><p className="text-xs text-zinc-500">{h.batches?.code} • {new Date(h.created_at).toLocaleDateString()}</p></div>)}</div>
          </div>
        </div>
      </div>
    )
  }

  // ============= OWNER & MANAGER =============
  const totalFeed = feedLogs.reduce((a, b) => a + Number(b.kg), 0)
  const totalEggs = eggLogs.reduce((a, b) => a + Number(b.count), 0)
  const tabsOwner = ["dashboard","feed","eggs","health","reports"]
  const tabsManager = ["dashboard","feed","eggs","health","reports"]

  return (
    <div className="min-h-screen w-full bg-zinc-50">
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <h1 className="text-xl font-black">POULTRY OS <span className={`ml-2 rounded-full px-2.5 py-1 text-xs text-white ${user.role==="Owner" ? "bg-green-600" : "bg-blue-600"}`}>{user.role}</span></h1>
            <p className="text-xs text-zinc-500">{user.name} • {user.email} {user.role==="Owner" ? "• Full Access" : "• Manager Access - No Revenue Delete"}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={()=>setShowAdd(true)} className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white">+ New Batch</button>
            <Link href="/workspace" className="rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white">Workspace</Link>
            <Link href="/team" className="rounded-full border px-5 py-2.5 text-sm">Team</Link>
            <button onClick={logout} className="rounded-full border px-5 py-2.5 text-sm">Logout</button>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 md:px-8 flex gap-2 overflow-x-auto pb-3">
          {(user.role==="Owner" ? tabsOwner : tabsManager).map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold capitalize ${activeTab===t ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"}`}>{t}</button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border bg-white p-5"><p className="text-xs text-zinc-500">Batches</p><p className="mt-1 text-2xl font-bold">{batches.length}</p></div>
          <div className="rounded-2xl border bg-white p-5"><p className="text-xs text-zinc-500">Live Birds</p><p className="mt-1 text-2xl font-bold">{batches.reduce((a:any,b:any)=>a+b.live_count,0)}</p></div>
          {user.role==="Owner" ? (
            <div className="rounded-2xl border bg-green-50 p-5"><p className="text-xs text-green-700">Gross Revenue (Owner Only)</p><p className="mt-1 text-2xl font-bold text-green-800">$2,000.00</p></div>
          ) : (
            <div className="rounded-2xl border bg-blue-50 p-5"><p className="text-xs text-blue-700">Manager - No Revenue</p><p className="mt-1 text-lg font-bold text-blue-800">No Access</p></div>
          )}
          <div className="rounded-2xl border bg-white p-5"><p className="text-xs text-zinc-500">Feed / Eggs</p><p className="mt-1 text-lg font-bold">{totalFeed}KG / {totalEggs}</p></div>
        </div>

        {activeTab==="dashboard" && (
          <div className="rounded-2xl border bg-white"><div className="border-b p-5 font-bold">Batches - {user.role} {user.role==="Manager" && "(No Delete)"}</div><div className="divide-y">{batches.map((b:any)=><div key={b.id} className="flex justify-between p-4 text-sm"><div><p className="font-bold">{b.code}</p><p className="text-xs text-zinc-500">{b.breed} • {b.live_count} live</p></div>{user.role==="Owner" ? <button onClick={()=>handleDelete(b.id)} className="text-xs text-red-600 underline">Delete</button> : <span className="text-xs text-zinc-400">View Only</span>}</div>)}</div></div>
        )}

        {activeTab==="feed" && (
          <div className="rounded-2xl border bg-white"><div className="border-b p-5 font-bold">Feed Dashboard - {totalFeed} KG</div><div className="divide-y">{feedLogs.map((f:any)=><div key={f.id} className="flex justify-between p-4 text-sm"><p className="font-bold">{f.kg} KG - {f.batches?.code}</p><p className="text-xs">{new Date(f.created_at).toLocaleString()}</p></div>)}</div></div>
        )}

        {activeTab==="eggs" && (
          <div className="rounded-2xl border bg-white"><div className="border-b p-5 font-bold">Eggs Dashboard - {totalEggs}</div><div className="divide-y">{eggLogs.map((e:any)=><div key={e.id} className="flex justify-between p-4 text-sm"><p className="font-bold">{e.count} eggs - {e.batches?.code}</p><p className="text-xs">{new Date(e.created_at).toLocaleString()}</p></div>)}</div></div>
        )}

        {activeTab==="health" && (
          <div className="rounded-2xl border bg-white"><div className="border-b p-5 font-bold">Health Logs</div><div className="divide-y">{healthLogs.map((h:any)=><div key={h.id} className="p-4 text-sm"><p className="font-bold">{h.description}</p><p className="text-xs text-zinc-500">{h.batches?.code}</p></div>)}</div></div>
        )}

        {activeTab==="reports" && (
          <div className="rounded-2xl border bg-white p-6">
            {user.role==="Owner" ? (
              <><h2 className="font-bold">Reports - Owner Full Access</h2><div className="mt-4 grid grid-cols-2 gap-4"><div className="bg-zinc-50 p-4 rounded-xl"><p className="text-xs">Revenue</p><p className="font-bold">$2,000</p></div><div className="bg-zinc-50 p-4 rounded-xl"><p className="text-xs">Feed Cost</p><p className="font-bold">{totalFeed} KG</p></div><div className="bg-zinc-50 p-4 rounded-xl"><p className="text-xs">Eggs</p><p className="font-bold">{totalEggs}</p></div><div className="bg-zinc-50 p-4 rounded-xl"><p className="text-xs">Mortality</p><p className="font-bold">3 birds</p></div></div></>
            ) : (
              <><h2 className="font-bold">Reports - Manager Limited (No Revenue)</h2><div className="mt-4 grid grid-cols-2 gap-4"><div className="bg-zinc-50 p-4 rounded-xl"><p className="text-xs">Feed</p><p className="font-bold">{totalFeed} KG</p></div><div className="bg-zinc-50 p-4 rounded-xl"><p className="text-xs">Eggs</p><p className="font-bold">{totalEggs}</p></div></div><p className="text-xs text-blue-600 mt-4">Manager cannot see revenue - Owner only</p></>
            )}
          </div>
        )}
      </main>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-md rounded-[20px] bg-white p-6 space-y-4"><div className="flex justify-between"><h3 className="font-bold">Add Batch - {user.role}</h3><button onClick={()=>setShowAdd(false)}>✕</button></div><input value={newCode} onChange={e=>setNewCode(e.target.value)} placeholder="Flock-2026-Beta" className="w-full rounded-full border px-4 py-3 text-sm"/><select value={newBreed} onChange={e=>setNewBreed(e.target.value)} className="w-full rounded-full border px-4 py-3 text-sm"><option>Cobb 500</option><option>Cobb 600</option><option>Ross 308</option></select><input value={newStarted} onChange={e=>setNewStarted(e.target.value)} type="number" placeholder="3000" className="w-full rounded-full border px-4 py-3 text-sm"/><button onClick={handleAddBatch} className="w-full rounded-full bg-zinc-900 py-3 text-white text-sm font-bold">Create</button></div></div>
      )}
    </div>
  )
}