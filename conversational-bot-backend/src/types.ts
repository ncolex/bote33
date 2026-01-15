// Conversation interface matching the required contract
export interface Conversation {
  id: string;
  mode: 'bot' | 'human';
  lastMessageAt: string;
  contactId: string;
  channelId: string;
  createdAt: string;
  updatedAt: string;
}

// Message interface matching the required contract
export interface Message {
  id: string;
  conversationId: string;
  contactId: string;
  channelId: string;
  direction: 'in' | 'out';
  sender: 'bot' | 'human' | 'contact';
  content: string;
  timestamp: string;
}

// Flow interface
export interface Flow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// FlowNode interface matching the required contract
export interface FlowNode {
  id: string;
  flowId: string;
  type: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  next: string[];
  createdAt: string;
  updatedAt: string;
}

// Contact interface
export interface Contact {
  id: string;
  externalId: string; // External ID from the channel (e.g., Telegram ID)
  name?: string;
  phoneNumber?: string;
  email?: string;
  channelId: string;
  createdAt: string;
  updatedAt: string;
}

// Common event types for real-time communication
export enum RealtimeEvent {
  MESSAGE_NEW = 'message:new',
  CONVERSATION_UPDATED = 'conversation:updated',
  CONVERSATION_MODE_CHANGED = 'conversation:mode_changed',
  FLOW_ADVANCED = 'flow:advanced',
}