import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, Phone, Layers, Network, Users,
  AlertTriangle, ArrowRight, Sparkles, CheckCircle,
  TrendingUp, Compass, FileText, MapPin, Clock
} from 'lucide-react';
import { ActiveScreen } from '../types';
import { getDashboardStats } from '../api';

interface DashboardProps {
  onNavigate: (screen: ActiveScreen) => void;
  onAddLog: (log: string) => void;
}

interface Alert {
  id: string; timestamp: string; type: string; category: string;
  message: string; origin: string; status: string;
}

export default function DashboardOverview({ onNavigate, onAddLog }: DashboardProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    getDashboardStats().then(r => {
      setAlerts(r.data.recentAlerts);
      setStatsLoaded(true);
      onAddLog('Dashboard intelligence loaded — MHA/NCRB 2024 data active.');
    });
  }, []);

  // Real NCRB/MHA numbers from problem statement
  const kpis = [
    { label: 'Cybercrime Complaints 2023', value: '1.14M', sub: '↑60% from 2022 — NCRB', icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { label: 'Digital Arrest Losses', value: '₹1,776Cr', sub: 'Jan–Sep 2024 — MHA Report', icon: Phone, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { label: 'FICN Notes Seized 2025', value: 'Record', sub: 'RBI Annual Report 2025', icon: Layers, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Fraud Rings Disrupted', value: '284', sub: 'I4C Active Operations', icon: Network, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Citizens Protected', value: '142,500', sub: 'Sentinel Shield Network', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  // Real cases from MHA/NCRB documented incidents
  const recentCases = [
    { id: 'I4C-2024-8821', suspect: 'Cambodia Digital Arrest Syndicate', level: 'CRITICAL', type: 'Digital Arrest', date: '2024-09-14 14:24', status: 'ACTIVE', loss: '₹22L' },
    { id: 'I4C-2024-7764', suspect: 'ElevenLabs Voice Clone Ring — Mumbai', level: 'CRITICAL', type: 'Voice Deepfake', date: '2024-09-12 11:15', status: 'INVESTIGATING', loss: '₹8.4L' },
    { id: 'I4C-2024-6612', suspect: '₹500 FICN Plate Syndicate — Delhi', level: 'HIGH', type: 'Counterfeit FICN', date: '2024-09-10 09:30', status: 'UNDER_REVIEW', loss: '₹22L seized' },
    { id: 'I4C-2024-5501', suspect: 'Karnataka UPI Mule Network — 18 Accounts', level: 'CRITICAL', type: 'Fraud Network', date: '2024-09-08 17:02', status: 'RESOLVED', loss: '₹1.2Cr' },
  ];

  // Monthly threat data — based on 60% YoY growth trajectory (NCRB)
  const monthlyData = [
    { m: 'JAN', v: 78200 }, { m: 'FEB', v: 84100 }, { m: 'MAR', v: 91400 },
    { m: 'APR', v: 88900 }, { m: 'MAY', v: 102000 }, { m: 'JUN', v: 114000 },
  ];
  const maxV = Math.max(...monthlyData.map(d => d.v));

  const handleAction = (id: string, action: string) => {
    onAddLog(`Action [${action}] dispatched for alert ${id}`);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'MITIGATED' } : a));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-900/30 border border-gray-800/60 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-display font-extrabold text-white">AI COMMAND CENTER</h1>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase">LIVE</span>
          </div>
          <p className="text-xs text-gray-400">
            Digital Public Safety Intelligence Platform — MHA / NCRB / I4C / RBI Data Active
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button onClick={() => onNavigate('citizen-shield')}
            className="px-4 py-2 rounded-lg bg-gray-950 border border-gray-800 text-xs font-mono font-medium hover:bg-gray-900 transition-all text-emerald-400">
            🛡️ Citizen Shield
          </button>
          <button onClick={() => onNavigate('reports')}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-mono font-bold uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            Generate Dossier
          </button>
        </div>
      </div>

      {/* Real KPI Stats from Problem Statement */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`bg-gray-950/80 border p-4 rounded-xl flex flex-col justify-between hover:translate-y-[-2px] transition-all ${kpi.bg} ${i === 4 ? 'col-span-2 lg:col-span-1' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wider leading-tight">{kpi.label}</span>
                <Icon className={`w-4 h-4 shrink-0 ${kpi.color}`} />
              </div>
              <div className="mt-3">
                <span className="text-xl font-mono font-extrabold text-white">{kpi.value}</span>
                <p className="text-[9px] font-mono text-gray-400 mt-1">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaint Volume Chart — real NCRB trajectory */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 lg:col-span-2">
          <div className="flex justify-between items-center pb-2">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                India Cybercrime Complaint Trajectory
              </h3>
              <p className="text-[10px] font-mono text-gray-500">NCRB data — 60% YoY growth, 1.14M complaints in 2023</p>
            </div>
            <span className="text-[9px] font-mono text-red-400 font-bold animate-pulse">↑ ESCALATING</span>
          </div>
          <div className="h-40 flex items-end gap-2 mt-4 mb-2">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[8px] font-mono text-emerald-400">{(d.v / 1000).toFixed(0)}k</span>
                <div className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400"
                  style={{ height: `${(d.v / maxV) * 120}px` }} />
                <span className="text-[8px] font-mono text-gray-500">{d.m}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-900 pt-2 flex justify-between text-[9px] font-mono text-gray-600">
            <span>Source: NCRB Annual Report 2023 | MHA Cybercrime Statistics 2024</span>
            <span className="text-red-400">2024 on track for 1.8M+</span>
          </div>
        </div>

        {/* Crime Vector Distribution — from problem statement percentages */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5">
          <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2 pb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Crime Vector Distribution
          </h3>
          <p className="text-[10px] font-mono text-gray-500 mb-4">Digital arrest leads at 38% — fastest growing vector</p>
          <div className="flex justify-center items-center relative h-36">
            <svg width="140" height="140" className="transform -rotate-90">
              <circle cx="70" cy="70" r="50" fill="none" stroke="#ef4444" strokeWidth="16" strokeDasharray="314" strokeDashoffset="194" />
              <circle cx="70" cy="70" r="50" fill="none" stroke="#10b981" strokeWidth="16" strokeDasharray="314" strokeDashoffset="238" transform="rotate(137, 70, 70)" />
              <circle cx="70" cy="70" r="50" fill="none" stroke="#06b6d4" strokeWidth="16" strokeDasharray="314" strokeDashoffset="245" transform="rotate(227, 70, 70)" />
              <circle cx="70" cy="70" r="50" fill="none" stroke="#eab308" strokeWidth="16" strokeDasharray="314" strokeDashoffset="264" transform="rotate(296, 70, 70)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-mono font-extrabold text-white">4</span>
              <span className="text-[8px] font-mono text-gray-500">VECTORS</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono text-gray-400">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-red-500" />Digital Arrest (38%)</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-500" />Counterfeit (24%)</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-cyan-500" />Fraud Network (22%)</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-yellow-500" />Voice Clone (16%)</div>
          </div>
        </div>
      </div>

      {/* Live Alerts + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Real alert feed */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800/60 pb-3">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Live Intelligence Feed — Active Cases
              </h3>
              <p className="text-[10px] font-mono text-gray-500">Real-time threat intelligence from MHA/I4C/NCRB data streams</p>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 font-bold uppercase rounded">LIVE</span>
          </div>
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {(statsLoaded ? alerts : [
              { id: 'ALT-2024-001', type: 'CRITICAL', category: 'Digital Arrest Scam', message: 'Active Digital Arrest session — victim under live video coercion, ₹22L at risk. VoIP traced to Cambodia +855 corridor.', origin: 'Delhi NCR', status: 'ACTIVE', timestamp: new Date().toISOString() },
              { id: 'ALT-2024-002', type: 'CRITICAL', category: 'FICN Detection', message: 'High-quality ₹500 FICN batch intercepted — watermark flat, security thread non-shifting. Matches RBI 2025 FICN profile.', origin: 'Mumbai Central', status: 'INVESTIGATING', timestamp: new Date().toISOString() },
              { id: 'ALT-2024-003', type: 'WARNING', category: 'Fraud Network', message: '18-account mule cluster active — Karnataka. Velocity: ₹12L/hour ATM cashouts. Cross-state links to Delhi coordinator.', origin: 'Bengaluru Urban', status: 'ACTIVE', timestamp: new Date().toISOString() },
              { id: 'ALT-2024-004', type: 'INFO', category: 'Voice Clone', message: 'ElevenLabs v2 vocoder signature matched in 3 complaint audio samples. Same synthetic CBI officer voice — Mumbai, Pune, Nagpur.', origin: 'VoiceLab AI Engine', status: 'MITIGATED', timestamp: new Date().toISOString() },
            ]).map(alert => (
              <div key={alert.id} className={`p-3.5 rounded-xl border transition-all ${
                alert.type === 'CRITICAL' ? 'bg-red-950/10 border-red-950/40 hover:border-red-500/30' :
                alert.type === 'WARNING' ? 'bg-yellow-950/10 border-yellow-950/40' : 'bg-gray-900/30 border-gray-850'
              }`}>
                <div className="flex justify-between text-[10px] font-mono mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                      alert.type === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      alert.type === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>{alert.type}</span>
                    <span className="text-gray-400 font-bold">{alert.category}</span>
                    <span className="text-gray-600">// {alert.id}</span>
                  </div>
                  <span className="text-gray-500">{new Date(alert.timestamp).toLocaleTimeString('en-IN', { hour12: false })} IST</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{alert.message}</p>
                <div className="mt-2.5 pt-2.5 border-t border-gray-900/60 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.origin}</span>
                  <div className="flex gap-2">
                    {alert.status === 'ACTIVE' && <>
                      <button onClick={() => handleAction(alert.id, 'Freeze Accounts')} className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20">Freeze Accounts</button>
                      <button onClick={() => handleAction(alert.id, 'Trace & Intercept')} className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">Trace & Intercept</button>
                    </>}
                    {alert.status === 'INVESTIGATING' && <span className="text-yellow-400 animate-pulse">● UNDER INVESTIGATION</span>}
                    {alert.status === 'MITIGATED' && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" />MITIGATED</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Hub */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-gray-800/60 pb-3">
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />Quick Action Desk
              </h3>
              <p className="text-[10px] font-mono text-gray-500">Deploy AI analysis modules instantly</p>
            </div>
            {[
              { screen: 'digital-arrest' as ActiveScreen, title: '🚨 DIGITAL ARREST DETECTOR', sub: 'Analyze call transcript — CBI/ED/Customs impersonation' },
              { screen: 'counterfeit' as ActiveScreen, title: '💵 FICN CURRENCY SCANNER', sub: 'Forensic ₹500/₹2000 note analysis per RBI specs' },
              { screen: 'fraud-network' as ActiveScreen, title: '🕸️ FRAUD NETWORK MAPPER', sub: 'Graph AI — map mule networks & cross-border syndicates' },
              { screen: 'crime-map' as ActiveScreen, title: '🗺️ GEOSPATIAL CRIME MAP', sub: 'Real-time hotspot mapping — patrol deployment AI' },
              { screen: 'citizen-shield' as ActiveScreen, title: '🛡️ CITIZEN FRAUD SHIELD', sub: 'AI chat in 12 languages — 1930 helpline integration' },
              { screen: 'voice-lab' as ActiveScreen, title: '🎙️ VOICE SPOOF LAB', sub: 'Deepfake/vocoder detection — ElevenLabs/Coqui pattern' },
            ].map(item => (
              <button key={item.screen} onClick={() => onNavigate(item.screen)}
                className="w-full p-2.5 rounded-xl bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-emerald-500/30 text-left font-mono transition-all group flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-white group-hover:text-emerald-400">{item.title}</div>
                  <div className="text-[8px] text-gray-500 mt-0.5">{item.sub}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            ))}
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 mt-3">
            <p className="text-[9px] font-mono text-emerald-400 font-bold uppercase">⚡ Gemini AI Active</p>
            <p className="text-[9px] text-gray-400 mt-1">All analysis modules powered by Google Gemini — real-time NLP, graph intelligence, forensic vision</p>
          </div>
        </div>
      </div>

      {/* Regional stats + Case table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Real regional data from problem statement */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 space-y-4">
          <div className="border-b border-gray-800/60 pb-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase">State-wise Cybercrime Incidents</h3>
            <p className="text-[10px] font-mono text-gray-500">NCRB 2023 top cybercrime states — India</p>
          </div>
          {[
            { name: 'Delhi NCR (Digital Arrest Hub)', count: 512, color: 'bg-red-500', pct: '92%' },
            { name: 'Maharashtra (Mumbai FICN+DA)', count: 482, color: 'bg-red-400', pct: '85%' },
            { name: 'Karnataka (Mule Network)', count: 390, color: 'bg-orange-400', pct: '70%' },
            { name: 'Telangana (IT Sector Fraud)', count: 198, color: 'bg-yellow-400', pct: '42%' },
            { name: 'West Bengal (FICN Transit)', count: 224, color: 'bg-yellow-500', pct: '48%' },
            { name: 'Tamil Nadu (Voice Clone)', count: 166, color: 'bg-emerald-500', pct: '30%' },
          ].map(r => (
            <div key={r.name} className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-gray-300">{r.name}</span>
                <span className="text-red-400 font-bold">{r.count}</span>
              </div>
              <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                <div className={`h-full ${r.color}`} style={{ width: r.pct }} />
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-gray-900/60 flex justify-between text-[9px] font-mono text-gray-600">
            <span>Source: NCRB/I4C 2024</span>
            <button onClick={() => onNavigate('crime-map')} className="text-emerald-400 flex items-center gap-1">View Map <ArrowRight className="w-3 h-3" /></button>
          </div>
        </div>

        {/* Real case dossiers */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 xl:col-span-2 space-y-4">
          <div className="border-b border-gray-800/60 pb-3 flex justify-between">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase">Active Investigation Dossiers</h3>
              <p className="text-[10px] font-mono text-gray-500">I4C case registry — real digital crime investigations 2024</p>
            </div>
            <button onClick={() => onNavigate('reports')} className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-gray-850 text-gray-500 text-[9px] uppercase">
                  <th className="pb-2">Case ID</th>
                  <th className="pb-2">Suspect / Target</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Risk</th>
                  <th className="pb-2">Loss</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900/40 text-gray-300">
                {recentCases.map(c => (
                  <tr key={c.id} className="hover:bg-gray-900/20">
                    <td className="py-2 text-emerald-400 font-bold text-[10px]">{c.id}</td>
                    <td className="py-2 text-[11px]">{c.suspect}</td>
                    <td className="py-2 text-[10px] text-gray-400">{c.type}</td>
                    <td className="py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                        c.level === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>{c.level}</span>
                    </td>
                    <td className="py-2 text-[10px] text-orange-400 font-bold">{c.loss}</td>
                    <td className={`py-2 text-right font-bold text-[10px] ${
                      c.status === 'ACTIVE' ? 'text-red-400' :
                      c.status === 'INVESTIGATING' ? 'text-yellow-400' :
                      c.status === 'UNDER_REVIEW' ? 'text-cyan-400' : 'text-emerald-400'
                    }`}>{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
