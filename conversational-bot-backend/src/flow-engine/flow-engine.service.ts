import { Injectable, Logger } from '@nestjs/common';
import { AirtableService } from '../airtable/airtable.service';
import { CoreService } from '../core/core.service';
import { Flow, FlowNode, Message } from '../types';

export interface FlowExecutionState {
  conversationId: string;
  currentFlowId: string;
  currentNodeId: string;
  data: Record<string, any>; // Store conversation-specific data
  visitedNodes: string[]; // Track visited nodes for debugging
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class FlowEngineService {
  private readonly logger = new Logger(FlowEngineService.name);
  private readonly flowStates = new Map<string, FlowExecutionState>(); // In-memory storage for flow states

  constructor(
    private readonly airtableService: AirtableService,
    private readonly coreService: CoreService,
  ) {}

  /**
   * Starts executing a flow for a conversation
   */
  async startFlow(conversationId: string, flowId: string): Promise<void> {
    this.logger.log(`Starting flow ${flowId} for conversation ${conversationId}`);

    const flow = await this.airtableService.getFlowById(flowId);
    if (!flow) {
      throw new Error(`Flow with ID ${flowId} not found`);
    }

    // Find the start node (typically the node with type 'start' or the first node)
    const nodes = await this.airtableService.getFlowNodesByFlowId(flowId);
    const startNode = nodes.find(node => node.type === 'start') || nodes[0];

    if (!startNode) {
      throw new Error(`No start node found for flow ${flowId}`);
    }

    // Initialize flow state
    const initialState: FlowExecutionState = {
      conversationId,
      currentFlowId: flowId,
      currentNodeId: startNode.id,
      data: {},
      visitedNodes: [startNode.id],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.flowStates.set(conversationId, initialState);

    // Execute the start node
    await this.executeNode(conversationId, startNode);
  }

  /**
   * Continues executing the flow from the current node
   */
  async continueFlow(conversationId: string, inputData?: any): Promise<void> {
    const state = this.flowStates.get(conversationId);
    if (!state) {
      throw new Error(`No active flow state found for conversation ${conversationId}`);
    }

    const currentNode = await this.airtableService.getFlowNodeById(state.currentNodeId);
    if (!currentNode) {
      throw new Error(`Current node ${state.currentNodeId} not found`);
    }

    // Execute the current node
    await this.executeNode(conversationId, currentNode, inputData);
  }

  /**
   * Executes a specific node in the flow
   */
  private async executeNode(conversationId: string, node: FlowNode, inputData?: any): Promise<void> {
    this.logger.log(`Executing node ${node.id} (${node.type}) for conversation ${conversationId}`);

    switch (node.type) {
      case 'message':
        await this.handleMessageNode(conversationId, node, inputData);
        break;
      case 'condition':
        await this.handleConditionNode(conversationId, node, inputData);
        break;
      case 'input':
        await this.handleInputNode(conversationId, node, inputData);
        break;
      case 'wait':
        await this.handleWaitNode(conversationId, node, inputData);
        break;
      case 'api':
        await this.handleApiNode(conversationId, node, inputData);
        break;
      case 'handoff':
        await this.handleHandoffNode(conversationId, node, inputData);
        break;
      case 'end':
        await this.handleEndNode(conversationId, node, inputData);
        break;
      case 'start':
        await this.handleStartNode(conversationId, node, inputData);
        break;
      default:
        this.logger.warn(`Unknown node type: ${node.type}. Skipping.`);
        await this.advanceToNextNode(conversationId, node);
    }
  }

  /**
   * Handles a message node - sends a message to the user
   */
  private async handleMessageNode(conversationId: string, node: FlowNode, inputData?: any): Promise<void> {
    const messageContent = node.config.content || 'Default message';
    await this.coreService.sendMessage(conversationId, messageContent, 'bot');
    
    await this.advanceToNextNode(conversationId, node);
  }

  /**
   * Handles a condition node - evaluates conditions and routes accordingly
   */
  private async handleConditionNode(conversationId: string, node: FlowNode, inputData?: any): Promise<void> {
    // In a real implementation, this would evaluate conditions based on node.config
    // For now, we'll just advance to the first next node
    await this.advanceToNextNode(conversationId, node);
  }

  /**
   * Handles an input node - waits for user input
   */
  private async handleInputNode(conversationId: string, node: FlowNode, inputData?: any): Promise<void> {
    // Input nodes typically wait for user response
    // In a real implementation, this would register a callback to handle the response
    // For now, we'll just advance to the first next node
    await this.advanceToNextNode(conversationId, node);
  }

  /**
   * Handles a wait node - pauses execution for a specified time
   */
  private async handleWaitNode(conversationId: string, node: FlowNode, inputData?: any): Promise<void> {
    // Wait nodes pause execution
    // In a real implementation, this would schedule a delayed execution
    // For now, we'll just advance to the first next node
    await this.advanceToNextNode(conversationId, node);
  }

  /**
   * Handles an API node - calls an external API
   */
  private async handleApiNode(conversationId: string, node: FlowNode, inputData?: any): Promise<void> {
    // In a real implementation, this would call an external API based on node.config
    // For now, we'll just advance to the first next node
    await this.advanceToNextNode(conversationId, node);
  }

  /**
   * Handles a handoff node - transfers control to a human agent
   */
  private async handleHandoffNode(conversationId: string, node: FlowNode, inputData?: any): Promise<void> {
    // Transfer conversation to human agent
    await this.coreService.updateConversationMode(conversationId, 'human');
    
    // Send a message indicating the handoff
    const messageContent = node.config.message || 'Transferring to a human agent...';
    await this.coreService.sendMessage(conversationId, messageContent, 'bot');
    
    await this.advanceToNextNode(conversationId, node);
  }

  /**
   * Handles an end node - terminates the flow
   */
  private async handleEndNode(conversationId: string, node: FlowNode, inputData?: any): Promise<void> {
    // Remove the flow state for this conversation
    this.flowStates.delete(conversationId);
    this.logger.log(`Flow ended for conversation ${conversationId}`);
  }

  /**
   * Handles a start node - initializes the flow
   */
  private async handleStartNode(conversationId: string, node: FlowNode, inputData?: any): Promise<void> {
    // Start nodes typically just advance to the next node
    await this.advanceToNextNode(conversationId, node);
  }

  /**
   * Advances to the next node in the flow
   */
  private async advanceToNextNode(conversationId: string, currentNode: FlowNode): Promise<void> {
    const state = this.flowStates.get(conversationId);
    if (!state) {
      throw new Error(`No active flow state found for conversation ${conversationId}`);
    }

    // Update the state
    state.currentNodeId = currentNode.next[0]; // For simplicity, always take the first next node
    state.updatedAt = new Date().toISOString();
    
    if (state.currentNodeId) {
      // Add to visited nodes
      state.visitedNodes.push(state.currentNodeId);
      
      // Update the state in memory
      this.flowStates.set(conversationId, state);
      
      // Execute the next node
      const nextNode = await this.airtableService.getFlowNodeById(state.currentNodeId);
      if (nextNode) {
        await this.executeNode(conversationId, nextNode);
      } else {
        this.logger.warn(`Next node ${state.currentNodeId} not found`);
      }
    } else {
      // No next node, flow ends
      this.flowStates.delete(conversationId);
      this.logger.log(`Flow completed for conversation ${conversationId}`);
    }
  }

  /**
   * Gets the current flow state for a conversation
   */
  getFlowState(conversationId: string): FlowExecutionState | undefined {
    return this.flowStates.get(conversationId);
  }

  /**
   * Sets data in the flow state
   */
  async setFlowData(conversationId: string, key: string, value: any): Promise<void> {
    const state = this.flowStates.get(conversationId);
    if (!state) {
      throw new Error(`No active flow state found for conversation ${conversationId}`);
    }

    state.data[key] = value;
    state.updatedAt = new Date().toISOString();
    
    this.flowStates.set(conversationId, state);
  }

  /**
   * Gets data from the flow state
   */
  getFlowData(conversationId: string, key: string): any {
    const state = this.flowStates.get(conversationId);
    if (!state) {
      return undefined;
    }

    return state.data[key];
  }
}