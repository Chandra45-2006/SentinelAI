import React, { useState } from 'react';
import { ActiveScreen } from './types';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardOverview from './components/DashboardOverview';
import DigitalArrest from './components/DigitalArrest';
import CounterfeitDetection from './components/CounterfeitDetection';
import FraudNetwork from './components/FraudNetwork';
import CrimeMap from './components/CrimeMap';
import VoiceLab from './components/VoiceLab';
import CitizenShield from './components/CitizenShield';
import AlertCenter from './components/AlertCenter';
import CaseReports from './components/CaseReports';
import SettingsConsole from './components/SettingsConsole';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('landing');
  const [auditLogs, setAuditLogs] = useState<string[]>([
    'Secure command bridge loaded successfully.',
    'Sovereign-grade neural nodes active.',
    'Surveillance feed decrypted under 256-bit AES.'
  ]);

  const handleAddLog = (logMessage: string) => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setAuditLogs(prev => [`[${timestamp}] ${logMessage}`, ...prev]);
  };

  const handleScreenChange = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    handleAddLog(`Navigated to security view: "${screen.toUpperCase()}"`);
  };

  const handleLogout = () => {
    setActiveScreen('landing');
    handleAddLog('Operator disconnected secure session.');
  };

  const handleEnterDashboard = () => {
    setActiveScreen('dashboard');
    handleAddLog('Operator authenticated under LEVEL 5 Clearance.');
  };

  // Render proper sub-screen content
  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardOverview onNavigate={handleScreenChange} onAddLog={handleAddLog} />;
      case 'digital-arrest':
        return <DigitalArrest onAddLog={handleAddLog} />;
      case 'counterfeit':
        return <CounterfeitDetection onAddLog={handleAddLog} />;
      case 'fraud-network':
        return <FraudNetwork onAddLog={handleAddLog} />;
      case 'crime-map':
        return <CrimeMap onAddLog={handleAddLog} />;
      case 'voice-lab':
        return <VoiceLab onAddLog={handleAddLog} />;
      case 'citizen-shield':
        return <CitizenShield onAddLog={handleAddLog} />;
      case 'alerts':
        return <AlertCenter onAddLog={handleAddLog} />;
      case 'reports':
        return <CaseReports onAddLog={handleAddLog} />;
      case 'settings':
        return <SettingsConsole onAddLog={handleAddLog} auditLogs={auditLogs} />;
      default:
        return <DashboardOverview onNavigate={handleScreenChange} onAddLog={handleAddLog} />;
    }
  };

  if (activeScreen === 'landing') {
    return <LandingPage onEnterDashboard={handleEnterDashboard} />;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 font-sans flex h-screen overflow-hidden select-none">
      {/* Dynamic Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      {/* Main Sidebar Navigation */}
      <Sidebar
        activeScreen={activeScreen}
        onScreenChange={handleScreenChange}
        onLogout={handleLogout}
      />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <TopBar />

        {/* Dynamic Screen View scrollable stage */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-950/40 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderScreen()}
          </div>
        </main>
      </div>
    </div>
  );
}
