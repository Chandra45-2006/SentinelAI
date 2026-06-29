import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Layers, AlertTriangle, CheckCircle, XCircle, Camera } from 'lucide-react';
import { geminiJSON, DEMO_COUNTERFEIT } from '../gemini';

interface NoteTemplate {
  key: string;
  label: string;
  denomination: '100' | '200' | '500' | '2000';
  serialNumber: string;
  series: string;
  printerCode: string;
  description?: string;
}

interface ScanResult {
  verdict: 'GENUINE' | 'COUNTERFEIT' | 'SUSPECTED';
  confidence: number;
  anomalies: Array<{
    id: string; name: string; description: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    location: string; xPercent: number; yPercent: number;
  }>;
  securityFeatureChecks: Array<{
    feature: string; status: 'PASS' | 'FAIL' | 'SUSPICIOUS'; detail: string;
  }>;
  rbiFicnAlert: boolean;
  caseSeverity: 'HIGH' | 'MEDIUM' | 'LOW';
  fieldOfficerActions: string[];
  forenzicSummary: string;
}

const NOTE_TEMPLATES: NoteTemplate[] = [
  { key: '500_genuine', label: '₹500 Standard Circulation Note', denomination: '500', serialNumber: '5AC 482091', series: '2023-A', printerCode: 'RBI-NAS-40' },
  { key: '500_ficn', label: '₹500 Suspected FICN (Seized)', denomination: '500', serialNumber: '2BD 889210', series: '2024-C', printerCode: 'RBI-DEL-12', description: 'Watermark appears flat with no 3D depth. Security thread does not shift color under tilt. Microprinting shows ink bleed at edges. Intaglio print feels smooth instead of raised.' },
  { key: '2000_ficn', label: '₹2000 High-Risk Seizure Note', denomination: '2000', serialNumber: '5HA 119830', series: '2023-F', printerCode: 'RBI-BLR-02', description: 'Latent image missing at 45-degree tilt. Alignment register mismatch between front and back. Paper texture abnormal — feels lighter than genuine note. Number panel lacks raised texture.' },
  { key: '100_verify', label: '₹100 Bank Counter Submission', denomination: '100', serialNumber: '4KL 330812', series: '2024-B', printerCode: 'RBI-NAS-08' },
];

export default function CounterfeitDetection({ onAddLog }: { onAddLog: (log: string) => void }) {
  const [selectedNote, setSelectedNote] = useState<NoteTemplate>(NOTE_TEMPLATES[1]);
  const [customFields, setCustomFields] = useState({ serialNumber: '', description: '' });
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-load demo scan result on mount — shows FICN detection immediately
  useEffect(() => {
    const result = DEMO_COUNTERFEIT('500', true) as ScanResult;
    setScanResult(result);
    onAddLog(`✅ Forensic Scan (Demo Mode): ${result.verdict} — ${result.confidence}% confidence${result.rbiFicnAlert ? ' | 🚨 RBI FICN Alert!' : ''}`);
  }, []);

  const handleNoteSelect = (note: NoteTemplate) => {
    setSelectedNote(note);
    setScanResult(null);
    setSelectedAnomaly(null);
    setError(null);
    setCustomFields({ serialNumber: '', description: '' });
    onAddLog(`Selected note template: "${note.label}"`);
  };

  const handleScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    setError(null);
    const serial = customFields.serialNumber || selectedNote.serialNumber;
    const desc = customFields.description || selectedNote.description;
    onAddLog(`Running Gemini AI forensic scan on ₹${selectedNote.denomination} — Serial: ${serial}...`);

    try {
      const result = await geminiJSON<ScanResult>(`You are a forensic currency authentication expert for the Reserve Bank of India (RBI) FICN Detection Unit.
The RBI Annual Report 2025 flagged RECORD FICN seizures — high-quality ₹500 fakes defeating manual bank detection.

BANKNOTE DETAILS:
- Denomination: ₹${selectedNote.denomination}
- Serial Number: ${serial}
- Series: ${selectedNote.series}
- Printer Code: ${selectedNote.printerCode}
- Physical Observations: ${desc || 'No anomalies reported'}

ANALYSIS CRITERIA:
1. Serial format validation: RBI uses 3 uppercase letters + space + 6 digits (e.g., "5AC 482091")
2. Printer code: Valid presses are Nashik (RBI-NAS-xx), Dewas (RBI-DEW-xx), Mysore (RBI-MYS-xx), Salboni (RBI-SAL-xx)
3. ₹500 security features: Swachh Bharat latent image at 45°, windowed security thread with colour shift भारत+RBI, 17-language panel, intaglio raised print
4. ₹2000 security: Nano text RBI, MOTIF Mangalyaan, raised number panel
5. Known FICN defects (RBI 2025): flat watermark, non-shifting thread, ink-bleed microprint >0.1mm, smooth intaglio
6. Analyse observations field carefully — if anomalies described, classify them at appropriate severity

Return JSON only:
{
  "verdict": "<GENUINE|COUNTERFEIT|SUSPECTED>",
  "confidence": <integer 0-100>,
  "anomalies": [
    {"id":"A-1","name":"<anomaly name>","description":"<RBI spec deviation>","severity":"<CRITICAL|HIGH|MEDIUM>","location":"<position on note>","xPercent":<0-100>,"yPercent":<0-100>}
  ],
  "securityFeatureChecks": [
    {"feature":"Watermark","status":"<PASS|FAIL|SUSPICIOUS>","detail":"<specific finding>"},
    {"feature":"Security Thread","status":"<PASS|FAIL|SUSPICIOUS>","detail":"<specific finding>"},
    {"feature":"Microprinting","status":"<PASS|FAIL|SUSPICIOUS>","detail":"<specific finding>"},
    {"feature":"Intaglio Print","status":"<PASS|FAIL|SUSPICIOUS>","detail":"<specific finding>"},
    {"feature":"Serial Number","status":"<PASS|FAIL|SUSPICIOUS>","detail":"<specific finding>"},
    {"feature":"Latent Image","status":"<PASS|FAIL|SUSPICIOUS>","detail":"<specific finding>"}
  ],
  "rbiFicnAlert": <true if COUNTERFEIT or confidence>=70>,
  "caseSeverity": "<HIGH|MEDIUM|LOW>",
  "fieldOfficerActions": ["<action citing IPC 489A if counterfeit>","<RBI submission step>","<investigation step>"],
  "forenzicSummary": "<2-3 sentence court-admissible forensic summary citing RBI specifications>"
}`);

      setScanResult(result);
      onAddLog(`✅ Gemini scan complete — Verdict: ${result.verdict} (${result.confidence}% confidence)${result.rbiFicnAlert ? ' 🚨 RBI FICN Alert triggered!' : ''}`);
    } catch (err: any) {
      const msg = String(err?.message || err);
      const isKeyError = msg.includes('INVALID_KEY') || msg.includes('API_KEY_INVALID') || msg.includes('API key not valid') || msg.includes('INVALID_ARGUMENT');
      if (isKeyError || msg.includes('QUOTA_EXHAUSTED') || msg.includes('quota')) {
        const hasSuspect = Boolean(selectedNote.description || customFields.description);
        const result = DEMO_COUNTERFEIT(selectedNote.denomination, hasSuspect) as ScanResult;
        setScanResult(result);
        onAddLog(`✅ Forensic Scan (Demo Mode): ${result.verdict} — ${result.confidence}% confidence${result.rbiFicnAlert ? ' | 🚨 RBI FICN Alert!' : ''}`);
        onAddLog('ℹ️ Using demo forensic data — add a valid VITE_GEMINI_API_KEY to .env for live AI scanning');
      } else {
        setError(`Scan error: ${msg}`);
        onAddLog(`⚠️ Scan failed: ${msg}`);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const verdictColors = {
    GENUINE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    COUNTERFEIT: 'bg-red-500/20 text-red-400 border-red-500/30',
    SUSPECTED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  const denomColor: Record<string, string> = {
    '500': 'from-stone-800/40 via-stone-700/30 to-stone-800/40 border-stone-700',
    '2000': 'from-rose-950/20 via-pink-900/10 to-rose-950/20 border-rose-900/30',
    '100': 'from-blue-950/20 via-blue-900/10 to-blue-950/20 border-blue-900/30',
    '200': 'from-yellow-950/20 via-yellow-900/10 to-yellow-950/20 border-yellow-900/30',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-extrabold text-white uppercase tracking-wider">
          Machine-Vision Counterfeit Currency Detection
        </h1>
        <p className="text-xs text-gray-400">
          Gemini AI forensic analysis of Indian banknote security features — watermarks, security threads, microprinting, serial validation per RBI FICN specifications. Source: RBI Annual Report 2025.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-400 font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Selection Panel */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 space-y-4 h-fit">
          <div className="border-b border-gray-800/60 pb-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase">1. Document Ingestion Desk</h3>
            <p className="text-[10px] font-mono text-gray-500">Select note sample or enter custom details</p>
          </div>

          <div className="space-y-2">
            {NOTE_TEMPLATES.map(note => (
              <button key={note.key} onClick={() => handleNoteSelect(note)}
                className={`w-full p-3 rounded-xl border font-mono text-xs flex justify-between items-center transition-all ${
                  selectedNote.key === note.key
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                    : 'bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
                }`}>
                <div className="text-left">
                  <div className="font-bold">{note.label}</div>
                  <div className="text-[9px] text-gray-500 mt-0.5">SN: {note.serialNumber}</div>
                </div>
                {note.description
                  ? <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold uppercase">SUSPECT</span>
                  : <span className="text-[8px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-300 border border-gray-600 font-bold uppercase">NORMAL</span>
                }
              </button>
            ))}
          </div>

          <div className="space-y-2 border-t border-gray-800 pt-3">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Custom Entry (Optional):</span>
            <input value={customFields.serialNumber} onChange={e => setCustomFields(p => ({ ...p, serialNumber: e.target.value }))}
              placeholder="Override serial number..."
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-500/50" />
            <textarea value={customFields.description} onChange={e => setCustomFields(p => ({ ...p, description: e.target.value }))}
              placeholder="Describe visual anomalies observed by officer..."
              className="w-full h-16 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-500/50 resize-none" />
          </div>

          {/* Note metadata */}
          <div className="bg-gray-900 border border-gray-850 rounded-xl p-3.5 font-mono text-xs space-y-2">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-1">Note Metadata</div>
            {[
              ['DENOMINATION', `₹${selectedNote.denomination}`],
              ['SERIAL NO', customFields.serialNumber || selectedNote.serialNumber],
              ['SERIES', selectedNote.series],
              ['PRINTER CODE', selectedNote.printerCode],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-400">{k}:</span>
                <span className="text-white font-bold">{v}</span>
              </div>
            ))}
          </div>

          <button onClick={handleScan} disabled={isScanning}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
            {isScanning
              ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>GEMINI AI SCANNING...</span></>
              : <><Sparkles className="w-4 h-4" /><span>INITIATE GEMINI FORENSIC SCAN</span></>}
          </button>
        </div>

        {/* Right: Visual Analysis */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 flex flex-col xl:col-span-2 space-y-4">
          <div className="border-b border-gray-800/60 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />2. Machine-Vision Forensic Overlay
              </h3>
              <p className="text-[10px] font-mono text-gray-500">Click anomaly markers (!) to inspect finding details</p>
            </div>
            {scanResult && (
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-1 rounded border ${verdictColors[scanResult.verdict]}`}>
                {scanResult.verdict} — {scanResult.confidence}%
              </span>
            )}
          </div>

          {/* Note visual */}
          <div className="bg-[#0b0f19] border border-gray-850 rounded-2xl aspect-[11/5] relative overflow-hidden flex items-center justify-center p-4">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            {isScanning && <div className="absolute inset-x-0 h-1 bg-emerald-400 scanning-line shadow-[0_0_15px_#10b981] z-20" />}
            <div className={`w-full h-full rounded-lg border relative flex flex-col justify-between p-4 bg-gradient-to-r ${denomColor[selectedNote.denomination]}`}>
              {/* Watermark zone */}
              <div className="w-20 h-full border border-gray-800/60 bg-gray-950/40 rounded flex flex-col justify-center items-center absolute left-4 top-0 bottom-0 my-4">
                <span className="text-[7px] font-mono text-gray-600 uppercase tracking-widest mb-1">WATERMARK</span>
                <div className="w-10 h-10 rounded-full border border-gray-800/60 flex items-center justify-center text-gray-600 text-lg">👤</div>
                <span className="text-[6px] font-mono text-gray-700 mt-1">MG PORTRAIT</span>
              </div>
              <div className="ml-28 space-y-1">
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 font-mono text-[10px] uppercase">RESERVE BANK OF INDIA</span>
                  <span className="text-white font-mono font-bold text-xl">₹{selectedNote.denomination}</span>
                </div>
                <div className="h-8 flex items-center">
                  <span className="text-2xl font-extrabold tracking-widest text-gray-700/25">₹{selectedNote.denomination}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>SERIES: {selectedNote.series}</span>
                  <span className="text-white font-bold">{customFields.serialNumber || selectedNote.serialNumber}</span>
                </div>
              </div>
              {/* Security thread */}
              <div className="absolute right-1/3 top-0 bottom-0 w-0.5 flex flex-col justify-between items-center py-2">
                {[...Array(5)].map((_, i) => <div key={i} className="w-0.5 h-3 bg-emerald-500" />)}
              </div>
              {/* Anomaly markers */}
              {scanResult?.anomalies.map(anom => (
                <button key={anom.id} onClick={() => setSelectedAnomaly(anom.id === selectedAnomaly ? null : anom.id)}
                  className="absolute w-6 h-6 bg-red-500/20 hover:bg-red-500/40 border-2 border-red-500 rounded-full flex items-center justify-center pulse-cyber"
                  style={{ left: `${anom.xPercent}%`, top: `${anom.yPercent}%` }} title={anom.name}>
                  <span className="text-[9px] font-mono text-red-400 font-bold">!</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected anomaly detail */}
          {selectedAnomaly && scanResult && (() => {
            const a = scanResult.anomalies.find(x => x.id === selectedAnomaly);
            if (!a) return null;
            return (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                <h4 className="text-xs font-mono font-bold text-red-400 flex items-center mb-1">
                  <AlertTriangle className="w-4 h-4 mr-1.5 animate-pulse" />
                  {a.name} — <span className="ml-1 text-[9px] text-red-300">{a.severity} SEVERITY</span>
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">{a.description}</p>
                <p className="text-[10px] font-mono text-gray-500 mt-1">Location: {a.location}</p>
              </div>
            );
          })()}

          {/* Security feature checks */}
          {scanResult && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {scanResult.securityFeatureChecks.map((check, i) => (
                <div key={i} className="bg-gray-900/40 p-3 border border-gray-850 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-gray-400">{check.feature}:</span>
                    {check.status === 'PASS'
                      ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      : check.status === 'FAIL'
                      ? <XCircle className="w-3.5 h-3.5 text-red-400" />
                      : <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />}
                  </div>
                  <p className="text-[9px] text-gray-500 leading-tight">{check.detail}</p>
                </div>
              ))}
            </div>
          )}

          {/* Field officer actions */}
          {scanResult && scanResult.verdict !== 'GENUINE' && (
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 space-y-2">
              <div className="text-[10px] font-mono text-red-400 font-bold uppercase flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />Field Officer Actions Required
              </div>
              {scanResult.fieldOfficerActions.map((action, i) => (
                <div key={i} className="text-[10px] font-mono text-gray-300 flex items-start gap-1.5">
                  <span className="text-red-400 font-bold">{i + 1}.</span>{action}
                </div>
              ))}
              {scanResult.rbiFicnAlert && (
                <div className="text-[10px] font-mono text-orange-400 font-bold border-t border-red-500/10 pt-2">
                  🚨 RBI FICN ALERT TRIGGERED — Report to RBI Currency Chest per FICN Protocol 2025
                </div>
              )}
              <p className="text-[9px] text-gray-500 font-mono mt-2 border-t border-gray-800 pt-2">{scanResult.forenzicSummary}</p>
            </div>
          )}

          {scanResult && scanResult.verdict === 'GENUINE' && (
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
              <div className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5 mb-1">
                <CheckCircle className="w-3.5 h-3.5" />Note Verified Genuine
              </div>
              <p className="text-[10px] font-mono text-gray-400">{scanResult.forenzicSummary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
