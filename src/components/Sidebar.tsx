import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Radio,
  Layers,
  Network,
  Map,
  Volume2,
  ShieldCheck,
  FileText,
  Settings,
  LogOut,
  Shield
} from 'lucide-react';
import { ActiveScreen } from '../types';

interface SidebarProps {
  activeScreen: ActiveScreen;
  onScreenChange: (screen: ActiveScreen) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeScreen, onScreenChange, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'AI Command Center', icon: LayoutDashboard },
    { id: 'alerts', label: 'Alert Center', icon: ShieldAlert, badge: '4' },
    { id: 'digital-arrest', label: 'Digital Arrest Detection', icon: Radio },
    { id: 'counterfeit', label: 'Counterfeit Detection', icon: Layers },
    { id: 'fraud-network', label: 'Fraud Network Graph', icon: Network },
    { id: 'crime-map', label: 'Geospatial Crime Map', icon: Map },
    { id: 'voice-lab', label: 'Voice Spoof Lab', icon: Volume2 },
    { id: 'citizen-shield', label: 'Citizen Shield AI', icon: ShieldCheck },
    { id: 'reports', label: 'Dossier Reports', icon: FileText },
    { id: 'settings', label: 'Settings & Security', icon: Settings },
  ] as const;

  return (
    <aside className="w-64 bg-gray-950 border-r border-gray-800/80 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div className="flex flex-col overflow-y-auto grow">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-800/60 flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="font-display font-extrabold text-sm tracking-tight text-white uppercase">
              SENTINEL<span className="text-emerald-400">AI</span>
            </span>
            <span className="block text-[8px] font-mono tracking-widest text-gray-500 uppercase">
              LEVEL 5 SECURE AUTH
            </span>
          </div>
        </div>

        {/* Navigation Options */}
        <nav className="p-4 space-y-1">
          <div className="text-[9px] font-mono font-bold text-gray-500 px-3 mb-2 tracking-widest uppercase">
            Surveillance Core
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onScreenChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white border border-transparent'
                }`}
                id={`sidebar-nav-${item.id}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 pulse-cyber">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Logout */}
      <div className="p-4 border-t border-gray-800/60 bg-gray-950/80 space-y-3">
        <div className="bg-gray-900/40 rounded-lg p-3 border border-gray-850">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
            <span>OPERATOR</span>
            <span className="text-emerald-400 font-bold">ADMIN-01</span>
          </div>
          <div className="h-1 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full w-[85%] bg-emerald-500" />
          </div>
          <div className="text-[8px] font-mono text-gray-500 mt-1 uppercase flex justify-between">
            <span>SYS AUTH</span>
            <span>85% STABLE</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono text-gray-400 hover:bg-red-950/20 hover:text-red-400 border border-transparent hover:border-red-950/30 transition-all"
          id="sidebar-logout"
        >
          <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
          <span>Exit Secure Console</span>
        </button>
      </div>
    </aside>
  );
}
