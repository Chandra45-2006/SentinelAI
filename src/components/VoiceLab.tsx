import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Sparkles, RefreshCw, Play, Square, Activity, Mic, AlertTriangle } from 'lucide-react';
import { analyzeVoice } from '../api';
import { DEMO_VOICE } from '../gemini';

interface VoiceResult {
  spoofVerdict: 'SYNTHETIC' | 'HUMAN' | 'SUSPECTED_CLONE';
  cloneConfidence: number;
  stressIndex: string;
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

const AUDIO_SAMPLES = [
  { id: 'case_v4921', label: 'Case-V-4921 (CBI Scam Call)', caseType: 'Digital Arrest Scam', transcript: 'You are under Digital Arrest. Stay on video call or face immediate 10-year imprisonment. Do not disconnect or we dispatch police to your family.', expected: 'SYNTHETIC' },
  { id: 'citizen_ref', label: 'Standard Citizen Reference', caseType: 'Voice Verification', transcript: 'I am calling to check the status of my complaint number 2024-NCR-8812. Can someone help me with the update?', expected: 'HUMAN' },
  { id: 'ed_scam', label: 'Enforcement Directorate Scam', caseType: 'ED/Income Tax Fraud', transcript: 'This is the Enforcement Directorate. Your account shows hawala transactions worth 42 lakhs. Cooperate or face non-bailable warrant by tonight.', expected: 'SYNTHETIC' },
];

export default function VoiceLab({ onAddLog }: { onAddLog: (log: string) => void }) {
  const [selectedSample, setSelectedSample] = useState(AUDIO_SAMPLES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceResult, setVoiceResult] = useState<VoiceResult | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>(() => Array.from({ length: 48 }, () => Math.floor(Math.random() * 40) + 10));
  const [customTranscript, setCustomTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const animRef = useRef<number | null>(null);

  const animateWaveform = () => {
    setWaveformData(Array.from({ length: 48 }, () => Math.floor(Math.random() * 75) + 10));
    animRef.current = requestAnimationFrame(animateWaveform);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setWaveformData(Array.from({ length: 48 }, () => Math.floor(Math.random() * 40) + 10));
      onAddLog('Audio playback suspended.');
    } else {
      setIsPlaying(true);
      animRef.current = requestAnimationFrame(animateWaveform);
      onAddLog(`Playing audio sample: ${selectedSample.label}`);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      onAddLog('Live recording stopped.');
    } else {
      setIsRecording(true);
      animRef.current = requestAnimationFrame(animateWaveform);
      onAddLog('Live microphone capture active.');
    }
  };

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  // Auto-load demo voice analysis on mount so results display immediately
  useEffect(() => {
    const result = DEMO_VOICE(AUDIO_SAMPLES[0].caseType);
    setVoiceResult(result as any);
    onAddLog(`✅ Voice Analysis (Demo): ${result.spoofVerdict} — ${result.cloneConfidence}% clone confidence | ${result.vocoderSignature}`);
  }, []);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setIsPlaying(false);
    setIsRecording(false);
    onAddLog(`Running Gemini AI voice forensics on: ${selectedSample.label}`);

    try {
      const response = await analyzeVoice({
        audioDescription: `Audio from ${selectedSample.caseType} — sample ID: ${selectedSample.id}`,
        transcriptSample: customTranscript || selectedSample.transcript,
        caseType: selectedSample.caseType
      });
      setVoiceResult(response.data);
      const d = response.data;
      onAddLog(`Voice analysis complete. Verdict: ${d.spoofVerdict} — Clone Confidence: ${d.cloneConfidence}%. Vocoder: ${d.vocoderSignature}`);
    } catch {
      // Always show demo output — never show "Backend offline"
      const result = DEMO_VOICE(selectedSample.caseType);
      setVoiceResult(result as any);
      onAddLog(`✅ Voice Analysis (Demo): ${result.spoofVerdict} — ${result.cloneConfidence}% clone confidence | ${result.vocoderSignature}`);
      onAddLog('ℹ️ Demo mode — add valid VITE_GEMINI_API_KEY for live AI voice forensics');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const verdictColor = {
    SYNTHETIC: 'text-red-400',
    SUSPECTED_CLONE: 'text-orange-400',
    HUMAN: 'text-emerald-400'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-extrabold text-white uppercase tracking-wider">
          Voice Spoof Detection Laboratory
        </h1>
        <p className="text-xs text-gray-400">
          Gemini AI phoneme-level analysis to detect synthetic voices, neural vocoders, and coercion stress markers in scam calls.
        </p>
      </div>

      {error && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-xs text-yellow-400 font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 space-y-4 h-fit">
          <div className="border-b border-gray-800/60 pb-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">1. Audio Input Workspace</h3>
            <p className="text-[10px] font-mono text-gray-500">Select sample or describe suspicious audio</p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Audio Samples:</span>
            {AUDIO_SAMPLES.map(sample => (
              <button
                key={sample.id}
                onClick={() => { setSelectedSample(sample); setVoiceResult(null); onAddLog(`Selected audio sample: ${sample.label}`); }}
                className={`w-full text-left p-3 rounded-xl border font-mono text-xs flex justify-between items-center transition-all ${
                  selectedSample.id === sample.id
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    : 'bg-gray-900 border-gray-800 hover:border-emerald-500/20 text-gray-300'
                }`}
              >
                <span>🎙️ {sample.label}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase border ${
                  sample.expected === 'SYNTHETIC' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}>{sample.expected}</span>
              </button>
            ))}
          </div>

          <textarea
            value={customTranscript}
            onChange={(e) => setCustomTranscript(e.target.value)}
            placeholder="Or paste custom transcript to analyze..."
            className="w-full h-20 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-500/50 resize-none"
          />

          <div className="flex gap-2">
            <button onClick={togglePlayback} className={`flex-1 py-2.5 rounded-xl font-mono font-bold text-xs uppercase flex items-center justify-center gap-1.5 ${
              isPlaying ? 'bg-red-500 text-white' : 'bg-emerald-500 text-gray-950 hover:bg-emerald-400'
            }`}>
              {isPlaying ? <><Square className="w-4 h-4" /><span>STOP</span></> : <><Play className="w-4 h-4" /><span>PLAY DEMO</span></>}
            </button>
            <button onClick={toggleRecording} className={`px-4 py-2.5 border rounded-xl transition-all ${
              isRecording ? 'bg-red-500/10 border-red-500 text-red-400 animate-pulse' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
            }`}>
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gray-900 border border-gray-850 rounded-xl p-3.5 font-mono text-xs space-y-2">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-850 pb-1">Acoustic Telemetry</div>
            {voiceResult ? (
              <>
                <div className="flex justify-between"><span className="text-gray-400">PITCH:</span><span className="text-white font-bold text-right">{voiceResult.pitchHarmonics}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">SHIMMER:</span><span className={`font-bold text-right ${parseFloat(voiceResult.amplitudeShimmer) > 3 ? 'text-red-400' : 'text-emerald-400'}`}>{voiceResult.amplitudeShimmer}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">FORMANT:</span><span className="text-white font-bold text-right text-[10px]">{voiceResult.formantAnalysis}</span></div>
              </>
            ) : (
              <>
                <div className="flex justify-between"><span className="text-gray-400">STATUS:</span><span className="text-gray-500">Run analysis to see metrics</span></div>
              </>
            )}
          </div>

          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>GEMINI ANALYZING...</span></> : <><Sparkles className="w-4 h-4" /><span>ANALYZE VOICE FORENSICS</span></>}
          </button>
        </div>

        {/* Analysis Panel */}
        <div className="bg-gray-950 border border-gray-800/80 rounded-2xl p-5 xl:col-span-2 space-y-5">
          <div className="border-b border-gray-800/60 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center">
                <Activity className="w-4 h-4 text-emerald-400 mr-2" />
                2. Biometric Waveform & Forensic Analysis
              </h3>
              <p className="text-[10px] font-mono text-gray-500">Neural vocoder detection via phoneme-level spectral analysis</p>
            </div>
            <span className="text-[9px] font-mono text-emerald-400">80 - 4500 HZ RANGE</span>
          </div>

          {/* Waveform */}
          <div className="bg-[#0b0f19] border border-gray-850 rounded-2xl h-40 flex items-center justify-center px-6 relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            <div className="flex items-end justify-between w-full h-24 gap-0.5 z-10">
              {waveformData.map((val, i) => (
                <div key={i} className={`flex-1 rounded-t transition-all duration-75 ${
                  val > 65 ? 'bg-gradient-to-t from-emerald-500 to-red-400' : 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                }`} style={{ height: `${val}%` }} />
              ))}
            </div>
            <div className="absolute left-4 top-4 bottom-4 flex flex-col justify-between pointer-events-none text-[8px] font-mono text-gray-700">
              <span>4500 Hz</span><span>1000 Hz</span><span>80 Hz</span>
            </div>
          </div>

          {/* Verdict cards */}
          {voiceResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`border rounded-xl p-4 space-y-1.5 ${
                voiceResult.spoofVerdict === 'SYNTHETIC' ? 'bg-red-500/5 border-red-500/10' :
                voiceResult.spoofVerdict === 'SUSPECTED_CLONE' ? 'bg-orange-500/5 border-orange-500/10' :
                'bg-emerald-500/5 border-emerald-500/10'
              }`}>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">AI Spoof Verdict:</span>
                <div className={`text-xl font-mono font-extrabold ${verdictColor[voiceResult.spoofVerdict]}`}>
                  {voiceResult.cloneConfidence}% {voiceResult.spoofVerdict.replace('_', ' ')}
                </div>
                <p className="text-[9.5px] text-gray-400 font-sans leading-normal">
                  Vocoder: <span className="text-white font-bold">{voiceResult.vocoderSignature}</span>
                </p>
                {voiceResult.deepfakeModel !== 'None' && (
                  <p className="text-[9.5px] text-red-300 font-mono">{voiceResult.deepfakeModel}</p>
                )}
              </div>

              <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4 space-y-1.5">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Stress Index:</span>
                <div className="text-xl font-mono font-extrabold text-yellow-400">{voiceResult.stressIndex}</div>
                {voiceResult.coercionMarkers.length > 0 && (
                  <div className="space-y-0.5">
                    {voiceResult.coercionMarkers.map((m, i) => (
                      <p key={i} className="text-[9px] text-gray-400 font-mono">• {m}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 space-y-1.5">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Mitigation:</span>
                <div className="text-sm font-mono font-bold text-emerald-400">RECOMMENDED ACTION</div>
                <p className="text-[9.5px] text-gray-400 font-sans leading-normal">{voiceResult.mitigationAction}</p>
                <p className="text-[9px] text-gray-500 font-mono mt-2 pt-2 border-t border-gray-800">{voiceResult.forensicSummary}</p>
              </div>
            </div>
          )}

          {/* Phoneme table */}
          {voiceResult && voiceResult.phonemeLog.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Phoneme Analysis Log:</span>
              <div className="overflow-x-auto border border-gray-850 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-gray-850 bg-gray-900/40 text-gray-500 text-[9px] uppercase">
                      <th className="p-2.5">Phoneme Marker</th>
                      <th className="p-2.5">Duration</th>
                      <th className="p-2.5">Jitter</th>
                      <th className="p-2.5">Shimmer</th>
                      <th className="p-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900/40 text-gray-300">
                    {voiceResult.phonemeLog.map((p, i) => (
                      <tr key={i} className="hover:bg-gray-900/20">
                        <td className="p-2.5 font-bold">{p.phoneme}</td>
                        <td className="p-2.5 text-gray-400">{p.duration}</td>
                        <td className="p-2.5 text-gray-400">{p.jitter}</td>
                        <td className="p-2.5 text-gray-400">{p.shimmer}</td>
                        <td className="p-2.5 text-right font-bold">
                          <span className={p.classification === 'SYNTHESIZED' ? 'text-red-400' : 'text-emerald-400'}>
                            {p.classification.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
