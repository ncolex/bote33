import { Module, forwardRef } from '@nestjs/common';
import { FlowEngineService } from './flow-engine.service';
import { AirtableModule } from '../airtable/airtable.module';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [AirtableModule, forwardRef(() => CoreModule)],
  providers: [FlowEngineService],
  exports: [FlowEngineService],
})
export class FlowEngineModule {}