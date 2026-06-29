import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeDigitalArrest } from './routes/digitalArrest';
import { analyzeCounterfeit } from './routes/counterfeit';
import { analyzeFraudNetwork } from './routes/fraudNetwork';
import { citizenShieldChat, credentialCheck } from './routes/citizenShield';
import { analyzeVoice } from './routes/voiceLab';
import { getCrimeMapData } from './routes/crimeMap';
import { getDashboardStats } from './routes/dashboard';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', service: 'SentinelAI Backend', timestamp: new Date().toISOString() });
});

// AI Routes
app.post('/api/digital-arrest/analyze', analyzeDigitalArrest);
app.post('/api/counterfeit/analyze', analyzeCounterfeit);
app.post('/api/fraud-network/analyze', analyzeFraudNetwork);
app.post('/api/citizen-shield/chat', citizenShieldChat);
app.post('/api/citizen-shield/credential-check', credentialCheck);
app.post('/api/voice-lab/analyze', analyzeVoice);
app.get('/api/crime-map/data', getCrimeMapData);
app.get('/api/dashboard/stats', getDashboardStats);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🛡️  SentinelAI Backend running on http://localhost:${PORT}`);
  console.log(`📡 Gemini AI integration: ${process.env.GEMINI_API_KEY ? 'ACTIVE' : 'Missing API Key'}\n`);
});
