import { NextResponse } from 'next/server';

const API_KEY = "AIzaSyDKv7dyAGykiSW9HWUSM5uJq1rtySDUBe8";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

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

    if (data.candidates) {
      return NextResponse.json({ 
        response: data.candidates[0].content.parts[0].text 
      });
    } else {
      return NextResponse.json({ 
        error: data 
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to process request' 
    }, { status: 500 });
  }
} 