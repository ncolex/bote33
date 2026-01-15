import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  // Airtable configuration
  get airtableApiKey(): string {
    return process.env.AIRTABLE_API_KEY || '';
  }

  get airtableBaseId(): string {
    return process.env.AIRTABLE_BASE_ID || '';
  }

  // Telegram configuration
  get telegramBotToken(): string {
    return process.env.TELEGRAM_BOT_TOKEN || '';
  }

  // Server configuration
  get port(): number {
    return parseInt(process.env.PORT || '3000', 10);
  }

  get isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  // Validate required environment variables
  validate(): void {
    const requiredVars = ['AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
}