import { Injectable, Logger } from '@nestjs/common';
import Airtable from 'airtable';
import { Conversation, Message, Flow, FlowNode, Contact } from '../types';

@Injectable()
export class AirtableService {
  private readonly logger = new Logger(AirtableService.name);
  private airtable: Airtable;
  private baseId: string;
  private cache = new Map<string, any[]>(); // Simple in-memory cache

  constructor() {
    const accessToken = process.env.AIRTABLE_ACCESS_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!accessToken || !baseId) {
      this.logger.warn('Airtable Access Token or Base ID not configured. Using mock data.');
      // In a real scenario, we would not proceed without proper configuration
      // For this example, we'll continue with mock data
    } else {
      // Configure Airtable with personal access token
      this.airtable = new Airtable({
        apiKey: accessToken, // The Airtable library still uses apiKey property even for access tokens
      });
      this.baseId = baseId;
    }
  }

  // ==================== CONTACTS ====================
  async getContactById(id: string): Promise<Contact | null> {
    // In a real implementation, this would fetch from Airtable
    // For now, returning mock data
    return {
      id: `contact_${id}`,
      externalId: id,
      name: `Contact ${id}`,
      channelId: 'telegram',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async getContactByExternalId(externalId: string, channelId: string): Promise<Contact | null> {
    // In a real implementation, this would query Airtable
    // For now, returning mock data
    return {
      id: `contact_${externalId}`,
      externalId,
      name: `Contact ${externalId}`,
      channelId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async createContact(contact: Partial<Contact>): Promise<Contact> {
    // In a real implementation, this would create in Airtable
    // For now, returning mock data
    return {
      id: `contact_${Date.now()}`,
      externalId: contact.externalId || '',
      channelId: contact.channelId || 'telegram',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...contact,
    };
  }

  // ==================== CONVERSATIONS ====================
  async getConversationById(id: string): Promise<Conversation | null> {
    // In a real implementation, this would fetch from Airtable
    // For now, returning mock data
    return {
      id: `conv_${id}`,
      mode: 'bot',
      lastMessageAt: new Date().toISOString(),
      contactId: `contact_${id.split('_')[1] || 'default'}`,
      channelId: 'telegram',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async getConversationsByContactId(contactId: string): Promise<Conversation[]> {
    // In a real implementation, this would query Airtable
    // For now, returning mock data
    return [{
      id: `conv_${contactId}_${Date.now()}`,
      mode: 'bot',
      lastMessageAt: new Date().toISOString(),
      contactId,
      channelId: 'telegram',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }];
  }

  async createConversation(conversation: Partial<Conversation>): Promise<Conversation> {
    // In a real implementation, this would create in Airtable
    // For now, returning mock data
    return {
      id: conversation.id || `conv_${Date.now()}`,
      mode: conversation.mode || 'bot',
      lastMessageAt: conversation.lastMessageAt || new Date().toISOString(),
      contactId: conversation.contactId || '',
      channelId: conversation.channelId || 'telegram',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation> {
    // In a real implementation, this would update in Airtable
    // For now, returning mock data
    const existing = await this.getConversationById(id);
    if (!existing) {
      throw new Error(`Conversation with ID ${id} not found`);
    }
    
    return {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  // ==================== MESSAGES ====================
  async getMessageById(id: string): Promise<Message | null> {
    // In a real implementation, this would fetch from Airtable
    // For now, returning mock data
    return {
      id: `msg_${id}`,
      conversationId: `conv_default`,
      contactId: `contact_default`,
      channelId: 'telegram',
      direction: 'in',
      sender: 'contact',
      content: 'Sample message content',
      timestamp: new Date().toISOString(),
    };
  }

  async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
    // In a real implementation, this would query Airtable
    // For now, returning mock data
    return [{
      id: `msg_${Date.now()}`,
      conversationId,
      contactId: `contact_${conversationId.split('_')[1] || 'default'}`,
      channelId: 'telegram',
      direction: 'in',
      sender: 'contact',
      content: 'Sample message content',
      timestamp: new Date().toISOString(),
    }];
  }

  async createMessage(message: Partial<Message>): Promise<Message> {
    // In a real implementation, this would create in Airtable
    // For now, returning mock data
    return {
      id: message.id || `msg_${Date.now()}`,
      conversationId: message.conversationId || '',
      contactId: message.contactId || '',
      channelId: message.channelId || 'telegram',
      direction: message.direction || 'in',
      sender: message.sender || 'contact',
      content: message.content || '',
      timestamp: message.timestamp || new Date().toISOString(),
    };
  }

  // ==================== FLOWS ====================
  async getFlowById(id: string): Promise<Flow | null> {
    // In a real implementation, this would fetch from Airtable
    // For now, returning mock data
    return {
      id: `flow_${id}`,
      name: `Flow ${id}`,
      description: 'Sample flow description',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async getAllFlows(): Promise<Flow[]> {
    // In a real implementation, this would query Airtable
    // For now, returning mock data
    return [{
      id: 'flow_default',
      name: 'Default Flow',
      description: 'Default flow for testing',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }];
  }

  async createFlow(flow: Partial<Flow>): Promise<Flow> {
    // In a real implementation, this would create in Airtable
    // For now, returning mock data
    return {
      id: flow.id || `flow_${Date.now()}`,
      name: flow.name || 'New Flow',
      description: flow.description || '',
      isActive: flow.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // ==================== FLOW NODES ====================
  async getFlowNodeById(id: string): Promise<FlowNode | null> {
    // In a real implementation, this would fetch from Airtable
    // For now, returning mock data
    return {
      id: `node_${id}`,
      flowId: 'flow_default',
      type: 'message',
      config: { content: 'Sample message' },
      position: { x: 0, y: 0 },
      next: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async getFlowNodesByFlowId(flowId: string): Promise<FlowNode[]> {
    // In a real implementation, this would query Airtable
    // For now, returning mock data
    return [{
      id: 'node_start',
      flowId,
      type: 'start',
      config: { content: 'Welcome!' },
      position: { x: 100, y: 100 },
      next: ['node_message_1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, {
      id: 'node_message_1',
      flowId,
      type: 'message',
      config: { content: 'How can I help you?' },
      position: { x: 300, y: 100 },
      next: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }];
  }

  async createFlowNode(node: Partial<FlowNode>): Promise<FlowNode> {
    // In a real implementation, this would create in Airtable
    // For now, returning mock data
    return {
      id: node.id || `node_${Date.now()}`,
      flowId: node.flowId || '',
      type: node.type || 'message',
      config: node.config || {},
      position: node.position || { x: 0, y: 0 },
      next: node.next || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // ==================== CACHE MANAGEMENT ====================
  invalidateCache(table: string): void {
    this.cache.delete(table);
  }

  clearCache(): void {
    this.cache.clear();
  }
}