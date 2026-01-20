
import { GoogleGenAI } from "@google/genai";

// Funkcja bezpiecznie pobierająca klucz (zapobiega crashowi w przeglądarce)
const getApiKey = () => {
  try {
    // Sprawdza czy klucz jest wstrzyknięty, jeśli nie - używa wpisanego ręcznie
    const envKey = (typeof process !== 'undefined' && process.env?.API_KEY);
    return envKey || "TWÓJ_KLUCZ_GEMINI_TUTAJ"; 
  } catch (e) {
    return "TWÓJ_KLUCZ_GEMINI_TUTAJ";
  }
};

const API_KEY = getApiKey();
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const summarizeTask = async (description: string) => {
  if (API_KEY === "TWÓJ_KLUCZ_GEMINI_TUTAJ") return "Błąd: Skonfiguruj klucz API w geminiService.ts";
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

export const suggestWorkTime = async (title: string, description: string) => {
  if (API_KEY === "TWÓJ_KLUCZ_GEMINI_TUTAJ") return 60;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Oszacuj ile minut może zająć wykonanie zadania: "${title} - ${description}". Zwróć tylko liczbę minut jako cyfry.`,
    });
    const match = response.text?.match(/\d+/);
    return match ? parseInt(match[0]) : 60;
  } catch (error) {
    return 60;
  }
};
