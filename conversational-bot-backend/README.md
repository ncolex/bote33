# Conversational Bot Backend

A conversational bot system backend built with NestJS, designed for integration with React/Vite frontends. Inspired by Botpress architecture, this system provides a modular, scalable solution for building conversational AI applications.

## Features

- **Modular Architecture**: Clean separation of concerns with dedicated modules for core logic, flow engine, data persistence, and channels
- **Telegram Integration**: Built-in support for Telegram as the primary communication channel
- **Airtable Persistence**: Uses Airtable as the sole database for all data storage
- **Flow Engine**: Botpress-inspired flow engine supporting various node types (message, condition, input, wait, api, handoff, end)
- **Real-time Communication**: WebSocket support for live inbox and real-time updates
- **RESTful API**: Comprehensive API endpoints aligned with frontend contracts
- **Extensible Design**: Ready for additional channels (WhatsApp) and features

## Tech Stack

- **Node.js**: Runtime environment
- **NestJS**: Framework for building scalable server-side applications
- **TypeScript**: Type-safe development
- **WebSockets**: Real-time communication
- **Airtable**: Cloud-based database solution
- **Architecture**: Modular design with clear separation of concerns

## Project Structure

```
src/
├── core/                 # Core conversational logic
├── flow-engine/         # Flow execution engine (Botpress-style)
├── airtable/            # Airtable data persistence layer
├── channels/
│   └── telegram/        # Telegram channel adapter
├── realtime/            # WebSocket real-time communication
├── api/                 # REST API controllers
├── config/              # Configuration management
├── types.ts             # Shared type definitions
└── main.ts              # Application entry point
```

## Modules

### CoreModule
- Manages conversations and contacts
- Handles bot/human mode transitions
- Orchestrates flow execution
- Emits internal events

### FlowEngineModule
- Executes flows step-by-step
- Resolves different node types
- Maintains conversation-specific state
- Persists progress in Airtable

Supported node types:
- `message`: Send messages to users
- `condition`: Evaluate conditions and route accordingly
- `input`: Wait for user input
- `wait`: Pause execution temporarily
- `api`: Call external APIs
- `handoff`: Transfer to human agent
- `end`: Terminate flow execution

### AirtableModule
- Centralized Airtable client
- Strongly typed data access
- Services for all data tables
- In-memory caching
- Rate limit handling

### TelegramChannelModule
- Receives and sends Telegram messages
- Translates Telegram events to core events
- Minimal business logic in channel adapter
- Supports both webhook and polling modes

### RealtimeModule
- WebSocket communication
- Event emission for:
  - `message:new`
  - `conversation:updated`
  - `conversation:mode_changed`
  - `flow:advanced`
- Designed for live human inbox

### API REST Contract

#### Flows
- `GET /api/v1/flows` - Get all flows
- `GET /api/v1/flows/:id` - Get specific flow
- `GET /api/v1/flows/:id/nodes` - Get flow nodes

#### Conversations
- `GET /api/v1/conversations` - Get all conversations
- `GET /api/v1/conversations/:id/messages` - Get conversation messages
- `POST /api/v1/conversations/:id/messages` - Send message
- `POST /api/v1/conversations/:id/takeover` - Take over conversation (human mode)
- `POST /api/v1/conversations/:id/release` - Release conversation (bot mode)

## Setup

### Prerequisites

- Node.js 16+
- Airtable account and Personal Access Token
- Telegram bot token

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd conversational-bot-backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
# Airtable Configuration
AIRTABLE_ACCESS_TOKEN=your_airtable_access_token_here
AIRTABLE_BASE_ID=your_airtable_base_id_here

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Running the Application

#### Development
```bash
npm run start:dev
```

#### Production
```bash
npm run build
npm run start:prod
```

## Connecting Telegram

1. Create a Telegram bot using [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Add the token to your `.env` file as `TELEGRAM_BOT_TOKEN`
4. The bot will automatically start receiving messages when the application runs

## Adding WhatsApp Support (Future)

The architecture is designed to support WhatsApp without touching the core logic:

1. Create a new `WhatsAppChannelModule`
2. Implement the same interface as `TelegramChannelModule`
3. Register the new channel in the appropriate places
4. The core logic remains unchanged

## API Response Formats

### Conversation
```json
{
  "id": "string",
  "mode": "bot" | "human",
  "lastMessageAt": "string"
}
```

### Message
```json
{
  "id": "string",
  "direction": "in" | "out",
  "sender": "bot" | "human" | "contact",
  "content": "string",
  "timestamp": "string"
}
```

### FlowNode
```json
{
  "id": "string",
  "type": "string",
  "config": {},
  "position": { "x": number, "y": number },
  "next": ["string"]
}
```

## Architecture Principles

- **Separation of Concerns**: Clear boundaries between modules
- **Dependency Inversion**: Core doesn't depend on channels
- **Extensibility**: Easy to add new channels and features
- **Testability**: Modular design enables unit testing
- **Configuration Over Convention**: Flexible configuration options
- **Airtable-First**: All data stored in Airtable with caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT