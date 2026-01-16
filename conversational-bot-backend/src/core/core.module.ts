import { Module, forwardRef } from '@nestjs/common';
import { CoreService } from './core.service';
import { AirtableModule } from '../airtable/airtable.module';
import { FlowEngineModule } from '../flow-engine/flow-engine.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [AirtableModule, forwardRef(() => FlowEngineModule), RealtimeModule],
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}