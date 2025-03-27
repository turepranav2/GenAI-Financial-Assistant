import { NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// Function to clean the response text
function cleanResponse(text: string): string {
  // Remove asterisks
  let cleaned = text.replace(/\*/g, '');
  
  // Convert bullet points to new lines
  cleaned = cleaned.replace(/^[•-]\s/gm, '\n• ');
  
  // Remove extra newlines
  cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}

export async function POST(req: Request) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to generate response' },
        { status: response.status }
      );
    }

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const cleanedMessage = cleanResponse(data.candidates[0].content.parts[0].text);
      return NextResponse.json({
        message: cleanedMessage
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid response format' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 