import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// 1. THIS IS THE KEY: Use Node.js runtime to support all modules
export const runtime = 'nodejs'; 

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// 2. REMOVED: export const config = { runtime: 'edge' }; (This was causing the crash)

export default async function handler(req) {
  // Add a safety check for the method
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { messages } = await req.json();

  const result = await streamText({
    model: openrouter('google/gemini-2.0-flash-001'), // Specified a model for better stability
    messages,
  });

  return result.toDataStreamResponse();
}
