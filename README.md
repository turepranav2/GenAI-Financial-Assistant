# GenAI-Powered Financial Assistant

A modern AI-powered financial assistant that helps users make better investing decisions through intelligent conversations. The application provides guidance on basic investment questions and helps users find suitable investment products.

## Features

- AI-powered conversational interface for financial guidance
- Investment product recommendations
- Basic financial literacy education
- Real-time market insights
- Personalized investment advice

## Tech Stack

- Next.js 14
- TypeScript
- Chakra UI
- Gemini API
- Node.js

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for AI functionality

## Project Structure

```
/
├── app/                # Next.js app directory
├── components/         # React components
├── lib/               # Utility functions and API clients
├── public/            # Static assets
└── types/             # TypeScript type definitions
``` # GenAI-Financial-Assistant
