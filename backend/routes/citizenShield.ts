import { Request, Response } from 'express';
import { generateJSON } from '../gemini';

interface CredentialCheckResult {
  status: 'CLEARED' | 'HIGH_RISK_SCAM' | 'SUSPICIOUS' | 'UNKNOWN';
  riskScore: number;
  details: string;
  connections: string;
  recommendedActions: string[];
  reportingPortal: string;
}

interface ChatResponse {
  reply: string;
  alertLevel: 'CRITICAL' | 'WARNING' | 'INFO' | 'SAFE';
  immediateActions: string[];
  reportingLinks: string[];
  language: string;
}

export async function credentialCheck(req: Request, res: Response): Promise<void> {
  try {
    const { credential, language = 'English' } = req.body as { credential: string; language?: string };

    if (!credential?.trim()) {
      res.status(400).json({ error: 'Credential is required' });
      return;
    }

    const prompt = `You are India's National Cyber Crime Intelligence Verification System (NCCIVS), integrated with NCRB fraud databases.

A citizen has submitted this identifier for verification: "${credential}"

Perform a real risk assessment. The identifier could be:
- A phone number (Indian: +91/0 prefix, Foreign: +92 Pakistan, +855 Cambodia, +86 China, +971 UAE — all high-risk for scam origin)
- A UPI ID (legitimate ones use verified handles; scam ones use random alphanumeric strings with payment apps)
- A website URL (check for fake government domain patterns: anything claiming to be CBI/ED/RBI/Customs but not official .gov.in)
- An email address (scam patterns: government claims from gmail/yahoo)
- A bank account number

Real analysis criteria:
1. Phone number: Country code risk, known VoIP patterns, carrier spoofing indicators
2. UPI ID: "@" handle legitimacy, app provider risk, naming patterns of fraud mule accounts
3. URL: Domain authenticity vs official .gov.in domains, fake portal patterns (cbi-verify.in, rbi.clearance.com, ed-noc.net etc.)
4. General: Does it match known India fraud syndicate infrastructure patterns?

Indian Cyber Crime Helpline: 1930
Reporting portal: cybercrime.gov.in
NCRB patterns: Digital arrest scams, UPI fraud, courier parcel scams, OTP fraud

Respond in ${language}. Return JSON:
{
  "status": "<CLEARED|HIGH_RISK_SCAM|SUSPICIOUS|UNKNOWN>",
  "riskScore": <integer 0-100>,
  "details": "<detailed explanation of why this is safe or risky, in ${language}, 2-3 sentences>",
  "connections": "<known fraud pattern associations or 'No known fraud associations'>",
  "recommendedActions": [
    "<specific action 1>",
    "<specific action 2>",
    "<specific action 3>"
  ],
  "reportingPortal": "cybercrime.gov.in"
}`;

    const result = await generateJSON<CredentialCheckResult>(prompt);
    res.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Credential check error:', err?.message || err);
    const isQuota = err?.message?.includes('quota') || err?.message?.includes('exhausted') || err?.message?.includes('429');
    res.status(500).json({
      success: false,
      error: isQuota
        ? 'Gemini API quota exhausted. Please wait a few minutes.'
        : 'Check failed: ' + (err?.message || 'Unknown error'),
    });
  }
}

export async function citizenShieldChat(req: Request, res: Response): Promise<void> {
  try {
    const { message, history = [], language = 'English' } = req.body as {
      message: string;
      history?: Array<{ role: 'user' | 'assistant'; content: string }>;
      language?: string;
    };

    if (!message?.trim()) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const historyText = history
      .slice(-6)
      .map(h => `${h.role === 'user' ? 'CITIZEN' : 'SENTINEL AI'}: ${h.content}`)
      .join('\n');

    const prompt = `You are SentinelAI Citizen Shield — India's official AI-powered cyber safety assistant deployed by the Ministry of Home Affairs (MHA). You protect Indian citizens from real cybercrime threats.

CRITICAL FACTS you must always uphold:
- Real CBI/ED/Customs/Police NEVER place citizens under "Digital Arrest" over video calls. This is 100% always a scam.
- Real government agencies NEVER ask for money transfers to "verify", "clear your name", or "secure your account"
- No official calls an "escrow vault", "clearance bond", "verification transfer", or "reverse NEFT" is real
- Real RBI never freezes accounts over phone calls demanding immediate action
- If someone is ON an active scam call RIGHT NOW — they need to hang up IMMEDIATELY

PREVIOUS CONVERSATION:
${historyText || 'None — first message'}

CITIZEN'S MESSAGE: "${message}"

LANGUAGE TO RESPOND IN: ${language}

Guidelines:
- If this is an ACTIVE scam situation (victim currently in contact with scammer), respond with MAXIMUM urgency
- Be empathetic, clear, and direct — not robotic
- Give actionable advice specific to India (1930 helpline, cybercrime.gov.in, nearest police station)
- Support 12 Indian languages authentically
- Keep under 200 words but be complete
- Alert level: CRITICAL (active scam happening), WARNING (just happened or suspicious), INFO (general question), SAFE (verified safe situation)

Return JSON:
{
  "reply": "<your response in ${language} — empathetic, clear, actionable>",
  "alertLevel": "<CRITICAL|WARNING|INFO|SAFE>",
  "immediateActions": ["<most urgent action>", "<second action>", "<third action if needed>"],
  "reportingLinks": ["cybercrime.gov.in", "Helpline: 1930"],
  "language": "${language}"
}`;

    const result = await generateJSON<ChatResponse>(prompt);
    res.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Citizen shield chat error:', err?.message || err);
    const isQuota = err?.message?.includes('quota') || err?.message?.includes('exhausted') || err?.message?.includes('429');
    res.status(500).json({
      success: false,
      error: isQuota
        ? 'Gemini API quota exhausted. Please wait a few minutes.'
        : 'Chat failed: ' + (err?.message || 'Unknown error'),
    });
  }
}
