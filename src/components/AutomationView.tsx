import React, { useState } from "react";
import { Plus, Play, ToggleLeft, ArrowRight, CornerDownRight, Bell, ChevronRight, CheckCircle2, RotateCcw, Sliders, AlertTriangle, PlayCircle } from "lucide-react";
import { AutomationFlow, AutomationNode } from "../types";

export default function AutomationView() {
  const [activeDraftId, setActiveDraftId] = useState("draft-1");
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Form states to add dynamic nodes to the Canvas!
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [newNodeType, setNewNodeType] = useState<"ACTION" | "CONDITION" | "TRUE_BRANCH">("ACTION");
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeDetail, setNewNodeDetail] = useState("");

  const [flows, setFlows] = useState<AutomationFlow[]>([
    {
      id: "draft-1",
      name: "Data Ingestion Pipeline",
      status: "DRAFT_V1",
      nodes: [
        { id: "n1", type: "TRIGGER", name: "Incoming Webhook", detail: "POST /api/v1/ingest/logs" },
        { id: "n2", type: "ACTION", name: "Parse JSON Payload", detail: "EXTRACT_KEY: event_type" },
        { id: "n3", type: "CONDITION", name: "event_type == 'error'", detail: "IF_TRUE: ALERT_ENGINEERING" },
        { id: "n4", type: "TRUE_BRANCH", name: "Alert Engineering", detail: "PUSH_ALERT" }
      ]
    },
    {
      id: "draft-2",
      name: "Slack Alerting Rule",
      status: "PAUSED",
      nodes: [
        { id: "e1", type: "TRIGGER", name: "Model Performance Failure", detail: "METRIC < 90%" },
        { id: "e2", type: "TRUE_BRANCH", name: "Notify Slack Channel", detail: "#net-operations" }
      ]
    }
  ]);

  const activeFlow = flows.find(f => f.id === activeDraftId) || flows[0];

  const handleTestRun = () => {
    setIsRunning(true);
    setExecutionLogs(["INITIALIZING_FLOW_CYCLES // Connecting channels..."]);
    
    fetch("/api/trigger-flow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flowName: activeFlow.name, nodes: activeFlow.nodes }),
    })
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          setIsRunning(false);
          setExecutionLogs(data.logs || []);
        }, 1200);
      })
      .catch(err => {
        setIsRunning(false);
        setExecutionLogs(["SYS_ERROR // PIPELINE_EXECUTION_FAILED // Core dropped packet connection."]);
      });
  };

  const handleAddNewFlow = () => {
    const freshFlow: AutomationFlow = {
      id: `flow-${Date.now()}`,
      name: `Custom Flow Config #${flows.length + 1}`,
      status: "DRAFT_V1",
      nodes: [
        { id: "t1", type: "TRIGGER", name: "Inbound Slack Trigger", detail: "CHANNEL_MENTION" }
      ]
    };
    setFlows([...flows, freshFlow]);
    setActiveDraftId(freshFlow.id);
  };

  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName || !newNodeDetail) return;

    const created: AutomationNode = {
      id: `node-${Date.now()}`,
      type: newNodeType,
      name: newNodeName,
      detail: newNodeDetail
    };

    setFlows(prev => prev.map(f => {
      if (f.id === activeDraftId) {
        return {
          ...f,
          nodes: [...f.nodes, created]
        };
      }
      return f;
    }));

    setNewNodeName("");
    setNewNodeDetail("");
    setShowAddNodeModal(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto pb-24 font-sans bg-[#030706]">
      
      {/* Header section matched */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight uppercase">
            AUTOMATION <span className="text-nexus-green nexus-glow-text text-nexus-green">BUILDER</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
            Design powerful workflows visually. Connect triggers to actions and let Nexus handle the logic.
          </p>
        </div>

        <button 
          id="visual-new-flow-btn"
          onClick={handleAddNewFlow}
          className="bg-nexus-green text-nexus-bg font-mono font-black text-xs px-5 py-3 rounded tracking-widest uppercase hover:bg-nexus-green-bright transition-all cursor-pointer active:scale-95 self-start md:self-center"
        >
          + NEW_FLOW
        </button>
      </div>

      {/* Main visual pipeline canvas card */}
      <div className="p-6 bg-[#080f0d] border border-nexus-border rounded-lg space-y-5 relative shadow-xl">
        <div className="flex items-center justify-between border-b border-[#142a22] pb-3">
          <h3 className="font-display font-bold text-lg text-white">{activeFlow.name}</h3>
          
          <div className="flex items-center space-x-2 font-mono text-[10px]">
            <span className="bg-nexus-green-dark text-nexus-green px-2 py-0.5 rounded font-bold uppercase border border-nexus-green/30">
              {activeFlow.status}
            </span>
            <button className="p-1 rounded bg-[#030706] border border-nexus-border text-gray-500 hover:text-white transition-all cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Vertical list of linked visual nodes with pipeline connections */}
        <div className="space-y-4 pl-3 relative">
          
          {/* Vertical layout line */}
          <div className="absolute top-2 bottom-2 left-6.5 w-0.5 bg-[#142a22]"></div>

          {activeFlow.nodes.map((node, index) => {
            return (
              <div key={node.id} className="flex items-start space-x-4 relative z-10">
                
                {/* Node icon with specific category borders */}
                <div className={`p-2.5 rounded-full border shadow-md flex items-center justify-center bg-[#030706] ${
                  node.type === "TRIGGER" ? "border-nexus-green/60 text-nexus-green" : 
                  node.type === "CONDITION" ? "border-[#00ff88]/30 text-nexus-green/80" : 
                  "border-nexus-border text-gray-400"
                }`}>
                  {node.type === "TRUE_BRANCH" ? <Bell className="w-4 h-4" /> : <Sliders className="w-4 h-4" />}
                </div>

                <div className="bg-[#030706] border border-nexus-border rounded px-4 py-2 flex-grow max-w-md">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] text-[#00ff88]/60 tracking-widest font-bold block uppercase">{node.type}</span>
                    <span className="font-mono text-[8px] text-gray-600 block">STEP_0{index + 1}</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white mt-0.5">{node.name}</h4>
                  <p className="font-mono text-[10px] text-gray-400 bg-[#060c0a] px-2 py-1.5 rounded mt-1.5 border border-nexus-green/5">
                    {node.detail}
                  </p>
                </div>

              </div>
            );
          })}

          {/* Interactive "+" to append step dynamically */}
          <div className="flex items-center pl-2">
            <button
              id="append-node-btn"
              onClick={() => setShowAddNodeModal(true)}
              className="p-1.5 rounded bg-[#030706] border border-dashed border-nexus-border hover:border-nexus-green text-gray-500 hover:text-nexus-green transition-all cursor-pointer relative z-10 ml-2"
              title="Add step to pipeline"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Live operational controls underneath canvas */}
        <div className="pt-4 border-t border-[#142a22] flex flex-wrap items-center justify-between gap-3">
          <button 
            id="test-run-pipeline-btn"
            onClick={handleTestRun}
            disabled={isRunning}
            className="bg-[#0c1c16] hover:bg-[#00331b] border border-nexus-green/20 hover:border-nexus-green text-nexus-green font-mono text-[11px] font-bold px-4 py-2.5 rounded transition-all cursor-pointer active:scale-95 flex items-center space-x-1.5 disabled:opacity-50"
          >
            <PlayCircle className="w-4 h-4" />
            <span>{isRunning ? "TRANSMITTING..." : "TEST RUN PIPELINE"}</span>
          </button>
        </div>

        {/* Interactive mini execution logs drawer */}
        {executionLogs.length > 0 && (
          <div className="mt-4 p-4 bg-[#010604] border border-nexus-green/10 rounded font-mono text-[10px] space-y-1 text-nexus-green/80 overflow-y-auto max-h-32 shadow-inner">
            {executionLogs.map((log, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-gray-600">[{index + 1}]</span>
                <span className={`${index === 0 ? "text-[#00ff88]/90 font-bold" : ""}`}>{log}</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* SYSTEMS ONLINE status blocks checklist matched exactly */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Systems checklist card */}
        <div className="p-5 bg-[#080f0d] border border-nexus-border rounded-lg space-y-4">
          <span className="font-mono text-[10px] text-[#00ff88]/60 tracking-widest font-bold block uppercase pl-1">
            SYSTEMS_ONLINE
          </span>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-[#030706] border border-nexus-border rounded">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-nexus-green shadow-[0_0_8px_rgb(0,255,136)]"></span>
                <span className="font-display text-sm font-bold text-white">Nightly Model Sync</span>
              </div>
              <span className="font-mono text-[9px] text-gray-500 uppercase">TS: 2H_AGO</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#030706] border border-nexus-border rounded">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-nexus-green shadow-[0_0_8px_rgb(0,255,136)]"></span>
                <span className="font-display text-sm font-bold text-white">User Onboarding Email</span>
              </div>
              <span className="font-mono text-[9px] text-gray-500 uppercase">TS: 5M_AGO</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#030706] border border-nexus-border rounded opacity-50">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
                <span className="font-display text-sm font-bold text-white">Stale Data Purge</span>
              </div>
              <span className="font-mono text-[9px] text-gray-500 uppercase">STATE: PAUSED</span>
            </div>
          </div>
        </div>

        {/* LOCAL DRAFTS selector checklist card matched exactly */}
        <div className="p-5 bg-[#080f0d] border border-nexus-border rounded-lg space-y-4">
          <span className="font-mono text-[10px] text-[#00ff88]/60 tracking-widest font-bold block uppercase pl-1">
            LOCAL_DRAFTS
          </span>

          <div className="space-y-3">
            {flows.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveDraftId(f.id)}
                className={`w-full text-left p-4 rounded border transition-all flex items-center justify-between flex-wrap gap-2 hover:bg-[#0c1c16]/30 cursor-pointer ${
                  activeDraftId === f.id 
                    ? "bg-[#0c1c16]/20 border-nexus-green/30" 
                    : "bg-[#030706] border-nexus-border"
                }`}
              >
                <div className="space-y-0.5">
                  <h4 className={`font-display font-bold text-sm ${activeDraftId === f.id ? "text-nexus-green" : "text-white"}`}>{f.name}</h4>
                  <span className="font-mono text-[9px] text-gray-500 block uppercase">
                    MOD: {f.status === "PAUSED" ? "PAUSED_ACTIVE" : "EDITING_NOW"}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-gray-500 uppercase">
                  {f.status === "PAUSED" ? "UPDATED: YESTERDAY" : "ACTIVE_DRAFT"}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Visual Add node Modal overlay */}
      {showAddNodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#030706]/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#080f0d] border border-nexus-border rounded-lg p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">APPEND_NODE_OPERATIONS</h3>
            
            <form onSubmit={handleCreateNode} className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">STEP_CATEGORY</label>
                <div className="flex space-x-2">
                  {["ACTION", "CONDITION", "TRUE_BRANCH"].map(typeOpt => (
                    <button
                      key={typeOpt}
                      type="button"
                      onClick={() => setNewNodeType(typeOpt as any)}
                      className={`flex-1 py-1.5 rounded border text-[10px] uppercase font-bold tracking-wider cursor-pointer ${
                        newNodeType === typeOpt 
                          ? "bg-nexus-green text-nexus-bg border-nexus-green" 
                          : "bg-[#030706] border-nexus-border text-gray-400"
                      }`}
                    >
                      {typeOpt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">NODE_NAME</label>
                <input 
                  type="text"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  placeholder="e.g. Filter Raw Payload"
                  className="w-full bg-[#030706] border border-nexus-border rounded p-2 text-white outline-none focus:border-nexus-green/40 font-sans"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">NODE_DETAIL_ARGUMENTS</label>
                <input 
                  type="text"
                  value={newNodeDetail}
                  onChange={(e) => setNewNodeDetail(e.target.value)}
                  placeholder="e.g. payload.headers.content_type"
                  className="w-full bg-[#030706] border border-nexus-border rounded p-2 text-white outline-none focus:border-nexus-green/40"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowAddNodeModal(false)}
                  className="bg-[#0c100e] border border-nexus-border px-4 py-2 rounded text-gray-400 hover:text-white cursor-pointer"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="bg-nexus-green text-nexus-bg font-black tracking-widest uppercase px-5 py-2 rounded cursor-pointer"
                >
                  APPEND
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
