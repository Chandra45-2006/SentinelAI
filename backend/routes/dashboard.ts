import { Request, Response } from 'express';

export function getDashboardStats(_req: Request, res: Response): void {
  const stats = {
    kpis: {
      totalThreatsDetected: 14847,
      fraudNetworksDisrupted: 284,
      counterfeitNotesSeized: 18420,
      citizensProtected: 94200,
      activeAlerts: 23,
      casesUnderInvestigation: 2847
    },
    recentAlerts: [
      {
        id: 'ALT-001',
        timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
        type: 'CRITICAL',
        category: 'Digital Arrest Scam',
        message: 'Active digital arrest scam session detected — victim under live video coercion',
        origin: 'Delhi NCR / VoIP +855 Cambodia',
        status: 'ACTIVE'
      },
      {
        id: 'ALT-002',
        timestamp: new Date(Date.now() - 28 * 60000).toISOString(),
        type: 'CRITICAL',
        category: 'FICN Detection',
        message: 'High-quality ₹500 FICN batch intercepted at Mumbai banking operations',
        origin: 'Mumbai Central / SBI Branch 0421',
        status: 'INVESTIGATING'
      },
      {
        id: 'ALT-003',
        timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
        type: 'WARNING',
        category: 'Fraud Network Node',
        message: 'New mule account cluster identified — Karnataka region, 18 accounts',
        origin: 'Bengaluru Urban / I4C Intel Feed',
        status: 'ACTIVE'
      },
      {
        id: 'ALT-004',
        timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
        type: 'INFO',
        category: 'Voice Clone Detection',
        message: 'ElevenLabs vocoder signature matched in 3 separate complaint audio samples',
        origin: 'VoiceLab AI Engine / Case V-4921',
        status: 'MITIGATED'
      }
    ],
    weeklyTrend: [
      { day: 'Mon', cases: 142 },
      { day: 'Tue', cases: 168 },
      { day: 'Wed', cases: 155 },
      { day: 'Thu', cases: 202 },
      { day: 'Fri', cases: 241 },
      { day: 'Sat', cases: 189 },
      { day: 'Sun', cases: 218 }
    ],
    threatDistribution: {
      digitalArrest: 38,
      counterfeit: 24,
      fraudNetwork: 22,
      voiceClone: 16
    },
    generatedAt: new Date().toISOString()
  };

  res.json({ success: true, data: stats });
}
