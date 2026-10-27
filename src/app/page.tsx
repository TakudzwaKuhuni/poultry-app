import Link from "next/link"

export default function Home() {
  const batches = [
    { code: "Flock-2026-Alpha", breed: "Active Cobb 500", status: "1,997 - Started with 3000", feed: "5 KG", revenue: "$2000.00" },
    { code: "Flock-2025-Alpha", breed: "Active Cobb 600", status: "2,000 - Started with 2000", feed: "0 KG", revenue: "$0.00" },
  ]

  return (
    <div className="min-h-screen w-full bg-zinc-50 overflow-x-hidden">
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <h1 className="text-xl font-black md:text-2xl">POULTRY OS <span className="ml-2 rounded-full bg-zinc-900 px-2.5 py-1 text-xs text-white">v1.0</span></h1>
            <p className="mt-1 text-xs text-zinc-500">Real-time enterprise analytics ledger</p>
          </div>
          <Link href="/dashboard" className="w-full rounded-full bg-zinc-900 px-6 py-3 text-center text-sm font-semibold text-white md:w-auto">
            + Receive Production Batch
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6"><p className="text-sm text-zinc-500">Total Live Birds</p><p className="mt-2 text-3xl font-bold">3,997</p></div>
          <div className="rounded-2xl border bg-white p-6"><p className="text-sm text-zinc-500">Mortality Losses</p><p className="mt-2 text-3xl font-bold">3</p></div>
          <div className="rounded-2xl border bg-white p-6"><p className="text-sm text-zinc-500">Gross Revenue</p><p className="mt-2 text-3xl font-bold">$2,000.00</p></div>
        </div>

        <div className="rounded-2xl border bg-white">
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="font-bold">Active Production Pipelines</h2>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs">2 Batches</span>
          </div>

          {/* MOBILE: Cards - visible only on mobile */}
          <div className="space-y-4 p-4 md:hidden">
            {batches.map((b) => (
              <div key={b.code} className="rounded-xl border bg-zinc-50 p-4 space-y-2">
                <p className="font-bold">{b.code}</p>
                <div className="text-sm space-y-1 text-zinc-600">
                  <p><span className="font-medium text-zinc-900">Breed:</span> {b.breed}</p>
                  <p><span className="font-medium text-zinc-900">Status:</span> {b.status}</p>
                  <p><span className="font-medium text-zinc-900">Feed:</span> {b.feed} | <span className="font-medium text-zinc-900">Revenue:</span> {b.revenue}</p>
                </div>
                <Link href="/dashboard" className="mt-3 block w-full rounded-full bg-zinc-900 py-2.5 text-center text-sm text-white">Workspace →</Link>
              </div>
            ))}
          </div>

          {/* DESKTOP: Table - hidden on mobile */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr><th className="px-6 py-3">Batch Code</th><th className="px-6 py-3">Breed</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Feed</th><th className="px-6 py-3">Revenue</th><th className="px-6 py-3">Action</th></tr>
              </thead>
              <tbody className="divide-y">
                {batches.map((b) => (
                  <tr key={b.code}><td className="px-6 py-4 font-bold">{b.code}</td><td className="px-6 py-4">{b.breed}</td><td className="px-6 py-4">{b.status}</td><td className="px-6 py-4">{b.feed}</td><td className="px-6 py-4">{b.revenue}</td><td className="px-6 py-4"><Link href="/dashboard" className="font-semibold underline">Workspace →</Link></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}