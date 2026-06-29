import { Request, Response } from 'express';
import { generateJSON } from '../gemini';

interface VoiceAnalysis {
  spoofVerdict: 'SYNTHETIC' | 'HUMAN' | 'SUSPECTED_CLONE';
  cloneConfidence: number;
  stressIndex: 'CRITICAL AGGRESSIVE' | 'HIGH PRESSURE' | 'MODERATE' | 'CALM';
  pitchHarmonics: string;
  amplitudeShimmer: string;
  formantAnalysis: string;
  phonemeLog: Array<{
    phoneme: string;
    duration: string;
    jitter: string;
    shimmer: string;
    classification: 'SYNTHESIZED' | 'NATURAL_HUMAN';
  }>;
  vocoderSignature: string;
  deepfakeModel: string;
  coercionMarkers: string[];
  mitigationAction: string;
  forensicSummary: string;
}

export async function analyzeVoice(req: Request, res: Response): Promise<void> {
  try {
    const { audioDescription, transcriptSample, caseType } = req.body as {
      audioDescription?: string;
      transcriptSample?: string;
      caseType?: string;
    };

    const prompt = `You are a forensic speech analysis AI for India's cyber crime investigation unit.

Analyze this voice/audio evidence for AI-generated speech, vocal cloning, and coercion stress markers:

AUDIO DESCRIPTION: ${audioDescription || 'Recorded call from alleged CBI officer making arrest threats'}
TRANSCRIPT SAMPLE: ${transcriptSample || 'You are under digital arrest. Stay on video call or face imprisonment.'}
CASE TYPE: ${caseType || 'Digital Arrest Scam'}

Perform phoneme-level analysis for:
1. Pitch irregularities typical of TTS (Text-to-Speech) synthesis
2. Amplitude shimmer patterns exceeding natural human variation (>3%)
3. Formant frequency disconnects (F1/F2 mismatches)
4. Timing artifacts from neural vocoder synthesis (ElevenLabs, Coqui TTS, etc.)
5. Coercion stress markers - deliberate high-pace, threatening cadence

Return JSON:
{
  "spoofVerdict": "<SYNTHETIC|HUMAN|SUSPECTED_CLONE>",
  "cloneConfidence": <0-100>,
  "stressIndex": "<CRITICAL AGGRESSIVE|HIGH PRESSURE|MODERATE|CALM>",
  "pitchHarmonics": "<Hz value and assessment>",
  "amplitudeShimmer": "<percentage and assessment>",
  "formantAnalysis": "<F1/F2 assessment>",
  "phonemeLog": [
    {
      "phoneme": "<IPA notation and description>",
      "duration": "<ms>",
      "jitter": "<percentage>",
      "shimmer": "<percentage>",
      "classification": "<SYNTHESIZED|NATURAL_HUMAN>"
    }
  ],
  "vocoderSignature": "<detected vocoder model or 'Natural Speech'>",
  "deepfakeModel": "<AI model signature if detected or 'None'>",
  "coercionMarkers": ["<marker 1>", "<marker 2>"],
  "mitigationAction": "<recommended action>",
  "forensicSummary": "<court-admissible forensic summary>"
}`;

    const result = await generateJSON<VoiceAnalysis>(prompt);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Voice analysis error:', err);
    res.status(500).json({ success: false, error: 'Voice analysis failed' });
  }
}
