import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { PlusCircle, Flame, Skull, DollarSign, Layers, ChevronRight, Inbox } from 'lucide-react';

export const revalidate = 0;

export default async function MainPoultryDashboard() {
  const { data: analytics, error } = await supabase
    .from('batch_analytics')
    .select('*')
    .order('batch_number', { ascending: false });

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto mt-12 bg-red-950/40 text-red-400 rounded-2xl border border-red-900/50 backdrop-blur-md">
        <h2 className="font-bold text-xl tracking-tight">Database Synced Ledger Offline</h2>
        <p className="text-sm mt-1 text-red-400/80">{error.message}</p>
      </div>
    );
  }

  const totalFlockSize = analytics?.reduce((sum, item) => sum + (item.current_live_birds || 0), 0) || 0;
  const globalMortality = analytics?.reduce((sum, item) => sum + (item.total_mortality || 0), 0) || 0;
  const cumulativeRevenue = analytics?.reduce((sum, item) => sum + (item.total_revenue || 0), 0) || 0;

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-10 bg-slate-900 min-h-screen text-slate-100">
      
      {/* Header Panel Top Layer */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-850/40 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent opacity-30 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <span className="bg-gradient-to-tr from-emerald-400 to-teal-500 bg-clip-text text-transparent">Poultry OS</span>
            <span className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">v1.0</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-medium">Real-time enterprise analytics ledger and batch production controls</p>
        </div>
        <Link 
          href="/dashboard/new-batch" 
          className="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-3.5 px-6 rounded-2xl shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.4)] transition-all duration-300 text-sm tracking-wide w-full md:w-auto justify-center group"
        >
          <PlusCircle size={18} className="transition-transform group-hover:rotate-90 duration-300" /> Receive Production Batch
        </Link>
      </div>

      {/* Modern High-End Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between hover:border-slate-700/80 transition-all duration-300">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Live Birds</p>
            <h3 className="text-3xl font-black text-white mt-2 tracking-tight">{totalFlockSize.toLocaleString()}</h3>
          </div>
          <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"><Layers size={22} /></div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between hover:border-slate-700/80 transition-all duration-300">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mortality Losses</p>
            <h3 className="text-3xl font-black text-rose-500 mt-2 tracking-tight">{globalMortality.toLocaleString()}</h3>
          </div>
          <div className="p-3.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]"><Skull size={22} /></div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between hover:border-slate-700/80 transition-all duration-300">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gross Revenue</p>
            <h3 className="text-3xl font-black text-emerald-400 mt-2 tracking-tight">${cumulativeRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
          </div>
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"><DollarSign size={22} /></div>
        </div>
      </div>

      {/* Main Ledger Dashboard Pipeline View */}
      <div className="bg-slate-800/30 backdrop-blur-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-6 px-8 border-b border-slate-800 bg-slate-850/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">Active Production Pipelines</h2>
          <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700/60">{analytics?.length || 0} Batches Total</span>
        </div>
        
        {analytics && analytics.length === 0 ? (
          <div className="p-16 text-center text-slate-500 max-w-sm mx-auto space-y-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700/50"><Inbox size={22} /></div>
            <div>
              <p className="text-base font-bold text-slate-300">System Ledger Empty</p>
              <p className="text-xs text-slate-500 mt-1">Deploy your first batch of birds into the system pipeline using the creation launcher.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-850/30 border-b border-slate-800/80 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <th className="p-5 pl-8">Batch Code</th>
                  <th className="p-5">Breed Details</th>
                  <th className="p-5">Current Flock Status</th>
                  <th className="p-5">Feed Consumption</th>
                  <th className="p-5">Revenue Yield</th>
                  <th className="p-5 text-right pr-8">Action Matrix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {analytics?.map((batch) => (
                  <tr key={batch.batch_id} className="hover:bg-slate-800/30 transition-all duration-200 group">
                    <td className="p-5 pl-8">
                      <span className="font-extrabold text-white block text-base group-hover:text-emerald-400 transition-colors">{batch.batch_number}</span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 mt-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{batch.status}</span>
                    </td>
                    <td className="p-5 text-slate-400 font-semibold">{batch.breed}</td>
                    <td className="p-5">
                      <span className="text-white font-extrabold text-base block">{batch.current_live_birds.toLocaleString()}</span>
                      <span className="text-xs text-slate-500 block mt-0.5">Started with {batch.starting_birds}</span>
                    </td>
                    <td className="p-5">
                      <span className="text-orange-400 font-bold block">{batch.total_feed_consumed.toLocaleString()} KG</span>
                    </td>
                    <td className="p-5">
                      <span className="text-emerald-400 font-extrabold text-base block">${parseFloat(batch.total_revenue).toFixed(2)}</span>
                    </td>
                    <td className="p-5 text-right pr-8">
                      <Link 
                        href={`/dashboard/batch/${batch.batch_id}`} 
                        className="inline-flex items-center gap-1 text-xs font-black tracking-wider uppercase text-emerald-400 hover:text-slate-950 bg-emerald-500/10 hover:bg-emerald-400 py-2.5 px-4 rounded-xl border border-emerald-500/20 hover:border-transparent transition-all duration-200 shadow-sm"
                      >
                        Workspace <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
