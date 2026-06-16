"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIMarketService = void 0;
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });
class AIMarketService {
    static async analyzeToken(tokenData) {
        if (process.env.GEMINI_API_KEY === 'dummy_key' || !process.env.GEMINI_API_KEY) {
            return this.mockAnalysis(tokenData);
        }
        try {
            const prompt = `Analyze the following DeepBook market data for ${tokenData.token}:\n${JSON.stringify(tokenData)}\n\nProvide output in JSON format with fields: sentiment (Bullish, Bearish, Neutral), confidence (0-100), expectedMove, recommendation.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            const text = response.text || "{}";
            const cleanedText = text.replace(/```json/g, "").replace(/```/g, "");
            return JSON.parse(cleanedText);
        }
        catch (error) {
            console.error('AI Analysis failed:', error);
            return this.mockAnalysis(tokenData);
        }
    }
    static mockAnalysis(tokenData) {
        return {
            sentiment: "Bullish",
            confidence: 85,
            expectedMove: "+5.2%",
            recommendation: "Accumulate on dips. High probability of upward continuation."
        };
    }
}
exports.AIMarketService = AIMarketService;
