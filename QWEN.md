# WholesaleFlow - WhatsApp Bot Control Panel

## Project Overview

WholesaleFlow is a sophisticated WhatsApp bot control panel designed for wholesale businesses. It provides a comprehensive dashboard for managing automated conversations, campaigns, analytics, and customer interactions. The application leverages Google's Gemini AI to enhance message processing, intent recognition, and voice message transcription capabilities.

### Key Features:
- **Dashboard**: Real-time performance monitoring with metrics, charts, and analytics
- **Flow Builder**: Visual flow builder for creating automated conversation flows
- **Live Inbox**: Real-time inbox for managing customer conversations
- **Campaigns**: Tools for creating and managing marketing campaigns
- **Analytics**: Detailed analytics and reporting on bot performance
- **Settings**: Configuration options for the bot and integrations
- **Playground**: Testing environment for experimenting with AI features

### Technology Stack:
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom dark theme
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI Integration**: Google GenAI (Gemini 3 Flash Preview model)
- **State Management**: React hooks

## Project Structure

```
wholesaleflow---whatsapp-bot-control-panel/
├── components/
│   ├── Analytics.tsx
│   ├── Campaigns.tsx
│   ├── Dashboard.tsx
│   ├── FlowBuilder.tsx
│   ├── LiveInbox.tsx
│   ├── Playground.tsx
│   └── Settings.tsx
├── services/
│   └── geminiService.ts
├── App.tsx
├── index.html
├── index.tsx
├── types.ts
├── vite.config.ts
├── tsconfig.json
├── package.json
├── README.md
└── .gitignore
```

## Building and Running

### Prerequisites
- Node.js

### Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Create a `.env.local` file
   - Add your `GEMINI_API_KEY` to the file

3. Run the application in development mode:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

### Production Build
To build the application for production:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## Development Conventions

### Component Architecture
- Components are organized in the `components/` directory
- Each major view has its own dedicated component file
- Components use TypeScript interfaces defined in `types.ts`
- State management is handled using React hooks (`useState`, etc.)

### AI Integration
- AI services are centralized in `services/geminiService.ts`
- The application uses the Gemini 3 Flash Preview model for:
  - Message intent parsing
  - Voice message transcription
- API keys are loaded via environment variables through Vite's `loadEnv`

### Styling
- The application uses Tailwind CSS for styling
- A custom dark theme is implemented with consistent color palette
- Custom scrollbar styles are defined in `index.html`
- Responsive design is implemented using Tailwind's responsive classes

### Data Types
The application defines several key interfaces and enums in `types.ts`:
- `View`: Enum for navigation views
- `ChatMessage`: Interface for chat message objects
- `Conversation`: Interface for conversation objects
- `FlowNode`: Interface for flow builder nodes

## Key Services

### Gemini Service (`services/geminiService.ts`)
Provides two main functions:
1. `getAIParsingInsight`: Parses messages for wholesale order intent, products, and quantities
2. `transcribeVoiceMessage`: Transcribes voice messages using the Gemini model

## Environment Variables

The application requires the following environment variable:
- `GEMINI_API_KEY`: Your Google Gemini API key for AI functionality

## Navigation Structure

The application features a sidebar navigation with the following sections:
- Dashboard
- Flow Builder
- Live Inbox
- Playground
- Campaigns
- Analytics
- Personalities
- Settings

## File Descriptions

- `App.tsx`: Main application component with routing and layout
- `index.tsx`: Application entry point that mounts the React app
- `index.html`: HTML template with Tailwind CDN and custom styles
- `vite.config.ts`: Vite configuration including environment variable handling
- `tsconfig.json`: TypeScript configuration
- `types.ts`: Shared TypeScript interfaces and enums
- `package.json`: Dependencies and scripts
- `README.md`: Basic setup instructions

## Special Notes

- The application is designed with a dark theme as default
- Real-time updates are simulated in the UI components
- AI features depend on a valid Gemini API key
- The application uses ESM imports via import maps in the HTML file
- Responsive design ensures usability across different screen sizes