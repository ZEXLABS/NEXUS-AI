import React, { useState } from "react";
import { FlaskConical, Search, Download, ExternalLink, Play, Pause, Plus, X, Server, Shield, Database } from "lucide-react";
import { ResearchTask } from "../types";

export default function ResearchView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Model creation values inside form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCode, setNewCode] = useState("PRJ-102X");
  const [customInsight, setCustomInsight] = useState("");

  const [tasks, setTasks] = useState<ResearchTask[]>([
    {
      id: "task-1",
      code: "TASK::PRJ-892A",
      title: "Quantum Topology Mapping",
      description: "Analyzing multi-dimensional manifold structures using persistent homology to optimize quantum error-correction grids.",
      status: "ACTIVE",
      uptime: "2H_04M",
      progress: 78,
      insights: [
        "Identified anomalous topological feature in Sector 4 quantum storage clusters.",
        "Betti numbers correlate with predicted high-dimensional stability metrics."
      ],
      resources: [
        { name: "dataset_v4.h5", url: "#download-data", type: "download" },
        { name: "manifold_draft.tex", url: "#view-tex", type: "external" }
      ]
    },
    {
      id: "task-2",
      code: "TASK::PRJ-714B",
      title: "Neural Network Substrate Optimization",
      description: "Evaluating energy efficiency of biologically-inspired spiking neural network backplanes mapped onto local FPGA matrices.",
      status: "PAUSED",
      uptime: "48H_12M",
      progress: 89,
      insights: [
        "Spiking frequency throttled past 45GHz to prevent extreme thermal stress leaks.",
        "Weight quantization to 4-bit integer values preserves 98.4% model accuracy boundaries."
      ],
      resources: [
        { name: "substrate_fpga_v1.bin", url: "#download-bin", type: "download" },
        { name: "accuracy_matrix_log.csv", url: "#view-csv", type: "external" }
      ]
    }
  ]);

  const handleToggleStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: t.status === "ACTIVE" ? "PAUSED" : "ACTIVE"
        };
      }
      return t;
    }));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const newTask: ResearchTask = {
      id: `task-${Date.now()}`,
      code: `TASK::${newCode.toUpperCase()}`,
      title: newTitle,
      description: newDesc,
      status: "ACTIVE",
      uptime: "0H_01M",
      progress: 10,
      insights: customInsight 
        ? [customInsight] 
        : ["Telemetry channels configured.", "Awaiting primary network stream ingestion for validation."],
      resources: [
        { name: "operational_manifest.json", url: "#json", type: "download" }
      ]
    };

    setTasks([newTask, ...tasks]);
    setNewTitle("");
    setNewDesc("");
    setNewCode(`PRJ-${Math.floor(100 + Math.random() * 900)}X`);
    setCustomInsight("");
    setIsModalOpen(false);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto pb-28 font-sans bg-[#030706] relative">
      
      {/* Title section */}
      <div className="space-y-1">
        <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight uppercase">
          RESEARCH <span className="text-nexus-green nexus-glow-text text-nexus-green">WORKSPACE</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Track ongoing analysis, synthesize intelligence, and manage linked documentation across active operations.
        </p>
      </div>

      {/* Styled inline search box */}
      <div className="flex items-center space-x-2 bg-[#080f0d] border border-nexus-border rounded-lg p-2 focus-within:border-nexus-green/40 transition-all max-w-md">
        <Search className="w-4 h-4 text-gray-500" />
        <input 
          id="search-research-input"
          type="text"
          placeholder="run search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs border-none focus:outline-none text-white font-mono placeholder-gray-600 pl-1"
        />
      </div>

      {/* ACTIVE OPTIONS panel Widget matched exactly */}
      <div className="p-5 rounded-lg border border-nexus-green/20 bg-[#080f0d] relative overflow-hidden shadow-lg max-w-xl">
        <div className="absolute top-0 right-0 p-3 text-nexus-green/30">
          <Server className="w-12 h-12 stroke-[1]" />
        </div>
        
        <span className="font-mono text-[10px] text-[#00ff88]/60 tracking-widest block font-bold">ACTIVE_OPS</span>
        
        {/* Metric display layout */}
        <div className="flex items-baseline space-x-3 mt-1">
          <span className="font-display text-4xl font-black text-nexus-green nexus-glow-text">12</span>
          <span className="font-mono text-[9px] text-[#00ff88] bg-nexus-green-dark border border-nexus-green/35 px-1.5 py-0.5 rounded uppercase tracking-wider">
            ▲ DELTA +3 [7D_WINDOW]
          </span>
        </div>

        {/* Computations status lines */}
        <div className="space-y-3 mt-4 pt-4 border-t border-[#142a22]">
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-gray-400">GLOBAL_COMPUTE</span>
              <span className="text-nexus-green font-bold">78%</span>
            </div>
            <div className="w-full h-1.5 bg-[#000d07] rounded-full overflow-hidden border border-[#0d1c16]">
              <div className="h-full bg-nexus-green rounded-full shadow-[0_0_8px_rgb(0,255,136)]" style={{ width: "78%" }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-gray-400">SYNTHESIS_SYNC</span>
              <span className="text-nexus-green font-bold">42%</span>
            </div>
            <div className="w-full h-1.5 bg-[#000d07] rounded-full overflow-hidden border border-[#0d1c16]">
              <div className="h-full bg-nexus-green rounded-full shadow-[0_0_8px_rgb(0,255,136)]" style={{ width: "42%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Tasks list */}
      <div className="space-y-4">
        {filteredTasks.map((t) => {
          const isActive = t.status === "ACTIVE";

          return (
            <div 
              key={t.id}
              className={`p-5 rounded-lg border bg-[#080f0d] shadow-lg relative ${
                isActive ? "border-nexus-green/30" : "border-nexus-border"
              }`}
            >
              
              <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                isActive ? "bg-nexus-green" : "bg-gray-700"
              }`}></div>

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-1 pl-2">
                  <div className="font-mono text-[10px] text-gray-500 font-bold">{t.code}</div>
                  <h3 className="font-display font-bold text-lg text-white">{t.title}</h3>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed max-w-2xl">{t.description}</p>
                </div>

                {/* State controllers matching layout */}
                <div className="flex items-center space-x-3 self-start font-mono text-[10px]">
                  <div className={`px-2 py-1 rounded border text-[9px] font-bold ${
                    isActive 
                      ? "bg-nexus-green-dark border-nexus-green/40 text-nexus-green animate-pulse" 
                      : "bg-[#141414] border-gray-800 text-gray-500"
                  }`}>
                    PROC_STATE: {t.status}
                  </div>
                  <div className="text-gray-500 font-medium">
                    UP_TIME: {t.uptime}
                  </div>
                  <button
                    id={`toggle-status-${t.id}`}
                    onClick={() => handleToggleStatus(t.id)}
                    className="p-1.5 rounded border border-nexus-border bg-[#030706] hover:border-nexus-green hover:text-nexus-green transition-all"
                    title={isActive ? "Pause task execution" : "Resume task execution"}
                  >
                    {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Training progress specifically on PRJ-714B shown in screenshot */}
              {t.progress && (
                <div className="mt-4 p-3.5 bg-[#000d07] rounded border border-nexus-green/5 pl-4">
                  <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                    <span className="text-[#00ff88]/60 tracking-wider font-bold">TRAINING_VECTOR_COMPLETION</span>
                    <span className="text-nexus-green font-bold">{t.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#010905] rounded-full overflow-hidden border border-[#0d1c16]">
                    <div className="h-full bg-nexus-green rounded-[1px] shadow-sm" style={{ width: `${t.progress}%` }}></div>
                  </div>
                </div>
              )}

              {/* Telemetry insights bullet reports */}
              <div className="mt-4 pt-4 border-t border-nexus-border/30 pl-2 space-y-2">
                <span className="font-mono text-[10px] text-gray-500 tracking-wider font-bold block uppercase flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5 text-nexus-green/70" />
                  <span>TELEMETRY_INSIGHTS</span>
                </span>
                <ul className="space-y-1.5">
                  {t.insights.map((ins, index) => (
                    <li key={index} className="text-xs text-gray-300 flex items-start space-x-1.5">
                      <span className="text-nexus-green font-bold mt-0.5">•</span>
                      <span>{ins}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Attachment Resource Links matching design */}
              <div className="mt-4 pt-4 border-t border-nexus-border/20 pl-2 space-y-2">
                <span className="font-mono text-[10px] text-gray-500 tracking-wider block font-bold uppercase">
                  RESOURCE_LINKS
                </span>
                <div className="flex flex-wrap gap-2">
                  {t.resources.map((resItem, idx) => (
                    <a
                      key={idx}
                      href={resItem.url}
                      className="flex items-center space-x-2 bg-[#0c1c16] hover:bg-nexus-green-[#00331b] border border-[#142a22] hover:border-nexus-green/40 px-3 py-1.5 rounded font-mono text-[11px] text-nexus-green transition-all uppercase"
                    >
                      {resItem.type === "download" ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                      <span>{resItem.name}</span>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Floating Add trigger "+" and trigger absolute layout modal */}
      <button
        id="add-research-btn"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-6 bg-nexus-green text-nexus-bg p-4 rounded-full shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:bg-nexus-green-bright transition-all active:scale-90 z-20 cursor-pointer flex items-center justify-center font-bold"
        title="Deploy New Research Module"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Custom absolute dialogue modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#030706]/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#080f0d] border border-nexus-green/40 rounded-lg shadow-[0_0_30px_rgba(0,255,136,0.15)] flex flex-col p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-nexus-border pb-3">
              <div className="flex items-center space-x-2 text-nexus-green">
                <Plus className="w-5 h-5" />
                <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider">DEPLOY_NEW_TASK</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">PROJECT_METRIC_CODE</label>
                <input 
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="PRJ-102X"
                  className="w-full bg-[#030706] border border-nexus-border rounded p-2 text-white focus:border-nexus-green/60 outline-none uppercase font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">PROJECT_TITLE</label>
                <input 
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Spanner Cluster Ingestion"
                  className="w-full bg-[#030706] border border-nexus-border rounded p-2 text-white font-sans focus:border-nexus-green/60 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">OPERATIONAL_DESCRIPTION</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summarize the core hypothesis and computing systems parameters..."
                  rows={2}
                  className="w-full bg-[#030706] border border-nexus-border rounded p-2 text-white font-sans focus:border-nexus-green/60 outline-none resize-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-bold block text-[#00ff88]/60">TELEMETRY_INSIGHT_INIT (OPTIONAL)</label>
                <input 
                  type="text"
                  value={customInsight}
                  onChange={(e) => setCustomInsight(e.target.value)}
                  placeholder="e.g. Memory allocation stable under standard 12.4M loads."
                  className="w-full bg-[#030706] border border-nexus-border rounded p-2 text-white font-sans focus:border-nexus-green/60 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#0c100e] border border-nexus-border hover:border-nexus-green/40 px-4 py-2 rounded text-gray-400 hover:text-white cursor-pointer transitioning tracking-wider uppercase font-bold"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="bg-nexus-green text-nexus-bg hover:bg-nexus-green-bright px-5 py-2 rounded font-black tracking-widest uppercase cursor-pointer"
                >
                  CONSTRUCT
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
