import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="min-w-0">
            <h1 className="flex flex-wrap items-center gap-2 text-xl font-black tracking-tight md:text-2xl">
              POULTRY OS 
              <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-bold text-white">v1.0</span>
            </h1>
            <p className="mt-1 text-xs text-zinc-500 md:text-sm">Real-time enterprise analytics ledger and batch production controls</p>
          </div>
          <Link href="/dashboard" className="w-full shrink-0 text-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-black transition md:w-auto">
            + Receive Production Batch
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        {/* STATS - fixed: 1 col mobile, 3 cols desktop */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: "Total Live Birds", value: "3,997", sub: "+12 this week" },
            { label: "Mortality Losses", value: "3", sub: "0.07% rate" },
            { label: "Gross Revenue", value: "$2,000.00", sub: "From 1 batch" },
          ].map((s) => (
            <div key={s.label} className="rounded-[20px] border bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-zinc-500">{s.label}</p>
              <p className="mt-3 text-3xl font-bold tracking-tight">{s.value}</p>
              <p className="mt-1 text-xs text-zinc-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* TABLE - fixed: no outer overflow-hidden */}
        <div className="rounded-[20px] border bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold">Active Production Pipelines</h2>
            <span className="w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium">2 Batches Total</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-zinc-50/70 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Batch Code</th>
                  <th className="px-6 py-4 font-semibold">Breed Details</th>
                  <th className="px-6 py-4 font-semibold">Current Flock Status</th>
                  <th className="px-6 py-4 font-semibold">Feed Consumption</th>
                  <th className="px-6 py-4 font-semibold">Revenue Yield</th>
                  <th className="px-6 py-4 font-semibold">Action Matrix</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                <tr className="hover:bg-zinc-50">
                  <td className="px-6 py-5 font-bold">Flock-2026-Alpha</td>
                  <td className="px-6 py-5">Active Cobb 500</td>
                  <td className="px-6 py-5">1,997 - Started with 3000</td>
                  <td className="px-6 py-5">5 KG</td>
                  <td className="px-6 py-5 font-medium">$2000.00</td>
                  <td className="px-6 py-5"><Link href="/dashboard" className="font-semibold text-zinc-900 underline underline-offset-4">Workspace →</Link></td>
                </tr>
                <tr className="hover:bg-zinc-50">
                  <td className="px-6 py-5 font-bold">Flock-2025-Alpha</td>
                  <td className="px-6 py-5">Active Cobb 600</td>
                  <td className="px-6 py-5">2,000 - Started with 2000</td>
                  <td className="px-6 py-5">0 KG</td>
                  <td className="px-6 py-5 font-medium">$0.00</td>
                  <td className="px-6 py-5"><Link href="/dashboard" className="font-semibold text-zinc-900 underline underline-offset-4">Workspace →</Link></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}