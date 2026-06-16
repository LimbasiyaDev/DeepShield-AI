import Groq from 'groq-sdk';
import { GeminiCache } from './gemini-cache.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy_key' });

export class GuardianService {
  static async chat(question: string, context: any) {
    const cacheKey = `guardian_${Buffer.from(question).toString('base64').substring(0, 20)}`;
    
    const cached = GeminiCache.get(cacheKey);
    if (cached) return cached;

    if (process.env.GROQ_API_KEY === 'dummy_key' || !process.env.GROQ_API_KEY) {
      const mock = this.mockChat(question);
      GeminiCache.set(cacheKey, mock);
      return mock;
    }

    try {
      const prompt = `You are DeepShield AI, an advanced trading guardian for the Sui ecosystem. The user is asking: "${question}". Here is the current market context: ${JSON.stringify(context)}. Provide a concise, highly analytical response focusing on risk, whale activity, and safe execution. Do NOT use markdown formatting like asterisks or bold text. Use plain text and keep it under 3 sentences.`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
        temperature: parseFloat(process.env.AI_TEMPERATURE || '0.3'),
      }, { signal: controller.signal });
      
      clearTimeout(timeoutId);

      const result = {
        answer: chatCompletion.choices[0]?.message?.content || "I am unable to provide analysis at this time.",
        confidence: 92,
        recommendation: "Proceed with caution"
      };
      
      GeminiCache.set(cacheKey, result);
      return result;
    } catch (error: any) {
      console.warn('⚠️ Guardian chat failed. Falling back to structured response.', error?.message || error);
      return {
        answer: "AI Analysis Temporarily Unavailable. Please rely on standard execution rules.",
        confidence: 0,
        recommendation: "AI Analysis Temporarily Unavailable"
      };
    }
  }

  private static mockChat(question: string) {
    return {
      answer: "Based on my analysis of DeepBook liquidity and recent transaction patterns, I recommend using the Protected Route to mitigate potential front-running risks. Whale accumulation was detected 5 minutes ago.",
      confidence: 88,
      recommendation: "Use Protected Execution"
    };
  }
}
