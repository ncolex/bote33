import { Controller, Get, Post, Param, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AirtableService } from '../../airtable/airtable.service';
import { CoreService } from '../../core/core.service';
import { Conversation, Message } from '../../types';

export class SendMessageDto {
  content: string;
}

@Controller('api/v1/conversations')
export class ConversationsController {
  constructor(
    private readonly airtableService: AirtableService,
    private readonly coreService: CoreService,
  ) {}

  @Get()
  async getAllConversations(): Promise<{ id: string; mode: 'bot' | 'human'; lastMessageAt: string }[]> {
    // This would normally fetch from a conversations table
    // For now, returning mock data
    return [
      {
        id: 'conv_1',
        mode: 'bot',
        lastMessageAt: new Date().toISOString(),
      },
      {
        id: 'conv_2',
        mode: 'human',
        lastMessageAt: new Date().toISOString(),
      },
    ];
  }

  @Get(':id/messages')
  async getConversationMessages(@Param('id') id: string): Promise<Message[]> {
    return await this.airtableService.getMessagesByConversationId(id);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ): Promise<Message> {
    // Send message through core service
    return await this.coreService.sendMessage(id, dto.content, 'human');
  }

  @Post(':id/takeover')
  async takeoverConversation(@Param('id') id: string): Promise<void> {
    await this.coreService.updateConversationMode(id, 'human');
  }

  @Post(':id/release')
  async releaseConversation(@Param('id') id: string): Promise<void> {
    await this.coreService.updateConversationMode(id, 'bot');
  }
}