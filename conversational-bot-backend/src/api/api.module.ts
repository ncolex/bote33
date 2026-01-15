import { Module } from '@nestjs/common';
import { FlowsController } from './controllers/flows.controller';
import { ConversationsController } from './controllers/conversations.controller';
import { AirtableModule } from '../airtable/airtable.module';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [AirtableModule, CoreModule],
  controllers: [FlowsController, ConversationsController],
})
export class ApiModule {}