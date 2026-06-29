import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Sliders,
  CheckCircle,
  Database,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Activity
} from 'lucide-react';

interface ApiKeyRow {
  name: string;
  keyVal: string;
  status: 'ACTIVE' | 'EXPIRED';
  lastUsed: string;
}

export default function SettingsConsole({
  onAddLog,
  auditLogs
}: {
  onAddLog: (log: string) => void;
  auditLogs: string[];
}) {
  const [showKeys, setShowKeys] = useState(false);
  const [securityLevels, setSecurityLevels] = useState({
    encryption256: true,
    interceptMute: false,
    auditTrail: true
  });

  const apiKeys: ApiKeyRow[] = [
    { name: 'Sovereign Telecom Intercept API', keyVal: 'sk_live_tele_90184_2026_sc_hq', status: 'ACTIVE', lastUsed: '3 mins ago' },
    { name: 'National Cyber Crime DB (NCR)', keyVal: 'sk_live_ncr_48209_del_police_esc', status: 'ACTIVE', lastUsed: 'Just now' },
    { name: 'Machine-Vision Watermark Engine', keyVal: 'sk_live_rbi_mv_77102_plate_verify', status: 'ACTIVE', lastUsed: '14 mins ago' },
    { name: 'Voice Biometrics Clone Detector', keyVal: 'sk_live_eleven_90182_voice_biom', status: 'ACTIVE', lastUsed: '1 hr ago' }
  ];

  const handleToggleSecurity = (key: keyof typeof securityLevels) => {
    const newVal = !securityLevels[key];
    setSecurityLevels(prev => ({ ...prev, [key]: newVal }));
    onAddLog(`Toggled security configuration: "${key}" to [${newVal ? 'ENABLED' : 'DISABLED'}]`);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-display font-extrabold text-white uppercase tracking-wider">
          Sovereign Security & Settings Console
        </h1>
        <p className="text-xs text-gray-400">
          Configure departmental API credentials, toggle live encryption layers, and view secure administrative access logs.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column: Profile & Security (Col span 1) */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 space-y-5 h-fit">
          <div className="border-b border-gray-800/60 pb-3 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Operator Profile & Security
            </h3>
          </div>

          <div className="flex items-center space-x-4 bg-gray-900/60 p-4 border border-gray-850 rounded-xl font-mono text-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-lg">
              01
            </div>
            <div className="space-y-0.5">
              <div className="text-white font-bold text-sm">ADMINISTRATOR-01</div>
              <div className="text-[10px] text-emerald-500 font-bold">LEVEL 5 ACCESS CLEARANCE</div>
              <div className="text-[9px] text-gray-500">IP: 10.244.20.91 (SECURE VPN)</div>
            </div>
          </div>

          {/* Configuration switches */}
          <div className="space-y-3 font-mono text-xs">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">Active Shield Controls:</span>

            <label className="flex items-center justify-between p-3 rounded-xl bg-gray-900/40 border border-gray-850 cursor-pointer hover:border-gray-700 transition-all">
              <div className="space-y-0.5">
                <span className="text-white font-bold block">256-Bit Link Encryption</span>
                <span className="text-[9px] text-gray-500">Lock communications through secure tunnels</span>
              </div>
              <input
                type="checkbox"
                checked={securityLevels.encryption256}
                onChange={() => handleToggleSecurity('encryption256')}
                className="accent-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-gray-900/40 border border-gray-850 cursor-pointer hover:border-gray-700 transition-all">
              <div className="space-y-0.5">
                <span className="text-white font-bold block">Live Cellular Intercept Logs</span>
                <span className="text-[9px] text-gray-500">Record all VoIP gateway sequences in database</span>
              </div>
              <input
                type="checkbox"
                checked={securityLevels.interceptMute}
                onChange={() => handleToggleSecurity('interceptMute')}
                className="accent-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-gray-900/40 border border-gray-850 cursor-pointer hover:border-gray-700 transition-all">
              <div className="space-y-0.5">
                <span className="text-white font-bold block">Auditable Operations Ledger</span>
                <span className="text-[9px] text-gray-500">Maintain permanent trail of console operations</span>
              </div>
              <input
                type="checkbox"
                checked={securityLevels.auditTrail}
                onChange={() => handleToggleSecurity('auditTrail')}
                className="accent-emerald-500"
              />
            </label>
          </div>
        </div>

        {/* Right column: API keys & logs (Col span 2) */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 flex flex-col justify-between xl:col-span-2">
          <div className="space-y-5">
            <div className="border-b border-gray-800/60 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center">
                  <Key className="w-4 h-4 text-emerald-400 mr-2" />
                  Sovereign API Access Keys
                </h3>
                <p className="text-[10px] font-mono text-gray-500">Configure connection strings for national intelligence hubs</p>
              </div>
              <button
                onClick={() => setShowKeys(!showKeys)}
                className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white font-mono text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                {showKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showKeys ? 'Hide Keys' : 'View Keys'}</span>
              </button>
            </div>

            {/* Render key table */}
            <div className="overflow-x-auto border border-gray-850 rounded-xl">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-gray-850 bg-gray-900/40 text-gray-500 uppercase text-[9px]">
                    <th className="p-2.5 font-bold">API Domain Name</th>
                    <th className="p-2.5 font-bold">Credential Key</th>
                    <th className="p-2.5 font-bold text-right">Last Used</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900/40 text-gray-300">
                  {apiKeys.map((keyRow, idx) => (
                    <tr key={idx} className="hover:bg-gray-900/20">
                      <td className="p-2.5 font-bold">{keyRow.name}</td>
                      <td className="p-2.5 font-mono text-gray-400">
                        {showKeys ? (
                          <span className="text-emerald-400">{keyRow.keyVal}</span>
                        ) : (
                          <span>••••••••••••••••••••••••</span>
                        )}
                      </td>
                      <td className="p-2.5 text-right text-gray-500">{keyRow.lastUsed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Active auditor logs list */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold font-mono">Active Auditor Logs:</span>
              <div className="bg-gray-900/40 border border-gray-850 rounded-xl p-4 font-mono text-[11px] text-gray-400 space-y-2 max-h-[160px] overflow-y-auto">
                {auditLogs.length === 0 ? (
                  <div className="text-gray-600 italic">No console operations logged in this session.</div>
                ) : (
                  auditLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">●</span>
                      <span>{log}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-900 pt-4 flex justify-between text-[10px] font-mono text-gray-500">
            <span>CONSOLE PARAMETERS SECURED</span>
            <span>SYSTEM AUDIT TIME COMPLIANT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
