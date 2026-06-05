import React, { useState } from "react";
import { Sliders, Shield, Key, Eye, EyeOff, Check, AlertTriangle, RefreshCw, LogOut, Radio } from "lucide-react";

export default function SettingsView() {
  const [showKeyConfirm, setShowKeyConfirm] = useState(false);
  const [customKey, setCustomKey] = useState(localStorage.getItem("USER_GEMINI_KEY") || "");
  const [hideKeyField, setHideKeyField] = useState(true);
  const [webhooksActive, setWebhooksActive] = useState(true);
  const [pushActive, setPushActive] = useState(false);
  const [language, setLanguage] = useState("EN_US");
  const [isWiped, setIsWiped] = useState(false);

  const handleSaveKey = () => {
    localStorage.setItem("USER_GEMINI_KEY", customKey);
    setShowKeyConfirm(true);
    setTimeout(() => setShowKeyConfirm(false), 2000);
  };

  const handleTerminateSession = () => {
    const confirmation = window.confirm("CRITICAL WARNING // Are you sure you want to terminate Nexus AI system cores? This will reset local terminal buffers immediately.");
    if (confirmation) {
      setIsWiped(true);
      setTimeout(() => {
        localStorage.clear();
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto pb-24 font-sans bg-[#030706]">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight uppercase">
          SYSTEM <span className="text-nexus-green nexus-glow-text text-nexus-green">SETTINGS</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Configure security authorization keys, telemetry webhooks, and core operational presets.
        </p>
      </div>

      {isWiped && (
        <div className="p-6 bg-red-950/40 border border-red-500 rounded-lg text-center animate-pulse space-y-2">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="font-display font-black text-xl text-white uppercase tracking-wider">TERMINATING_CORES...</h2>
          <p className="font-mono text-xs text-red-400">WIPING MEMORY BUFFERS // OPERATOR SESSION DISCONNECTED</p>
        </div>
      )}

      {/* Operator User Profile Card */}
      <div className="p-5 bg-[#080f0d] border border-nexus-green/20 rounded-lg flex flex-col sm:flex-row items-center sm:justify-between gap-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 text-center sm:text-left gap-3">
          <div className="w-16 h-16 rounded border border-nexus-green bg-[#0c1c16] flex items-center justify-center text-nexus-green overflow-hidden relative shadow-lg">
            <svg viewBox="0 0 100 100" className="w-full h-full text-nexus-green animate-pulse">
              <rect x="0" y="0" width="100" height="100" fill="#040d0a" />
              <circle cx="50" cy="35" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M25,75 C25,55 35,50 50,50 C65,50 75,55 75,75" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="33" r="2.5" fill="currentColor" />
            </svg>
            <span className="absolute bottom-0 right-0 left-0 bg-nexus-green text-nexus-bg font-mono font-bold text-[8px] text-center uppercase tracking-widest leading-none py-0.5">
              ROOT
            </span>
          </div>

          <div className="space-y-0.5">
            <h3 className="font-display font-bold text-lg text-white">OPERATOR_CHAMBER_01</h3>
            <span className="font-mono text-xs text-gray-400 block">sys_admin@nexus-ai.workspace</span>
            <span className="font-mono text-[9px] text-[#00ff88]/60 uppercase tracking-widest font-black block mt-1">
              PRO_MEMBER // LEVEL_4 AUTHORIZATION
            </span>
          </div>
        </div>

        <span className="bg-nexus-green-dark text-nexus-green border border-nexus-green/30 font-mono font-bold text-[10px] tracking-wider px-3 py-1.5 rounded uppercase self-center">
          SYSTEMS: STABLE
        </span>
      </div>

      {/* API authorization block designed carefully */}
      <div className="p-5 bg-[#080f0d] border border-nexus-border rounded-lg space-y-4">
        <div>
          <div className="flex items-center space-x-1.5 font-mono text-xs text-white font-bold uppercase tracking-wider">
            <Key className="w-4 h-4 text-nexus-green" />
            <span>GEMINI_API_AUTHORIZATION</span>
          </div>
          <span className="font-mono text-[9px] text-gray-500 block uppercase mt-0.5">
            Custom client-side backup key. Override standard workspace backend logic.
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 bg-[#030706] border border-nexus-border focus-within:border-nexus-green/45 p-1 rounded">
            <input 
              id="settings-api-key-input"
              type={hideKeyField ? "password" : "text"}
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="PASTE_YOUR_GEMINI_API_KEY_HERE..."
              className="flex-grow bg-transparent text-xs border-none focus:outline-none text-white font-mono placeholder-gray-700 pl-2.5 py-2.5"
            />
            <button 
              id="settings-key-visibility-btn"
              onClick={() => setHideKeyField(!hideKeyField)}
              className="p-2 text-gray-500 hover:text-white transition-all cursor-pointer"
            >
              {hideKeyField ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex justify-end">
            <button 
              id="settings-save-key-btn"
              onClick={handleSaveKey}
              className="bg-nexus-green text-nexus-bg font-mono font-black text-xs px-5 py-2.5 rounded tracking-widest uppercase hover:bg-nexus-green-bright transition-all cursor-pointer active:scale-95 flex items-center space-x-1"
            >
              {showKeyConfirm ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{showKeyConfirm ? "KEY_AUTHORIZED" : "SAVE_CREDENTIAL"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Option settings switcher rows */}
      <div className="p-5 bg-[#080f0d] border border-nexus-border rounded-lg space-y-4">
        <span className="font-mono text-[10px] text-[#00ff88]/60 tracking-widest font-black block uppercase">
          WORKSPACE_PREFERENCES
        </span>

        <div className="space-y-3 pl-1 text-xs font-mono">
          
          {/* Row 1 */}
          <div className="flex items-center justify-between p-3 bg-[#030706] border border-nexus-border rounded">
            <div>
              <span className="text-white block font-bold">SYSTEM_LANGUAGE</span>
              <span className="text-[10px] text-gray-500 uppercase mt-0.5 block">Format date-times coordinates logs</span>
            </div>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#080f0d] border border-nexus-border rounded text-[10px] p-1.5 focus:outline-none text-white font-mono cursor-pointer uppercase"
            >
              <option value="EN_US">ENGLISH (EN_US)</option>
              <option value="JA_JP">JAPANESE (JA_JP)</option>
              <option value="DE_DE">GERMAN (DE_DE)</option>
            </select>
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-between p-3 bg-[#030706] border border-nexus-border rounded">
            <div>
              <span className="text-white block font-bold">WEBHOOK_TRANSMISSIONS</span>
              <span className="text-[10px] text-gray-500 uppercase mt-0.5 block">Automated outbound pings on pipeline errors</span>
            </div>
            
            <button 
              id="toggle-webhook-btn"
              onClick={() => setWebhooksActive(!webhooksActive)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded uppercase transition-all tracking-wider font-mono border cursor-pointer ${
                webhooksActive 
                  ? "bg-[#0b1c15] border-nexus-green/30 text-nexus-green" 
                  : "bg-[#141414] border-gray-800 text-gray-500"
              }`}
            >
              {webhooksActive ? "ACTIVE_STREAMING" : "STANDBY"}
            </button>
          </div>

          {/* Row 3 */}
          <div className="flex items-center justify-between p-3 bg-[#030706] border border-nexus-border rounded">
            <div>
              <span className="text-white block font-bold">PUSH_TELEMETRY</span>
              <span className="text-[10px] text-gray-500 uppercase mt-0.5 block">Receive instant notification alerts in browser</span>
            </div>
            
            <button 
              id="toggle-push-btn"
              onClick={() => setPushActive(!pushActive)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded uppercase transition-all tracking-wider font-mono border cursor-pointer ${
                pushActive 
                  ? "bg-[#0b1c15] border-nexus-green/30 text-nexus-green" 
                  : "bg-[#141414] border-gray-800 text-gray-500"
              }`}
            >
              {pushActive ? "ENABLED" : "DISABLED"}
            </button>
          </div>

          {/* Row 4 */}
          <div className="flex items-center justify-between p-3 bg-[#030706] border border-nexus-border rounded">
            <div>
              <span className="text-white block font-bold">VISUAL_THEME</span>
              <span className="text-[10px] text-gray-500 uppercase mt-0.5 block">Workspace theme lock</span>
            </div>
            <span className="text-[10px] font-bold text-nexus-green uppercase tracking-wide bg-nexus-green-dark border border-nexus-green/20 px-2 py-1 rounded">
              CYBER_GREEN_DARK (LOCKED)
            </span>
          </div>

        </div>
      </div>

      {/* Critical Core Terminate warning segment */}
      <div className="p-5 border border-red-950 bg-[#140808]/40 rounded-lg space-y-4">
        <div>
          <span className="font-mono text-[10px] text-red-500 tracking-widest font-bold block uppercase">
            SAFETY_LIMITS // DANGER_ZONE
          </span>
          <span className="font-mono text-[9px] text-gray-500 block uppercase mt-0.5">
            Destructive tasks that will reset workspace memory matrices.
          </span>
        </div>

        <button 
          id="terminate-system-btn"
          onClick={handleTerminateSession}
          className="bg-red-950 hover:bg-red-900 text-red-400 border border-red-500/20 hover:border-red-500/50 font-mono text-[11px] font-black tracking-widest w-full py-3.5 rounded transition-all cursor-pointer flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>TERMINATE SYSTEM CORE</span>
        </button>
      </div>

    </div>
  );
}
