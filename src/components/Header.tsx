import React from "react";
import { Terminal, Shield, Cpu, RefreshCw, Layers, Sliders } from "lucide-react";

interface HeaderProps {
  onOpenSettings: () => void;
  currentView: string;
}

export default function Header({ onOpenSettings, currentView }: HeaderProps) {
  return (
    <header className="border-b border-nexus-border bg-[#030706]/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Animated Custom Logo Grid */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded border border-nexus-green/30 bg-[#000a06] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00ff88]/10 to-transparent group-hover:bg-[#00ff88]/20 transition-all duration-300"></div>
          <Cpu className="w-4 h-4 text-nexus-green group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        {/* Branding */}
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-display font-black text-lg tracking-wider text-white">NEXUS</span>
            <span className="font-display font-medium text-xs bg-nexus-green text-nexus-bg px-1.5 py-0.5 rounded font-black tracking-widest uppercase">AI</span>
          </div>
          <div className="font-mono text-[9px] text-[#00ff88]/60 tracking-wider">
            SYSTEM_OPERATOR // CORE_RUNNING
          </div>
        </div>
      </div>

      {/* Center Operational View Tag */}
      <div className="hidden md:flex items-center space-x-2 bg-[#081310] border border-nexus-border px-3 py-1 rounded text-[11px] font-mono">
        <Terminal className="w-3.5 h-3.5 text-nexus-green" />
        <span className="text-gray-400">ACTIVE_WORKSPACE_NODE:</span>
        <span className="text-white font-medium uppercase text-nexus-green tracking-widest">{currentView}</span>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center space-x-3">
        <div className="hidden lg:flex flex-col items-end text-right font-mono text-[10px]">
          <span className="text-gray-400">SESSION_STATUS: <span className="text-nexus-green">STABLE</span></span>
          <span className="text-gray-500 text-[9px]">V2.4.0-B8821 // SECURE</span>
        </div>

        {/* Settings button mimicking screenshot */}
        <button 
          id="hdr-settings-btn"
          onClick={onOpenSettings}
          className="flex items-center justify-center p-2 rounded border border-nexus-border hover:border-nexus-green bg-[#080f0d] text-gray-400 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
          title="Open System settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* User Operator Avatar */}
        <div className="relative group cursor-pointer" onClick={onOpenSettings}>
          <div className="w-9 h-9 rounded-full border border-nexus-green/40 overflow-hidden bg-[#0a1411] flex items-center justify-center shadow-lg hover:border-nexus-green transition-all">
            <svg viewBox="0 0 100 100" className="w-full h-full text-nexus-green/80">
              <rect x="0" y="0" width="100" height="100" fill="#040d0a" />
              {/* Sci-fi avatar placeholder drawing inside SVG */}
              <circle cx="50" cy="35" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <path d="M50,17 L50,8 M32,35 L23,35 M68,35 L77,35" stroke="currentColor" strokeWidth="2" />
              <path d="M25,75 C25,55 35,50 50,50 C65,50 75,55 75,75" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="50" cy="32" r="2.5" fill="currentColor" />
              <circle cx="44" cy="35" r="1.5" fill="currentColor" />
              <circle cx="56" cy="35" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-nexus-green rounded-full border-2 border-nexus-bg"></span>
        </div>
      </div>
    </header>
  );
}
