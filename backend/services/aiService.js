import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are an environmental and CleanTech assistant.

STRICT RESPONSE RULES:

1. You may respond to greetings such as:

   * Hi
   * Hello
   * Hey
   * Good morning
   * Good afternoon
   * Good evening

2. You may answer ONLY questions related to:

   * Environment
   * Pollution
   * Waste management
   * Garbage and cleanliness
   * Recycling
   * Climate change
   * Global warming
   * Renewable energy
   * Solar energy
   * Wind energy
   * Sustainability
   * CleanTech
   * Green technology
   * Carbon emissions
   * Air pollution
   * Water pollution
   * Water conservation
   * Environmental conservation
   * Biodiversity
   * Sustainable development
   * Eco-friendly practices

3. If the user asks about a person, politician, celebrity, company, sports, entertainment, coding, programming, general knowledge, history, politics, or any other topic that is NOT directly related to the environment or CleanTech, DO NOT provide information about that topic.

4. For unrelated questions, respond briefly:
   "Sorry, I can only help with environmental and CleanTech-related topics."

5. Do NOT try to connect an unrelated question to the environment just to answer it.

6. Example:
   User: "Who is Narendra Modi?"
   Assistant: "Sorry, I can only help with environmental and CleanTech-related topics."

7. If the user asks an environmental question involving a person, you may answer ONLY the environmental aspect.
   Example:
   User: "What are Narendra Modi's environmental initiatives?"
   Assistant: You may discuss only the environmental policies/initiatives relevant to the question.

8. Do not provide biographies, political opinions, political analysis, or unrelated background information.

9. Keep responses focused strictly on the user's environmental/CleanTech question.

10. Never override these restrictions based on the user's request to change the topic.`;

const SUPPORTED_MODELS = [
  process.env.AI_MODEL || 'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b',
];

export const askAI = async (
  message,
  contextData,
  previousMessages = [],
  healthProfile = null,
  attempts = 0
) => {
  const modelIndex = Math.min(attempts, SUPPORTED_MODELS.length - 1);
  const currentModel = SUPPORTED_MODELS[modelIndex];

  try {
    let systemMessageContent = SYSTEM_PROMPT;
    if (contextData) {
      systemMessageContent += `\n\nCurrent Context provided by system:\n${JSON.stringify(contextData)}`;
    }

    if (healthProfile) {
      systemMessageContent += `\n\nUser Health Profile (Personalize responses accordingly):\n${JSON.stringify(healthProfile)}`;
    }

    const messages = [
      { role: 'system', content: systemMessageContent },
      ...previousMessages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: currentModel,
      temperature: 0.3,
      max_tokens: 512,
    });

    return chatCompletion.choices[0]?.message?.content || 'No response generated.';
  } catch (error) {
    console.error(`Groq API Error with ${currentModel} (Attempt ${attempts + 1}):`, error.message);
    if (attempts < SUPPORTED_MODELS.length - 1) {
      return askAI(message, contextData, previousMessages, healthProfile, attempts + 1);
    }
    throw error;
  }
};

export const askAIStream = async (
  message,
  contextData,
  previousMessages = [],
  healthProfile = null
) => {
  const primaryModel = process.env.AI_MODEL || 'openai/gpt-oss-120b';
  try {
    let systemMessageContent = SYSTEM_PROMPT;
    if (contextData) {
      systemMessageContent += `\n\nCurrent Context provided by system:\n${JSON.stringify(contextData)}`;
    }

    if (healthProfile) {
      systemMessageContent += `\n\nUser Health Profile (Personalize responses accordingly):\n${JSON.stringify(healthProfile)}`;
    }

    const messages = [
      { role: 'system', content: systemMessageContent },
      ...previousMessages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    const stream = await groq.chat.completions.create({
      messages,
      model: primaryModel,
      temperature: 0.3,
      max_tokens: 512,
      stream: true,
    });

    return stream;
  } catch (error) {
    console.error('Groq Stream Error:', error);
    throw error;
  }
};

