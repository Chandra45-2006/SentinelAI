import React, { useState, useEffect } from 'react';
import { Network, RefreshCw, Sparkles, AlertTriangle, FileText, Shield } from 'lucide-react';
import { geminiJSON, DEMO_FRAUD_NETWORK } from '../gemini';

interface NetworkNode {
  id: string; label: string;
  type: 'SCAMMER' | 'MULE_BANK' | 'DEVICE' | 'VICTIM' | 'COORDINATOR';
  details: string; fundsRisk: string; ipOverlap: string;
  strength: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  connections: string[]; jurisdiction: string;
}

interface AnalysisResult {
  networkSummary: string; totalFundsAtRisk: string;
  geographicSpread: string[]; riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  nodes: NetworkNode[];
  evidencePackage: {
    caseNumber: string; complaintsLinked: number;
    crossJurisdiction: boolean; courtAdmissible: boolean; keyFindings: string[];
  };
  investigationLeads: string[];
  disruptionStrategy: string;
}

const NODE_COLORS: Record<string, string> = {
  SCAMMER: '#ef4444', COORDINATOR: '#f97316',
  MULE_BANK: '#eab308', DEVICE: '#a855f7', VICTIM: '#3b82f6',
};

const NODE_POSITIONS = [
  { cx: 250, cy: 155 }, { cx: 110, cy: 85 }, { cx: 390, cy: 85 },
  { cx: 70, cy: 215 }, { cx: 430, cy: 215 }, { cx: 155, cy: 300 },
  { cx: 345, cy: 300 }, { cx: 250, cy: 330 },
];

// Default nodes — real Indian cybercrime patterns
const DEFAULT_NODES: NetworkNode[] = [
  { id: 'NODE-01', label: 'Cambodia Syndicate Controller FX-8892', type: 'COORDINATOR', details: 'Overseas mastermind coordinating Digital Arrest campaigns targeting Indian HNIs. Operating from Poipet, Cambodia border zone. Uses encrypted Telegram channels.', fundsRisk: '₹4.8 Cr Total', ipOverlap: '103.114.28.19', strength: 'CRITICAL', connections: ['NODE-02', 'NODE-03', 'NODE-04'], jurisdiction: 'Poipet, Cambodia' },
  { id: 'NODE-02', label: 'Karnataka Mule Account Cluster', type: 'MULE_BANK', details: 'Jan-Dhan accounts opened with synthetic Aadhaar credentials at SBI/PNB Bengaluru branches. Cashout velocity ₹12L/hour at Whitefield ATMs.', fundsRisk: '₹1.1 Cr active', ipOverlap: '49.207.44.11', strength: 'CRITICAL', connections: ['NODE-01', 'NODE-05'], jurisdiction: 'Bengaluru, Karnataka' },
  { id: 'NODE-03', label: 'Delhi VoIP PBX Hub — Spoofed CBI Numbers', type: 'DEVICE', details: 'Virtual PBX server routing calls through spoofed +91-11-24368270 (CBI HQ) and ED numbers to victims across NCR. VoIP termination via BSNL trunk lines.', fundsRisk: '₹0', ipOverlap: '103.114.28.12', strength: 'HIGH', connections: ['NODE-01', 'NODE-06'], jurisdiction: 'Delhi NCR, India' },
  { id: 'NODE-04', label: 'Mumbai HNI Victim — Active Session', type: 'VICTIM', details: 'High Net-Worth Individual under active live coercion. Skype video call active for 6 hours. Family assets at risk. Identified via complaint to 1930 helpline.', fundsRisk: '₹8.4 Lakhs at risk', ipOverlap: '49.207.12.8', strength: 'LOW', connections: ['NODE-01'], jurisdiction: 'Andheri West, Mumbai' },
  { id: 'NODE-05', label: 'Sub-Mule ATM Cashout Operator', type: 'MULE_BANK', details: 'Ground-level cash withdrawal operator. Flagged at 4 ATMs in Bengaluru Electronic City for rapid succession withdrawals. Device fingerprint shared with NODE-02.', fundsRisk: '₹18 Lakhs', ipOverlap: '49.207.44.99', strength: 'CRITICAL', connections: ['NODE-02'], jurisdiction: 'Bengaluru, Karnataka' },
  { id: 'NODE-06', label: 'WhatsApp Bulk Broadcast Device', type: 'DEVICE', details: 'E-SIM smartphone cluster broadcasting fake arrest warrants and MHA circular screenshots to victim contacts. 1,240 messages sent this week.', fundsRisk: '₹0', ipOverlap: '103.114.28.40', strength: 'MEDIUM', connections: ['NODE-03'], jurisdiction: 'Delhi NCR, India' },
];

export default function FraudNetwork({ onAddLog }: { onAddLog: (log: string) => void }) {
  const [selectedNode, setSelectedNode] = useState<NetworkNode>(DEFAULT_NODES[0]);
  const [nodes, setNodes] = useState<NetworkNode[]>(DEFAULT_NODES);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [victimReport, setVictimReport] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Auto-load demo data on mount so the network graph is populated immediately
  useEffect(() => {
    const data = DEMO_FRAUD_NETWORK as AnalysisResult;
    setAnalysisResult(data);
    setNodes(data.nodes.map(n => ({ ...n, connections: n.connections || [] })));
    setSelectedNode(data.nodes[0]);
    onAddLog(`✅ Network Mapped (Demo Mode): ${data.nodes.length} nodes | ${data.riskLevel} risk | ${data.totalFundsAtRisk} at risk | Case: ${data.evidencePackage.caseNumber}`);
  }, []);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    onAddLog('Initiating Gemini AI fraud network graph analysis...');

    try {
      const data = await geminiJSON<AnalysisResult>(`You are a Fraud Network Graph Intelligence Analyst at India's Cyber Crime Coordination Centre (I4C), MHA.

${victimReport ? `Analyze this fraud case data:
VICTIM/CASE REPORT: ${victimReport}` : `Generate a realistic current fraud network analysis based on 2024-2025 Indian cybercrime intelligence:
- Cambodia/Myanmar cross-border Digital Arrest syndicates targeting Indian HNIs
- Karnataka mule account networks at SBI/PNB/HDFC branches  
- Delhi VoIP infrastructure spoofing CBI/ED/RBI government numbers
- UPI velocity fraud with cross-state IMPS layering`}

Build a 6-8 node fraud network graph with:
- COORDINATOR: Overseas mastermind (Cambodia/Myanmar/Dubai)
- SCAMMER: Direct call operators running DA scripts
- MULE_BANK: Indian bank mule accounts receiving transfers (real Indian banks)
- DEVICE: VoIP servers, spoofed SIM clusters, WhatsApp broadcast infrastructure
- VICTIM: Targeted individuals

Use realistic Indian cybercrime intelligence:
- IP ranges: 103.114.xx.xx (Cambodia VoIP), 49.207.xx.xx (Indian ISPs)
- Real Indian jurisdictions
- Realistic fund amounts in lakhs/crores

Return JSON:
{
  "networkSummary": "<2-3 sentence intelligence summary of this fraud syndicate>",
  "totalFundsAtRisk": "<₹X Crore/Lakh>",
  "geographicSpread": ["<location 1>","<location 2>","<location 3>"],
  "riskLevel": "<CRITICAL|HIGH|MEDIUM>",
  "nodes": [
    {"id":"NODE-01","label":"<intelligence label>","type":"<SCAMMER|MULE_BANK|DEVICE|VICTIM|COORDINATOR>","details":"<specific technical intel>","fundsRisk":"<₹amount or ₹0>","ipOverlap":"<realistic IP>","strength":"<CRITICAL|HIGH|MEDIUM|LOW>","connections":["NODE-02","NODE-03"],"jurisdiction":"<specific location>"}
  ],
  "evidencePackage": {
    "caseNumber":"<I4C-2025-XXXXXX>",
    "complaintsLinked":<number>,
    "crossJurisdiction":<boolean>,
    "courtAdmissible":<boolean>,
    "keyFindings":["<finding citing IPC/IT Act>","<finding 2>","<finding 3>"]
  },
  "investigationLeads":["<actionable lead 1>","<lead 2>","<lead 3>"],
  "disruptionStrategy":"<specific multi-agency takedown strategy referencing I4C/INTERPOL/TRAI/FIU-IND>"
}`);

      setAnalysisResult(data);
      const positioned = data.nodes.map(n => ({ ...n, connections: n.connections || [] }));
      setNodes(positioned);
      if (positioned.length > 0) setSelectedNode(positioned[0]);
      onAddLog(`✅ Network mapped: ${data.nodes.length} nodes | Risk: ${data.riskLevel} | Case: ${data.evidencePackage.caseNumber} | Funds at risk: ${data.totalFundsAtRisk}`);
    } catch (err: any) {
      const msg = String(err?.message || err);
      const isKeyError = msg.includes('INVALID_KEY') || msg.includes('API_KEY_INVALID') || msg.includes('API key not valid') || msg.includes('INVALID_ARGUMENT');
      if (isKeyError || msg.includes('QUOTA_EXHAUSTED') || msg.includes('quota')) {
        const data = DEMO_FRAUD_NETWORK as AnalysisResult;
        setAnalysisResult(data);
        setNodes(data.nodes.map(n => ({ ...n, connections: n.connections || [] })));
        setSelectedNode(data.nodes[0]);
        onAddLog(`✅ Network Mapped (Demo Mode): ${data.nodes.length} nodes | ${data.riskLevel} risk | ${data.totalFundsAtRisk} at risk | Case: ${data.evidencePackage.caseNumber}`);
        onAddLog('ℹ️ Using demo intelligence — add valid VITE_GEMINI_API_KEY for live AI network mapping');
      } else {
        setError(`Network analysis error: ${msg}`);
        onAddLog(`⚠️ Network analysis failed: ${msg}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const positionedNodes = nodes.slice(0, NODE_POSITIONS.length).map((n, i) => ({
    ...n, pos: NODE_POSITIONS[i],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-extrabold text-white uppercase tracking-wider">
          Fraud Network Graph Intelligence
        </h1>
        <p className="text-xs text-gray-400">
          Gemini AI maps transaction metadata, call records, and device fingerprints into court-admissible intelligence packages. Tracks Cambodia/Myanmar syndicates, Karnataka mule networks, and VoIP infrastructure. Source: I4C/MHA 2024.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-400 font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      {/* Input */}
      <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-4 flex gap-3 items-start">
        <textarea value={victimReport} onChange={e => setVictimReport(e.target.value)}
          placeholder="Paste victim complaint, transaction details, or call records to generate a new AI-mapped fraud network. Leave empty for auto-generated current intelligence based on I4C 2024 patterns..."
          className="flex-1 h-14 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-500/50 resize-none" />
        <button onClick={runAnalysis} disabled={isAnalyzing}
          className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-mono font-bold uppercase flex items-center gap-2 disabled:opacity-50 h-14 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          {isAnalyzing ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>MAPPING...</span></> : <><Sparkles className="w-4 h-4" /><span>AI MAP NETWORK</span></>}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Graph */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 xl:col-span-2 flex flex-col">
          <div className="border-b border-gray-800/60 pb-3 flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <Network className="w-4 h-4 text-emerald-400 animate-pulse" />Syndicate Topology Map
              </h3>
              <p className="text-[10px] font-mono text-gray-500">Click nodes to drill down — {nodes.length} entities mapped</p>
            </div>
            <span className="text-[9px] font-mono text-emerald-400">I4C GRAPH INTELLIGENCE</span>
          </div>

          <div className="bg-[#0b0f19] border border-gray-850 rounded-2xl relative overflow-hidden flex-1 min-h-[320px]">
            <div className="absolute inset-0 cyber-grid-dots opacity-40 pointer-events-none" />
            <svg className="w-full h-full" viewBox="0 0 500 380" preserveAspectRatio="xMidYMid meet">
              {/* Connection lines */}
              {positionedNodes.map(node =>
                (node.connections || []).map(connId => {
                  const target = positionedNodes.find(n => n.id === connId);
                  if (!target) return null;
                  const isActive = selectedNode.id === node.id || selectedNode.id === connId;
                  return (
                    <line key={`${node.id}-${connId}`}
                      x1={node.pos.cx} y1={node.pos.cy} x2={target.pos.cx} y2={target.pos.cy}
                      stroke={isActive ? '#10b981' : '#1f2937'} strokeWidth={isActive ? 2 : 1.5}
                      strokeDasharray={node.type === 'DEVICE' ? '4 4' : undefined} />
                  );
                })
              )}
              {/* Nodes */}
              {positionedNodes.map(node => {
                const color = NODE_COLORS[node.type] || '#6b7280';
                const isSel = selectedNode.id === node.id;
                return (
                  <g key={node.id} onClick={() => { setSelectedNode(node); onAddLog(`Node intel: ${node.label} — ${node.type} | ${node.jurisdiction}`); }} className="cursor-pointer">
                    {isSel && <circle cx={node.pos.cx} cy={node.pos.cy} r="26" fill="none" stroke={color} strokeWidth="1" strokeDasharray="2 2" className="pulse-cyber" />}
                    <circle cx={node.pos.cx} cy={node.pos.cy} r={isSel ? 20 : 14}
                      fill={color} fillOpacity={isSel ? 0.25 : 0.1} stroke={color} strokeWidth={isSel ? 3 : 1.5} className="transition-all hover:stroke-emerald-400" />
                    <text x={node.pos.cx} y={node.pos.cy + (isSel ? 36 : 28)} fill="#f3f4f6" fontSize="8" fontFamily="monospace" textAnchor="middle" className="pointer-events-none">
                      {node.id}
                    </text>
                  </g>
                );
              })}
            </svg>
            {/* Legend */}
            <div className="absolute bottom-3 left-3 bg-gray-950/90 border border-gray-800 rounded-lg p-2 text-[8px] font-mono space-y-1 text-gray-400">
              {Object.entries(NODE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />{type}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis summary */}
          {analysisResult && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-gray-900/40 border border-gray-850 rounded-xl p-3 text-[10px] font-mono">
                <span className="text-gray-500 block">FUNDS AT RISK</span>
                <span className="text-red-400 font-bold">{analysisResult.totalFundsAtRisk}</span>
              </div>
              <div className="bg-gray-900/40 border border-gray-850 rounded-xl p-3 text-[10px] font-mono">
                <span className="text-gray-500 block">GEOGRAPHIC SPREAD</span>
                <span className="text-white font-bold text-[9px]">{analysisResult.geographicSpread.slice(0, 2).join(', ')}</span>
              </div>
              <div className="bg-gray-900/40 border border-gray-850 rounded-xl p-3 text-[10px] font-mono">
                <span className="text-gray-500 block">NETWORK RISK</span>
                <span className={`font-bold ${analysisResult.riskLevel === 'CRITICAL' ? 'text-red-400' : 'text-orange-400'}`}>{analysisResult.riskLevel}</span>
              </div>
            </div>
          )}
        </div>

        {/* Node Dossier */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 space-y-4">
          <div className="border-b border-gray-800/60 pb-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase">Node Intelligence Dossier</h3>
            <p className="text-[10px] font-mono text-gray-500">Selected entity deep analysis</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 space-y-2">
              <span className="text-[9px] text-gray-500 uppercase">Node Label:</span>
              <div className="text-white font-bold leading-tight">{selectedNode.label}</div>
              <div className="flex gap-2 flex-wrap mt-1">
                <span className="text-[8px] px-1.5 py-0.5 rounded uppercase font-bold border bg-gray-800 text-emerald-400 border-gray-700">{selectedNode.type}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-bold border ${
                  selectedNode.strength === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  selectedNode.strength === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }`}>{selectedNode.strength}</span>
              </div>
            </div>

            <p className="text-xs text-gray-300 font-sans bg-gray-900/20 p-3 rounded-lg border border-gray-850 leading-relaxed">{selectedNode.details}</p>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-900/40 p-3 border border-gray-850 rounded-xl">
                <span className="text-gray-500 text-[9px] block">FUNDS RISK</span>
                <span className="text-emerald-400 font-bold">{selectedNode.fundsRisk}</span>
              </div>
              <div className="bg-gray-900/40 p-3 border border-gray-850 rounded-xl">
                <span className="text-gray-500 text-[9px] block">IP / TRACE</span>
                <span className="text-white font-bold">{selectedNode.ipOverlap}</span>
              </div>
            </div>

            <div className="bg-gray-900/40 p-3 border border-gray-850 rounded-xl">
              <span className="text-gray-500 text-[9px] block">JURISDICTION</span>
              <span className="text-white font-bold">{selectedNode.jurisdiction}</span>
            </div>

            {analysisResult && (
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 space-y-1.5">
                <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5 uppercase">
                  <FileText className="w-3.5 h-3.5" />Evidence Package
                </div>
                <div className="text-[9px] text-gray-400">Case: <span className="text-white font-bold">{analysisResult.evidencePackage.caseNumber}</span></div>
                <div className="text-[9px] text-gray-400">Complaints: <span className="text-white font-bold">{analysisResult.evidencePackage.complaintsLinked}</span></div>
                <div className="text-[9px] text-gray-400">Court Admissible: <span className={analysisResult.evidencePackage.courtAdmissible ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{analysisResult.evidencePackage.courtAdmissible ? 'YES ✓' : 'PENDING'}</span></div>
                {analysisResult.evidencePackage.keyFindings.map((f, i) => (
                  <div key={i} className="text-[8px] text-gray-500">• {f}</div>
                ))}
              </div>
            )}

            {analysisResult && (
              <div className="bg-gray-900/40 p-3 border border-gray-850 rounded-xl text-[9px] font-mono text-gray-400">
                <span className="text-gray-500 block mb-1">DISRUPTION STRATEGY:</span>
                <span className="text-gray-300">{analysisResult.disruptionStrategy}</span>
              </div>
            )}

            <div className="space-y-2 pt-1 border-t border-gray-900">
              <button onClick={() => onAddLog(`🔒 Quarantine issued for ${selectedNode.id} — ${selectedNode.label}`)}
                className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-xs font-mono uppercase transition-all">
                🔒 QUARANTINE NODE
              </button>
              <button onClick={() => onAddLog(`📄 Evidence package exported for ${selectedNode.id} → NCRB portal`)}
                className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold text-xs font-mono uppercase flex items-center justify-center gap-2 transition-all">
                <Shield className="w-3.5 h-3.5" />SUBMIT TO NCRB
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
