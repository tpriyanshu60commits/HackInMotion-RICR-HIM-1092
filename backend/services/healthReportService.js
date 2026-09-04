import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SUPPORTED_MODELS = [
  process.env.AI_MODEL || 'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b',
];

const validateReportSchema = (data) => {
  if (!data.riskLevel || !['Good', 'Moderate', 'Unhealthy', 'Hazardous'].includes(data.riskLevel)) {
    // Normalize or fallback if close
    if (data.riskLevel && typeof data.riskLevel === 'string') {
      const lower = data.riskLevel.toLowerCase();
      if (lower.includes('good') || lower.includes('low')) data.riskLevel = 'Good';
      else if (lower.includes('mod')) data.riskLevel = 'Moderate';
      else if (lower.includes('unhealthy') || lower.includes('high')) data.riskLevel = 'Unhealthy';
      else if (lower.includes('hazard') || lower.includes('severe') || lower.includes('crit')) data.riskLevel = 'Hazardous';
      else return false;
    } else {
      return false;
    }
  }

  if (!data.summary || typeof data.summary !== 'string') {
    return false;
  }

  if (!data.keyConcern || typeof data.keyConcern !== 'string') {
    return false;
  }

  if (!Array.isArray(data.dosAndDonts) || !Array.isArray(data.symptomWatch)) {
    return false;
  }

  return true;
};

// Vision API and medical image analysis removed

export const generateAIReport = async (profile, environmentData, attempts = 0) => {
  const modelIndex = Math.min(attempts, SUPPORTED_MODELS.length - 1);
  const currentModel = SUPPORTED_MODELS[modelIndex];

  try {
    const SYSTEM_PROMPT = `You are a health-risk AI assistant.
Your task is to analyze the user's health profile and the current environmental data, and generate a personalized health report.

STRICT RESPONSE RULES:
1. You MUST output your response purely in valid JSON format.
2. Ensure the JSON exactly matches the following schema:
{
  "riskLevel": "Good | Moderate | Unhealthy | Hazardous",
  "summary": "String (1-2 sentences summarizing the overall safety for this user).",
  "keyConcern": "String (the main pollutant or weather factor of concern for them).",
  "dosAndDonts": ["String", "String", "String"],
  "symptomWatch": ["String", "String", "String"],
  "bestTimeWindow": "String (e.g., 'Before 8 AM' or 'Anytime')",
  "cityComparisonNote": null
}
3. Be specific to the pollutant/conditions given. Avoid generic advice.
4. Avoid medical diagnosis language (use terms like 'may experience' instead of 'you have').`;

    const userContentObj = {
      healthProfile: profile,
      environmentData: environmentData,
    };

    const userContent = JSON.stringify(userContentObj);

    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: userContent,
      },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: currentModel,
      temperature: 0.3,
      max_tokens: 1024,
      response_format: {
        type: 'json_object',
      },
    });

    let responseText = chatCompletion.choices[0]?.message?.content || '{}';

    // Strip any markdown code fences if present
    if (responseText.includes('```')) {
      const match = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        responseText = match[1];
      }
    }

    const parsed = JSON.parse(responseText.trim());

    if (!validateReportSchema(parsed)) {
      throw new Error('Schema validation failed');
    }

    return parsed;
  } catch (error) {
    console.error(`Groq AI Report Error with ${currentModel} (Attempt ${attempts + 1}):`, error.message);

    if (attempts < SUPPORTED_MODELS.length - 1) {
      console.log(`Retrying AI report generation with fallback model...`);
      return generateAIReport(profile, environmentData, attempts + 1);
    }

    throw error;
  }
};

