import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Terminal, CornerDownLeft, AlertCircle, RefreshCw, Sparkles, FileCode, CheckCircle2 } from "lucide-react";
import { ChatMessage, FileAttachment } from "../types";

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, attachments?: FileAttachment[]) => void;
  isGenerating: boolean;
}

export default function ChatView({ messages, onSendMessage, isGenerating }: ChatViewProps) {
  const [inputText, setInputText] = useState("");
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSend = () => {
    if (!inputText.trim() && attachments.length === 0) return;
    onSendMessage(inputText, attachments);
    setInputText("");
    setAttachments([]);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    let customPrompt = "";
    if (suggestionText === "SUMMARIZE_MEETING") {
      customPrompt = "Can you summarize the notes regarding the Sector 4 quantum storage clusters?";
    } else if (suggestionText === "CODE_REVIEW") {
      customPrompt = "Review this distributed ingestion pipeline configuration for memory leaks and race conditions.";
    } else {
      customPrompt = `Initialize analytical review for: ${suggestionText}`;
    }
    onSendMessage(customPrompt, []);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const textContent = reader.result as string;
        const newAttachment: FileAttachment = {
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type || "text/plain",
          content: textContent,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsText(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] bg-[#030706] cyber-grid relative">
      
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-24">
        {messages.map((msg) => {
          const isUser = msg.sender === "OP_USER";
          
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col max-w-3xl mx-auto w-full ${isUser ? "items-end" : "items-start"}`}
            >
              {/* Operator Tag / Subtitle */}
              <div className="flex items-center space-x-2 mb-1.5 font-mono text-[10px] uppercase tracking-wider">
                {isUser ? (
                  <>
                    <span className="text-[#00ff88]/50">SECURE_CLIENT //</span>
                    <span className="text-gray-400">OP_USER // QUERY</span>
                  </>
                ) : (
                  <>
                    <span className="text-nexus-green shadow-sm text-nexus-green nexus-glow-text">■ NEXUS_AI //</span>
                    <span className="text-nexus-green/70">{msg.type}</span>
                  </>
                )}
              </div>

              {/* Message Payload Box */}
              <div 
                className={`w-full p-4 rounded border text-sm relative transition-all ${
                  isUser 
                    ? "bg-[#051410] border-nexus-green/30 text-gray-200" 
                    : "bg-[#080f0d] border-nexus-border text-gray-250"
                }`}
              >
                {/* Visual Status Indicator Core Strip */}
                <div className={`absolute top-0 bottom-0 left-0 w-1 rounded-l ${
                  isUser ? "bg-nexus-green" : "bg-nexus-green/40"
                }`}></div>

                {/* Content Render */}
                <div className="pl-2 space-y-2 leading-relaxed font-sans overflow-x-auto whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Render Attachments if present on the message */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-nexus-border/40 pl-2 flex flex-wrap gap-2">
                    {msg.attachments.map((att) => (
                      <div 
                        key={att.name} 
                        className="flex items-center space-x-2 bg-[#0d1c16] border border-nexus-green/10 rounded px-2.5 py-1 text-xs font-mono"
                      >
                        <FileCode className="w-3.5 h-3.5 text-nexus-green" />
                        <span className="text-[#00ff88]/80">{att.name}</span>
                        <span className="text-gray-500 text-[10px]">({att.size})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Dynamic Generating Analyzer State */}
        {isGenerating && (
          <div className="flex flex-col max-w-3xl mx-auto w-full items-start">
            <div className="flex items-center space-x-2 mb-1.5 font-mono text-[10px] uppercase tracking-wider">
              <span className="text-nexus-green nexus-glow-text">■ NEXUS_AI //</span>
              <span className="text-nexus-green/70">ANALYZING</span>
            </div>
            
            <div className="w-full p-4 rounded border border-nexus-border bg-[#080f0d] flex items-center space-x-3">
              <div className="w-1 absolute top-0 bottom-0 left-0 bg-[#00ff88]/30 rounded-l"></div>
              
              {/* Cyber Pulsing Blocks mimicking the ■ ■ ■ in screenshots */}
              <div className="flex items-center space-x-2 pl-2">
                <span className="w-3 h-3 bg-nexus-green rounded-[1px] animate-pulse"></span>
                <span className="w-3 h-3 bg-nexus-green rounded-[1px] animate-pulse [animation-delay:0.2s]"></span>
                <span className="w-3 h-3 bg-nexus-green rounded-[1px] animate-pulse [animation-delay:0.4s]"></span>
              </div>
              <span className="text-xs font-mono text-nexus-green/70 tracking-widest animate-pulse">SYNTHESIZING_AI_RESPONSE...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Floating Prompt Helpers & Suggestion Pills Bar */}
      <div className="absolute bottom-18 left-0 right-0 px-4 pointer-events-none">
        <div className="max-w-3xl mx-auto w-full flex items-center space-x-2 overflow-x-auto pb-1 pointer-events-auto select-none no-scrollbar">
          <button 
            id="pill-summarize"
            onClick={() => handleSuggestionClick("SUMMARIZE_MEETING")}
            className="flex items-center space-x-1.5 bg-[#080f0d]/90 border border-nexus-border hover:border-nexus-green text-[#00ff88]/80 hover:text-white px-3 py-1.5 rounded text-xs font-mono tracking-widest uppercase transition-all whitespace-nowrap scroll-mx-4 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-nexus-green" />
            <span>📄 SUMMARIZE_MEETING</span>
          </button>

          <button 
            id="pill-review"
            onClick={() => handleSuggestionClick("CODE_REVIEW")}
            className="flex items-center space-x-1.5 bg-[#080f0d]/90 border border-nexus-border hover:border-nexus-green text-[#00ff88]/80 hover:text-white px-3 py-1.5 rounded text-xs font-mono tracking-widest uppercase transition-all whitespace-nowrap scroll-mx-4 active:scale-95 cursor-pointer"
          >
            <FileCode className="w-3 h-3 text-nexus-green" />
            <span>&lt;&gt; CODE_REVIEW</span>
          </button>
        </div>
      </div>

      {/* Chat Operational Input Panel */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-nexus-border bg-[#030706]/95 backdrop-blur-sm p-3">
        <div className="max-w-3xl mx-auto w-full">
          
          {/* Queued Attachments display before sending */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 p-2 bg-[#080f0d] border border-nexus-border rounded">
              {attachments.map((att, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center space-x-1.5 bg-[#0c1a14] border border-nexus-green/30 px-2 py-0.5 rounded text-[10px] font-mono"
                >
                  <FileCode className="w-2.5 h-2.5 text-nexus-green" />
                  <span className="text-nexus-green max-w-[120px] truncate">{att.name}</span>
                  <button 
                    onClick={() => removeAttachment(idx)}
                    className="text-red-400 hover:text-red-300 ml-1 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-3 bg-[#080f0d] border border-nexus-border focus-within:border-nexus-green/60 p-2 rounded-lg transition-all shadow-lg">
            
            {/* Direct Hidden Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              multiple 
              className="hidden" 
              accept=".txt,.js,.ts,.tsx,.json,.md,.html,.css,.csv"
            />
            
            {/* Attachment Trigger Button */}
            <button 
              id="chat-attach-btn"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 hover:bg-[#00ff88]/5 border border-transparent hover:border-nexus-green/20 rounded-md text-gray-400 hover:text-nexus-green transition-all cursor-pointer"
              title="Upload operational logs/documents"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Inbound Text Box */}
            <input 
              id="chat-input-text"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="QUERY_NEXUS..."
              className="flex-1 bg-transparent text-sm border-none focus:outline-none focus:ring-0 text-white font-mono placeholder-gray-600 pl-1"
            />

            {/* SEND button */}
            <button 
              id="chat-send-btn"
              onClick={handleSend}
              className="bg-nexus-green text-nexus-bg p-2.5 rounded-md hover:bg-nexus-green-bright transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center font-bold"
              title="Transmit Query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-1.5 flex justify-between items-center font-mono text-[9px] text-gray-500 px-1 select-none">
            <span>CRITICAL: VERIFY TECHNICAL DATA // NEXUS_AI_V2.4</span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-2.5 h-2.5 text-nexus-green" />
              <span>CORE_ENCRYPTED</span>
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
