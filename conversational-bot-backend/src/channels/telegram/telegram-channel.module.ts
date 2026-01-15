import { Module } from '@nestjs/common';
import { TelegramChannelService } from './telegram-channel.service';
import { CoreModule } from '../../core/core.module';
import { AirtableModule } from '../../airtable/airtable.module';

@Module({
  imports: [CoreModule, AirtableModule],
  providers: [TelegramChannelService],
  exports: [TelegramChannelService],
})
export class TelegramChannelModule {}