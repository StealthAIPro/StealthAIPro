export const runtime = 'nodejs'; // Add this line

import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
// Your existing POST function logic...

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openrouter('openrouter/free'), // Using the free auto-router
    messages,
  });

  return result.toDataStreamResponse();
}
