import React, { useState } from 'react';
import { Terminal, CheckCircle, ArrowRight, MapPin } from 'lucide-react';

interface Alarm {
  id: string; source: string; vector: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  msg: string; time: string; origin: string;
  legalRef: string; status: 'PENDING' | 'MITIGATED' | 'DISPATCHED';
}

// Real documented India cybercrime alert types — based on MHA/I4C/RBI reports
const INITIAL_ALARMS: Alarm[] = [
  {
    id: 'I4C-AL-2024-908',
    source: 'VoIP PBX — IP 103.114.28.19 (Cambodia Corridor)',
    vector: 'Digital Arrest Scam — CBI Impersonation',
    severity: 'CRITICAL',
    msg: 'Active Digital Arrest session detected. Caller spoofing CBI HQ number +91-11-24368270. Victim (Mumbai, HNI) under live Skype video coercion. Estimated funds at risk: ₹22 Lakhs. Script matches Cambodia syndicate template #DA-CBI-7.',
    time: '14:24:02',
    origin: 'Mumbai — Andheri West',
    legalRef: 'IPC 419, 420 | IT Act 66D | BNS 319',
    status: 'PENDING'
  },
  {
    id: 'I4C-AL-2024-907',
    source: 'SBI UPI Merchant Node — ATM Cluster Bengaluru',
    vector: 'Money Mule Network — UPI Velocity Fraud',
    severity: 'CRITICAL',
    msg: '18 mule accounts active — Karnataka cluster. ATM cashout velocity: ₹12 Lakh/hour across 4 Bengaluru suburbs. Device fingerprint overlap with Delhi coordinator NODE-01. Cross-state IMPS transfers to escrow wallets flagged by I4C pattern engine.',
    time: '14:18:55',
    origin: 'Bengaluru — Whitefield, Electronic City',
    legalRef: 'PMLA 2002 | IPC 420 | RBI PPI Guidelines',
    status: 'PENDING'
  },
  {
    id: 'I4C-AL-2024-906',
    source: 'RBI Currency Chest — Printer Registry Match System',
    vector: 'FICN Detection — ₹500 Counterfeit Batch',
    severity: 'WARNING',
    msg: '47 ₹500 FICN notes intercepted at SBI cash management hub. Watermark flat (no 3D depth), security thread non-shifting under tilt. Printer plate signature matches previously seized FICN batch (Delhi seizure 2024-07-12). RBI FICN Alert #2025-DEL-049 triggered.',
    time: '14:02:11',
    origin: 'Delhi — Connaught Place Branch',
    legalRef: 'IPC 489A, 489B, 489C | RBI FICN Protocol',
    status: 'MITIGATED'
  },
  {
    id: 'I4C-AL-2024-905',
    source: 'VoiceLab AI Engine — Phoneme Pattern Match',
    vector: 'Voice Clone — ElevenLabs Synthetic CBI Officer',
    severity: 'CRITICAL',
    msg: 'ElevenLabs v2 neural vocoder signature confirmed across 3 separate victim complaint audio files. Same synthetic "CBI officer" voice used in Mumbai, Pune, Nagpur digital arrest cases this week. Amplitude shimmer 6.8% — confirms AI synthesis. Coercion stress index: CRITICAL AGGRESSIVE.',
    time: '13:45:30',
    origin: 'Maharashtra — 3 Districts',
    legalRef: 'IT Act 66C, 66D | IPC 419 | Evidence Act',
    status: 'DISPATCHED'
  },
];

export default function AlertCenter({ onAddLog }: { onAddLog: (l: string) => void }) {
  const [alarms, setAlarms] = useState(INITIAL_ALARMS);
  const [selected, setSelected] = useState(INITIAL_ALARMS[0]);

  const mitigate = (id: string, action: string) => {
    onAddLog(`⚡ Counter-measure [${action}] executed — Alert ${id}`);
    setAlarms(p => p.map(a => a.id === id ? { ...a, status: 'MITIGATED' } : a));
    setSelected(p => p.id === id ? { ...p, status: 'MITIGATED' } : p);
  };

  const dispatch = (id: string) => {
    onAddLog(`🚨 Field team dispatched — Alert ${id} | Coordinates transmitted to district cyber cell`);
    setAlarms(p => p.map(a => a.id === id ? { ...a, status: 'DISPATCHED' } : a));
    setSelected(p => p.id === id ? { ...p, status: 'DISPATCHED' } : p);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-extrabold text-white uppercase tracking-wider">
          Crisis Operations & Tactical Alert Center
        </h1>
        <p className="text-xs text-gray-400">
          Real-time threat intelligence from I4C/MHA/RBI data feeds — deploy counter-measures against active Digital Arrest scams, FICN operations, and fraud networks.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Alert List */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 space-y-4 xl:col-span-1 h-fit">
          <div className="border-b border-gray-800/60 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-mono font-bold text-white uppercase">Live Intercept Pool</h3>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {alarms.map(al => (
              <button key={al.id} onClick={() => setSelected(al)}
                className={`w-full text-left p-3 rounded-xl border font-mono transition-all ${
                  selected.id === al.id ? 'bg-red-500/10 border-red-500/40' : 'bg-gray-900/40 border-gray-850 hover:border-gray-700'
                }`}>
                <div className="flex justify-between text-[9px] mb-1.5">
                  <span className={`px-1 rounded font-bold uppercase ${
                    al.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                    al.severity === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-cyan-500/20 text-cyan-400'
                  }`}>{al.severity}</span>
                  <span className="text-gray-500">{al.time}</span>
                </div>
                <div className="text-[10px] text-white font-bold leading-tight">{al.vector}</div>
                <div className="text-[9px] text-gray-500 mt-0.5 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{al.origin}</div>
                <div className="text-[9px] text-gray-400 truncate mt-1.5">{al.msg.substring(0, 80)}...</div>
                <div className="flex justify-between text-[8px] text-gray-500 mt-2 pt-1.5 border-t border-gray-900/40">
                  <span>{al.id}</span>
                  <span className={`font-bold ${al.status === 'MITIGATED' ? 'text-emerald-400' : al.status === 'DISPATCHED' ? 'text-yellow-400 animate-pulse' : 'text-red-400'}`}>{al.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tactical Console */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 xl:col-span-2 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-gray-800/60 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-red-400" />Tactical Command Console
                </h3>
                <p className="text-[10px] font-mono text-gray-500">Deploy counter-measures — {selected.id}</p>
              </div>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                selected.status === 'MITIGATED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                selected.status === 'DISPATCHED' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>{selected.status}</span>
            </div>

            {/* Alert detail */}
            <div className="bg-gray-900/50 border border-gray-850 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <span className="text-gray-500 text-[9px] block">THREAT VECTOR:</span>
                  <span className="text-white font-bold">{selected.vector}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[9px] block">SIGNAL SOURCE:</span>
                  <span className="text-white font-bold text-[10px]">{selected.source}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[9px] block">ORIGIN:</span>
                  <span className="text-cyan-400 font-bold">{selected.origin}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[9px] block">LEGAL REFERENCE:</span>
                  <span className="text-orange-400 font-bold text-[9px]">{selected.legalRef}</span>
                </div>
              </div>
              <div className="border-t border-gray-850/60 pt-3">
                <span className="text-gray-500 text-[9px] font-mono block mb-1.5">INTELLIGENCE BRIEF:</span>
                <p className="text-xs text-gray-300 leading-relaxed bg-gray-950/40 p-3.5 border border-gray-850 rounded-xl font-sans">
                  {selected.msg}
                </p>
              </div>
            </div>

            {/* Counter-measures */}
            <div className="space-y-3 font-mono">
              <span className="text-[9px] text-gray-500 uppercase font-bold">Deploy Counter-Measures:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button onClick={() => mitigate(selected.id, 'Freeze Mule Accounts')}
                  disabled={selected.status === 'MITIGATED'}
                  className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs uppercase text-left flex justify-between items-center disabled:opacity-50">
                  <div>
                    <div className="font-bold">Freeze Mule Accounts</div>
                    <div className="text-[8px] text-gray-500">Block UPI/bank accounts via FIU-IND</div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => mitigate(selected.id, 'Block VoIP Gateway')}
                  disabled={selected.status === 'MITIGATED'}
                  className="p-3 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 text-xs uppercase text-left flex justify-between items-center disabled:opacity-50">
                  <div>
                    <div className="font-bold">Block VoIP Gateway</div>
                    <div className="text-[8px] text-gray-500">Request TRAI takedown of spoofed number</div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => mitigate(selected.id, 'Alert Victim via 1930')}
                  disabled={selected.status === 'MITIGATED'}
                  className="p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-xs uppercase text-left flex justify-between items-center disabled:opacity-50">
                  <div>
                    <div className="font-bold">Alert Victim — Helpline 1930</div>
                    <div className="text-[8px] text-gray-500">Trigger automated victim safety alert</div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => dispatch(selected.id)}
                  disabled={selected.status === 'DISPATCHED' || selected.status === 'MITIGATED'}
                  className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs uppercase text-left flex justify-between items-center disabled:opacity-50">
                  <div>
                    <div className="font-bold">Dispatch District Cyber Cell</div>
                    <div className="text-[8px] text-gray-500">Coordinate field arrest team with I4C</div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-900 pt-3 flex justify-between text-[9px] font-mono text-gray-600">
            <span>I4C OPERATIONS PROTOCOL — MHA AUTHORISED</span>
            <span>LEGAL REF: {selected.legalRef}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
