export interface FileAttachment {
  name: string;
  size: string;
  type: string;
  content?: string;
}

export interface ChatMessage {
  id: string;
  sender: "NEXUS_AI" | "OP_USER";
  type: "INIT" | "QUERY" | "ANALYZING" | "RESPONSE" | "INFO";
  content: string;
  timestamp: string;
  status?: string;
  suggestions?: string[];
  attachments?: FileAttachment[];
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: "DEVELOPMENT" | "MARKETING" | "AUTOMATION" | "SECURITY" | "AI_SYS";
  status: "ACTIVE" | "PAUSED" | "IN_DEVELOPMENT";
  deploys: string;
  tags: string[];
  isTrending?: boolean;
}

export interface ResearchTask {
  id: string;
  code: string;
  title: string;
  description: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  uptime: string;
  progress?: number;
  insights: string[];
  resources: { name: string; url: string; type: "download" | "external" }[];
}

export interface DocumentFinding {
  id: string;
  category: "KEY_FINDING" | "RISK_IDENTIFIED";
  title: string;
  description: string;
  loc: string;
}

export interface DocumentCorrelation {
  id: string;
  type: "match" | "conflict";
  title: string;
  description: string;
  actionText: string;
}

export interface ParseDocument {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "extracting" | "completed";
  estimatedTime?: string;
  findings: DocumentFinding[];
  correlations: DocumentCorrelation[];
}

export interface AutomationNode {
  id: string;
  type: "TRIGGER" | "ACTION" | "CONDITION" | "TRUE_BRANCH";
  name: string;
  detail: string;
  extra?: string;
}

export interface AutomationFlow {
  id: string;
  name: string;
  status: "DRAFT_V1" | "ACTIVE" | "PAUSED";
  nodes: AutomationNode[];
}

export interface TeamMember {
  id: string;
  username: string;
  status: "WORKING_ON_ALPHA" | "OFFLINE" | "IN_MEETING" | "IDLE";
  isOnline: boolean;
  avatarUrl?: string;
}

export interface TokenMetric {
  day: string;
  input: number;
  output: number;
}
