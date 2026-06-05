import React, { useState, useRef } from "react";
import { FileText, UploadCloud, ChevronRight, CheckCircle2, ShieldAlert, Sparkles, RefreshCw, FileCode, AlertTriangle } from "lucide-react";
import { ParseDocument, DocumentFinding, DocumentCorrelation } from "../types";

export default function AnalysisView() {
  const [inputText, setInputText] = useState("");
  const [pastedName, setPastedName] = useState("operational_logic_spec.txt");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("00:04S");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeDocument, setActiveDocument] = useState<ParseDocument | null>({
    id: "initial-doc",
    name: "quantum_computing_architecture_v2.pdf",
    size: "14.2 MB",
    progress: 100,
    status: "completed",
    findings: [
      {
        id: "kf-1",
        category: "KEY_FINDING",
        title: "Qubit Coherence Time Extended",
        description: "Proposed cooling mechanism increases coherence by 3.4x in controlled environments.",
        loc: "LOC: P14_L2"
      },
      {
        id: "ri-1",
        category: "RISK_IDENTIFIED",
        title: "Material Degradation",
        description: "Superconducting lattice shows fracturing signs after 10,000 thermal cycles.",
        loc: "LOC: P42_T3"
      }
    ],
    correlations: [
      {
        id: "co-1",
        type: "match",
        title: "Cooling parallels found",
        description: "Matches 'Cryogenic_Systems_2023.pdf' with 89% semantic overlap.",
        actionText: "VIEW COMPARISON"
      },
      {
        id: "co-2",
        type: "conflict",
        title: "Conflict detected",
        description: "Current doc states 4K limit vs previous 1.2K stability requirements.",
        actionText: "RESOLVE CONFLICT"
      }
    ]
  });

  const runMockProgress = (documentName: string, docText: string) => {
    setIsLoading(true);
    setProgress(12);
    setEstimatedTime("00:04S");

    // Start loading progression updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          return 98;
        }
        const step = Math.floor(10 + Math.random() * 15);
        const next = prev + step;
        const timeVal = Math.max(1, Math.ceil((100 - next) / 25));
        setEstimatedTime(`00:0${timeVal}S`);
        return next;
      });
    }, 450);

    // Call server API for real analytical parsing!
    fetch("/api/parse-doc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: documentName, fileContent: docText }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("PARSING_FAILED");
        return res.json();
      })
      .then((data) => {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setActiveDocument({
            id: `doc-${Date.now()}`,
            name: documentName,
            size: `${(docText.length / 1024).toFixed(1)} KB`,
            progress: 100,
            status: "completed",
            findings: data.findings || [],
            correlations: data.correlations || []
          });
        }, 300);
      })
      .catch((err) => {
        console.error("Document Ingestion Error:", err);
        clearInterval(interval);
        setIsLoading(false);
        alert("INGESTION_ERROR: System was unable to synthesize the loaded payload. Check Gemini keys.");
      });
  };

  const handleManualInjest = () => {
    if (!inputText.trim()) return;
    runMockProgress(pastedName, inputText);
    setInputText("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      runMockProgress(file.name, text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto pb-24 font-sans bg-[#030706]">
      
      {/* View Title Header */}
      <div className="space-y-1">
        <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight uppercase">
          DOCUMENT <span className="text-nexus-green nexus-glow-text text-nexus-green">ANALYSIS</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Deep structural parsing for technical specifications and research data.
        </p>
      </div>

      {/* Drop zone mimicking screenshot design */}
      <div className="relative p-8 rounded-lg border border-dashed border-nexus-border hover:border-nexus-green/45 bg-[#080f0d]/50 text-center transition-all">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept=".txt,.pdf,.docx,.md,.json,.html" 
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3.5 rounded-full bg-[#0c1c16] border border-nexus-green/10 text-nexus-green">
            <UploadCloud className="w-8 h-8 text-nexus-green" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">DROP FILES TO PARSE</h3>
            <p className="font-mono text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
              PDF | DOCX | TXT | MD [MAX_50MB]
            </p>
          </div>
          <button 
            id="exec-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            className="bg-nexus-green text-nexus-bg font-mono font-black text-xs px-5 py-2.5 rounded tracking-widest uppercase hover:bg-nexus-green-bright transition-all cursor-pointer active:scale-95"
          >
            EXEC_UPLOAD
          </button>
        </div>
      </div>

      {/* Manual document parser text zone */}
      <div className="p-4 bg-[#080f0d] border border-nexus-border rounded-lg space-y-3">
        <span className="font-mono text-[11px] text-[#00ff88]/60 tracking-widest font-bold block uppercase">
          OR: PASTE TECHNICAL CODES / DETAILS
        </span>
        <div className="space-y-2">
          <input 
            id="analysis-pasted-name"
            type="text"
            value={pastedName}
            onChange={(e) => setPastedName(e.target.value)}
            className="w-full bg-[#030706] border border-nexus-border rounded p-2 text-xs font-mono text-white outline-none focus:border-nexus-green/40"
            placeholder="document_specification_v1.txt"
          />
          <textarea 
            id="analysis-pasted-content"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste raw server logs, markdown specifications, or code scripts here to execute structured parser..."
            rows={2}
            className="w-full bg-[#030706] border border-nexus-border rounded p-2.5 text-xs font-mono text-white outline-none resize-none focus:border-nexus-green/40"
          />
        </div>
        <div className="flex justify-end">
          <button 
            id="analysis-injest-btn"
            onClick={handleManualInjest}
            disabled={!inputText.trim() || isLoading}
            className="bg-[#0c1c16] hover:bg-[#00331b] border border-nexus-green/20 hover:border-nexus-green text-nexus-green font-mono text-[11px] font-bold px-4 py-2 rounded transition-all cursor-pointer active:scale-95 disabled:opacity-40"
          >
            PARSE_DRAFT_TEXT
          </button>
        </div>
      </div>

      {/* LOADING Progress bar matched exactly when parsing is triggerred */}
      {isLoading && (
        <div className="p-4 bg-[#080f0d] border border-nexus-green/20 rounded-lg relative overflow-hidden animate-pulse">
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-nexus-green"></div>
          
          <div className="flex items-center justify-between mb-2 pl-2">
            <span className="font-mono text-xs text-white uppercase font-bold flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-nexus-green" />
              <span>Analyzing: {pastedName}</span>
            </span>
            <span className="font-mono text-xs text-nexus-green font-black">{progress}%</span>
          </div>

          <div className="w-full h-2 bg-[#020704] rounded-full overflow-hidden border border-[#142a22]">
            <div className="h-full bg-nexus-green rounded-full shadow-[0_0_8px_rgb(0,255,136)]" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono mt-2 pl-2 text-gray-500">
            <span className="text-nexus-green">EXTRACTING TOPOLOGICAL VECTORS...</span>
            <span>T_REMAINING: {estimatedTime}</span>
          </div>
        </div>
      )}

      {/* Result metrics panels - Insights */}
      {activeDocument && !isLoading && (
        <div className="space-y-6">
          
          {/* Section subtitle headings */}
          <div className="space-y-3">
            <div className="flex items-center space-x-1 font-mono text-xs text-gray-400 font-bold uppercase tracking-wider pl-1">
              <Sparkles className="w-4 h-4 text-nexus-green" />
              <span>INSIGHT_ENGINE_RESULTS</span>
            </div>

            <div className="space-y-3">
              {activeDocument.findings.map((f) => {
                const isKey = f.category === "KEY_FINDING";
                
                return (
                  <div 
                    key={f.id}
                    className="p-4 bg-[#080f0d] border border-nexus-border rounded-lg relative flex flex-col space-y-2 relative"
                  >
                    <div className={`absolute top-0 bottom-0 left-0 w-1 rounded-l ${
                      isKey ? "bg-nexus-green" : "bg-red-400"
                    }`}></div>

                    <div className="flex items-center justify-between pl-2">
                      <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isKey ? "bg-nexus-green-dark text-nexus-green" : "bg-[#2a1414] text-red-400"
                      }`}>
                        {f.category}
                      </span>
                      <span className="font-mono text-[10px] text-gray-500">{f.loc}</span>
                    </div>

                    <h3 className="font-display font-medium text-white pl-2 tracking-tight">{f.title}</h3>
                    <p className="text-xs text-gray-300 pl-2 leading-relaxed">{f.description}</p>
                  </div>
                );
              })}

              {activeDocument.findings.length === 0 && (
                <div className="p-4 border border-dashed border-nexus-border text-center rounded bg-[#080f0d]">
                  <p className="font-mono text-xs text-gray-500">Awaiting payload analysis findings...</p>
                </div>
              )}
            </div>
          </div>

          {/* Cross Document Correlation visual cards matched exactly */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2 font-mono text-xs text-gray-400 font-bold uppercase tracking-wider pl-1">
              <FileText className="w-4 h-4 text-nexus-green" />
              <span>CROSS_DOC_CORRELATION</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDocument.correlations.map((co) => {
                const isMatch = co.type === "match";

                return (
                  <div 
                    key={co.id}
                    className="p-4 bg-[#080f0d] border border-nexus-border rounded-lg flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded-full ${isMatch ? "bg-nexus-green-dark text-nexus-green" : "bg-[#2a1a14] text-amber-500"}`}>
                          {isMatch ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        </div>
                        <h4 className="font-display font-bold text-white text-sm">{co.title}</h4>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed pl-1">{co.description}</p>
                    </div>

                    <button 
                      id={`analysis-action-${co.id}`}
                      className="flex items-center space-x-1 text-[11px] font-mono text-nexus-green hover:text-nexus-green-bright hover:underline tracking-wider uppercase font-bold pl-1 cursor-pointer"
                    >
                      <span>{co.actionText}</span>
                      <ChevronRight className="w-3.5 h-3.5 mt-0.5" />
                    </button>
                  </div>
                );
              })}

              {activeDocument.correlations.length === 0 && (
                <div className="col-span-2 p-4 border border-dashed border-nexus-border text-center rounded bg-[#080f0d]">
                  <p className="font-mono text-xs text-gray-500">No cross-doc metrics compiled.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
