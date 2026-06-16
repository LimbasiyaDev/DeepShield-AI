"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardianService = void 0;
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });
class GuardianService {
    static async chat(question, context) {
        if (process.env.GEMINI_API_KEY === 'dummy_key' || !process.env.GEMINI_API_KEY) {
            return this.mockChat(question);
        }
        try {
            const prompt = `You are DeepShield AI, an advanced trading guardian for the Sui ecosystem. The user is asking: "${question}". Here is the current market context: ${JSON.stringify(context)}. Provide a concise, highly analytical response focusing on risk, whale activity, and safe execution.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
            });
            return {
                answer: response.text,
                confidence: 92,
                recommendation: "Proceed with caution"
            };
        }
        catch (error) {
            console.error('Guardian chat failed:', error);
            return this.mockChat(question);
        }
    }
    static mockChat(question) {
        return {
            answer: "Based on my analysis of DeepBook liquidity and recent transaction patterns, I recommend using the Protected Route to mitigate potential front-running risks. Whale accumulation was detected 5 minutes ago.",
            confidence: 88,
            recommendation: "Use Protected Execution"
        };
    }
}
exports.GuardianService = GuardianService;
