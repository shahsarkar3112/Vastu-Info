
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ZoneState } from "../types";

/**
 * Performs a comprehensive Vastu Shastra audit in the selected language.
 */
export async function getVastuAnalysis(zones: ZoneState[], language: 'English' | 'Hindi' | 'Marathi' = 'English'): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const layoutDescription = zones.map(z => 
    `${z.direction}: ${z.roomType} (Wall Colors: ${z.wallColors.join(', ')})`
  ).join('\n');

  const langInstruction = {
    'English': 'Respond in English.',
    'Hindi': 'Respond in Hindi (हिंदी).',
    'Marathi': 'Respond in Marathi (मराठी).'
  }[language];

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a Scientific Vastu Audit on this layout:\n${layoutDescription}`,
      config: {
        systemInstruction: `You are an expert Vastu Consultant and Interior Architect. 
        Your task is to provide a "Scientific Vastu Audit Report".
        ${langInstruction}
        Structure your response with these exact headers:
        1. ## Overall Vastu Compliance Score
        2. ## Zone-by-Zone Scientific Analysis
        3. ## Furniture Placement & Interior Suggestions (Suggest where to place beds, sofas, or stoves in each room)
        4. ## Remedial Objects (Specific objects like Copper Pyramids, Mirrors, or specific crystals)
        5. ## Color Grading Audit (Critique the specific wall colors provided based on their directional harmony)
        Tone: Authoritative, helpful, and precise. Use Markdown formatting.`,
      },
    });

    return response.text ?? "Audit failed.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to fetch audit data.";
  }
}

/**
 * Quick AI remedy generator for a specific zone.
 */
export async function getZoneRemedy(zone: ZoneState, language: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const langPrompt = language !== 'English' ? `Respond in ${language}.` : '';
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${langPrompt} Suggest 3 non-structural remedies for a ${zone.roomType} located in the ${zone.direction} zone. Focus on objects and color corrections.`,
    });
    return response.text ?? "No remedies found.";
  } catch {
    return "Error generating remedy.";
  }
}
