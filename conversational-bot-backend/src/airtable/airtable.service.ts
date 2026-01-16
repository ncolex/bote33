import { Injectable, Logger } from '@nestjs/common';
import * as Airtable from 'airtable';
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
      this.logger.error('Airtable Access Token or Base ID not configured. Cannot connect to Airtable.');
      throw new Error('Airtable credentials not configured.');
    }

    this.airtable = new Airtable({ apiKey: accessToken });
    this.baseId = baseId;
  }

  private getTable(tableName: string) {
    return this.airtable.base(this.baseId)(tableName);
  }

  async createRecord(tableName: string, fields: any): Promise<any> {
    try {
      const createdRecord = await this.getTable(tableName).create([{ fields }]);
      return createdRecord[0].fields;
    } catch (error) {
      this.logger.error(`Error creating record in ${tableName}: ${error.message}`);
      throw error;
    }
  }


  private _mapRecordToContact(record: Airtable.Record<Airtable.FieldSet>): Contact {
    return {
      id: record.id,
      externalId: record.fields.externalId as string,
      name: record.fields.name as string,
      phoneNumber: record.fields.phoneNumber as string,
      email: record.fields.email as string,
      channelId: record.fields.channelId as string,
      createdAt: record.fields.createdAt as string,
      updatedAt: record.fields.updatedAt as string,
    };
  }

  private _mapRecordToConversation(record: Airtable.Record<Airtable.FieldSet>): Conversation {
    return {
      id: record.id,
      contactId: (record.fields.contactId as string[])[0], // Assuming 'contactId' is a linked record
      channelId: record.fields.channelId as string,
      mode: record.fields.mode as 'bot' | 'human',
      lastMessageAt: record.fields.lastMessageAt as string,
      createdAt: record.fields.createdAt as string,
      updatedAt: record.fields.updatedAt as string,
    };
  }

  private _mapRecordToMessage(record: Airtable.Record<Airtable.FieldSet>): Message {
    return {
      id: record.id,
      conversationId: (record.fields.conversationId as string[])[0], // Assuming linked record
      contactId: (record.fields.contactId as string[])[0], // Assuming linked record
      channelId: record.fields.channelId as string,
      direction: record.fields.direction as 'in' | 'out',
      sender: record.fields.sender as 'contact' | 'bot' | 'human',
      content: record.fields.content as string,
      timestamp: record.fields.timestamp as string,
    };
  }

  private _mapRecordToFlow(record: Airtable.Record<Airtable.FieldSet>): Flow {
    return {
      id: record.id,
      name: record.fields.name as string,
      description: record.fields.description as string,
      isActive: record.fields.isActive as boolean,
      createdAt: record.fields.createdAt as string,
      updatedAt: record.fields.updatedAt as string,
    };
  }

  private _mapRecordToFlowNode(record: Airtable.Record<Airtable.FieldSet>): FlowNode {
    return {
      id: record.id,
      flowId: (record.fields.flowId as string[])[0], // Assuming linked record
      type: record.fields.type as string,
      config: JSON.parse(record.fields.config as string), // Assuming config is stored as a JSON string
      position: JSON.parse(record.fields.position as string), // Assuming position is stored as a JSON string
      next: (record.fields.next as string[] | undefined) || [], // Assuming 'next' is an array of linked record IDs
      createdAt: record.fields.createdAt as string,
      updatedAt: record.fields.updatedAt as string,
    };
  }

  // ==================== CONTACTS ====================
  async getContactById(id: string): Promise<Contact | null> {
    try {
      const record = await this.getTable('Contacts').find(id);
      return record ? this._mapRecordToContact(record) : null;
    } catch (error) {
      this.logger.error(`Error getting contact by id ${id}: ${error.message}`);
      return null;
    }
  }

  async getContactByExternalId(externalId: string, channelId: string): Promise<Contact | null> {
    try {
      const records = await this.getTable('Contacts').select({
        filterByFormula: `AND({externalId} = '${externalId}', {channelId} = '${channelId}')`,
        maxRecords: 1,
      }).firstPage();
      return records.length > 0 ? this._mapRecordToContact(records[0]) : null;
    } catch (error) {
      this.logger.error(`Error getting contact by externalId ${externalId}: ${error.message}`);
      return null;
    }
  }

  async createContact(contact: Partial<Contact>): Promise<Contact> {
    try {
      const createdRecords = await this.getTable('Contacts').create([{ fields: contact }]);
      return this._mapRecordToContact(createdRecords[0]);
    } catch (error) {
      this.logger.error(`Error creating contact: ${error.message}`);
      throw error;
    }
  }

  // ==================== CONVERSATIONS ====================
  async getConversationById(id: string): Promise<Conversation | null> {
    try {
      const record = await this.getTable('Conversations').find(id);
      return record ? this._mapRecordToConversation(record) : null;
    } catch (error) {
      this.logger.error(`Error getting conversation by id ${id}: ${error.message}`);
      return null;
    }
  }

  async getConversationsByContactId(contactId: string): Promise<Conversation[]> {
    try {
      const records = await this.getTable('Conversations').select({
        filterByFormula: `{contactId} = '${contactId}'`,
        sort: [{ field: 'lastMessageAt', direction: 'desc' }],
      }).firstPage();
      return records.map(this._mapRecordToConversation);
    } catch (error) {
      this.logger.error(`Error getting conversations by contactId ${contactId}: ${error.message}`);
      return [];
    }
  }

  async createConversation(conversation: Partial<Conversation>): Promise<Conversation> {
    try {
      const createdRecords = await this.getTable('Conversations').create([{ 
        fields: {
          ...conversation,
          contactId: [conversation.contactId], // Link to Contact record
        }
      }]);
      return this._mapRecordToConversation(createdRecords[0]);
    } catch (error) {
      this.logger.error(`Error creating conversation: ${error.message}`);
      throw error;
    }
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation> {
    try {
      const updatedRecords = await this.getTable('Conversations').update([{ 
        id, 
        fields: {
          ...updates,
          contactId: updates.contactId ? [updates.contactId] : undefined, // Link to Contact record if provided
        }
      }]);
      return this._mapRecordToConversation(updatedRecords[0]);
    } catch (error) {
      this.logger.error(`Error updating conversation ${id}: ${error.message}`);
      throw error;
    }
  }

  // ==================== MESSAGES ====================
  async getMessageById(id: string): Promise<Message | null> {
    try {
      const record = await this.getTable('Messages').find(id);
      return record ? this._mapRecordToMessage(record) : null;
    } catch (error) {
      this.logger.error(`Error getting message by id ${id}: ${error.message}`);
      return null;
    }
  }

  async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
    try {
      const records = await this.getTable('Messages').select({
        filterByFormula: `{conversationId} = '${conversationId}'`,
        sort: [{ field: 'timestamp', direction: 'asc' }],
      }).firstPage();
      return records.map(this._mapRecordToMessage);
    } catch (error) {
      this.logger.error(`Error getting messages by conversationId ${conversationId}: ${error.message}`);
      return [];
    }
  }

  async createMessage(message: Partial<Message>): Promise<Message> {
    try {
      const createdRecords = await this.getTable('Messages').create([{ 
        fields: {
          ...message,
          conversationId: [message.conversationId], // Link to Conversation record
          contactId: [message.contactId], // Link to Contact record
        }
      }]);
      return this._mapRecordToMessage(createdRecords[0]);
    } catch (error) {
      this.logger.error(`Error creating message: ${error.message}`);
      throw error;
    }
  }

  // ==================== FLOWS ====================
  async getFlowById(id: string): Promise<Flow | null> {
    try {
      const record = await this.getTable('Flows').find(id);
      return record ? this._mapRecordToFlow(record) : null;
    } catch (error) {
      this.logger.error(`Error getting flow by id ${id}: ${error.message}`);
      return null;
    }
  }

  async getAllFlows(): Promise<Flow[]> {
    try {
      const records = await this.getTable('Flows').select().firstPage();
      return records.map(this._mapRecordToFlow);
    } catch (error) {
      this.logger.error(`Error getting all flows: ${error.message}`);
      return [];
    }
  }

  async createFlow(flow: Partial<Flow>): Promise<Flow> {
    try {
      const createdRecords = await this.getTable('Flows').create([{ fields: flow }]);
      return this._mapRecordToFlow(createdRecords[0]);
    } catch (error) {
      this.logger.error(`Error creating flow: ${error.message}`);
      throw error;
    }
  }

  // ==================== FLOW NODES ====================
  async getFlowNodeById(id: string): Promise<FlowNode | null> {
    try {
      const record = await this.getTable('FlowNodes').find(id);
      return record ? this._mapRecordToFlowNode(record) : null;
    } catch (error) {
      this.logger.error(`Error getting flow node by id ${id}: ${error.message}`);
      return null;
    }
  }

  async getFlowNodesByFlowId(flowId: string): Promise<FlowNode[]> {
    try {
      const records = await this.getTable('FlowNodes').select({
        filterByFormula: `{flowId} = '${flowId}'`,
        sort: [{ field: 'createdAt', direction: 'asc' }],
      }).firstPage();
      return records.map(this._mapRecordToFlowNode);
    } catch (error) {
      this.logger.error(`Error getting flow nodes by flowId ${flowId}: ${error.message}`);
      return [];
    }
  }

  async createFlowNode(node: Partial<FlowNode>): Promise<FlowNode> {
    try {
      const createdRecords = await this.getTable('FlowNodes').create([{ 
        fields: {
          ...node,
          flowId: [node.flowId], // Link to Flow record
          config: JSON.stringify(node.config), // Store config as JSON string
          position: JSON.stringify(node.position), // Store position as JSON string
        }
      }]);
      return this._mapRecordToFlowNode(createdRecords[0]);
    } catch (error) {
      this.logger.error(`Error creating flow node: ${error.message}`);
      throw error;
    }
  }

  async createSampleContacts(): Promise<void> {
    this.logger.log('Attempting to create two sample contacts in Airtable...');
    try {
      const contact1: Partial<Contact> = {
        name: 'John Doe',
        externalId: 'external_id_1',
        channelId: 'telegram',
        phoneNumber: '+1234567890',
        email: 'john.doe@example.com',
      };
      const contact2: Partial<Contact> = {
        name: 'Jane Smith',
        externalId: 'external_id_2',
        channelId: 'telegram',
        phoneNumber: '+1987654321',
        email: 'jane.smith@example.com',
      };

      await this.createContact(contact1);
      this.logger.log('Sample contact 1 created successfully.');
      await this.createContact(contact2);
      this.logger.log('Sample contact 2 created successfully.');
    } catch (error) {
      this.logger.error(`Failed to create sample contacts: ${error.message}`);
    }
  }
  invalidateCache(table: string): void {
    this.cache.delete(table);
  }

  clearCache(): void {
    this.cache.clear();
  }
}