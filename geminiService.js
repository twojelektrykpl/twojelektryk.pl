
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeTask = async (description) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Podsumuj poniższe zgłoszenie serwisowe w 3 krótkich punktach dla technika: "${description}"`,
    });
    return response.text || "Brak podsumowania.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Nie udało się wygenerować podsumowania.";
  }
};

export const suggestWorkTime = async (title, description) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Oszacuj ile minut może zająć wykonanie zadania: "${title} - ${description}". Zwróć tylko liczbę minut.`,
    });
    const match = response.text?.match(/\d+/);
    return match ? parseInt(match[0]) : 60;
  } catch (error) {
    return 60;
  }
};
