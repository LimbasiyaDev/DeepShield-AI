import Groq from 'groq-sdk';
import { GeminiCache } from './gemini-cache.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy_key' });

export class AIMarketService {
  static async analyzeToken(tokenData: any) {
    const cacheKey = `market_${tokenData.token}`;
    
    const cached = GeminiCache.get(cacheKey);
    if (cached) return cached;

    try {
      const prompt = `Analyze the following DeepBook market data for ${tokenData.token}:\n${JSON.stringify(tokenData)}\n\nProvide output in JSON format with fields: sentiment (Bullish, Bearish, Neutral), confidence (0-100), expectedMove, recommendation.`;
      
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
      console.log('--- GROQ AI RESPONSE ---', text);
      const rawResult = JSON.parse(text);
      
      // Map keys case-insensitively just in case
      const result = {
        sentiment: rawResult.sentiment || rawResult.Sentiment || 'Neutral',
        confidence: rawResult.confidence || rawResult.Confidence || 50,
        expectedMove: rawResult.expectedMove || rawResult.ExpectedMove || '0%',
        recommendation: rawResult.recommendation || rawResult.Recommendation || 'No clear recommendation'
      };
      
      GeminiCache.set(cacheKey, result);
      return result;
    } catch (error: any) {
      console.warn('⚠️ AI Analysis failed. Falling back to structured response.', error?.message || error);
      
      const fallback = {
        sentiment: "Neutral",
        confidence: 0,
        expectedMove: "0%",
        recommendation: "AI Analysis Temporarily Unavailable"
      };
      // Do not cache the hard failure so it can retry later, but we can return it.
      return fallback;
    }
  }
}
