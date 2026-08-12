import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are VerdantX Environmental Intelligence Assistant. Understand the user's exact question and answer it directly, accurately, and concisely. Use available application and real-time environmental data when relevant. Never fabricate data. Maintain conversation context and understand follow-up questions. Do not repeat your introduction or capabilities unless explicitly asked. Do not provide unrelated information. Match the response length to the user's request. If required data is unavailable, clearly say so instead of guessing.

CRITICAL RULES:
1. STRICT RELEVANCE: Answer ONLY what the user asks. If they ask about PM2.5, don't explain AQI unless they ask.
2. CONCISE: Simple question = 1-3 sentences. Detailed question = detailed structured answer.
3. CONVERSATION CONTEXT: Understand follow-up questions (e.g., "Is it dangerous?" refers to the previous topic).
4. NON-ENVIRONMENTAL QUESTIONS: Answer them briefly if possible (e.g. "What is JavaScript?"), or politely state you specialize in environment/CleanTech.
5. NO REPETITION: NEVER replace the user's question with your introduction. NEVER say "I am an Environmental Intelligence Assistant" unless explicitly asked "Who are you?".
6. NEVER HALLUCINATE: Do not guess AQI, temp, or weather. If it's not provided in the "Current Context", state you don't have current data.`;

export const askAI = async (message, contextData, previousMessages = []) => {
    try {
        let systemMessageContent = SYSTEM_PROMPT;
        if (contextData) {
            systemMessageContent += `\n\nCurrent Context provided by system:\n${JSON.stringify(contextData)}`;
        }

        const messages = [
            { role: 'system', content: systemMessageContent },
            ...previousMessages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: message }
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.1-8b-instant', 
            temperature: 0.3,
            max_tokens: 512,
        });

        return chatCompletion.choices[0]?.message?.content || "No response generated.";
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
};

export const askAIStream = async (message, contextData, previousMessages = []) => {
    try {
        let systemMessageContent = SYSTEM_PROMPT;
        if (contextData) {
            systemMessageContent += `\n\nCurrent Context provided by system:\n${JSON.stringify(contextData)}`;
        }

        const messages = [
            { role: 'system', content: systemMessageContent },
            ...previousMessages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: message }
        ];

        const stream = await groq.chat.completions.create({
            messages,
            model: 'llama-3.1-8b-instant', 
            temperature: 0.3,
            max_tokens: 512,
            stream: true,
        });

        return stream;
    } catch (error) {
        console.error("Groq Stream Error:", error);
        throw error;
    }
};
