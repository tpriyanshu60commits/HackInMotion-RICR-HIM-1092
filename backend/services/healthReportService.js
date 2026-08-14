import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const validateReportSchema = (data) => {
    if (!data.riskLevel || !['Good', 'Moderate', 'Unhealthy', 'Hazardous'].includes(data.riskLevel)) return false;
    if (!data.summary || typeof data.summary !== 'string') return false;
    if (!data.keyConcern || typeof data.keyConcern !== 'string') return false;
    if (!Array.isArray(data.dosAndDonts) || !Array.isArray(data.symptomWatch)) return false;
    return true;
};

// Vision API to analyze uploaded medical images
export const analyzeMedicalImages = async (imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) return '';
    
    try {
        console.log(`Analyzing ${imageUrls.length} medical images with Groq Vision...`);
        
        // We can process them in one prompt if we pass multiple image URLs
        const contentBlocks = [
            { type: 'text', text: 'You are a medical data extraction assistant. Analyze these medical reports/images. Extract relevant health conditions, medications, abnormal values, and doctor notes. Return ONLY a concise text summary of the findings. Do NOT give medical advice.' }
        ];

        imageUrls.forEach(url => {
            contentBlocks.push({ type: 'image_url', image_url: { url } });
        });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'user', content: contentBlocks }
            ],
            model: 'llama-3.2-11b-vision-preview', // Note: Check Groq docs if preview model is deprecated
            temperature: 0.2,
            max_tokens: 1024,
        });

        return chatCompletion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq Vision API Error:", error.message);
        throw new Error("Failed to analyze medical images. Please try again.");
    }
};

export const generateAIReport = async (profile, environmentData, extractedMedicalContext = '', attempts = 0) => {
    try {
        let SYSTEM_PROMPT = `You are a health-risk AI assistant.
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

        let userContentObj = {
            healthProfile: profile,
            environmentData: environmentData
        };

        if (extractedMedicalContext) {
            userContentObj.extractedMedicalFindings = extractedMedicalContext;
            SYSTEM_PROMPT += `\n5. The user has uploaded medical reports. The extracted findings are included in the prompt. Strongly consider these findings when assessing risk and providing Do's and Don'ts.`;
        }

        const userContent = JSON.stringify(userContentObj);

        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userContent }
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.3-70b-versatile', 
            temperature: 0.3,
            max_tokens: 1024,
            response_format: { type: "json_object" }
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(responseText);
        
        if (!validateReportSchema(parsed)) {
            throw new Error("Schema validation failed");
        }
        
        return parsed;
    } catch (error) {
        console.error(`Groq AI Report Error (Attempt ${attempts + 1}):`, error.message);
        
        if (attempts < 1) { // Retry once (max 2 total attempts)
            console.log("Retrying AI report generation due to schema or parsing error...");
            return generateAIReport(profile, environmentData, extractedMedicalContext, attempts + 1);
        }
        
        throw error;
    }
};
