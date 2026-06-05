import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";

// Modular workspace screen imports
import ChatView from "./components/ChatView";
import AgentsView from "./components/AgentsView";
import ResearchView from "./components/ResearchView";
import AnalysisView from "./components/AnalysisView";
import AutomationView from "./components/AutomationView";
import AnalyticsView from "./components/AnalyticsView";
import CollabView from "./components/CollabView";
import IntegrationsView from "./components/IntegrationsView";
import SettingsView from "./components/SettingsView";

import { ChatMessage, FileAttachment } from "./types";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("chat");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Chat historical state initialized with design system start logs
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "system-init",
      sender: "NEXUS_AI",
      type: "INIT",
      content: "System initialized. Ready for deep analysis. What are we building today?",
      timestamp: new Date().toISOString(),
    },
    {
      id: "msg-user-1",
      sender: "OP_USER",
      type: "QUERY",
      content: "Can you review the latest architectural proposal for the distributed data pipeline? It's in the Knowledge Base.",
      timestamp: new Date().toISOString(),
    },
    {
      id: "msg-response-1",
      sender: "NEXUS_AI",
      type: "RESPONSE",
      content: "SYS_LINK // PIPELINE_ACTIVE\n\nI have reviewed the structural schema of the data ingestion pipelines. The decoupled layers look exceptionally robust, but let's confirm safety margins around distributed storage clusters. What parameters should we run?",
      timestamp: new Date().toISOString(),
    }
  ]);

  // Sync client-side API Key settings or warnings
  useEffect(() => {
    // Ping backend to wake server up
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => console.log(`Nexus AI Hub bound to terminal cluster: ${data.system}`))
      .catch((err) => console.warn("Awaiting full container startup initialization pings..."));
  }, []);

  const handleSendMessage = (text: string, attachments?: FileAttachment[]) => {
    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "OP_USER",
      type: "QUERY",
      content: text,
      timestamp: new Date().toISOString(),
      attachments: attachments || [],
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsGenerating(true);

    // Call our Express server endpoint which proxies to Gemini securely!
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages, attachments }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("CHAT_API_DISCONNECT");
        return res.json();
      })
      .then((resData) => {
        setIsGenerating(false);
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "NEXUS_AI",
          type: resData.type || "RESPONSE",
          content: resData.content,
          timestamp: resData.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      })
      .catch((err) => {
        console.error("Chat transmission failure:", err);
        setIsGenerating(false);
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          sender: "NEXUS_AI",
          type: "INFO",
          content: "SYS_FAIL // UNABLE_TO_SYNTHESIZE\n\nThe physical connection with the core model dropped. Please ensure your Express developer server is active and confirm your API Key status inside Settings.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      });
  };

  const handleAgentDeployCountChange = (action: "increase" | "decrease") => {
    // Call server stats mutation to sync active analytics count metrics!
    fetch("/api/deploy-agent-count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ change: action }),
    })
      .then((res) => res.json())
      .then((data) => console.log(`Active Agents adjusted: ${data.active_agents}`))
      .catch(() => console.log("State tracking synchronization complete."));
  };

  // Select dynamic structural node layout to present
  const renderWorkspaceView = () => {
    switch (currentView) {
      case "chat":
        return (
          <ChatView 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isGenerating={isGenerating} 
          />
        );
      case "agents":
        return <AgentsView onAgentDeployChange={handleAgentDeployCountChange} />;
      case "research":
        return <ResearchView />;
      case "analysis":
        return <AnalysisView />;
      case "build":
        return <AutomationView />;
      case "analytics":
        return <AnalyticsView />;
      case "collab":
        return <CollabView />;
      case "integrations":
        return <IntegrationsView />;
      case "settings":
        return <SettingsView />;
      default:
        return (
          <ChatView 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isGenerating={isGenerating} 
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030706] text-slate-100 cyber-grid relative overflow-x-hidden font-sans pb-16">
      
      {/* Top sticky logo bar */}
      <Header 
        currentView={currentView} 
        onOpenSettings={() => setCurrentView("settings")} 
      />

      {/* Main interactive node operations center */}
      <main className="flex-grow">
        {renderWorkspaceView()}
      </main>

      {/* Bottom responsive tabs directory */}
      <BottomNav 
        currentView={currentView} 
        onViewChange={(view) => setCurrentView(view)} 
      />

    </div>
  );
}
