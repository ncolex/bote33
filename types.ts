
export enum View {
  DASHBOARD = 'DASHBOARD',
  FLOW_BUILDER = 'FLOW_BUILDER',
  LIVE_INBOX = 'LIVE_INBOX',
  CAMPAIGNS = 'CAMPAIGNS',
  ANALYTICS = 'ANALYTICS',
  PERSONALITIES = 'PERSONALITIES',
  SETTINGS = 'SETTINGS',
  PLAYGROUND = 'PLAYGROUND'
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'agent';
  text: string;
  timestamp: Date;
  type?: 'text' | 'audio';
  metadata?: {
    intent?: string;
    parsing_status?: 'parsed' | 'failed' | 'manual';
    entities?: Record<string, string>;
    transcription?: string;
  };
}

export interface Conversation {
  id: string;
  contactName: string;
  lastMessage: string;
  status: 'bot' | 'agent' | 'closed';
  platform: 'whatsapp' | 'telegram';
  unreadCount: number;
}

export interface FlowNode {
  id: string;
  type: 'start' | 'message' | 'condition' | 'handoff' | 'end';
  label: string;
  position: { x: number; y: number };
}
