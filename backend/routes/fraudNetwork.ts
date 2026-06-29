import { Request, Response } from 'express';
import { generateJSON } from '../gemini';

interface FraudNetworkAnalysis {
  networkSummary: string;
  totalFundsAtRisk: string;
  geographicSpread: string[];
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  nodes: Array<{
    id: string;
    label: string;
    type: 'SCAMMER' | 'MULE_BANK' | 'DEVICE' | 'VICTIM' | 'COORDINATOR';
    details: string;
    fundsRisk: string;
    ipOverlap: string;
    strength: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    connections: string[];
    jurisdiction: string;
  }>;
  evidencePackage: {
    caseNumber: string;
    complaintsLinked: number;
    crossJurisdiction: boolean;
    courtAdmissible: boolean;
    keyFindings: string[];
  };
  investigationLeads: string[];
  disruptionStrategy: string;
}

export async function analyzeFraudNetwork(req: Request, res: Response): Promise<void> {
  try {
    const { victimReports, transactionData, callRecords } = req.body as {
      victimReports?: string[];
      transactionData?: string;
      callRecords?: string;
    };

    const hasRealInput = (victimReports?.length || transactionData || callRecords);
    const inputContext = hasRealInput
      ? `
VICTIM REPORTS PROVIDED:
${(victimReports || []).map((r, i) => `${i + 1}. ${r}`).join('\n') || 'None'}

TRANSACTION DATA:
${transactionData || 'None provided'}

CALL RECORDS / METADATA:
${callRecords || 'None provided'}
`
      : `
No specific case data provided. Generate a realistic fraud network analysis based on current Indian cybercrime intelligence patterns from 2024-2025 NCRB data showing:
- Cross-border digital arrest scam syndicates (Cambodia, Myanmar, Dubai corridors)
- Mule account networks in Karnataka, Maharashtra, Delhi
- UPI money mule velocity patterns
- VoIP infrastructure spoofing Indian government numbers
`;

    const prompt = `You are a Fraud Network Graph Intelligence Analyst at India's Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs.

Conduct a real graph intelligence analysis to map the fraud syndicate network topology.

${inputContext}

Based on the provided data (or current 2024-2025 Indian cybercrime patterns if no data provided), construct a detailed network graph showing:

1. COORDINATOR NODES: Overseas masterminds (Cambodia/Myanmar/Dubai based syndicates known in Indian cybercrime)
2. SCAMMER NODES: Direct callers/operators running scripts
3. MULE_BANK NODES: Money mule bank accounts receiving transfers (real Indian banks, common in fraud: SBI, HDFC, PNB accounts opened with synthetic/stolen Aadhaar)
4. DEVICE NODES: VoIP servers, spoofed SIM clusters, WhatsApp bulk broadcast infrastructure
5. VICTIM NODES: Targeted individuals with estimated funds at risk

Use realistic Indian cybercrime intelligence:
- Known IP ranges: 103.114.xx.xx (Cambodia VoIP hubs), 185.220.xx.xx (anonymized), 49.207.xx.xx (Indian ISPs)
- Real Indian jurisdiction names
- Realistic fund amounts (lakhs crores scale)
- Connection patterns that reflect actual I4C investigation data

Return JSON with 6-8 nodes total:
{
  "networkSummary": "<2-3 sentence real intelligence summary of this fraud syndicate>",
  "totalFundsAtRisk": "<realistic total e.g. ₹4.8 Crore>",
  "geographicSpread": ["<state/country 1>", "<state/country 2>", "<state/country 3>"],
  "riskLevel": "<CRITICAL|HIGH|MEDIUM>",
  "nodes": [
    {
      "id": "NODE-01",
      "label": "<descriptive intelligence label>",
      "type": "<SCAMMER|MULE_BANK|DEVICE|VICTIM|COORDINATOR>",
      "details": "<technical intelligence detail — specific and realistic>",
      "fundsRisk": "<specific amount or '₹0' for infrastructure nodes>",
      "ipOverlap": "<realistic IP address>",
      "strength": "<CRITICAL|HIGH|MEDIUM|LOW>",
      "connections": ["NODE-02", "NODE-03"],
      "jurisdiction": "<specific location e.g. Poipet, Cambodia>"
    }
  ],
  "evidencePackage": {
    "caseNumber": "<I4C-2025-XXXXXX format case number>",
    "complaintsLinked": <integer number of linked complaints>,
    "crossJurisdiction": <boolean>,
    "courtAdmissible": <boolean>,
    "keyFindings": ["<specific legal finding 1>", "<specific legal finding 2>", "<specific legal finding 3>"]
  },
  "investigationLeads": ["<actionable intelligence lead 1>", "<lead 2>", "<lead 3>"],
  "disruptionStrategy": "<specific multi-agency takedown strategy referencing real Indian law enforcement capabilities>"
}`;

    const result = await generateJSON<FraudNetworkAnalysis>(prompt);
    res.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Fraud network analysis error:', err?.message || err);
    const isQuota = err?.message?.includes('quota') || err?.message?.includes('exhausted') || err?.message?.includes('429');
    res.status(500).json({
      success: false,
      error: isQuota
        ? 'Gemini API quota exhausted. Please wait a few minutes or upgrade your API plan.'
        : 'AI analysis failed: ' + (err?.message || 'Unknown error'),
    });
  }
}
