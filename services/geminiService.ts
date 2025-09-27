
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable. Using mock data.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateJsonFromPrompt = async (prompt: string): Promise<any | null> => {
  if (!API_KEY) {
    console.error("Cannot call Gemini API: API key is missing.");
    // Return a mock response for UI development without an API key
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return {
      summary: "This is a mock AI summary because no API key was provided. The final score is decent, but there are clear areas for improvement, especially in process compliance which is critical.",
      recommendations: [
        "Focus on improving KYC/AML checks to ensure full compliance.",
        "Review premium calculation accuracy to avoid financial discrepancies.",
        "Ensure timely system updation for better tracking and reporting."
      ]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Returning a mock response on error as well for robustness
    return {
      summary: "An error occurred while generating AI insights. This is a mock response.",
      recommendations: [
        "Please check the console for API error details.",
        "Ensure the API key is valid and has the necessary permissions.",
      ]
    };
  }
};
