import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RealtimeEvent } from '../types';

export interface RealtimePayload {
  conversationId: string;
  userId?: string;
  data?: any;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Configure properly in production
    methods: ['GET', 'POST'],
  },
})
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('RealtimeGateway');

  afterInit(server: Server) {
    this.logger.log('Realtime gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(client: Socket, payload: { conversationId: string }) {
    client.join(payload.conversationId);
    this.logger.log(`Client ${client.id} joined conversation ${payload.conversationId}`);
  }

  @SubscribeMessage('leave_conversation')
  handleLeaveConversation(client: Socket, payload: { conversationId: string }) {
    client.leave(payload.conversationId);
    this.logger.log(`Client ${client.id} left conversation ${payload.conversationId}`);
  }

  // Emit events to specific conversation room
  emitToConversation(conversationId: string, event: RealtimeEvent, data: any) {
    this.server.to(conversationId).emit(event, data);
    this.logger.log(`Emitted ${event} to conversation ${conversationId}`);
  }

  // Emit events to all clients
  emitToAll(event: RealtimeEvent, data: any) {
    this.server.emit(event, data);
    this.logger.log(`Emitted ${event} to all clients`);
  }

  // Emit new message event
  emitNewMessage(conversationId: string, message: any) {
    this.emitToConversation(conversationId, RealtimeEvent.MESSAGE_NEW, message);
  }

  // Emit conversation updated event
  emitConversationUpdated(conversationId: string, conversation: any) {
    this.emitToConversation(conversationId, RealtimeEvent.CONVERSATION_UPDATED, conversation);
  }

  // Emit conversation mode changed event
  emitConversationModeChanged(conversationId: string, mode: 'bot' | 'human') {
    this.emitToConversation(conversationId, RealtimeEvent.CONVERSATION_MODE_CHANGED, { mode });
  }

  // Emit flow advanced event
  emitFlowAdvanced(conversationId: string, nodeId: string, flowId: string) {
    this.emitToConversation(conversationId, RealtimeEvent.FLOW_ADVANCED, {
      nodeId,
      flowId,
    });
  }
}