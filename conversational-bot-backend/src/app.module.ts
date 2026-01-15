import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { FlowEngineModule } from './flow-engine/flow-engine.module';
import { AirtableModule } from './airtable/airtable.module';
import { TelegramChannelModule } from './channels/telegram/telegram-channel.module';
import { RealtimeModule } from './realtime/realtime.module';
import { ApiModule } from './api/api.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    CoreModule,
    FlowEngineModule,
    AirtableModule,
    TelegramChannelModule,
    RealtimeModule,
    ApiModule,
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}