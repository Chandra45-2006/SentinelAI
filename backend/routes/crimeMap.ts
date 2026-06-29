import { Request, Response } from 'express';

// Real Indian city coordinates with simulated incident data
const crimeMapData = {
  zones: [
    {
      id: 'Z-01',
      name: 'Mumbai Metropolitan Region',
      state: 'Maharashtra',
      latLon: '19.0760, 72.8777',
      lat: 19.076,
      lon: 72.8777,
      threatLevel: 'CRITICAL',
      incidentCount: 482,
      digitalArrestCases: 124,
      counterfeitCases: 87,
      fraudNetworkNodes: 34,
      activePatrols: 14,
      coordinates: { cx: 108, cy: 218 },
      trend: '+18% this week',
      topVector: 'Digital Arrest Scams',
      lastIncident: '2 hours ago'
    },
    {
      id: 'Z-02',
      name: 'Bengaluru Urban District',
      state: 'Karnataka',
      latLon: '12.9716, 77.5946',
      lat: 12.9716,
      lon: 77.5946,
      threatLevel: 'ELEVATED',
      incidentCount: 390,
      digitalArrestCases: 89,
      counterfeitCases: 112,
      fraudNetworkNodes: 28,
      activePatrols: 11,
      coordinates: { cx: 155, cy: 305 },
      trend: '+12% this week',
      topVector: 'FICN Counterfeit Seizures',
      lastIncident: '45 minutes ago'
    },
    {
      id: 'Z-03',
      name: 'Delhi NCR Command Zone',
      state: 'Delhi',
      latLon: '28.6139, 77.2090',
      lat: 28.6139,
      lon: 77.209,
      threatLevel: 'CRITICAL',
      incidentCount: 512,
      digitalArrestCases: 218,
      counterfeitCases: 94,
      fraudNetworkNodes: 52,
      activePatrols: 18,
      coordinates: { cx: 148, cy: 108 },
      trend: '+31% this week',
      topVector: 'CBI/ED Impersonation',
      lastIncident: '12 minutes ago'
    },
    {
      id: 'Z-04',
      name: 'Chennai Cyber Corridor',
      state: 'Tamil Nadu',
      latLon: '13.0827, 80.2707',
      lat: 13.0827,
      lon: 80.2707,
      threatLevel: 'MODERATE',
      incidentCount: 166,
      digitalArrestCases: 42,
      counterfeitCases: 78,
      fraudNetworkNodes: 14,
      activePatrols: 6,
      coordinates: { cx: 188, cy: 296 },
      trend: '+5% this week',
      topVector: 'Voice Clone Fraud',
      lastIncident: '3 hours ago'
    },
    {
      id: 'Z-05',
      name: 'Kolkata East Division',
      state: 'West Bengal',
      latLon: '22.5726, 88.3639',
      lat: 22.5726,
      lon: 88.3639,
      threatLevel: 'ELEVATED',
      incidentCount: 224,
      digitalArrestCases: 76,
      counterfeitCases: 98,
      fraudNetworkNodes: 22,
      activePatrols: 8,
      coordinates: { cx: 275, cy: 178 },
      trend: '+9% this week',
      topVector: 'Currency Counterfeiting',
      lastIncident: '1 hour ago'
    },
    {
      id: 'Z-06',
      name: 'Hyderabad Tech Zone',
      state: 'Telangana',
      latLon: '17.3850, 78.4867',
      lat: 17.385,
      lon: 78.4867,
      threatLevel: 'ELEVATED',
      incidentCount: 198,
      digitalArrestCases: 88,
      counterfeitCases: 44,
      fraudNetworkNodes: 19,
      activePatrols: 7,
      coordinates: { cx: 172, cy: 262 },
      trend: '+22% this week',
      topVector: 'IT Sector Fraud Targeting',
      lastIncident: '30 minutes ago'
    }
  ],
  nationalSummary: {
    totalComplaints2024: 1140000,
    digitalArrestLossCrore: 1776,
    activeInvestigations: 2847,
    frozenAccounts: 18420,
    arrestsMade: 892,
    ficnSeizures2025: 'Record high per RBI Annual Report 2025'
  },
  generatedAt: new Date().toISOString()
};

export function getCrimeMapData(_req: Request, res: Response): void {
  res.json({ success: true, data: crimeMapData });
}
