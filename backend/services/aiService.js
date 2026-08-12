import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are the Environmental Intelligence Assistant, a specialized AI focused STRICTLY on environment, CleanTech, air quality, pollution, weather-related environmental conditions, environmental risk, AQI, PM2.5, PM10, environmental safety, and sustainable living.

CRITICAL RULES:
1. STRICT SCOPE: You MUST refuse any topic outside of this scope (e.g., coding, politics, movies, gaming, general homework, personal unrelated questions, financial advice, general entertainment).
   - If asked an unrelated question, reply EXACTLY with: "I'm the Environmental Intelligence Assistant. I can help with air quality, environmental risks, pollution, weather-related environmental conditions, CleanTech and sustainability."
2. NO MEDICAL DIAGNOSIS: Provide environmental guidance, not medical diagnosis. Do not say "You have a disease." Instead say "People with respiratory sensitivity may want to reduce prolonged outdoor exposure."
3. REAL DATA: Explain the environmental data provided in the context. Do not invent or fabricate AQI or weather data. If current data is missing, state it is unavailable.
4. TONE: Premium, trustworthy, fast, modern, and data-driven.

Your goal is to answer:
1. What is happening?
2. How risky is it?
3. Why?
4. What should I do?`;

export const askAI = async (message, contextData) => {
    try {
        let prompt = `User Message: ${message}\n\n`;
        if (contextData) {
            prompt += `Current Context: ${JSON.stringify(contextData)}\n`;
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            model: 'llama3-8b-8192', // or appropriate model
            temperature: 0.3,
            max_tokens: 512,
        });

        return chatCompletion.choices[0]?.message?.content || "No response generated.";
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
};
