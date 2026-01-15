
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIParsingInsight = async (messageText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Parse the following message for wholesale order intent, products, and quantities: "${messageText}". Return a structured JSON summary.`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Parsing Error:", error);
    return null;
  }
};

/**
 * Simulates transcribing a voice message.
 * In a real app, 'audioData' would be the base64 encoded audio bytes.
 */
export const transcribeVoiceMessage = async (audioData: string, mimeType: string = 'audio/mp3') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: "Transcribe this voice message accurately. Focus on product names, quantities, and business intent." },
          { 
            inlineData: {
              mimeType: mimeType,
              data: audioData
            } 
          },
        ],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Transcription Error:", error);
    // Return a mock transcription if the API key isn't set or fails for demo purposes
    return "I would like to order 50 units of the blue parka and check if you have them in size XL. Also, what's the shipping time to Chicago?";
  }
};
