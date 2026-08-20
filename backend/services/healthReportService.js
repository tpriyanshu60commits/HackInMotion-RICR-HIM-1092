import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const validateReportSchema = (data) => {
  if (!data.riskLevel || !['Good', 'Moderate', 'Unhealthy', 'Hazardous'].includes(data.riskLevel)) {
    return false;
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
      model: 'openai/gpt-oss-20b',
      temperature: 0.3,
      max_tokens: 1024,
      response_format: {
        type: 'json_object',
      },
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '{}';

    const parsed = JSON.parse(responseText);

    if (!validateReportSchema(parsed)) {
      throw new Error('Schema validation failed');
    }

    return parsed;
  } catch (error) {
    console.error(`Groq AI Report Error (Attempt ${attempts + 1}):`, error.message);

    if (attempts < 1) {
      // Retry once (max 2 total attempts)
      console.log('Retrying AI report generation due to schema or parsing error...');

      return generateAIReport(profile, environmentData, attempts + 1);
    }

    throw error;
  }
};
