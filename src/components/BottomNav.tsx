import React from "react";
import { MessageSquare, Bot, FlaskConical, FileText, ToggleLeft, Users, LineChart, Link2 } from "lucide-react";

interface BottomNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const tabs = [
    { id: "chat", label: "CHAT", icon: MessageSquare },
    { id: "agents", label: "AGENTS", icon: Bot },
    { id: "research", label: "RESEARCH", icon: FlaskConical },
    { id: "analysis", label: "ANALYSIS", icon: FileText },
    { id: "build", label: "BUILD", icon: ToggleLeft },
    { id: "analytics", label: "ANALYTICS", icon: LineChart },
    { id: "collab", label: "COLLAB", icon: Users },
    { id: "integrations", label: "INTEGRATION", icon: Link2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-nexus-border bg-[#030706]/95 backdrop-blur-md z-40 px-2 py-1.5 flex items-center justify-around select-none">
      <div className="w-full max-w-lg mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = currentView === tab.id;

          return (
            <button
              id={`btn-nav-${tab.id}`}
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded transition-all cursor-pointer relative group ${
                isActive 
                  ? "text-nexus-green bg-[#00ff88]/5 border border-[#00ff88]/20" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <IconComponent className={`w-4 h-4 mb-1 transition-transform ${
                isActive ? "scale-110 text-nexus-green nexus-glow-text" : "group-hover:scale-105"
              }`} />
              
              <span className="font-mono text-[9px] tracking-wider font-semibold">
                {tab.label}
              </span>

              {/* Status active pip */}
              {isActive && (
                <span className="absolute -top-1 w-1 h-1 rounded-full bg-nexus-green shadow-[0_0_8px_rgb(0,255,136)]"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
