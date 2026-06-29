import React, { useState, useEffect } from 'react';
import { Search, Bell, Shield, ShieldCheck, Mail, Globe, User } from 'lucide-react';

export default function TopBar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatIST = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
    });
  };

  return (
    <header className="h-16 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/80 flex items-center justify-between px-6 z-40 sticky top-0 shrink-0">
      {/* Title & Status Block */}
      <div className="flex items-center space-x-6">
        <div>
          <h2 className="text-sm font-mono font-bold text-white tracking-wider uppercase">
            SOVEREIGN CORE <span className="text-emerald-400">CONSOLE</span>
          </h2>
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest">
              THREAT LEVEL: ELEVATED (STATE LEVEL 3)
            </span>
          </div>
        </div>
      </div>

      {/* Center Search / System Indicator */}
      <div className="hidden lg:flex items-center bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 w-80">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Query intelligence database..."
          className="bg-transparent border-none text-xs text-gray-300 focus:outline-none w-full font-mono placeholder-gray-600"
        />
      </div>

      {/* Right Operations and Status */}
      <div className="flex items-center space-x-6 font-mono text-xs text-gray-400">
        {/* Local & IST Clocks */}
        <div className="hidden sm:flex flex-col text-right border-r border-gray-800/80 pr-6">
          <span className="text-[9px] text-gray-500 uppercase tracking-widest">HQ LOCAL (IST)</span>
          <span className="text-white font-bold text-sm tracking-widest">{formatIST(currentTime)} IST</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          <button className="relative p-1.5 rounded-lg bg-gray-900 hover:bg-gray-850 text-gray-400 hover:text-emerald-400 border border-gray-800 transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          <button className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-850 text-gray-400 hover:text-emerald-400 border border-gray-800 transition-all">
            <Mail className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-850 text-gray-400 hover:text-emerald-400 border border-gray-800 transition-all">
            <Globe className="w-4 h-4" />
          </button>
        </div>

        {/* Administrator profile */}
        <div className="flex items-center space-x-3 pl-2 border-l border-gray-800/80">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <User className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-left hidden md:block">
            <div className="text-white font-bold text-xs uppercase leading-tight">Chief Officer</div>
            <div className="text-[9px] text-emerald-500 font-bold tracking-widest leading-none">LEVEL 5 ACCESS</div>
          </div>
        </div>
      </div>
    </header>
  );
}
