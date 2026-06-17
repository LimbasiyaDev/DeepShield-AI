import Groq from 'groq-sdk';
import { GeminiCache } from './gemini-cache.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy_key' });

export class GuardianService {
  static async chat(question: string, context: any) {
    const cacheKey = `guardian_${Buffer.from(question).toString('base64').substring(0, 20)}`;
    
    const cached = GeminiCache.get(cacheKey);
    if (cached) return cached;

    try {
      const prompt = `You are DeepShield AI, an advanced trading guardian for the Sui ecosystem. The user is asking: "${question}". Here is the current market context: ${JSON.stringify(context)}. Provide a JSON response with:
      1. 'answer': A conversational response under 3 sentences focusing on risk and safe execution.
      2. 'confidence': A number 0-100.
      3. 'strategies': An array of 1 to 3 strategic actions. Each object must have: 'title' (short action name), 'description' (why to do it), and 'type' (one of: 'warning', 'primary', 'success').
      Do not use markdown.`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
        temperature: parseFloat(process.env.AI_TEMPERATURE || '0.3'),
        response_format: { type: 'json_object' }
      }, { signal: controller.signal });
      
      clearTimeout(timeoutId);

      const text = chatCompletion.choices[0]?.message?.content || "{}";
      const rawResult = JSON.parse(text);

      const result = {
        answer: rawResult.answer || "I am unable to provide analysis at this time.",
        confidence: rawResult.confidence || 92,
        strategies: rawResult.strategies || [
          { title: "Proceed with caution", description: "Market conditions are uncertain.", type: "warning" }
        ]
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
}
