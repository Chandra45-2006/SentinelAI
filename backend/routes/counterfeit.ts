import { Request, Response } from 'express';
import { generateJSON } from '../gemini';

interface CounterfeitAnalysis {
  verdict: 'GENUINE' | 'COUNTERFEIT' | 'SUSPECTED';
  confidence: number;
  denomination: string;
  serialNumber: string;
  anomalies: Array<{
    id: string;
    name: string;
    description: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    location: string;
    xPercent: number;
    yPercent: number;
  }>;
  securityFeatureChecks: Array<{
    feature: string;
    status: 'PASS' | 'FAIL' | 'SUSPICIOUS';
    detail: string;
  }>;
  rbiFicnAlert: boolean;
  caseSeverity: 'HIGH' | 'MEDIUM' | 'LOW';
  fieldOfficerActions: string[];
  forenzicSummary: string;
}

export async function analyzeCounterfeit(req: Request, res: Response): Promise<void> {
  try {
    const { denomination, serialNumber, series, printerCode, description } = req.body as {
      denomination: string;
      serialNumber: string;
      series: string;
      printerCode: string;
      description?: string;
    };

    const prompt = `You are a forensic currency authentication expert for the Reserve Bank of India (RBI) FICN (Fake Indian Currency Notes) Detection Unit.

Perform a real forensic analysis of this Indian banknote submission. The RBI Annual Report 2025 flagged record FICN seizures, particularly high-quality ₹500 fakes capable of defeating manual detection.

SUBMITTED NOTE DETAILS:
- Denomination: ₹${denomination}
- Serial Number: ${serialNumber}
- Series/Year: ${series}
- Printer Code: ${printerCode}
${description ? `- Physical Observations by Officer: ${description}` : '- No physical anomalies reported yet'}

Apply genuine forensic analysis:

1. SERIAL NUMBER VALIDATION:
   - RBI format: 3 letters + space + 6 digits (e.g., "5AB 123456") — verify pattern
   - Check prefix letters against valid RBI inflow series for that denomination and year
   - Flag if serial pattern doesn't match expected RBI issuance patterns

2. PRINTER CODE VERIFICATION:
   - India Security Press (ISP), Nashik — codes: RBI-NAS-xx
   - Security Printing & Minting Corp (SPMCIL): Dewas (RBI-DEW-xx), Mysore (RBI-MYS-xx), Salboni (RBI-SAL-xx)
   - Currency Note Press, Nashik — RBI-NAS-xx
   - Verify the printer code format and plausibility for the denomination

3. DENOMINATION-SPECIFIC SECURITY FEATURES (per RBI spec):
   ₹500 (current series): Swachh Bharat logo latent image, windowed security thread 'भारत' + 'RBI', 17 language panel, angular bleed lines
   ₹2000 (demonetized 2023, still in analysis): Nano text RBI, MOTIF of Mangalyaan, number panel raised
   ₹100: Rani ki Vav motif, 90° angle watermark
   ₹200: Sanchi Stupa motif

4. KNOWN FICN PATTERNS (from RBI 2025 report):
   - Flat watermarks (no 3D depth)
   - Security thread doesn't shift color under tilt
   - Microprinting shows ink bleed beyond 0.1mm
   - Intaglio print lacks raised texture
   - Serial number font inconsistencies

5. PHYSICAL OBSERVATIONS: ${description || 'None provided — assess based on metadata alone'}

Be forensically precise. If description mentions real anomalies, classify them at critical severity.

Return JSON:
{
  "verdict": "<GENUINE|COUNTERFEIT|SUSPECTED>",
  "confidence": <integer 0-100>,
  "denomination": "${denomination}",
  "serialNumber": "${serialNumber}",
  "anomalies": [
    {
      "id": "A-1",
      "name": "<specific anomaly name>",
      "description": "<technical forensic description referencing RBI standards>",
      "severity": "<CRITICAL|HIGH|MEDIUM>",
      "location": "<exact location on note>",
      "xPercent": <0-100 horizontal position for UI overlay>,
      "yPercent": <0-100 vertical position for UI overlay>
    }
  ],
  "securityFeatureChecks": [
    {"feature": "Watermark", "status": "<PASS|FAIL|SUSPICIOUS>", "detail": "<specific finding>"},
    {"feature": "Security Thread", "status": "<PASS|FAIL|SUSPICIOUS>", "detail": "<specific finding>"},
    {"feature": "Microprinting", "status": "<PASS|FAIL|SUSPICIOUS>", "detail": "<specific finding>"},
    {"feature": "Intaglio Print", "status": "<PASS|FAIL|SUSPICIOUS>", "detail": "<specific finding>"},
    {"feature": "Serial Number Format", "status": "<PASS|FAIL|SUSPICIOUS>", "detail": "<specific finding>"},
    {"feature": "Latent Image", "status": "<PASS|FAIL|SUSPICIOUS>", "detail": "<specific finding>"}
  ],
  "rbiFicnAlert": <true if verdict is COUNTERFEIT or confidence of fake >= 70>,
  "caseSeverity": "<HIGH|MEDIUM|LOW>",
  "fieldOfficerActions": [
    "<specific action 1 citing actual law e.g. IPC Section 489A>",
    "<specific action 2 for RBI submission>",
    "<specific action 3 for investigation>"
  ],
  "forenzicSummary": "<2-3 sentence court-admissible forensic summary citing RBI specifications>"
}`;

    const result = await generateJSON<CounterfeitAnalysis>(prompt);
    res.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Counterfeit analysis error:', err?.message || err);
    const isQuota = err?.message?.includes('quota') || err?.message?.includes('exhausted') || err?.message?.includes('429');
    res.status(500).json({
      success: false,
      error: isQuota
        ? 'Gemini API quota exhausted. Please wait a few minutes or upgrade your API plan.'
        : 'AI analysis failed: ' + (err?.message || 'Unknown error'),
    });
  }
}
