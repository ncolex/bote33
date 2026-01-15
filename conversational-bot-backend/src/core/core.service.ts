import { Injectable, Logger, Inject } from '@nestjs/common';
import { AirtableService } from '../airtable/airtable.service';
import { Conversation, Message } from '../types';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { FlowEngineService } from '../flow-engine/flow-engine.service';

@Injectable()
export class CoreService {
  private readonly logger = new Logger(CoreService.name);

  constructor(
    private readonly airtableService: AirtableService,
    private readonly flowEngineService: FlowEngineService,
    @Inject(RealtimeGateway) private readonly realtimeGateway: RealtimeGateway,
  ) {}

  /**
   * Creates or retrieves an existing conversation for a contact
   */
  async getOrCreateConversation(contactId: string, channelId: string): Promise<Conversation> {
    // Check if conversation exists
    const existingConversations = await this.airtableService.getConversationsByContactId(contactId);

    if (existingConversations.length > 0) {
      // Return the most recent active conversation
      return existingConversations[0];
    }

    // Create a new conversation
    const newConversation: Partial<Conversation> = {
      id: `conv_${Date.now()}_${contactId}`,
      contactId,
      channelId,
      mode: 'bot',
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const createdConversation = await this.airtableService.createConversation(newConversation);

    this.logger.log(`Created new conversation: ${createdConversation.id} for contact: ${contactId}`);

    // Emit conversation created event
    this.realtimeGateway.emitConversationUpdated(createdConversation.id, createdConversation);

    return createdConversation;
  }

  /**
   * Updates the mode of a conversation (bot/human)
   */
  async updateConversationMode(conversationId: string, mode: 'bot' | 'human'): Promise<void> {
    await this.airtableService.updateConversation(conversationId, { mode });
    this.logger.log(`Updated conversation ${conversationId} mode to ${mode}`);

    // Emit mode change event
    this.realtimeGateway.emitConversationModeChanged(conversationId, mode);

    // Update conversation in realtime
    const updatedConversation = await this.airtableService.getConversationById(conversationId);
    if (updatedConversation) {
      this.realtimeGateway.emitConversationUpdated(conversationId, updatedConversation);
    }
  }

  /**
   * Processes an incoming message
   */
  async processIncomingMessage(message: Message): Promise<void> {
    this.logger.log(`Processing incoming message: ${message.id} from contact: ${message.contactId}`);

    // Get or create conversation for this contact
    const conversation = await this.getOrCreateConversation(message.contactId, message.channelId);

    // Save the incoming message
    const savedMessage = await this.airtableService.createMessage(message);

    // Emit new message event
    this.realtimeGateway.emitNewMessage(conversation.id, savedMessage);

    // If the conversation is in bot mode, trigger flow execution
    if (conversation.mode === 'bot') {
      // For now, we'll trigger a default flow
      // In a real implementation, this would determine the appropriate flow based on message content
      await this.flowEngineService.startFlow(conversation.id, 'flow_default');
    }

    this.logger.log(`Message processed and saved for conversation: ${conversation.id}`);
  }

  /**
   * Sends a message to a contact
   */
  async sendMessage(conversationId: string, content: string, sender: 'bot' | 'human'): Promise<Message> {
    const conversation = await this.airtableService.getConversationById(conversationId);

    if (!conversation) {
      throw new Error(`Conversation with ID ${conversationId} not found`);
    }

    const message: Partial<Message> = {
      id: `msg_${Date.now()}_${conversationId}`,
      conversationId,
      contactId: conversation.contactId,
      channelId: conversation.channelId,
      direction: 'out',
      sender,
      content,
      timestamp: new Date().toISOString(),
    };

    const createdMessage = await this.airtableService.createMessage(message);

    this.logger.log(`Message sent: ${createdMessage.id} for conversation: ${conversationId}`);

    // Emit new message event
    this.realtimeGateway.emitNewMessage(conversationId, createdMessage);

    return createdMessage;
  }
}