# Project Overview

This project is a monorepo containing a React-based frontend and a NestJS-based backend for a conversational bot control panel. The frontend allows users to manage and monitor the bot, while the backend handles the bot's logic, integrations, and communication channels.

## Frontend (wholesaleflow---whatsapp-bot-control-panel)

The frontend is a React application built with Vite. It provides a user interface for interacting with the conversational bot, including a dashboard, analytics, a flow builder, and a live inbox.

### Building and Running

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Set Environment Variables:**
    Create a `.env.local` file and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key
    ```
3.  **Run in Development Mode:**
    ```bash
    npm run dev
    ```
4.  **Build for Production:**
    ```bash
    npm run build
    ```
5.  **Preview Production Build:**
    ```bash
    npm run preview
    ```

### Development Conventions

*   The project uses TypeScript and React.
*   Components are organized in the `components` directory.
*   The project uses `vite` for building and development.

## Backend (conversational-bot-backend)

The backend is a NestJS application that powers the conversational bot. It integrates with Airtable for data storage, Telegram for communication, and uses WebSockets for real-time updates to the frontend.

### Building and Running

1.  **Navigate to the backend directory:**
    ```bash
    cd conversational-bot-backend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Set Environment Variables:**
    Create a `.env` file in the `conversational-bot-backend` directory and add the necessary environment variables. You can use `.env.example` as a template.
4.  **Run in Development Mode:**
    ```bash
    npm run start:dev
    ```
5.  **Build for Production:**
    ```bash
    npm run build
    ```
6.  **Run in Production Mode:**
    ```bash
    npm run start:prod
    ```
7.  **Run Tests:**
    ```bash
    npm run test
    ```

### Development Conventions

*   The project uses NestJS, a modular and scalable Node.js framework.
*   The code is organized into modules (`core`, `flow-engine`, `airtable`, `channels`, `realtime`, `api`).
*   The project uses `jest` for testing.
