import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Search, MessageSquare, Send, AlertTriangle, CheckCircle, Globe, RefreshCw } from 'lucide-react';
import { geminiJSON, DEMO_CITIZEN_SHIELD_CHAT, DEMO_CREDENTIAL_CHECK } from '../gemini';

interface ChatMessage {
  id: string; sender: 'CITIZEN' | 'AI_OFFICER';
  text: string; timestamp: string;
  alertLevel?: 'CRITICAL' | 'WARNING' | 'INFO' | 'SAFE';
  immediateActions?: string[];
}

interface CredentialResult {
  status: 'CLEARED' | 'HIGH_RISK_SCAM' | 'SUSPICIOUS' | 'UNKNOWN';
  riskScore: number; details: string; connections: string;
  recommendedActions: string[]; reportingPortal: string;
}

interface ChatResponse {
  reply: string; alertLevel: 'CRITICAL' | 'WARNING' | 'INFO' | 'SAFE';
  immediateActions: string[]; reportingLinks: string[]; language: string;
}

const LANGUAGES = [
  'English', 'Hindi', 'Bengali', 'Telugu', 'Marathi',
  'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Malayalam', 'Odia', 'Punjabi',
];

// Real scam scenarios documented by MHA/cybercrime.gov.in
const QUICK_QUERIES = [
  { label: '📹 Digital Arrest — CBI Video Call', text: 'A man claiming to be CBI officer is saying I am under "Digital Arrest" and must stay on Skype video call or I will be arrested. He says my Aadhaar was used to send drugs in a parcel.' },
  { label: '💸 Escrow Vault Transfer Demand', text: 'Someone from "ED Enforcement" asked me to transfer all my savings to a clearance vault UPI to prove my innocence. They said it will be returned in 48 hours.' },
  { label: '📦 Customs Narcotics Scam', text: 'Got a call saying Customs intercepted a DHL parcel with my name containing MDMA drugs and foreign passports. They want ₹2 lakhs to clear my name.' },
  { label: '🏦 Fake RBI Account Freeze', text: 'Received a call from "RBI Compliance" saying my account is linked to hawala and will be frozen in 2 hours unless I cooperate and transfer funds to an RBI escrow UPI.' },
];

export default function CitizenShield({ onAddLog }: { onAddLog: (log: string) => void }) {
  const [queryInput, setQueryInput] = useState('');
  const [queryResult, setQueryResult] = useState<CredentialResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([{
    id: 'init', sender: 'AI_OFFICER',
    text: '🛡️ Namaste! I am SentinelAI Citizen Shield — powered by Gemini AI, deployed by MHA for your protection.\n\nI can help you verify suspicious calls, UPI IDs, phone numbers, and websites in real-time across 12 Indian languages.\n\n⚠️ REMEMBER: Real CBI/ED/Customs/Police NEVER arrest anyone over video call. If someone says you are under "Digital Arrest" — IT IS ALWAYS A SCAM. Hang up immediately and call 1930.',
    timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
    alertLevel: 'INFO',
    immediateActions: ['Ask me about any suspicious call or message', 'Use credential checker to verify phone/UPI/URL'],
  }]);
  const [apiHistory, setApiHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [credError, setCredError] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const handleCredentialCheck = async () => {
    if (!queryInput.trim()) return;
    setIsChecking(true);
    setQueryResult(null);
    setCredError(null);
    onAddLog(`Citizen Shield verifying: "${queryInput.substring(0, 40)}..."`);

    try {
      const result = await geminiJSON<CredentialResult>(`You are India's National Cyber Crime Credential Verification System integrated with NCRB fraud databases.

Verify this credential: "${queryInput}"

Risk indicators for Indian fraud:
- Phone: +92 (Pakistan), +855 (Cambodia), +86 (China), +971 (UAE) = HIGH RISK fraud operation hubs
- UPI IDs with suspicious patterns (random alphanumeric + payment apps like @ybl, @okaxis)
- URLs pretending to be government but NOT .gov.in: e.g. cbi-verify.in, rbi-clearance.com, ed-noc.net, mha-alert.org
- Emails claiming government authority from gmail/yahoo = always scam
- Numbers associated with Digital Arrest scripts (spoofed +91-11 Delhi numbers)

Return JSON in ${selectedLanguage}:
{
  "status": "<CLEARED|HIGH_RISK_SCAM|SUSPICIOUS|UNKNOWN>",
  "riskScore": <0-100>,
  "details": "<explanation in ${selectedLanguage}, 2-3 sentences>",
  "connections": "<fraud pattern or 'No known fraud associations'>",
  "recommendedActions": ["<action 1>","<action 2>","<action 3>"],
  "reportingPortal": "cybercrime.gov.in"
}`);

      setQueryResult(result);
      onAddLog(`Credential check: ${result.status} — Risk: ${result.riskScore}%`);
    } catch (err: any) {
      const msg = String(err?.message || err);
      const isKeyError = msg.includes('INVALID_KEY') || msg.includes('API_KEY_INVALID') || msg.includes('API key not valid') || msg.includes('INVALID_ARGUMENT');
      if (isKeyError || msg.includes('QUOTA_EXHAUSTED') || msg.includes('quota')) {
        const result = DEMO_CREDENTIAL_CHECK(queryInput) as CredentialResult;
        setQueryResult(result);
        onAddLog(`Credential check (Demo): ${result.status} — Risk: ${result.riskScore}%`);
      } else {
        setCredError(`Check error: ${msg}`);
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleSendChat = async (overrideText?: string) => {
    const text = (overrideText || chatInput).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`, sender: 'CITIZEN', text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
    };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);
    setChatError(null);

    const newApiHistory = [...apiHistory, { role: 'user' as const, content: text }];

    try {
      const data = await geminiJSON<ChatResponse>(`You are SentinelAI Citizen Shield — India's official AI cyber safety assistant deployed by MHA.

CRITICAL FACTS:
- Real CBI/ED/Customs/Police NEVER "digitally arrest" anyone over video call — ALWAYS a scam
- Real government agencies NEVER ask for money to "verify", "clear your name", or "prevent account freeze"
- No "escrow vault", "clearance bond", "reverse NEFT", "RBI safety transfer" is ever real
- MHA officially warned about Digital Arrest scams — PM Modi personally addressed the nation about this

CONVERSATION HISTORY:
${apiHistory.slice(-4).map(h => `${h.role === 'user' ? 'CITIZEN' : 'SENTINEL AI'}: ${h.content}`).join('\n') || 'First message'}

CITIZEN MESSAGE: "${text}"
RESPOND IN: ${selectedLanguage}

If this sounds like an ACTIVE scam happening RIGHT NOW — be URGENT and PROTECTIVE.
Give specific advice: Hang up, don't transfer money, call 1930, visit cybercrime.gov.in
Support all 12 Indian languages authentically.

Return JSON:
{
  "reply": "<empathetic response in ${selectedLanguage}, under 200 words, direct and actionable>",
  "alertLevel": "<CRITICAL|WARNING|INFO|SAFE>",
  "immediateActions": ["<most urgent action>","<second action>","<third if needed>"],
  "reportingLinks": ["cybercrime.gov.in","Helpline: 1930"],
  "language": "${selectedLanguage}"
}`);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`, sender: 'AI_OFFICER', text: data.reply,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        alertLevel: data.alertLevel, immediateActions: data.immediateActions,
      };
      setChatHistory(prev => [...prev, aiMsg]);
      setApiHistory([...newApiHistory, { role: 'assistant', content: data.reply }]);
      onAddLog(`AI responded — Alert: ${data.alertLevel}`);
    } catch (err: any) {
      const msg = String(err?.message || err);
      const isKeyError = msg.includes('INVALID_KEY') || msg.includes('API_KEY_INVALID') || msg.includes('API key not valid') || msg.includes('INVALID_ARGUMENT');
      if (isKeyError || msg.includes('QUOTA_EXHAUSTED') || msg.includes('quota')) {
        const data = DEMO_CITIZEN_SHIELD_CHAT(text) as ChatResponse;
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`, sender: 'AI_OFFICER', text: data.reply,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
          alertLevel: data.alertLevel, immediateActions: data.immediateActions,
        };
        setChatHistory(prev => [...prev, aiMsg]);
        setApiHistory([...newApiHistory, { role: 'assistant', content: data.reply }]);
        onAddLog(`AI responded (Demo Mode) — Alert: ${data.alertLevel}`);
      } else {
        setChatError(`Chat error: ${msg}`);
        onAddLog(`⚠️ Chat failed: ${msg}`);
      }
    } finally {
      setIsChatLoading(false);
    }
  };

  const alertColors: Record<string, string> = {
    CRITICAL: 'border-red-500/20 bg-red-950/10',
    WARNING: 'border-yellow-500/20 bg-yellow-950/10',
    INFO: 'border-gray-800',
    SAFE: 'border-emerald-500/20 bg-emerald-950/10',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-extrabold text-white uppercase tracking-wider">
          Citizen Fraud Shield — Multi-Channel Safety Portal
        </h1>
        <p className="text-xs text-gray-400">
          Gemini AI safety assistant — 12 Indian languages, real-time scam assessment, guided NCRB reporting. Powered by MHA cybercrime intelligence. Helpline: 1930 | cybercrime.gov.in
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Credential Checker */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 space-y-5 h-fit">
          <div className="border-b border-gray-800/60 pb-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />1. Live Credential Verifier
            </h3>
            <p className="text-[10px] font-mono text-gray-500">Verify phone numbers, UPI IDs, or web domains</p>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-2 py-1.5 text-xs font-mono text-gray-200 focus:outline-none focus:border-emerald-500/50">
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="flex bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 gap-2">
            <input type="text" value={queryInput} onChange={e => setQueryInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCredentialCheck()}
              placeholder="UPI ID, phone number, or URL to verify..."
              className="bg-transparent text-xs text-gray-200 focus:outline-none flex-1 font-mono" />
            <button onClick={handleCredentialCheck} disabled={isChecking || !queryInput.trim()}
              className="p-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold disabled:opacity-50">
              {isChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
          </div>

          {credError && <p className="text-[10px] text-red-400 font-mono">{credError}</p>}

          {queryResult && (
            <div className={`p-4 rounded-xl border space-y-3 ${
              queryResult.status === 'HIGH_RISK_SCAM' ? 'bg-red-500/5 border-red-500/20' :
              queryResult.status === 'SUSPICIOUS' ? 'bg-yellow-500/5 border-yellow-500/20' :
              'bg-emerald-500/5 border-emerald-500/20'
            }`}>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-gray-500">Verdict:</span>
                <span className={`font-bold uppercase px-1.5 py-0.5 rounded border text-[9px] ${
                  queryResult.status === 'HIGH_RISK_SCAM' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  queryResult.status === 'SUSPICIOUS' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}>{queryResult.status.replace(/_/g, ' ')}</span>
              </div>
              <div className="text-center border-y border-gray-800 py-3">
                <div className={`text-4xl font-extrabold font-mono ${
                  queryResult.status === 'HIGH_RISK_SCAM' ? 'text-red-400' :
                  queryResult.status === 'SUSPICIOUS' ? 'text-yellow-400' : 'text-emerald-400'
                }`}>{queryResult.riskScore}%</div>
                <span className="text-[9px] font-mono text-gray-500 block mt-1">AI Risk Score</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{queryResult.details}</p>
              <div className="space-y-1">
                {queryResult.recommendedActions.map((a, i) => (
                  <div key={i} className="text-[10px] font-mono text-gray-400 flex items-start gap-1">
                    <span className="text-emerald-400">•</span>{a}
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-mono text-gray-500 border-t border-gray-800 pt-2">
                REPORT: <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline">cybercrime.gov.in</a>
              </div>
            </div>
          )}

          {/* Quick alert box */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 text-[9px] font-mono text-red-300">
            <p className="font-bold text-red-400 mb-1">🚨 MHA OFFICIAL WARNING:</p>
            <p>"Digital Arrest does not exist in Indian law. Real government officials never conduct investigations over WhatsApp or video call." — PM Modi, Mann Ki Baat, Oct 2024</p>
          </div>
        </div>

        {/* AI Chat */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 flex flex-col xl:col-span-2 h-[620px]">
          <div className="border-b border-gray-800/60 pb-3 flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />2. Gemini AI Safety Assistant
              </h3>
              <p className="text-[10px] font-mono text-gray-500">Real-time AI guidance in {selectedLanguage} — 12 languages supported</p>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 font-bold">GEMINI DIRECT MODE</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3">
            {chatHistory.map(msg => {
              const isAI = msg.sender === 'AI_OFFICER';
              return (
                <div key={msg.id} className={`flex ${isAI ? 'justify-start' : 'justify-end'} items-start gap-2`}>
                  {isAI && (
                    <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl p-3 border ${isAI ? alertColors[msg.alertLevel || 'INFO'] : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                    <div className="flex justify-between text-[9px] font-mono text-gray-500 pb-1.5 mb-1.5 border-b border-gray-900/40">
                      <span className={`font-bold ${isAI ? 'text-emerald-400' : 'text-gray-300'}`}>
                        {isAI ? '🛡️ SENTINEL AI OFFICER' : '👤 CITIZEN'}
                      </span>
                      <span className="flex items-center gap-1">
                        {isAI && msg.alertLevel === 'CRITICAL' && <span className="text-red-400 font-bold">🚨 CRITICAL</span>}
                        {isAI && msg.alertLevel === 'WARNING' && <span className="text-yellow-400 font-bold">⚠️ WARNING</span>}
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-line">{msg.text}</p>
                    {isAI && msg.immediateActions && msg.immediateActions.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-800 space-y-1">
                        {msg.immediateActions.map((a, i) => (
                          <div key={i} className="text-[10px] font-mono text-emerald-300 flex items-start gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />{a}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isChatLoading && (
              <div className="flex justify-start items-start gap-2">
                <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  <span className="text-xs text-gray-400 font-mono">Gemini AI analyzing in {selectedLanguage}...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {chatError && <p className="text-[10px] text-red-400 font-mono mb-2">{chatError}</p>}

          {/* Quick scenarios */}
          <div className="flex flex-wrap gap-1.5 mb-3 border-t border-gray-900/60 pt-3">
            {QUICK_QUERIES.map((q, i) => (
              <button key={i} onClick={() => handleSendChat(q.text)}
                className="px-2.5 py-1 text-[10px] font-mono bg-gray-900 border border-gray-800 hover:border-emerald-500/30 rounded text-gray-400 hover:text-white transition-colors">
                {q.label}
              </button>
            ))}
          </div>

          <div className="flex bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 gap-2">
            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isChatLoading && handleSendChat()}
              placeholder={`Describe your situation in ${selectedLanguage}...`}
              className="bg-transparent text-xs text-gray-200 focus:outline-none flex-1 font-mono" disabled={isChatLoading} />
            <button onClick={() => handleSendChat()} disabled={isChatLoading || !chatInput.trim()}
              className="p-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold disabled:opacity-50 transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
