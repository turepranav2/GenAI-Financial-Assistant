import { NextResponse } from 'next/server';

const LLAMA_API_KEY = '4378753f-4b81-4f96-8942-12bcfdd75f92';
const LLAMA_API_URL = 'https://api.llama-api.com/v1/chat/completions';

const FINANCIAL_CONTEXT = `You are an expert financial advisor with deep knowledge of personal finance, investment strategies, and market analysis. 
Your role is to provide clear, practical, and ethical financial advice. Follow these guidelines:

1. Be clear and concise in your explanations
2. Focus on long-term strategies and sustainable practices
3. Always emphasize diversification and risk management
4. Include relevant warnings and disclaimers
5. Keep advice general and avoid specific product recommendations
6. Consider different income levels and financial situations
7. Use simple language to explain complex concepts
8. Provide actionable steps when possible
9. Include relevant market context when appropriate
10. Always remind users that past performance doesn't guarantee future results

Remember: Your advice should be educational and empowering, helping users make informed financial decisions.`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await fetch(LLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLAMA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-2-70b-chat',
        messages: [
          {
            role: 'system',
            content: FINANCIAL_CONTEXT
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Llama API Error:', error);
      throw new Error(error.message || 'Failed to generate response');
    }

    const data = await response.json();
    return NextResponse.json({ message: data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 