export type ActiveScreen =
  | 'landing'
  | 'dashboard'
  | 'digital-arrest'
  | 'counterfeit'
  | 'fraud-network'
  | 'crime-map'
  | 'voice-lab'
  | 'citizen-shield'
  | 'alerts'
  | 'reports'
  | 'settings';

export interface ThreatAlert {
  id: string;
  timestamp: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  category: string;
  message: string;
  origin: string;
  status: 'ACTIVE' | 'MITIGATED' | 'INVESTIGATING';
}

export interface CaseDossier {
  id: string;
  title: string;
  target: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'ACTIVE' | 'CLOSED' | 'UNDER_REVIEW';
  summary: string;
  dateCreated: string;
  evidenceCount: number;
}
