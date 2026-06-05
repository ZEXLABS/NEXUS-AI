import React, { useState, useEffect } from "react";
import { LineChart, Calendar, Download, Cpu, Clock, LayoutGrid, Server, Check } from "lucide-react";
import { TokenMetric } from "../types";

export default function AnalyticsView() {
  const [tokensMetric, setTokensMetric] = useState("12.42M");
  const [responseTime, setResponseTime] = useState("240ms");
  const [activeAgents, setActiveAgents] = useState("08");
  const [range, setRange] = useState("30D");
  const [isExported, setIsExported] = useState(false);
  const [chartData, setChartData] = useState<TokenMetric[]>([
    { day: "MON", input: 80000, output: 120000 },
    { day: "TUE", input: 140000, output: 190000 },
    { day: "WED", input: 110000, output: 250000 },
    { day: "THU", input: 180000, output: 310000 },
    { day: "FRI", input: 220000, output: 260000 },
    { day: "SAT", input: 160000, output: 350000 },
    { day: "SUN", input: 240000, output: 410000 },
  ]);

  // Hook up real dynamic server polling telemetry!
  useEffect(() => {
    const fetchStats = () => {
      fetch("/api/stats")
        .then((res) => {
          if (!res.ok) throw new Error("STATS_FETCH_FAILED");
          return res.json();
        })
        .then((data) => {
          setTokensMetric(data.total_tokens_used);
          setResponseTime(data.avg_response_time);
          setActiveAgents(data.active_agents);
          setChartData(data.analyticsUsage || chartData);
        })
        .catch((err) => console.log("Silent stats pull error (using responsive state):", err));
    };

    fetchStats();
    const interval = setInterval(fetchStats, 4000); // Poll every 4 seconds to keep it live!
    return () => clearInterval(interval);
  }, []);

  const handleExportCSV = () => {
    setIsExported(true);
    setTimeout(() => setIsExported(false), 2000);
  };

  // Compute maximum chart coordinates to map SVG dimensions perfectly
  const maxVal = 500000;
  const mapY = (val: number) => 180 - (val / maxVal) * 150;
  const mapX = (index: number) => 40 + index * 85;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto pb-24 font-sans bg-[#030706]">
      
      {/* Title section with custom fonts & italics */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-widest uppercase">
            SYSTEM <span className="text-nexus-green italic font-black text-nexus-green animate-pulse">ANALYTICS</span>
          </h1>
          <p className="font-mono text-[9px] text-[#00ff88]/60 tracking-wider font-semibold mt-1 uppercase">
            REAL-TIME PERFORMANCE // TOKEN_CONSUMPTION_METRICS
          </p>
        </div>

        {/* Top Control Filters matching visual sketches */}
        <div className="flex items-center space-x-2 text-xs font-mono self-start sm:self-center select-none">
          <div className="flex items-center space-x-2 border border-nexus-border bg-[#080f0d] px-3 py-2 rounded">
            <Calendar className="w-3.5 h-3.5 text-nexus-green" />
            <select 
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-white uppercase text-[10px] cursor-pointer"
            >
              <option value="30D">RANGE: 30D</option>
              <option value="7D">RANGE: 7D</option>
              <option value="24H">RANGE: 24H</option>
            </select>
          </div>

          <button 
            id="export-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 bg-nexus-green text-nexus-bg hover:bg-nexus-green-bright px-3.5 py-2.5 rounded font-black tracking-widest text-[10px] transition-all cursor-pointer shadow-md uppercase active:scale-95"
          >
            {isExported ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isExported ? "DOWNLOADED" : "EXPORT_CSV"}</span>
          </button>
        </div>
      </div>

      {/* Numerical Telemetry visual metrics grid matched exactly */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric Card 1 */}
        <div className="p-5 bg-[#080f0d] border border-nexus-border rounded-lg relative overflow-hidden shadow-lg">
          <div className="absolute top-4 right-4 text-nexus-green/30">
            <LayoutGrid className="w-6 h-6 stroke-[1.5]" />
          </div>
          <span className="font-mono text-[9px] text-gray-500 tracking-wider font-bold block">TOTAL_TOKENS_USED</span>
          <div className="font-display text-3xl font-black text-white mt-1.5 tracking-tight nexus-glow-text">
            {tokensMetric}
          </div>
          <span className="font-mono text-[9px] text-nexus-green block mt-2">
            ▲ +14.2%_PREV_CYCLE
          </span>
        </div>

        {/* Metric Card 2 */}
        <div className="p-5 bg-[#080f0d] border border-nexus-border rounded-lg relative overflow-hidden shadow-lg">
          <div className="absolute top-4 right-4 text-nexus-green/30">
            <Clock className="w-6 h-6 stroke-[1.5]" />
          </div>
          <span className="font-mono text-[9px] text-gray-500 tracking-wider font-bold block">AVG_RESPONSE_TIME</span>
          <div className="font-display text-3xl font-black text-white mt-1.5 tracking-tight nexus-glow-text">
            {responseTime}
          </div>
          <span className="font-mono text-[9px] text-[#00ff88]/80 block mt-2">
            ▼ -5.1%_LATENCY_OPT
          </span>
        </div>

        {/* Metric Card 3 */}
        <div className="p-5 bg-[#080f0d] border border-nexus-border rounded-lg relative overflow-hidden shadow-lg">
          <div className="absolute top-4 right-4 text-nexus-green/30">
            <Server className="w-6 h-6 stroke-[1.5]" />
          </div>
          <span className="font-mono text-[9px] text-gray-500 tracking-wider font-bold block">ACTIVE_AGENTS</span>
          <div className="font-display text-3xl font-black text-white mt-1.5 tracking-tight nexus-glow-text">
            {activeAgents}
          </div>
          <span className="font-mono text-[9px] text-[#00ff88]/60 block mt-2 uppercase tracking-widest font-black text-nexus-green">
            STATUS://NOMINAL
          </span>
        </div>

      </div>

      {/* Vector Line Graph consumption matrix card matched exactly */}
      <div className="p-5 bg-[#080f0d] border border-nexus-border rounded-lg space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#142a22] pb-3 gap-2">
          <div>
            <div className="flex items-center space-x-1 font-mono text-xs text-white font-bold uppercase tracking-wider pl-1">
              <span className="w-1.5 h-3 bg-nexus-green rounded-[1px] inline-block mr-1"></span>
              <span>TOKEN_CONSUMPTION_MATRIX</span>
            </div>
            <span className="font-mono text-[9px] text-gray-500 block uppercase pl-1 mt-0.5">DAILY BREAKDOWN INPUT_VS_OUTPUT</span>
          </div>

          <div className="flex items-center space-x-3 text-[9px] font-mono select-none pl-1">
            <span className="flex items-center space-x-1.5 text-nexus-green font-bold uppercase">
              <span className="w-2.5 h-2.5 rounded-[1px] bg-nexus-green inline-block"></span>
              <span>INPUT</span>
            </span>
            <span className="flex items-center space-x-1.5 text-gray-500 uppercase">
              <span className="w-2.5 h-2.5 rounded-[1px] bg-gray-700 inline-block"></span>
              <span>OUTPUT</span>
            </span>
          </div>
        </div>

        {/* Beautiful Custom responsive Vector SVG Area / Line Chart */}
        <div className="w-full overflow-x-auto select-none no-scrollbar">
          <svg viewBox="0 0 600 200" className="w-full min-w-[550px] h-[200px] text-nexus-green">
            
            {/* Grid references lines */}
            <line x1="40" y1="30" x2="570" y2="30" stroke="#142a22" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="40" y1="80" x2="570" y2="80" stroke="#142a22" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="40" y1="130" x2="570" y2="130" stroke="#142a22" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="40" y1="180" x2="570" y2="180" stroke="#142a22" strokeWidth="1" />

            {/* Left Axis numerical limits lines */}
            <text x="10" y="34" className="font-mono text-[8px] fill-gray-600">500k</text>
            <text x="10" y="84" className="font-mono text-[8px] fill-gray-600">300k</text>
            <text x="10" y="134" className="font-mono text-[8px] fill-gray-600">100k</text>
            <text x="10" y="184" className="font-mono text-[8px] fill-gray-600">000</text>

            <defs>
              <linearGradient id="chart-green-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff88" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#00ff88" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="chart-gray-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#374151" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#374151" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gray Area under Output Plot first */}
            <path
              d={`M ${mapX(0)} ${mapY(chartData[0].output)}
                  L ${mapX(1)} ${mapY(chartData[1].output)}
                  L ${mapX(2)} ${mapY(chartData[2].output)}
                  L ${mapX(3)} ${mapY(chartData[3].output)}
                  L ${mapX(4)} ${mapY(chartData[4].output)}
                  L ${mapX(5)} ${mapY(chartData[5].output)}
                  L ${mapX(6)} ${mapY(chartData[6].output)}
                  L ${mapX(6)} 180 L ${mapX(0)} 180 Z`}
              fill="url(#chart-gray-grad)"
            />

            {/* Green Area under Input Plot */}
            <path
              d={`M ${mapX(0)} ${mapY(chartData[0].input)}
                  L ${mapX(1)} ${mapY(chartData[1].input)}
                  L ${mapX(2)} ${mapY(chartData[2].input)}
                  L ${mapX(3)} ${mapY(chartData[3].input)}
                  L ${mapX(4)} ${mapY(chartData[4].input)}
                  L ${mapX(5)} ${mapY(chartData[5].input)}
                  L ${mapX(6)} ${mapY(chartData[6].input)}
                  L ${mapX(6)} 180 L ${mapX(0)} 180 Z`}
              fill="url(#chart-green-grad)"
            />

            {/* Line Output plot */}
            <path
              d={`M ${mapX(0)} ${mapY(chartData[0].output)}
                  L ${mapX(1)} ${mapY(chartData[1].output)}
                  L ${mapX(2)} ${mapY(chartData[2].output)}
                  L ${mapX(3)} ${mapY(chartData[3].output)}
                  L ${mapX(4)} ${mapY(chartData[4].output)}
                  L ${mapX(5)} ${mapY(chartData[5].output)}
                  L ${mapX(6)} ${mapY(chartData[6].output)}`}
              fill="none"
              stroke="#4b5563"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Glowing Line Input plot */}
            <path
              d={`M ${mapX(0)} ${mapY(chartData[0].input)}
                  L ${mapX(1)} ${mapY(chartData[1].input)}
                  L ${mapX(2)} ${mapY(chartData[2].input)}
                  L ${mapX(3)} ${mapY(chartData[3].input)}
                  L ${mapX(4)} ${mapY(chartData[4].input)}
                  L ${mapX(5)} ${mapY(chartData[5].input)}
                  L ${mapX(6)} ${mapY(chartData[6].input)}`}
              fill="none"
              stroke="#00ff88"
              strokeWidth="2"
              strokeLinejoin="round"
              className="nexus-glow-text"
              style={{ filter: "drop-shadow(0 0 4px rgba(0, 255, 136, 0.4))" }}
            />

            {/* Data coordinates indicator dots */}
            {chartData.map((d, idx) => (
              <g key={idx}>
                {/* dots for output */}
                <circle cx={mapX(idx)} cy={mapY(d.output)} r="2" fill="#4b5563" />
                {/* dots for input */}
                <circle cx={mapX(idx)} cy={mapY(d.input)} r="3" fill="#00ff88" stroke="#030706" strokeWidth="1" />
                
                {/* X Axis labels */}
                <text x={mapX(idx) - 8} y="195" className="font-mono text-[8px] fill-gray-500 font-medium uppercase">{d.day}</text>
              </g>
            ))}

          </svg>
        </div>
      </div>

      {/* AGENT_WORKLOAD_REGISTRY card matched exactly */}
      <div className="p-5 bg-[#080f0d] border border-nexus-border rounded-lg space-y-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-1 font-mono text-xs text-white font-bold uppercase tracking-wider pl-1">
            <span className="w-1.5 h-3 bg-nexus-green rounded-[1px] inline-block mr-1"></span>
            <span>AGENT_WORKLOAD_REGISTRY</span>
          </div>
          <span className="font-mono text-[9px] text-gray-500 block uppercase pl-1 mt-0.5">TASKS COMPLETED PER UNIT</span>
        </div>

        {/* Progress tracks of agents */}
        <div className="space-y-4 pl-1">
          {[
            { tag: "RESEARCHER_01", value: "4,201", percentage: 95 },
            { tag: "CODER_BETA", value: "3,890", percentage: 84 },
            { tag: "DATA_PARSER", value: "2,150", percentage: 48 },
            { tag: "UI_GENERATOR", value: "1,240", percentage: 28 },
            { tag: "QA_BOT", value: "890", percentage: 19 },
          ].map((item) => (
            <div key={item.tag} className="space-y-1.5">
              <div className="flex justify-between items-center font-mono text-[10px] text-white">
                <span className="text-gray-450 tracking-wider font-semibold">{item.tag}</span>
                <span className="text-nexus-green font-bold">{item.value}</span>
              </div>

              {/* Progress visual bar */}
              <div className="w-full h-1.5 bg-[#020704] rounded-full overflow-hidden border border-[#142a22]">
                <div 
                  className="h-full bg-nexus-green rounded-full shadow-[0_0_6px_rgba(0,255,136,0.3)] duration-500 transition-all" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
