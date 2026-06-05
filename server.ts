import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up larger JSON payload limits for file uploads
app.use(express.json({ limit: "15mb" }));

// Initialize GoogleGenAI Client lazily with named config parameter
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("⚠️ GEMINI_API_KEY is not configured or using placeholder value. AI interactions will run in smart simulated mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Global state trackers for simulation/interactive enhancements
let activeAgentsDeployedCount = 1; // Start with Nexus Coder v4 deployed
const sessionUptimeStart = Date.now();
const analyticsUsageOverTime = [
  { day: "MON", input: 80000, output: 120000 },
  { day: "TUE", input: 140000, output: 190000 },
  { day: "WED", input: 110000, output: 250000 },
  { day: "THU", input: 180000, output: 310000 },
  { day: "FRI", input: 220000, output: 260000 },
  { day: "SAT", input: 160000, output: 350000 },
  { day: "SUN", input: 240000, output: 410000 },
];

/**
 * API Endpoints
 */

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    system: "NEXUS_CORE // V2.4",
    uptime: Math.floor((Date.now() - sessionUptimeStart) / 1000),
    sdk: "@google/genai",
  });
});

// Chat endpoint (real Gemini proxy or smart fallback)
app.post("/api/chat", async (req, res) => {
  const { messages, attachments } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages array." });
  }

  // Get current user prompt
  const userMsg = messages[messages.length - 1];
  const promptText = userMsg ? userMsg.content : "";

  // Prepare file text if any attachments
  let attachmentContext = "";
  if (attachments && attachments.length > 0) {
    attachmentContext = attachments.map((att: any) => 
      `[FILE ATTACHMENT: ${att.name} (${att.size}) of type ${att.type}]\nContent Preview:\n${att.content || "Empty or non-text content"}`
    ).join("\n\n");
  }

  const systemInstruction = 
    "You are NEXUS_AI // SYSTEM CORE V2.4, an elegant, ultra-intellectual cyberpunk synthetic operator. " +
    "You communicate in a highly structured, objective, and composed developer persona. " +
    "Style conventions:\n" +
    "- Use terms like 'OPERATOR', 'INGESTION', 'ANALYSIS_SYNTHESIS' when appropriate.\n" +
    "- Prefix logical headings or key system status updates with tags like 'SYS_LINK // DETECTED', 'CORE_LOG // INFO', or 'PIPELINE // RUNNING'.\n" +
    "- Be incredibly helpful, practical, and detail-oriented. Answer coding, architectural, and data analysis tasks.\n" +
    "- Format your output beautifully with clean, scannable markdown, lists, and code blocks.";

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "";

  if (!isKeyValid) {
    // Elegant smart simulation fallback highlighting that API Key is missing in Settings
    console.log("No valid Gemini API key found. Providing smart cyberpunk simulated response.");
    
    // Simulate smart developer response
    let simulatedText = `SYS_LINK // SIMULATION_ACTIVE\n\nNEXUS_AI Core is currently operating with a **Simulated Engine** because your **GEMINI_API_KEY** is not set in the workspace Secrets. To unlock full real-time analysis, please add your key via the **Secrets panel** in the settings.\n\n### Analytical Response regarding: "${promptText.substring(0, 50)}${promptText.length > 50 ? '...' : ''}"\n\n1. **Core Strategy**: A tactical pipeline would address this by establishing decoupled service layers.\n2. **Execution Vector**: Ensure robust sanitization and logging channels are active.\n3. **Proactive Audit**: Check error boundaries in any active visual automations.`;
    
    // Customize simulation for certain prompt cues
    const cue = promptText.toLowerCase();
    if (cue.includes("summarize") || cue.includes("notes")) {
      simulatedText = `SYS_LINK // SUMMARIZATION_PIPELINE\n\n**Meeting Notes Summary (Simulated AI Extract)**:\n\n- **Decisions**: Real-time distributed telemetry routing agreed for Sector 4.\n- **Risk Vector**: High latency identified in distributed Kafka/Spanner clusters during high load peaks.\n- **Action Items**:\n  - operator_alpha: Refactor stream serialization filters (Target: Monday).\n  - operator_beta: Stabilize network buffering configurations (Target: Wednesday).`;
    } else if (cue.includes("code") || cue.includes("review") || cue.includes("bug")) {
      simulatedText = `SYS_LINK // CODE_REVIEW_MODULE\n\n**Technical Pipeline Review**:\n\n\`\`\`typescript\n// Recommendation for asynchronous payload streams\nexport async function ingestStream(sourceKey: string) {\n  const startTime = Date.now(); \n  try {\n    const response = await fetch(\`/api/v1/source/\${sourceKey}\`);\n    if (!response.ok) throw new Error("INGEST_STREAM_FAILED");\n    // Optimize GC buffers here\n    return await response.json();\n  } catch (error) {\n    console.error("PIPELINE_ERROR // SOURCE_DISCONNECT", error);\n    throw error;\n  }\n}\n\`\`\`\n\n**Insights**:\n- Memory allocation looks clean.\n- Add exponential retry bounds to the network fetch step.`;
    }

    return res.json({
      sender: "NEXUS_AI",
      type: "RESPONSE",
      content: simulatedText,
      timestamp: new Date().toISOString(),
      status: "SIMULATED",
    });
  }

  try {
    const ai = getGeminiClient();
    
    // Convert previous chat messages to Gemini prompt context
    const chatPrompt = messages.map(m => {
      const sender = m.sender === "OP_USER" ? "User" : "NexusAI";
      return `${sender}: ${m.content}`;
    }).join("\n\n");

    const fullPrompt = `${attachmentContext ? `Attachment Context:\n${attachmentContext}\n\n` : ""}Workspace History & Current Query:\n${chatPrompt}\n\nNexusAI Response:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({
      sender: "NEXUS_AI",
      type: "RESPONSE",
      content: response.text || "SYSTEM ERROR // EMPTY_RESPONSE",
      timestamp: new Date().toISOString(),
      status: "COMPLETED",
    });

  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    res.status(500).json({
      sender: "NEXUS_AI",
      type: "RESPONSE",
      content: `SYS_FAIL // ENGINES_OFFLINE\n\nAn unexpected exception occurred during model synthesis.\n\n**Diagnostics**:\n\`\`\`\n${error.message || error}\n\`\`\`\n\nPlease check server console logs and confirm your API Key configurations.`,
      timestamp: new Date().toISOString(),
      status: "ERROR",
    });
  }
});

// Document parsing & structured analysis endpoint (Returns structured JSON)
app.post("/api/parse-doc", async (req, res) => {
  const { fileName, fileContent } = req.body;
  if (!fileContent) {
    return res.status(400).json({ error: "Missing document content." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "";

  // If key is not valid, return a beautiful simulated structured mock
  if (!isKeyValid) {
    console.log("No valid Gemini API key found for parsing. Returning smart custom simulation.");
    // Generate smart mock based on file contents
    const lowerName = fileName.toLowerCase();
    let headline = "Topological Quantum Logic Optimization";
    let text = "Discovered a 4x reduction in error correction overhead by mapping qubit states to Fibonacci anyons.";
    let loc = "Page 3, Row 12";

    if (lowerName.includes("financial") || lowerName.includes("billing")) {
      headline = "Operating Margin Forecast v3";
      text = "Q3 software subscription gross margin projected to expand by 4.2% due to bulk server cluster provisioning optimization.";
      loc = "Sheet 2, Cells G12-K15";
    } else if (lowerName.includes("code") || lowerName.includes("typescript") || lowerName.includes("server")) {
      headline = "Memory Leak in Express Event Loop";
      text = "Active task polling keeps database connections alive indefinitely, causing heap exhaustion after 48h active cycles.";
      loc = "server.ts, Lines 92-114";
    }

    setTimeout(() => {
      res.json({
        findings: [
          {
            id: "f1",
            category: "KEY_FINDING",
            title: headline,
            description: text,
            loc: loc,
          },
          {
            id: "f2",
            category: "RISK_IDENTIFIED",
            title: "Resource Dependency Congestion",
            description: "High concurrency limits are throttling operational throughput due to non-optimized thread pooling.",
            loc: "Core Module 4, Subsector 2",
          },
        ],
        correlations: [
          {
            id: "c1",
            type: "match",
            title: "Cryogenic Parallel Matches Found",
            description: "Matches standard 'Thermo_Specs_v1.pdf' specification index by 89% structural overlap.",
            actionText: "VIEW COMPARISON",
          },
          {
            id: "c2",
            type: "conflict",
            title: "Limits Conflict Detected",
            description: "Current architecture caps bounds at 4K limits while prior model suggested 1.2K metrics.",
            actionText: "RESOLVE CONFLICT",
          },
        ],
      });
    }, 1500);
    return;
  }

  try {
    const ai = getGeminiClient();

    const parsingPrompt = 
      `Analyze the following document/file contents (named "${fileName}") and extract key actionable findings, risk parameters, and correlations.\n\n` +
      `File Content Preview:\n${fileContent.substring(0, 10000)}\n\n` +
      `You MUST return a JSON payload matching exact types structure:\n` +
      `{\n` +
      `  "findings": [\n` +
      `    { "id": "unique_id", "category": "KEY_FINDING" | "RISK_IDENTIFIED", "title": "short dynamic finding title", "description": "concise objective summary of this finding", "loc": "file coordinate e.g. Lines 50-60 or Page 2" }\n` +
      `  ],\n` +
      `  "correlations": [\n` +
      `    { "id": "unique_id", "type": "match" | "conflict", "title": "overlap title", "description": "how it relates to general records", "actionText": "RESOLVE CONFLICT" | "VIEW DETAILS" }\n` +
      `  ]\n` +
      `}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: parsingPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["findings", "correlations"],
          properties: {
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "category", "title", "description", "loc"],
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING, description: "Must be exactly 'KEY_FINDING' or 'RISK_IDENTIFIED'" },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  loc: { type: Type.STRING },
                },
              },
            },
            correlations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "type", "title", "description", "actionText"],
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, description: "Must be 'match' or 'conflict'" },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  actionText: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);

  } catch (error: any) {
    console.error("Gemini Analysis Document Parsing Error:", error);
    res.status(500).json({ error: "Failed to parse document content correctly via Gemini." });
  }
});

// Simulated trigger of visual automation pipelines
app.post("/api/trigger-flow", (req, res) => {
  const { flowName, nodes } = req.body;
  if (!flowName || !nodes) {
    return res.status(400).json({ error: "Flow parameters incomplete." });
  }

  // Generate responsive execution trace
  const executionLogs = [
    `CRITICAL_LOG // PIPELINE // Starting visual ingestion for node: "${flowName}"`,
    `PIPELINE_FLOW // Node-1 [TRIGGER]: Incoming connection established successfully.`,
    `PIPELINE_FLOW // Node-2 [ACTION]: Extracted keys from inbound headers. Processing complete.`,
    `PIPELINE_FLOW // Node-3 [CONDITION]: Evaluated logic check. Condition returned: TRUE.`,
    `PIPELINE_FLOW // Node-4 [ALERT]: Dispatched critical webhook transmission to engineering.`,
    `SYSTEM_CORE // PIPELINE // Completed visualization queue in 122ms.`
  ];

  res.json({
    status: "SUCCESS",
    triggeredAt: new Date().toISOString(),
    logs: executionLogs,
  });
});

// Dynamic server statistics and token counters
app.get("/api/stats", (req, res) => {
  // Add a minute variance so stats feel alive
  const totalTokens = 12.4 + (Math.sin(Date.now() / 100000) * 0.15);
  const latencyOpt = 240 + Math.floor(Math.sin(Date.now() / 5000) * 8);
  
  res.json({
    total_tokens_used: `${totalTokens.toFixed(2)}M`,
    avg_response_time: `${latencyOpt}ms`,
    active_agents: activeAgentsDeployedCount < 10 ? `0${activeAgentsDeployedCount}` : `${activeAgentsDeployedCount}`,
    analyticsUsage: analyticsUsageOverTime,
    uptimeSeconds: Math.floor((Date.now() - sessionUptimeStart) / 1000),
  });
});

app.post("/api/deploy-agent-count", (req, res) => {
  const { change } = req.body; // +1 or -1
  if (change === "increase") activeAgentsDeployedCount++;
  if (change === "decrease" && activeAgentsDeployedCount > 1) activeAgentsDeployedCount--;
  res.json({ active_agents: activeAgentsDeployedCount });
});


// Express server setup with index routing inside Vite middleware

async function start() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 NEXUS AI Server running on http://localhost:${PORT}`);
  });
}

start();
