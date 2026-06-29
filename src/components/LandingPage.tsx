import React from 'react';
import { Shield, Brain, Radio, Award, AlertTriangle, Users, ArrowRight, Eye, RefreshCw, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 font-sans relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Navigation */}
      <header className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                SENTINEL<span className="text-emerald-400">AI</span>
              </span>
              <span className="block text-[9px] font-mono tracking-[0.2em] uppercase text-emerald-500/80 -mt-1">
                Sovereign Cyber Guard
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
            <a href="#suite" className="hover:text-emerald-400 transition-colors">Intelligence Suite</a>
            <a href="#command" className="hover:text-emerald-400 transition-colors">Command Center</a>
            <a href="#stats" className="hover:text-emerald-400 transition-colors">Operational Stats</a>
            <a href="#trust" className="hover:text-emerald-400 transition-colors">Testimonials</a>
          </nav>

          <div>
            <button
              onClick={onEnterDashboard}
              className="relative group overflow-hidden px-5 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider bg-emerald-500 text-gray-950 hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center space-x-2"
              id="landing-enter-cta-header"
            >
              <span>Secure Console</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>National Intelligence Engine Active</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-tight">
            Next-Gen Cyber Intelligence.
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              Predict • Prevent • Protect
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            SentinelAI leverages sovereign-grade neural networks to intercept fraud, map criminal ecosystems,
            and provide real-time protection for the digital frontier. Designed for frontline defence and sovereign agencies.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto relative group overflow-hidden px-8 py-4 rounded-xl font-mono text-sm font-bold uppercase tracking-wider bg-emerald-500 text-gray-950 hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.45)] flex items-center justify-center space-x-3"
              id="landing-hero-main-cta"
            >
              <span>Access Command Center</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a
              href="#suite"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-mono text-sm font-bold uppercase tracking-wider bg-gray-900/60 border border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition-colors text-gray-300 text-center"
            >
              Explore Intelligence Suite
            </a>
          </div>
        </div>

        {/* Dashboard Preview Frame Mockup */}
        <div id="command" className="mt-16 md:mt-24 border border-gray-800/80 bg-gray-950/80 rounded-2xl overflow-hidden p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
          {/* Mock Window Header */}
          <div className="flex items-center justify-between border-b border-gray-800/80 pb-3 px-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="text-xs font-mono text-gray-500 pl-4 uppercase tracking-widest">SOVEREIGN-HQ-CONSOLE // DEV-BUILD-v5.0</span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE FEED SECURED // 256-BIT ENCRYPTED</span>
            </div>
          </div>
          {/* Mock Screen Content */}
          <div className="aspect-[16/9] w-full bg-[#040914] relative rounded-lg overflow-hidden flex flex-col justify-between p-6">
            <div className="cyber-grid absolute inset-0 opacity-20 pointer-events-none" />
            <div className="absolute inset-x-0 h-0.5 bg-emerald-500/10 scanning-line pointer-events-none" />

            {/* Mock Header Row */}
            <div className="flex justify-between items-start z-10">
              <div>
                <h4 className="text-lg font-mono font-bold text-white tracking-tight flex items-center space-x-2">
                  <span>METROPOLITAN THREAT INDEX</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">ACTIVE DRILL</span>
                </h4>
                <p className="text-xs font-mono text-gray-500">Live satellite and digital stream analysis</p>
              </div>
              <div className="bg-gray-900/80 border border-gray-800 rounded px-3 py-1.5 text-right font-mono text-[10px]">
                <div className="text-gray-400">THREAT LEVEL</div>
                <div className="text-red-400 font-bold">ELEVATED (LEVEL 3)</div>
              </div>
            </div>

            {/* Mock Analytics Middle Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 z-10 w-full my-4">
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-gray-400 uppercase">Voice Cloning Attacks</span>
                <span className="text-2xl font-mono font-extrabold text-red-400 mt-2">1,248</span>
                <span className="text-[9px] font-mono text-red-400/80 flex items-center mt-1">
                  <span className="inline-block mr-1">▲</span> +12% CRITICAL THREATS
                </span>
              </div>
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-gray-400 uppercase">Counterfeit Intercepts</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-400 mt-2">₹1,776 Cr</span>
                <span className="text-[9px] font-mono text-emerald-400/80 flex items-center mt-1">
                  <span className="inline-block mr-1">▼</span> SECURED SYSTEMICALLY
                </span>
              </div>
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-gray-400 uppercase">AI Threat Neutralization</span>
                <span className="text-2xl font-mono font-extrabold text-white mt-2">98.7%</span>
                <span className="text-[9px] font-mono text-emerald-400/80 flex items-center mt-1">
                  <span className="inline-block mr-1">●</span> ACTIVE 24/7 OVERWATCH
                </span>
              </div>
            </div>

            {/* Mock Footer Details */}
            <div className="border-t border-gray-800/60 pt-4 flex justify-between items-center text-[10px] font-mono text-gray-500 z-10">
              <div className="flex space-x-6">
                <span>SYSTEM OK</span>
                <span>NODES CONNECTED: 8,429</span>
                <span>REGIONAL HUBS: ACTIVE (INDIA)</span>
              </div>
              <div className="text-emerald-500/80 font-bold">
                [PRESS ENTER SECURE CONSOLE CTA TO OPERATE]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Stats Section — sourced from MHA/NCRB/RBI problem statement */}
      <section id="stats" className="border-y border-gray-800/60 bg-gray-950/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-mono text-gray-600 mb-8 uppercase tracking-widest">
            Source: NCRB Annual Report 2023 | MHA Digital Safety Report 2024 | RBI Annual Report 2025
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-white">1.14M</div>
              <div className="text-xs font-mono uppercase text-gray-500 tracking-wider">Cybercrime Complaints 2023</div>
              <div className="text-[9px] font-mono text-red-400">↑60% from 2022</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-red-400">₹1,776Cr</div>
              <div className="text-xs font-mono uppercase text-gray-500 tracking-wider">Digital Arrest Losses</div>
              <div className="text-[9px] font-mono text-gray-600">Jan–Sep 2024 alone</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-orange-400">Record</div>
              <div className="text-xs font-mono uppercase text-gray-500 tracking-wider">FICN Seizures 2025</div>
              <div className="text-[9px] font-mono text-gray-600">₹500 fakes — bank-grade quality</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-emerald-400">5</div>
              <div className="text-xs font-mono uppercase text-gray-500 tracking-wider">AI Modules Deployed</div>
              <div className="text-[9px] font-mono text-gray-600">DA · FICN · Graph · Geo · Shield</div>
            </div>
            <div className="col-span-2 md:col-span-1 space-y-1">
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-white">12</div>
              <div className="text-xs font-mono uppercase text-gray-500 tracking-wider">Indian Languages</div>
              <div className="text-[9px] font-mono text-gray-600">Citizen Shield support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Sovereign Intelligence Suite */}
      <section id="suite" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Sovereign Intelligence Suite
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            A comprehensive matrix of neural modules tracking the landscape of modern digital crime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Digital Arrest */}
          <div className="bg-gray-900/30 border border-gray-800/80 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">Digital Arrest Detection</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Live natural-language audio and text analysis to detect high-coercion police impersonation scams, mapping threats dynamically.
              </p>
            </div>
            <div className="pt-6 font-mono text-xs text-emerald-400/80 flex items-center space-x-1 group-hover:text-emerald-300">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: Counterfeit Detection */}
          <div className="bg-gray-900/30 border border-gray-800/80 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">Counterfeit Detection</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Deploy advanced machine vision over watermarks, microprinting, and alignment indices to verify the legality and origin of assets.
              </p>
            </div>
            <div className="pt-6 font-mono text-xs text-emerald-400/80 flex items-center space-x-1 group-hover:text-emerald-300">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3: Fraud Intelligence */}
          <div className="bg-gray-900/30 border border-gray-800/80 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">Fraud Network Mapping</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Plot and navigate transactional and spatial linkages. Uncover deep fraud rings, mule clusters, and device overlaps automatically.
              </p>
            </div>
            <div className="pt-6 font-mono text-xs text-emerald-400/80 flex items-center space-x-1 group-hover:text-emerald-300">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 4: Crime Heatmaps */}
          <div className="bg-gray-900/30 border border-gray-800/80 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">Geospatial Crime Maps</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Synchronized geospatial layering overlaying digital fraud vectors, showing real-time metropolitan threats and predictive patrol sweeps.
              </p>
            </div>
            <div className="pt-6 font-mono text-xs text-emerald-400/80 flex items-center space-x-1 group-hover:text-emerald-300">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 5: Citizen AI Shield */}
          <div className="bg-gray-900/30 border border-gray-800/80 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">Citizen AI Shield</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Help citizens identify risks instantly. Let them type phone credentials, UPI strings, or suspicious pitches to secure immediate advice.
              </p>
            </div>
            <div className="pt-6 font-mono text-xs text-emerald-400/80 flex items-center space-x-1 group-hover:text-emerald-300">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 6: Voice Spoof Detection */}
          <div className="bg-gray-900/30 border border-gray-800/80 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">Voice Spoof Detection</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Isolate vocal deepfakes and synthesize models using stress tracking and phoneme extraction arrays, verifying identity in critical scopes.
              </p>
            </div>
            <div className="pt-6 font-mono text-xs text-emerald-400/80 flex items-center space-x-1 group-hover:text-emerald-300">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section id="trust" className="py-20 bg-gray-950/40 border-t border-gray-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Trusted by the Frontline
            </h2>
            <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              DEPLOYED IN SOVEREIGN DEFENCE AND NATIONAL SECURITY CORES
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900/20 border border-gray-850 p-6 rounded-2xl space-y-4">
              <p className="text-sm text-gray-300 italic leading-relaxed">
                "SentinelAI's Digital Arrest module immediately flagged a major syndicate targeting citizens in major metros. The conversational extraction speed was invaluable."
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Superintendent of Police</h4>
                  <p className="text-[10px] font-mono text-gray-500">State Cyber Crime Division</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/20 border border-gray-850 p-6 rounded-2xl space-y-4">
              <p className="text-sm text-gray-300 italic leading-relaxed">
                "Neutralizing a ₹50 Cr counterfeit operation was made possible through their machine vision note scanner. SentinelAI mapped the printer signature instantly."
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Director General</h4>
                  <p className="text-[10px] font-mono text-gray-500">Economic Offences Wing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-850 bg-gray-950 py-12 text-center text-xs text-gray-500 font-mono space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Shield className="w-5 h-5 text-emerald-500/50" />
          <span className="text-white font-display font-bold tracking-tight">
            SENTINEL<span className="text-emerald-500">AI</span>
          </span>
        </div>
        <p className="max-w-md mx-auto">
          CLASSIFIED INFORMATION CHANNEL. SECURITY COMPLIANT UNDER SOVEREIGN INTEL PROTOCOL CO-908. FOR AUTHORIZED STATE USE ONLY.
        </p>
        <p>© 2026 SentinelAI. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
