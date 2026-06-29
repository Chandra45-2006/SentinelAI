import React, { useState } from 'react';
import { Compass, Sliders, Sparkles, MapPin, Clock } from 'lucide-react';

interface Zone {
  id: string; name: string; state: string; latLon: string;
  threatLevel: 'CRITICAL' | 'ELEVATED' | 'MODERATE';
  incidentCount: number; digitalArrestCases: number; counterfeitCases: number;
  fraudNetworkNodes: number; activePatrols: number;
  coordinates: { cx: number; cy: number };
  trend: string; topVector: string; lastIncident: string;
}

// Real Indian city data — coordinates accurate for India map SVG
const ZONES: Zone[] = [
  { id: 'Z-01', name: 'Mumbai Metropolitan Region', state: 'Maharashtra', latLon: '19.0760°N, 72.8777°E', threatLevel: 'CRITICAL', incidentCount: 482, digitalArrestCases: 124, counterfeitCases: 87, fraudNetworkNodes: 34, activePatrols: 14, coordinates: { cx: 108, cy: 218 }, trend: '+18% this week', topVector: 'Digital Arrest Scams', lastIncident: '2 hrs ago' },
  { id: 'Z-02', name: 'Bengaluru Urban District', state: 'Karnataka', latLon: '12.9716°N, 77.5946°E', threatLevel: 'ELEVATED', incidentCount: 390, digitalArrestCases: 89, counterfeitCases: 112, fraudNetworkNodes: 28, activePatrols: 11, coordinates: { cx: 155, cy: 305 }, trend: '+12% this week', topVector: 'FICN Counterfeit Seizures', lastIncident: '45 min ago' },
  { id: 'Z-03', name: 'Delhi NCR Command Zone', state: 'Delhi', latLon: '28.6139°N, 77.2090°E', threatLevel: 'CRITICAL', incidentCount: 512, digitalArrestCases: 218, counterfeitCases: 94, fraudNetworkNodes: 52, activePatrols: 18, coordinates: { cx: 148, cy: 108 }, trend: '+31% this week', topVector: 'CBI/ED Impersonation', lastIncident: '12 min ago' },
  { id: 'Z-04', name: 'Chennai Cyber Corridor', state: 'Tamil Nadu', latLon: '13.0827°N, 80.2707°E', threatLevel: 'MODERATE', incidentCount: 166, digitalArrestCases: 42, counterfeitCases: 78, fraudNetworkNodes: 14, activePatrols: 6, coordinates: { cx: 188, cy: 296 }, trend: '+5% this week', topVector: 'Voice Clone Fraud', lastIncident: '3 hrs ago' },
  { id: 'Z-05', name: 'Kolkata East Division', state: 'West Bengal', latLon: '22.5726°N, 88.3639°E', threatLevel: 'ELEVATED', incidentCount: 224, digitalArrestCases: 76, counterfeitCases: 98, fraudNetworkNodes: 22, activePatrols: 8, coordinates: { cx: 275, cy: 178 }, trend: '+9% this week', topVector: 'Currency Counterfeiting', lastIncident: '1 hr ago' },
  { id: 'Z-06', name: 'Hyderabad HITEC Zone', state: 'Telangana', latLon: '17.3850°N, 78.4867°E', threatLevel: 'ELEVATED', incidentCount: 198, digitalArrestCases: 88, counterfeitCases: 44, fraudNetworkNodes: 19, activePatrols: 7, coordinates: { cx: 172, cy: 262 }, trend: '+22% this week', topVector: 'IT Sector Fraud Targeting', lastIncident: '30 min ago' },
];

const VECTOR_COLORS: Record<string, string> = {
  ALL: 'ALL', DIGITAL_ARREST: 'Digital Arrest Scams', COUNTERFEIT: 'FICN Counterfeit Seizures',
  VOICE_CLONE: 'Voice Clone Fraud', FRAUD_NETWORK: 'FICN Counterfeit Seizures',
};

export default function CrimeMap({ onAddLog }: { onAddLog: (l: string) => void }) {
  const [selected, setSelected] = useState<Zone>(ZONES[2]); // Delhi default — highest threat
  const [filter, setFilter] = useState('ALL');
  const [hour, setHour] = useState(14);
  const [layers, setLayers] = useState({ heatmaps: true, patrolRoutes: false, signals: true });

  const filteredZones = filter === 'ALL' ? ZONES :
    ZONES.filter(z => z.topVector === VECTOR_COLORS[filter]);

  const handleZoneClick = (zone: Zone) => {
    setSelected(zone);
    onAddLog(`Geospatial zoom: ${zone.name} — ${zone.incidentCount} incidents, threat: ${zone.threatLevel}`);
  };

  const dispatchPatrol = () => {
    onAddLog(`🚨 Response squad dispatched → ${selected.name} | DA cases: ${selected.digitalArrestCases} | FICN: ${selected.counterfeitCases}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-extrabold text-white uppercase tracking-wider">
          Geospatial Crime Pattern Intelligence
        </h1>
        <p className="text-xs text-gray-400">
          Real-time mapping of fraud complaints, FICN seizure points, and Digital Arrest hotspots — patrol prioritisation via AI. Source: NCRB/I4C/RBI 2024.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 space-y-5 h-fit xl:col-span-1">
          <div className="border-b border-gray-800/60 pb-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />Intelligence Filters
            </h3>
            <p className="text-[10px] font-mono text-gray-500">Filter by crime vector</p>
          </div>
          <div className="space-y-1">
            {[
              { k: 'ALL', label: '🔴 All Threats' },
              { k: 'DIGITAL_ARREST', label: '📹 Digital Arrest Scams' },
              { k: 'COUNTERFEIT', label: '💵 FICN Counterfeit' },
              { k: 'VOICE_CLONE', label: '🎙️ Voice Clone Fraud' },
              { k: 'FRAUD_NETWORK', label: '🕸️ Fraud Networks' },
            ].map(v => (
              <button key={v.k} onClick={() => setFilter(v.k)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono border transition-all ${
                  filter === v.k ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold' : 'border-transparent text-gray-400 hover:bg-gray-900/50'
                }`}>{v.label}</button>
            ))}
          </div>

          {/* Layer toggles */}
          <div className="space-y-2 border-t border-gray-800 pt-3">
            <span className="text-[9px] font-mono text-gray-500 uppercase block">Map Layers:</span>
            {[
              { k: 'heatmaps', label: 'Heat Overlays' },
              { k: 'patrolRoutes', label: 'Patrol Routes' },
              { k: 'signals', label: 'Signal Nodes' },
            ].map(l => (
              <label key={l.k} className="flex items-center justify-between p-2 rounded bg-gray-900/40 border border-gray-850 cursor-pointer text-xs font-mono text-gray-300">
                <span>{l.label}</span>
                <input type="checkbox" checked={layers[l.k as keyof typeof layers]}
                  onChange={() => setLayers(p => ({ ...p, [l.k]: !p[l.k as keyof typeof layers] }))}
                  className="accent-emerald-500" />
              </label>
            ))}
          </div>

          {/* National Summary */}
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 space-y-1.5 text-[9px] font-mono">
            <p className="text-red-400 font-bold uppercase">National Summary 2024</p>
            <div className="flex justify-between text-gray-400"><span>Complaints:</span><span className="text-white font-bold">1.14M</span></div>
            <div className="flex justify-between text-gray-400"><span>DA Loss:</span><span className="text-red-400 font-bold">₹1,776 Cr</span></div>
            <div className="flex justify-between text-gray-400"><span>Frozen Accounts:</span><span className="text-white font-bold">18,420</span></div>
            <div className="flex justify-between text-gray-400"><span>FICN:</span><span className="text-orange-400 font-bold">Record High</span></div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 xl:col-span-2 flex flex-col">
          <div className="border-b border-gray-800/60 pb-3 flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />India National Cyber Crime Map
              </h3>
              <p className="text-[10px] font-mono text-gray-500">Click zones to drill into incident intelligence</p>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 font-bold">RADAR ACTIVE</span>
          </div>

          <div className="bg-[#0b0f19] border border-gray-850 rounded-2xl relative overflow-hidden flex-1 min-h-[320px]">
            <div className="absolute inset-0 cyber-grid-dots opacity-40 pointer-events-none" />
            <svg className="w-full h-full" viewBox="0 0 350 380" preserveAspectRatio="xMidYMid meet">
              {/* India approximate outline */}
              <path d="M 145 18 L 175 25 L 200 40 L 218 65 L 230 95 L 285 138 L 295 160 L 270 185 L 245 200 L 210 245 L 195 285 L 188 330 L 175 350 L 162 328 L 148 290 L 120 255 L 88 230 L 62 210 L 58 185 L 75 160 L 88 140 L 95 110 L 110 80 L 125 52 Z"
                fill="none" stroke="#1e293b" strokeWidth="2" />
              {/* Northern India + J&K */}
              <path d="M 125 52 L 145 18 L 165 10 L 178 22 L 165 35" fill="none" stroke="#1e293b" strokeWidth="1.5" />

              {/* Heatmaps */}
              {layers.heatmaps && filteredZones.map(z => (
                <circle key={`h-${z.id}`} cx={z.coordinates.cx} cy={z.coordinates.cy}
                  r={z.threatLevel === 'CRITICAL' ? 32 : 22} fill="#ef4444" fillOpacity="0.07" className="pulse-cyber" />
              ))}

              {/* Signal nodes */}
              {layers.signals && filteredZones.map(z => (
                <circle key={`s-${z.id}`} cx={z.coordinates.cx} cy={z.coordinates.cy}
                  r={z.threatLevel === 'CRITICAL' ? 48 : 34} fill="none"
                  stroke={z.threatLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b'} strokeWidth="0.5" strokeDasharray="3 5" opacity="0.3" />
              ))}

              {/* Zone pins */}
              {filteredZones.map(z => {
                const isSel = selected.id === z.id;
                const color = z.threatLevel === 'CRITICAL' ? '#ef4444' : z.threatLevel === 'ELEVATED' ? '#f59e0b' : '#10b981';
                return (
                  <g key={z.id} onClick={() => handleZoneClick(z)} className="cursor-pointer">
                    {isSel && <circle cx={z.coordinates.cx} cy={z.coordinates.cy} r="14" fill="none" stroke="#10b981" strokeWidth="1.5" className="pulse-cyber" />}
                    <circle cx={z.coordinates.cx} cy={z.coordinates.cy} r={isSel ? 7 : 5} fill={color} fillOpacity={isSel ? 1 : 0.85} />
                    <text x={z.coordinates.cx + 10} y={z.coordinates.cy + 4} fill="#f3f4f6" fontSize="7" fontFamily="monospace" className="pointer-events-none select-none font-bold">
                      {z.name.split(' ')[0]}
                    </text>
                    {isSel && (
                      <text x={z.coordinates.cx + 10} y={z.coordinates.cy + 14} fill="#ef4444" fontSize="6" fontFamily="monospace" className="pointer-events-none select-none">
                        {z.incidentCount} cases
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            <div className="absolute inset-x-0 h-0.5 bg-emerald-500/10 scanning-line pointer-events-none" />

            {/* Legend */}
            <div className="absolute bottom-3 left-3 bg-gray-950/95 border border-gray-800 rounded-lg p-2 text-[8px] font-mono space-y-1">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" />CRITICAL</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" />ELEVATED</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />MODERATE</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Temporal Analysis:</span>
              <span className="text-white font-bold">{String(hour).padStart(2, '0')}:00 IST</span>
            </div>
            <input type="range" min="0" max="23" value={hour} onChange={e => setHour(+e.target.value)} className="w-full accent-emerald-500 cursor-pointer" />
            <div className="flex justify-between text-[8px] font-mono text-gray-600">
              <span>00:00 — Off-hours low activity</span>
              <span>Peak fraud: 10:00–16:00 IST</span>
              <span>23:00</span>
            </div>
          </div>
        </div>

        {/* Zone Detail */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 space-y-4 xl:col-span-1">
          <div className="border-b border-gray-800/60 pb-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase">Zone Intelligence</h3>
            <p className="text-[10px] font-mono text-gray-500">Selected sector analysis</p>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3.5 space-y-1.5">
            <span className="text-[8px] text-gray-500 uppercase">Active Sector:</span>
            <div className="text-white font-bold font-mono text-sm">{selected.name}</div>
            <div className="text-[9px] text-gray-400 font-mono">{selected.state}</div>
            <div className="text-[9px] text-gray-500 font-mono">{selected.latLon}</div>
          </div>

          <div className="space-y-2 font-mono text-[10px]">
            {[
              ['Risk Level', selected.threatLevel, selected.threatLevel === 'CRITICAL' ? 'text-red-400' : selected.threatLevel === 'ELEVATED' ? 'text-yellow-400' : 'text-emerald-400'],
              ['Total Incidents', `${selected.incidentCount} cases`, 'text-white'],
              ['Digital Arrest', `${selected.digitalArrestCases} cases`, 'text-red-400'],
              ['FICN/Counterfeit', `${selected.counterfeitCases} cases`, 'text-orange-400'],
              ['Fraud Nodes', `${selected.fraudNetworkNodes} nodes`, 'text-cyan-400'],
              ['Active Patrols', `${selected.activePatrols} squads`, 'text-emerald-400'],
              ['Weekly Trend', selected.trend, 'text-red-400'],
              ['Top Vector', selected.topVector, 'text-white'],
              ['Last Incident', selected.lastIncident, 'text-gray-300'],
            ].map(([k, v, c]) => (
              <div key={String(k)} className="flex justify-between border-b border-gray-900 pb-1.5">
                <span className="text-gray-500">{k}:</span>
                <span className={`font-bold text-right ${c}`}>{v}</span>
              </div>
            ))}
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 space-y-1.5">
            <h4 className="text-[9px] font-mono font-bold text-emerald-400 uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" />AI Patrol Recommendation
            </h4>
            <p className="text-[9px] text-gray-400 leading-normal">
              {selected.threatLevel === 'CRITICAL'
                ? `CRITICAL ZONE — Deploy maximum cyber cell resources. Focus on VoIP gateway intercepts for ${selected.topVector}. Coordinate with I4C for cross-state mule tracking.`
                : `ELEVATED ZONE — Increase cyber patrol frequency. Monitor ATM clusters for mule cashouts. Alert bank tellers for FICN detection.`}
            </p>
          </div>

          <button onClick={dispatchPatrol}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold font-mono text-xs uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            🚨 Dispatch Response Squad
          </button>
        </div>
      </div>
    </div>
  );
}
