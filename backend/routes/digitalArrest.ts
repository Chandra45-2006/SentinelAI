import { Request, Response } from 'express';
import { generateJSON } from '../gemini';

interface DigitalArrestAnalysis {
  threatScore: number;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  scamVector: string;
  impersonationEntities: string[];
  coercionTactics: string[];
  financialAsk: string;
  aiConfidence: number;
  deepfakeProbability: number;
  victimStressLevel: string;
  threatTags: Array<{ speaker: string; text: string; tags: string[] }>;
  recommendations: string[];
  summary: string;
  mhaAlertGenerated: boolean;
}

export async function analyzeDigitalArrest(req: Request, res: Response): Promise<void> {
  try {
    const { transcript } = req.body as { transcript: string };
    if (!transcript?.trim()) {
      res.status(400).json({ error: 'Transcript is required' });
      return;
    }

    const prompt = `You are SentinelAI — India's premier cybercrime intelligence system specializing in Digital Arrest scam detection for law enforcement agencies.

Conduct a real forensic NLP analysis of this call transcript. Digital Arrest scams are real crimes in India where fraudsters impersonate CBI/ED/Customs/Police officers and psychologically trap victims in prolonged video calls, threatening "digital arrest" unless funds are transferred. The MHA reported ₹1,776 crore stolen via this method in 9 months of 2024.

TRANSCRIPT TO ANALYZE:
---
${transcript}
---

Perform genuine analysis of:
1. Government agency impersonation markers (CBI, ED, Customs, NCB, RBI, Police, IT Department)
2. Coercion language patterns (arrest threats, prison threats, family threat, asset seizure)
3. Financial extraction tactics (escrow, vault transfer, clearance bond, verification fee)
4. Urgency/isolation tactics (don't tell anyone, stay on call, webcam active)
5. Psychological manipulation stages (shock → fear → compliance → transfer)
6. Voice stress indicators from text (CAPS, repeated commands, contradictions)
7. Deepfake/scripted speech patterns (too formal, repeating exact legal terms incorrectly)

Evaluate every line and extract real threat indicators. Be precise and forensically accurate.

Return this exact JSON:
{
  "threatScore": <integer 0-100, based on actual content analysis>,
  "threatLevel": "<CRITICAL if >80, HIGH if >60, MEDIUM if >40, LOW otherwise>",
  "scamVector": "<specific scam type e.g. 'CBI Digital Arrest – Courier Narcotic Trap'>",
  "impersonationEntities": ["<exact agencies mentioned or implied in transcript>"],
  "coercionTactics": ["<each specific tactic found with evidence from text>"],
  "financialAsk": "<exact amount/method requested or 'No explicit financial demand detected'>",
  "aiConfidence": <integer 0-100 confidence in this assessment>,
  "deepfakeProbability": <integer 0-100 chance of AI-generated/scripted voice>,
  "victimStressLevel": "<CRITICAL COERCED|HIGH PRESSURE|MODERATE|CALM based on victim responses>",
  "threatTags": [
    {"speaker": "<CALLER or VICTIM>", "text": "<exact quoted phrase from transcript>", "tags": ["<specific threat tag>"]},
    ...up to 6 most significant entries
  ],
  "recommendations": [
    "<immediate action 1 for victim>",
    "<immediate action 2 for law enforcement>",
    "<immediate action 3 for telecom/bank>",
    "<preventive action 4>"
  ],
  "summary": "<2-3 sentence precise forensic summary for MHA/law enforcement use>",
  "mhaAlertGenerated": <true only if threatScore >= 75>
}`;

    const result = await generateJSON<DigitalArrestAnalysis>(prompt);
    res.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Digital arrest analysis error:', err?.message || err);
    const isQuota = err?.message?.includes('quota') || err?.message?.includes('exhausted') || err?.message?.includes('429');
    res.status(500).json({
      success: false,
      error: isQuota
        ? 'Gemini API quota exhausted on all models. Please wait a few minutes or upgrade your API plan at aistudio.google.com'
        : 'AI analysis failed: ' + (err?.message || 'Unknown error'),
    });
  }
}
