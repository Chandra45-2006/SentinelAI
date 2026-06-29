import { GoogleGenAI } from '@google/genai';

let _ai: GoogleGenAI | null = null;

export function getAI(): GoogleGenAI {
  if (!_ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment variables');
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

// Try models in order — if one quota is exhausted, fall through to next
const MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-2.0-flash',
];

async function tryGenerate(prompt: string, jsonMode: boolean): Promise<string> {
  let lastError: Error | null = null;

  for (const model of MODELS) {
    try {
      const ai = getAI();
      const fullPrompt = jsonMode
        ? prompt + '\n\nRespond ONLY with valid JSON. No markdown fences, no explanation, just raw JSON.'
        : prompt;

      const response = await ai.models.generateContent({
        model,
        contents: fullPrompt,
        config: {
          temperature: jsonMode ? 0.1 : 0.3,
          maxOutputTokens: 4000,
        },
      });

      const raw = (response.text ?? '').trim();
      if (!raw) throw new Error('Empty response from model');
      console.log(`✅ Model used: ${model}`);
      return raw;
    } catch (err: any) {
      const is429 = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED') || err?.message?.includes('quota');
      if (is429) {
        console.warn(`⚠️  Quota hit on ${model}, trying next model...`);
        lastError = err;
        // Small delay before trying next model
        await new Promise(r => setTimeout(r, 1500));
        continue;
      }
      // Non-quota error — throw immediately
      throw err;
    }
  }

  throw lastError ?? new Error('All Gemini models exhausted or unavailable');
}

export async function generateText(prompt: string): Promise<string> {
  return tryGenerate(prompt, false);
}

export async function generateJSON<T>(prompt: string): Promise<T> {
  const raw = await tryGenerate(prompt, true);
  // Strip markdown code fences if model added them anyway
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    console.error('JSON parse failed. Raw response:', cleaned.substring(0, 500));
    throw new Error('Model returned invalid JSON');
  }
}
