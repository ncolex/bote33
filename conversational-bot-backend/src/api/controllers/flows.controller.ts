import { Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { AirtableService } from '../../airtable/airtable.service';
import { Flow, FlowNode } from '../../types';

@Controller('api/v1/flows')
export class FlowsController {
  constructor(private readonly airtableService: AirtableService) {}

  @Get()
  async getAllFlows(): Promise<Flow[]> {
    return await this.airtableService.getAllFlows();
  }

  @Get(':id')
  async getFlowById(@Param('id') id: string): Promise<Flow> {
    const flow = await this.airtableService.getFlowById(id);
    if (!flow) {
      throw new Error(`Flow with ID ${id} not found`);
    }
    return flow;
  }

  @Get(':id/nodes')
  async getFlowNodes(@Param('id') id: string): Promise<FlowNode[]> {
    return await this.airtableService.getFlowNodesByFlowId(id);
  }
}