'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Layers, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewBatchPage() {
  const router = useRouter();
  const [form, setForm] = useState({ batch_number: '', house_pen: '', breed: '', starting_birds: '', purchase_cost: '', date_received: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('batches').insert([
      { ...form, starting_birds: parseInt(form.starting_birds), purchase_cost: parseFloat(form.purchase_cost) }
    ]);
    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-2xl mx-auto text-slate-100 min-h-screen flex flex-col justify-center">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-white mb-6 transition-colors self-start group">
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Return to Ledger
      </Link>

      <div className="bg-slate-800/40 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-slate-700/40 pointer-events-none"><Layers size={80} /></div>
        
        <h1 className="text-2xl font-black text-white tracking-tight">Receive Production Flock</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Log flock configuration variables to deploy into active pipeline analysis</p>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-8 relative z-10">
          <div>
            <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Batch Reference Key</label>
            <input type="text" required placeholder="e.g., FLOCK-2026-ALPHA" className="w-full p-3.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-600 focus:border-emerald-500 font-semibold" onChange={e => setForm({...form, batch_number: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Structure / Pen Unit</label>
              <input type="text" required placeholder="e.g., Structure 04-A" className="w-full p-3.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-600 focus:border-emerald-500 font-semibold" onChange={e => setForm({...form, house_pen: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Genetics / Breed Type</label>
              <input type="text" required placeholder="e.g., Cobb 500" className="w-full p-3.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-600 focus:border-emerald-500 font-semibold" onChange={e => setForm({...form, breed: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Chicks Quantity Received</label>
              <input type="number" required placeholder="3000" className="w-full p-3.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-600 focus:border-emerald-500 font-semibold" onChange={e => setForm({...form, starting_birds: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Procurement Capital ($)</label>
              <input type="number" step="0.01" required placeholder="2450.00" className="w-full p-3.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-600 focus:border-emerald-500 font-semibold" onChange={e => setForm({...form, purchase_cost: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-4 px-4 rounded-xl shadow-lg transition-all duration-300 text-sm tracking-wider uppercase mt-4 disabled:opacity-40">
            {loading ? 'Initializing Ledger Entry...' : 'Initialize Flock Records'}
          </button>
        </form>
      </div>
    </div>
  );
}
