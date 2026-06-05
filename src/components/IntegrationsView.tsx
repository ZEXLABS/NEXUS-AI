import React, { useState } from "react";
import { Link2, Bot, Database, Check, Sliders, RefreshCw, Layers } from "lucide-react";

export default function IntegrationsView() {
  const [integrations, setIntegrations] = useState([
    { id: "github", name: "GitHub Repository Auth", desc: "Allows Nexus to pull code catalogs, triggers, and review branches directly.", connected: true, group: "CODE" },
    { id: "slack", name: "Slack Operational Sync", desc: "Transmits system alert thresholds and pipeline status vectors instantly.", connected: true, group: "CHAT" },
    { id: "notion", name: "Notion Knowledge base", desc: "Imports meeting summaries, documents, and spec sheets to parse.", connected: false, group: "DOCS" },
    { id: "jira", name: "Jira Task Orchestration", desc: "Maps code failure notifications to automated, detailed sub-tickets.", connected: false, group: "MANAGEMENT" },
  ]);

  const handleToggle = (id: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id === id) {
        return { ...int, connected: !int.connected };
      }
      return int;
    }));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto pb-24 font-sans bg-[#030706]">
      
      {/* View Title */}
      <div className="space-y-1">
        <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight uppercase">
          INTEGRATIONS <span className="text-nexus-green nexus-glow-text text-nexus-green">WORKSPACE</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Link external developer streams directly to Nexus AI system modules to drive workflow automations.
        </p>
      </div>

      {/* Grid of integrations cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((int) => (
          <div 
            key={int.id}
            className={`p-5 rounded-lg border bg-[#080f0d] flex flex-col justify-between space-y-4 relative shadow ${
              int.connected ? "border-nexus-green/30" : "border-nexus-border"
            }`}
          >
            {/* Tag group indicator */}
            <div className="absolute top-4 right-4 font-mono text-[8px] border border-nexus-border px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase">
              {int.group}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded ${int.connected ? "bg-nexus-green-dark text-nexus-green" : "bg-[#141414] text-gray-450"}`}>
                  <Link2 className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-white text-base">{int.name}</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{int.desc}</p>
            </div>

            <div className="flex items-center justify-between border-t border-[#142a22] pt-3.5 mt-2">
              <span className="font-mono text-[10px] text-gray-500 uppercase">
                STATUS: {int.connected ? "LINK_ACTIVE" : "STANDBY"}
              </span>

              {/* Action toggler */}
              <button
                id={`toggle-int-${int.id}`}
                onClick={() => handleToggle(int.id)}
                className={`font-mono text-[11px] font-bold tracking-widest px-4 py-1.5 rounded transition-all active:scale-95 cursor-pointer uppercase ${
                  int.connected 
                    ? "bg-[#1a1414] text-red-400 border border-red-500/10 hover:border-red-500/40" 
                    : "bg-nexus-green text-nexus-bg hover:bg-nexus-green-bright"
                }`}
              >
                {int.connected ? "DISCONNECT_PIPE" : "ESTABLISH_LINK"}
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
