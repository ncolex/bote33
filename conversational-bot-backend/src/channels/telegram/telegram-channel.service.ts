import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CoreService } from '../../core/core.service';
import { AirtableService } from '../../airtable/airtable.service';
import { Message } from '../../types';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramChannelService implements OnModuleInit {
  private readonly logger = new Logger(TelegramChannelService.name);
  private telegramBot: TelegramBot;

  constructor(
    private readonly coreService: CoreService,
    private readonly airtableService: AirtableService,
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN not found. Telegram integration disabled.');
      return;
    }

    // Initialize Telegram bot
    this.telegramBot = new TelegramBot(token, { polling: true });

    // Set up message handler
    this.telegramBot.on('message', async (msg) => {
      await this.handleIncomingMessage(msg);
    });
  }

  async onModuleInit() {
    if (!this.telegramBot) {
      this.logger.warn('Telegram bot not initialized due to missing token');
      return;
    }

    try {
      await this.telegramBot.getMe();
      this.logger.log('Telegram bot initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Telegram bot:', error);
    }
  }

  /**
   * Handles incoming messages from Telegram
   */
  private async handleIncomingMessage(msg: TelegramBot.Message): Promise<void> {
    this.logger.log(`Received message from Telegram: ${msg.text} from user ${msg.from?.id}`);

    // Create a contact if it doesn't exist
    let contact = await this.airtableService.getContactByExternalId(
      msg.from?.id.toString() || '', 
      'telegram'
    );

    if (!contact) {
      contact = await this.airtableService.createContact({
        externalId: msg.from?.id.toString() || '',
        name: `${msg.from?.first_name || ''} ${msg.from?.last_name || ''}`.trim(),
        channelId: 'telegram',
      });
    }

    // Get or create conversation
    const conversation = await this.coreService.getOrCreateConversation(
      contact.id, 
      'telegram'
    );

    // Create message object
    const message: Partial<Message> = {
      id: `tg_msg_${msg.message_id}`,
      conversationId: conversation.id,
      contactId: contact.id,
      channelId: 'telegram',
      direction: 'in',
      sender: 'contact',
      content: msg.text || '',
      timestamp: new Date(msg.date * 1000).toISOString(),
    };

    // Process the incoming message through the core
    await this.coreService.processIncomingMessage(message as Message);
  }

  /**
   * Sends a message to a Telegram user
   */
  async sendMessage(chatId: string, text: string): Promise<TelegramBot.Message> {
    if (!this.telegramBot) {
      throw new Error('Telegram bot not initialized');
    }

    try {
      const sentMessage = await this.telegramBot.sendMessage(chatId, text);
      this.logger.log(`Message sent to Telegram user ${chatId}: ${text}`);
      return sentMessage;
    } catch (error) {
      this.logger.error(`Failed to send message to Telegram user ${chatId}:`, error);
      throw error;
    }
  }

  /**
   * Gets the bot info
   */
  async getBotInfo(): Promise<TelegramBot.User> {
    if (!this.telegramBot) {
      throw new Error('Telegram bot not initialized');
    }

    return await this.telegramBot.getMe();
  }
}