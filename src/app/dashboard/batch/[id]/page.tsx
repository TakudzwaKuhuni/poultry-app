'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { 
  Sparkles, Save, ShoppingBag, ArrowLeft, 
  Activity, Skull, ShoppingCart, Scale 
} from 'lucide-react';
import Link from 'next/link';

export default function BatchManagementWorkspace() {
  const { id } = useParams();
  
  const [analytics, setAnalytics] = useState<any>(null);
  const [feed, setFeed] = useState('');
  const [weight, setWeight] = useState('');
  const [mortality, setMortality] = useState('');
  const [soldQty, setSoldQty] = useState('');
  const [revenue, setRevenue] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingAi, setLoadingAi] = useState(false);
  const [savingLogs, setSavingLogs] = useState(false);
  const [savingSales, setSavingSales] = useState(false);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase.from('batch_analytics').select('*').eq('batch_id', id).single();
      if (error) throw error;
      setAnalytics(data);
    } catch (err: any) {
      console.error('Error syncing secure ledger:', err.message);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => { if (id) fetchMetrics(); }, [id]);

  const saveDailyLogs = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLogs(true);
    try {
      const { error } = await supabase.from('daily_logs').insert([{
        batch_id: id,
        log_date: new Date().toISOString().split('T')[0],
        feed_consumed_kg: parseFloat(feed) || 0,
        average_weight_g: parseFloat(weight) || 0,
        mortality: parseInt(mortality) || 0,
        culls: 0
      }]);
      if (error) throw error;
      alert('Production ledger updated successfully.');
      setFeed(''); setWeight(''); setMortality('');
      fetchMetrics();
    } catch (err: any) {
      alert(`Logging Failure: ${err.message}`);
    } finally { setSavingLogs(false); }
  };

  const processSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSales(true);
    const requestedQty = parseInt(soldQty);
    if (requestedQty > analytics?.current_live_birds) {
      alert(`Business Rule Violation: Cannot sell ${requestedQty} birds. Only ${analytics?.current_live_birds} remain.`);
      setSavingSales(false); return;
    }
    try {
      const { error } = await supabase.from('sales').insert([{
        batch_id: id,
        sale_date: new Date().toISOString().split('T')[0],
        birds_sold: requestedQty,
        total_weight_kg: (requestedQty * (analytics?.average_weight_g || 1500)) / 1000,
        total_revenue: parseFloat(revenue)
      }]);
      if (error) throw error;
      alert('Sales invoice committed safely.');
      setSoldQty(''); setRevenue('');
      fetchMetrics();
    } catch (err: any) {
      alert(`Transaction Error: ${err.message}`);
    } finally { setSavingSales(false); }
  };

  const generateAiReview = async () => {
    setLoadingAi(true);
    try {
      const { data: logs } = await supabase.from('daily_logs').select('*').eq('batch_id', id);
      const res = await fetch('/api/ai-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchData: analytics, logs })
      });
      const result = await res.json();
      setAiSummary(result.summary || 'Summary compiled successfully.');
    } catch (err: any) {
      setAiSummary('AI feature layer currently offline. Verify your GROQ_API_KEY.');
    } finally { setLoadingAi(false); }
  };

  if (loadingMetrics) {
    return <div className="p-12 text-center text-slate-400 font-bold bg-slate-900 min-h-screen">Syncing Secure Operational Ledger...</div>;
  }
  if (!analytics) {
    return (
      <div className="p-8 max-w-4xl mx-auto mt-12 bg-red-950/40 text-red-400 rounded-2xl border border-red-900/50 text-center">
        <h2 className="font-bold text-lg">Batch Records Missing</h2>
        <p className="text-sm mt-1 text-slate-400">The referenced batch could not be parsed.</p>
        <Link href="/dashboard" className="mt-4 inline-block bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold">Return to Main View</Link>
      </div>
    );
  }

  const mortalityRate = analytics.starting_birds > 0 ? ((analytics.total_mortality / analytics.starting_birds) * 100).toFixed(1) : '0.0';

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8 bg-slate-900 text-slate-100 min-h-screen">
      
      <div className="flex justify-between items-center">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-slate-400 hover:text-white transition-colors group">
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Back to Ledger
        </Link>
        <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-full">
          Batch Code: {analytics.batch_number}
        </span>
      </div>

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-black text-white tracking-tight">{analytics.breed} Production Pipeline</h1>
        <p className="text-sm text-slate-400 mt-1">Operational control matrices and real-time ledger outputs</p>
      </div>

      <div className="bg-slate-800/30 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Activity size={12} className="text-blue-400" /> Live Inventory</p>
          <p className="text-3xl font-black text-white tracking-tight">{analytics.current_live_birds?.toLocaleString()}</p>
          <span className="text-[10px] font-semibold text-slate-500 block">Of {analytics.starting_birds} received</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Skull size={12} className="text-rose-400" /> Mortality Rate</p>
          <p className="text-3xl font-black text-rose-500 tracking-tight">{mortalityRate}%</p>
          <span className="text-[10px] font-semibold text-slate-500 block">{analytics.total_mortality} birds lost total</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Scale size={12} className="text-orange-400" /> Total Feed Used</p>
          <p className="text-3xl font-black text-orange-400 tracking-tight">{analytics.total_feed_consumed?.toLocaleString()} KG</p>
          <span className="text-[10px] font-semibold text-slate-500 block">Cumulative weight distribution</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><ShoppingCart size={12} className="text-emerald-400" /> Total Revenue</p>
          <p className="text-3xl font-black text-emerald-400 tracking-tight">${parseFloat(analytics.total_revenue || '0').toFixed(2)}</p>
          <span className="text-[10px] font-semibold text-slate-500 block">{analytics.total_sold} birds marketed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* DAILY LOGS CARD - FIXED CLOSING TAGS */}
        <div className="bg-slate-800/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <div className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-300"><Save size={16} /></div>
            <div>
              <h3 className="font-extrabold text-white text-base">Record Daily Metrics</h3>
              <p className="text-xs text-slate-500">Log feed inputs, weights, and losses</p>
            </div>
          </div>
          <form onSubmit={saveDailyLogs} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Feed Handed Out (KG)</label>
              <input type="number" required placeholder="0.00" value={feed} onChange={e => setFeed(e.target.value)} className="w-full p-3.5 bg-slate-900 border border-slate-700/60 rounded-xl text-white font-semibold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Avg Weight (Grams)</label>
                <input type="number" required placeholder="0.00" value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-3.5 bg-slate-900 border border-slate-700/60 rounded-xl text-white font-semibold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Mortality Count</label>
                <input type="number" required placeholder="0" value={mortality} onChange={e => setMortality(e.target.value)} className="w-full p-3.5 bg-slate-900 border border-slate-700/60 rounded-xl text-white font-semibold" />
              </div>
            </div>
            <button type="submit" disabled={savingLogs} className="w-full py-3.5 bg-white text-slate-900 rounded-xl font-black text-sm hover:bg-slate-200 transition-colors disabled:opacity-50">
              {savingLogs ? 'Syncing...' : 'Commit Daily Ledger'}
            </button>
          </form>
        </div>

        {/* SALES CARD - FIXED */}
        <div className="bg-slate-800/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <div className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-300"><ShoppingBag size={16} /></div>
            <div>
              <h3 className="font-extrabold text-white text-base">Process Sales Batch</h3>
              <p className="text-xs text-slate-500">Register market offload and revenue</p>
            </div>
          </div>
          <form onSubmit={processSale} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Birds Sold</label>
              <input type="number" required placeholder="0" value={soldQty} onChange={e => setSoldQty(e.target.value)} className="w-full p-3.5 bg-slate-900 border border-slate-700/60 rounded-xl text-white font-semibold" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Total Revenue ($)</label>
              <input type="number" step="0.01" required placeholder="0.00" value={revenue} onChange={e => setRevenue(e.target.value)} className="w-full p-3.5 bg-slate-900 border border-slate-700/60 rounded-xl text-white font-semibold" />
            </div>
            <button type="submit" disabled={savingSales} className="w-full py-3.5 bg-emerald-500 text-slate-900 rounded-xl font-black text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50">
              {savingSales ? 'Processing...' : 'Commit Sales Transaction'}
            </button>
          </form>
        </div>
      </div>

      {/* AI REVIEW CARD */}
      <div className="bg-slate-800/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-violet-900/50 border border-violet-700 rounded-xl text-violet-300"><Sparkles size={16} /></div>
            <h3 className="font-extrabold text-white text-base">AI Operational Review</h3>
          </div>
          <button onClick={generateAiReview} disabled={loadingAi} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors disabled:opacity-50">
            {loadingAi ? 'Analyzing...' : 'Generate Review'}
          </button>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-sm text-slate-300 min-h-[80px]">
          {aiSummary || 'No AI summary generated yet. Click Generate Review to analyze flock performance.'}
        </div>
      </div>
    </div>
  );
}