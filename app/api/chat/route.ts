import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Access your API key (ensure it's set in .env.local)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Prepare the context for financial advice
const FINANCIAL_CONTEXT = `You are an AI financial assistant. Provide advice on investments while:
1. Explaining concepts clearly and simply
2. Focusing on long-term investment strategies
3. Emphasizing diversification
4. Warning about risks
5. Reminding that this is general advice, not professional financial advice

User Question: `;

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { message } = await req.json();
    
    // Initialize the model with the standard version
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });
    
    // Generate content
    const prompt = FINANCIAL_CONTEXT + message;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({
      message: response.text(),
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 