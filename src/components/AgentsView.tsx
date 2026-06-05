import React, { useState } from "react";
import { Search, Bot, Check, Star, Settings, ShieldAlert, Radio } from "lucide-react";
import { Agent } from "../types";

interface AgentsViewProps {
  onAgentDeployChange: (action: "increase" | "decrease") => void;
}

export default function AgentsView({ onAgentDeployChange }: AgentsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  
  // Local active state of currently deployed agents to make UI perfectly interactive
  const [deployedStates, setDeployedStates] = useState<Record<string, boolean>>({
    "agent-coder": true, // Start with Nexus Coder v4 pre-deployed
  });

  const agents: Agent[] = [
    {
      id: "agent-coder",
      name: "Nexus Coder v4",
      description: "Advanced development assistant capable of writing, refactoring, and debugging full-stack applications. Integrated with major repositories.",
      category: "DEVELOPMENT",
      status: "ACTIVE",
      deploys: "12.4K",
      tags: ["PYTHON", "REACT", "SYS_DESIGN"],
      isTrending: true,
    },
    {
      id: "agent-marketing",
      name: "Campaign Architect",
      description: "Generates multi-channel marketing campaigns, copies, and target visual prompt guides automatically.",
      category: "MARKETING",
      status: "ACTIVE",
      deploys: "8.1K",
      tags: ["SEO", "COPY", "VEO_PROMPTS"],
    },
    {
      id: "agent-automation",
      name: "Workflow Orchestrator",
      description: "Connects APIs and manages complex logical conditions between server microservices.",
      category: "AUTOMATION",
      status: "ACTIVE",
      deploys: "14.2K",
      tags: ["WEBHOOKS", "TRIGGERS", "CRON_FLOWS"],
    },
    {
      id: "agent-security",
      name: "Net Sentinel",
      description: "Continuous vulnerability mapping and automated malicious injection threat defense.",
      category: "SECURITY",
      status: "ACTIVE",
      deploys: "9.9K",
      tags: ["CYBER_AUDIT", "FIREWALL", "INTEGRITY"],
    },
    {
      id: "agent-synthesizer",
      name: "Data Synthesizer",
      description: "Aggregates and analyzes unstructured data lakes autonomously. Currently standardizing operational schemas.",
      category: "AI_SYS",
      status: "IN_DEVELOPMENT",
      deploys: "0",
      tags: ["SPANNER", "BIGQUERY", "GRAPH_SCHEMA"],
    },
  ];

  const handleToggleDeploy = (agentId: string) => {
    const isCurrentlyDeployed = deployedStates[agentId];
    setDeployedStates((prev) => ({
      ...prev,
      [agentId]: !isCurrentlyDeployed,
    }));
    
    // Notify main app to update server statistics counts!
    onAgentDeployChange(isCurrentlyDeployed ? "decrease" : "increase");
  };

  const categories = ["ALL", "DEVELOPMENT", "MARKETING", "AUTOMATION", "SECURITY", "AI_SYS"];

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedCategory === "ALL") return matchesSearch;
    return matchesSearch && agent.category === selectedCategory;
  });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto pb-24 font-sans bg-[#030706]">
      
      {/* Title block matching screenshot */}
      <div className="space-y-1">
        <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight uppercase">
          AGENT <span className="text-nexus-green nexus-glow-text text-nexus-green">MARKETPLACE</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Discover, deploy, and manage specialized AI agents for your workflow.
        </p>
      </div>

      {/* Structured Search input / button */}
      <div className="flex items-center space-x-2 bg-[#080f0d] border border-nexus-border rounded-lg p-1.5 focus-within:border-nexus-green/50 transition-all">
        <Search className="w-5 h-5 text-gray-500 ml-2" />
        <input 
          id="search-agents-input"
          type="text" 
          placeholder="SEARCH_CAPABILITIES..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none text-sm focus:outline-none text-white font-mono placeholder-gray-600 pl-1 py-1"
        />
        <button 
          id="search-agents-btn"
          className="bg-nexus-green text-nexus-bg font-mono font-bold px-4 py-1.5 rounded text-xs tracking-wider uppercase cursor-pointer hover:bg-nexus-green-bright transition-all"
        >
          SEARCH
        </button>
      </div>

      {/* Category Pills Flex list */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar select-none text-[11px] font-mono">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded border transition-all whitespace-nowrap uppercase cursor-pointer ${
              selectedCategory === cat 
                ? "bg-nexus-green text-nexus-bg border-nexus-green font-bold tracking-wider" 
                : "bg-[#080f0d] border-nexus-border text-gray-400 hover:text-white"
            }`}
          >
            {cat === "ALL" ? "ALL_AGENTS" : cat}
          </button>
        ))}
      </div>

      {/* Agents Inventory List */}
      <div className="space-y-4">
        {filteredAgents.map((agent) => {
          const isDeployed = deployedStates[agent.id];
          const isDev = agent.status === "IN_DEVELOPMENT";

          return (
            <div 
              key={agent.id}
              className={`p-5 rounded-lg border bg-[#080f0d] relative shadow-lg overflow-hidden transition-all duration-300 ${
                isDeployed 
                  ? "border-nexus-green/30 shadow-[0_0_12px_rgba(0,255,136,0.06)]" 
                  : "border-nexus-border hover:border-nexus-border-bright"
              }`}
            >
              
              {/* Highlight bar inside card */}
              <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                isDeployed ? "bg-nexus-green" : "bg-gray-800"
              }`}></div>

              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3.5 pl-2">
                  <div className="p-2 rounded bg-[#0c1c16] border border-nexus-green/10 text-nexus-green mt-1">
                    <Bot className="w-5 h-5 text-nexus-green" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display font-bold text-lg text-white">{agent.name}</h3>
                      {agent.isTrending && (
                        <span className="bg-[#142a22] text-nexus-green border border-nexus-green/25 font-mono font-bold text-[9px] tracking-wider px-2 py-0.5 rounded uppercase flex items-center space-x-1 animate-pulse">
                          <Radio className="w-2.5 h-2.5 animate-spin" />
                          <span>● TRENDING_ACTIVE</span>
                        </span>
                      )}
                      {isDev && (
                        <span className="bg-[#1a1414] text-red-400 border border-red-500/20 font-mono font-bold text-[9px] tracking-wider px-2 py-0.5 rounded uppercase">
                          IN_DEVELOPMENT
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed max-w-2xl">{agent.description}</p>
                  </div>
                </div>

                <div className="hidden md:block font-mono text-[10px] text-gray-500 text-right">
                  <span className="block text-gray-400 font-bold uppercase">{agent.category}</span>
                  <span className="block mt-1">Deploys: {agent.deploys}</span>
                </div>
              </div>

              {/* Tags panel */}
              <div className="mt-4 pt-4 border-t border-nexus-border/30 pl-2 flex flex-wrap gap-1.5">
                {agent.tags.map(t => (
                  <span key={t} className="bg-[#0c1c16] border border-nexus-green/10 text-nexus-green/80 text-[10px] font-mono px-2 py-0.5 rounded tracking-wide">
                    {t}
                  </span>
                ))}
              </div>

              {/* Action deployed layout buttons */}
              <div className="mt-4 flex items-center justify-between pl-2">
                <div className="flex items-center space-x-2 font-mono text-[11px] text-gray-500">
                  <span>↓ {agent.deploys}_DEPLOYS</span>
                </div>

                {isDev ? (
                  <button 
                    id={`notify-btn-${agent.id}`}
                    className="bg-[#0c100e] border border-nexus-border hover:border-nexus-green/40 text-gray-400 hover:text-white font-mono font-bold text-[11px] px-5 py-2 rounded tracking-widest uppercase transition-all duration-200 cursor-pointer"
                  >
                    NOTIFY_ME
                  </button>
                ) : (
                  <button
                    id={`deploy-btn-${agent.id}`}
                    onClick={() => handleToggleDeploy(agent.id)}
                    className={`font-mono font-black text-xs px-5 py-2 rounded tracking-widest uppercase leading-none transition-all duration-200 active:scale-95 cursor-pointer flex items-center space-x-1.5 ${
                      isDeployed 
                        ? "bg-nexus-green text-nexus-bg hover:bg-nexus-green-bright shadow-[0_0_10px_rgba(0,255,136,0.3)]" 
                        : "bg-[#0d1613] text-[#00ff88] border border-nexus-border hover:border-nexus-green/40"
                    }`}
                  >
                    {isDeployed && <Check className="w-3.5 h-3.5" />}
                    <span>{isDeployed ? "DEPLOYED_ACTIVE" : "DEPLOY_AGENT"}</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}

        {filteredAgents.length === 0 && (
          <div className="text-center py-12 border border-dashed border-nexus-border rounded-lg bg-[#050907]/50">
            <Bot className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">No matching agents found</p>
          </div>
        )}
      </div>

    </div>
  );
}
