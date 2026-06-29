// SentinelAI — Gemini AI client with intelligent demo fallbacks
// Works with a valid API key for real AI, or shows realistic demo data if key is invalid/missing

import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
let _client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!_client) {
    if (!API_KEY) throw new Error('NO_KEY');
    _client = new GoogleGenAI({ apiKey: API_KEY });
  }
  return _client;
}

const MODELS = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-2.0-flash'];

async function callGemini(prompt: string): Promise<string> {
  const client = getClient();
  let lastError: Error | null = null;
  for (const model of MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: { temperature: 0.1, maxOutputTokens: 4000 },
      });
      const text = response.text ?? '';
      if (!text.trim()) throw new Error('Empty response');
      return text;
    } catch (err: any) {
      const isQuota = err?.status === 429 || String(err).includes('429') || String(err).includes('RESOURCE_EXHAUSTED') || String(err).includes('quota');
      const isInvalidKey = err?.status === 400 || String(err).includes('API_KEY_INVALID') || String(err).includes('API key not valid');
      if (isQuota) { lastError = err; await new Promise(r => setTimeout(r, 800)); continue; }
      if (isInvalidKey) throw new Error('INVALID_KEY');
      throw err;
    }
  }
  throw lastError ?? new Error('QUOTA_EXHAUSTED');
}

export async function geminiJSON<T>(prompt: string): Promise<T> {
  const raw = await callGemini(prompt + '\n\nRespond ONLY with valid JSON. No markdown, no code fences, no explanation. Raw JSON only.');
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  try { return JSON.parse(cleaned) as T; } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error('Invalid JSON from model');
  }
}

export function isGeminiConfigured(): boolean { return Boolean(API_KEY); }

// ── DEMO FALLBACKS ────────────────────────────────────────────────────────────
// Used when API key is invalid/missing — always shows realistic output for demo

export const DEMO_DIGITAL_ARREST = {
  threatScore: 96,
  threatLevel: 'CRITICAL',
  scamVector: 'CBI Digital Arrest — Fake Narcotics Courier Trap',
  impersonationEntities: ['Central Bureau of Investigation (CBI)', 'Customs & Narcotics Control Bureau', 'Ministry of Home Affairs'],
  coercionTactics: [
    'False arrest threat using "Digital Arrest" — illegal construct not in Indian law',
    'Forced isolation: "Do not contact family or lawyer — classified national security matter"',
    'Webcam surveillance demand to maintain psychological control',
    'Urgency escalation: 10-year imprisonment threat under NDPS Act',
    'Financial extraction via "Supreme Treasury Verification" escrow UPI'
  ],
  financialAsk: 'Full bank balance transfer to escrow UPI for "clearance bond" — promise of return in 48 hours',
  aiConfidence: 98,
  deepfakeProbability: 73,
  victimStressLevel: 'CRITICAL COERCED',
  threatTags: [
    { speaker: 'CALLER', text: 'You are under Digital Arrest immediately', tags: ['Fake Digital Arrest', 'CBI Impersonation', 'Illegal Threat'] },
    { speaker: 'CALLER', text: 'Transfer your savings to Supreme Treasury Verification vault', tags: ['Financial Extortion', 'Escrow Fraud', 'UPI Demand'] },
    { speaker: 'CALLER', text: 'Do not talk to anyone — classified national security', tags: ['Isolation Tactic', 'Fear Amplification'] },
    { speaker: 'VICTIM', text: 'Please help me I am innocent', tags: ['High Victim Stress', 'Compliance Risk'] },
  ],
  recommendations: [
    '🚨 VICTIM: Hang up immediately — "Digital Arrest" does not exist in Indian law',
    '📞 CALL 1930 (Cyber Crime Helpline) and report at cybercrime.gov.in',
    '🏦 BANK: Contact bank immediately to block any pending transfer',
    '🚔 LAW ENFORCEMENT: Initiate TRAI complaint to block spoofed VoIP number',
  ],
  summary: 'High-confidence CBI impersonation Digital Arrest scam matching Cambodia syndicate script template #DA-CBI-7. Victim under active psychological coercion with ₹22 Lakh at risk. MHA alert generated for district cyber cell dispatch.',
  mhaAlertGenerated: true,
};

export const DEMO_COUNTERFEIT = (denomination: string, hasSuspect: boolean) => ({
  verdict: hasSuspect ? 'COUNTERFEIT' : 'GENUINE',
  confidence: hasSuspect ? 94 : 98,
  denomination,
  serialNumber: hasSuspect ? '2BD 889210' : '5AC 482091',
  anomalies: hasSuspect ? [
    { id: 'A-1', name: 'Watermark Discontinuity', description: 'Mahatma Gandhi portrait watermark lacks authentic 3D multi-tonal depth gradient. Flat printing without proper translucency — hallmark of offset FICN printing per RBI 2025 FICN report.', severity: 'CRITICAL', location: 'Left panel watermark zone', xPercent: 20, yPercent: 50 },
    { id: 'A-2', name: 'Security Thread Failure', description: 'Window security thread with "भारत RBI" inscription does not exhibit colour shift from magenta to green under 45° tilt — confirmed FICN indicator per RBI circular DCBR.CO.2025.', severity: 'CRITICAL', location: 'Central vertical thread band', xPercent: 53, yPercent: 35 },
    { id: 'A-3', name: 'Microprint Ink Bleed', description: '"भारत" and "RBI" microtext shows ink spread beyond 0.2mm — exceeds RBI tolerance of 0.05mm. Confirms offset printing rather than intaglio.', severity: 'HIGH', location: 'Right margin microprint strip', xPercent: 78, yPercent: 65 },
  ] : [],
  securityFeatureChecks: [
    { feature: 'Watermark', status: hasSuspect ? 'FAIL' : 'PASS', detail: hasSuspect ? 'Flat — no 3D depth. Offset print detected.' : 'Authentic 3D Gandhi portrait with correct tonal gradients.' },
    { feature: 'Security Thread', status: hasSuspect ? 'FAIL' : 'PASS', detail: hasSuspect ? 'Non-shifting. No भारत+RBI inscription shift.' : 'Confirmed colour shift magenta→green at 45°.' },
    { feature: 'Microprinting', status: hasSuspect ? 'SUSPICIOUS' : 'PASS', detail: hasSuspect ? 'Ink bleed 0.2mm — exceeds 0.05mm RBI tolerance.' : 'Clean sharp text — RBI/INDIA confirmed under 10x.' },
    { feature: 'Intaglio Print', status: hasSuspect ? 'FAIL' : 'PASS', detail: hasSuspect ? 'Surface feels smooth — intaglio raise absent.' : 'Raised texture confirmed on denomination numeral.' },
    { feature: 'Serial Number', status: 'SUSPICIOUS', detail: hasSuspect ? 'Prefix "2BD" not in RBI 2024 ₹500 issuance series.' : 'Format valid — 3-letter prefix within RBI issuance range.' },
    { feature: 'Latent Image', status: hasSuspect ? 'FAIL' : 'PASS', detail: hasSuspect ? 'Denomination numeral NOT visible at 45° tilt.' : 'Denomination visible at 45° with correct colour.' },
  ],
  rbiFicnAlert: hasSuspect,
  caseSeverity: hasSuspect ? 'HIGH' : 'LOW',
  fieldOfficerActions: hasSuspect ? [
    'Seize note immediately under IPC Section 489A (possession of counterfeit currency)',
    'Submit to nearest RBI currency chest with FICN Forwarding Form — cite RBI Alert #2025-DEL-049',
    'File FIR at local police station citing IPC 489B (using counterfeit currency)',
    'Preserve note in evidence bag — do not fold/mark — maintain chain of custody for court',
  ] : [
    'Note verified genuine — clear for banking operations',
    'Log verification in branch records with officer ID and timestamp',
  ],
  forenzicSummary: hasSuspect
    ? 'This ₹' + denomination + ' note exhibits multiple critical FICN indicators including absent watermark depth, non-shifting security thread, and ink-bleed microprinting consistent with RBI Annual Report 2025 high-quality FICN profile. Recommend immediate seizure, RBI currency chest submission, and FIR filing under IPC 489A/489B. Note should be preserved as court-admissible evidence under standard forensic protocols.'
    : 'Note exhibits all authentic security features within RBI specifications. Watermark, security thread, microprinting, and intaglio print confirmed genuine. Note cleared for banking circulation.',
});

export const DEMO_FRAUD_NETWORK = {
  networkSummary: 'Cross-border Digital Arrest syndicate operating from Poipet, Cambodia with domestic mule infrastructure across Karnataka and Delhi NCR. Syndicate uses VoIP PBX systems to spoof CBI/ED numbers, AI-generated voice scripts, and Jan-Dhan mule accounts for rapid ATM cashouts. Estimated 847 victims targeted with ₹4.8 Crore total losses identified.',
  totalFundsAtRisk: '₹4.8 Crore',
  geographicSpread: ['Poipet, Cambodia', 'Bengaluru, Karnataka', 'Delhi NCR, India', 'Mumbai, Maharashtra'],
  riskLevel: 'CRITICAL',
  nodes: [
    { id: 'NODE-01', label: 'Cambodia Syndicate Mastermind FX-8892', type: 'COORDINATOR', details: 'Overseas orchestrator managing 12 operators from Poipet Cambodia border zone. Uses encrypted Signal/Telegram for command. Coordinates across 4 Indian cities via VoIP infrastructure.', fundsRisk: '₹4.8 Cr total', ipOverlap: '103.114.28.19', strength: 'CRITICAL', connections: ['NODE-02', 'NODE-03', 'NODE-04'], jurisdiction: 'Poipet, Cambodia' },
    { id: 'NODE-02', label: 'Karnataka Mule Account Cluster — 18 Accounts', type: 'MULE_BANK', details: 'Jan-Dhan accounts at SBI/PNB opened with synthetic Aadhaar credentials in Bengaluru. ATM cashout velocity ₹12L/hour across Whitefield and Electronic City branches.', fundsRisk: '₹1.1 Cr active', ipOverlap: '49.207.44.11', strength: 'CRITICAL', connections: ['NODE-01', 'NODE-05'], jurisdiction: 'Bengaluru, Karnataka' },
    { id: 'NODE-03', label: 'Delhi VoIP PBX — Spoofed CBI Numbers', type: 'DEVICE', details: 'Virtual PBX routing calls via spoofed +91-11-24368270 (CBI HQ). BSNL trunk line exploitation. 1,240 calls placed this week to targets across Maharashtra and Delhi.', fundsRisk: '₹0', ipOverlap: '103.114.28.12', strength: 'HIGH', connections: ['NODE-01', 'NODE-06'], jurisdiction: 'Delhi NCR, India' },
    { id: 'NODE-04', label: 'Mumbai HNI Victim — Active Coercion', type: 'VICTIM', details: 'High Net-Worth Individual under live Skype video coercion for 6+ hours. Savings ₹22L at risk. Identified via 1930 complaint. Family unaware — isolation protocol in effect.', fundsRisk: '₹22L at risk', ipOverlap: '49.207.12.8', strength: 'LOW', connections: ['NODE-01'], jurisdiction: 'Andheri West, Mumbai' },
    { id: 'NODE-05', label: 'ATM Cashout Operator — Bengaluru', type: 'MULE_BANK', details: 'Ground-level cash withdrawal agent. Flagged at 4 ATMs for rapid succession withdrawals. Shares device fingerprint with NODE-02 cluster. ₹18L withdrawn this week.', fundsRisk: '₹18 Lakhs', ipOverlap: '49.207.44.99', strength: 'CRITICAL', connections: ['NODE-02'], jurisdiction: 'Bengaluru, Karnataka' },
    { id: 'NODE-06', label: 'WhatsApp Bulk Broadcast — AI Scripts', type: 'DEVICE', details: 'E-SIM cluster broadcasting fake MHA circulars and arrest warrants. AI-generated voice scripts from ElevenLabs vocoder. 1,240 messages sent targeting NCR residents.', fundsRisk: '₹0', ipOverlap: '103.114.28.40', strength: 'MEDIUM', connections: ['NODE-03'], jurisdiction: 'Delhi NCR, India' },
  ],
  evidencePackage: {
    caseNumber: 'I4C-2025-XP4419',
    complaintsLinked: 847,
    crossJurisdiction: true,
    courtAdmissible: true,
    keyFindings: [
      'VoIP call records link 847 victim complaints to same Cambodia IP range 103.114.28.x — admissible under IT Act Section 65B',
      'Device fingerprint overlap across 18 mule accounts confirms coordinated operation under IPC 120B (criminal conspiracy)',
      'ElevenLabs AI voice signature matched across 3 districts — establishes syndicate identity under Evidence Act',
    ],
  },
  investigationLeads: [
    'Request INTERPOL Red Notice for Cambodia-based operator FX-8892 via MHA-INTERPOL National Central Bureau',
    'TRAI emergency request to blacklist VoIP trunk line exploiting BSNL Delhi — block 47 spoofed numbers',
    'FIU-IND freeze order for all 18 Karnataka mule accounts — coordinate with SBI/PNB nodal officers',
  ],
  disruptionStrategy: 'Multi-agency takedown: I4C coordinates with INTERPOL NCB for Cambodia-side server seizure, TRAI blocks domestic VoIP infrastructure within 24 hours, FIU-IND freezes all mule accounts simultaneously to prevent fund dissipation, and district cyber cells conduct simultaneous arrests of 6 ground-level operators across Bengaluru.',
};

export const DEMO_CITIZEN_SHIELD_CHAT = (message: string) => {
  const lower = message.toLowerCase();
  const isArrest = lower.includes('arrest') || lower.includes('cbi') || lower.includes('ed ') || lower.includes('customs') || lower.includes('skype') || lower.includes('video call');
  const isTransfer = lower.includes('transfer') || lower.includes('vault') || lower.includes('escrow') || lower.includes('clear') || lower.includes('savings');
  const isRBI = lower.includes('rbi') || lower.includes('freeze') || lower.includes('account');

  if (isArrest) return {
    reply: '🚨 CRITICAL ALERT: This is 100% a scam. "Digital Arrest" does NOT exist in Indian law.\n\nReal CBI, ED, Customs or Police NEVER:\n• Arrest anyone over Skype/WhatsApp/video call\n• Ask you to stay on camera for hours\n• Demand money to "clear your name"\n\nWhat you must do RIGHT NOW:\n1. Hang up the call immediately\n2. Call 1930 (National Cyber Crime Helpline)\n3. Report at cybercrime.gov.in\n4. Tell your family immediately',
    alertLevel: 'CRITICAL',
    immediateActions: ['🔴 HANG UP THE CALL IMMEDIATELY', '📞 Call 1930 — Cyber Crime Helpline', '💻 Report at cybercrime.gov.in', '🏦 Block any pending bank transfer now'],
    reportingLinks: ['cybercrime.gov.in', 'Helpline: 1930'],
    language: 'English',
  };
  if (isTransfer || isRBI) return {
    reply: '⚠️ WARNING: No government agency ever asks for money transfer to "verify your account" or "clear your name". This is a confirmed fraud tactic.\n\n"Escrow vaults", "clearance bonds", "RBI safety transfers" — none of these exist.\n\nDO NOT transfer any money. Lock your accounts immediately. Call 1930 now.',
    alertLevel: 'WARNING',
    immediateActions: ['🚫 Do NOT transfer any money', '🏦 Call your bank to block transfers — use bank helpline', '📞 Report to 1930 immediately', '💻 File complaint: cybercrime.gov.in'],
    reportingLinks: ['cybercrime.gov.in', 'Helpline: 1930'],
    language: 'English',
  };
  return {
    reply: '🛡️ I\'m here to help you stay safe from cyber fraud. Based on what you\'ve described, here\'s what you should know:\n\nIf you received a suspicious call from someone claiming to be a government official, police, or bank — always verify by calling the official number directly.\n\nFor any doubt, call 1930 (free, 24/7 Cyber Crime Helpline) or visit cybercrime.gov.in.',
    alertLevel: 'INFO',
    immediateActions: ['Verify caller identity via official government website', 'Never share OTP, passwords, or transfer money', 'Call 1930 if you feel threatened'],
    reportingLinks: ['cybercrime.gov.in', 'Helpline: 1930'],
    language: 'English',
  };
};

export const DEMO_CREDENTIAL_CHECK = (credential: string) => {
  const c = credential.toLowerCase();
  const isHighRisk = c.startsWith('+92') || c.startsWith('+855') || c.startsWith('+86') || c.includes('clearance') || c.includes('verify') || c.includes('cbi') || c.includes('rbi.') || c.includes('ed-') || c.includes('escrow') || c.includes('@ybl') && c.length < 12;
  return {
    status: isHighRisk ? 'HIGH_RISK_SCAM' : credential.includes('@') || credential.includes('.') ? 'SUSPICIOUS' : 'UNKNOWN',
    riskScore: isHighRisk ? 94 : 45,
    details: isHighRisk
      ? 'This credential matches known fraud patterns. Numbers from +92 (Pakistan), +855 (Cambodia) are commonly used in Digital Arrest scam operations targeting Indians. Do not engage.'
      : 'Unable to confirm legitimacy. Exercise caution. Verify through official government channels only.',
    connections: isHighRisk ? 'Matches Cambodia/Pakistan-based Digital Arrest syndicate infrastructure patterns' : 'No direct match — manual verification recommended',
    recommendedActions: ['Do not engage or call back', 'Report to 1930 helpline', 'File complaint at cybercrime.gov.in'],
    reportingPortal: 'cybercrime.gov.in',
  };
};

export const DEMO_VOICE = (caseType: string) => ({
  spoofVerdict: 'SYNTHETIC',
  cloneConfidence: 87,
  stressIndex: 'CRITICAL AGGRESSIVE',
  pitchHarmonics: '142 Hz — Unnatural regularity (±2 Hz variance vs natural ±18 Hz) — TTS synthesis artifact',
  amplitudeShimmer: '6.8% — CRITICAL (natural speech <3%) — Neural vocoder pattern confirmed',
  formantAnalysis: 'F1/F2 DISCONNECTED — 780/1240 Hz mismatch. Natural Indian English F2 should be 1800-2200 Hz. Vocoder artifact confirmed.',
  phonemeLog: [
    { phoneme: '[æ] - open front vowel (arrest)', duration: '180 ms', jitter: '4.82%', shimmer: '6.9%', classification: 'SYNTHESIZED' },
    { phoneme: '[ɪ] - near-close vowel (digital)', duration: '92 ms', jitter: '5.10%', shimmer: '7.4%', classification: 'SYNTHESIZED' },
    { phoneme: '[ɑː] - open back vowel (CBI)', duration: '240 ms', jitter: '0.9%', shimmer: '1.2%', classification: 'NATURAL_HUMAN' },
    { phoneme: '[s] - alveolar sibilant (stay)', duration: '280 ms', jitter: '4.2%', shimmer: '6.1%', classification: 'SYNTHESIZED' },
  ],
  vocoderSignature: 'ElevenLabs v2 Neural Vocoder — Hindi-English bilingual model',
  deepfakeModel: 'ElevenLabs v2 / Coqui TTS — India accent fine-tuned model detected',
  coercionMarkers: [
    'Deliberate high-pace delivery (210 WPM vs natural 130 WPM) — designed to prevent victim interruption',
    'Authority impersonation cadence — trained CBI/police speech pattern simulation',
    'Threat escalation pattern: legal terminology → imprisonment threat → financial demand',
  ],
  mitigationAction: 'Flag number for TRAI blacklisting. Submit audio sample to I4C VoiceLab database. Report under IT Act Section 66C (identity theft) and 66D (impersonation).',
  forensicSummary: `ElevenLabs v2 neural vocoder confirmed with 87% confidence. Amplitude shimmer of 6.8% exceeds natural speech threshold by 3.8x, consistent with AI voice synthesis for ${caseType}. Phoneme-level F1/F2 formant disconnect at 780/1240 Hz confirms synthetic origin. This audio is court-inadmissible as genuine human speech under Indian Evidence Act Section 65B.`,
});
