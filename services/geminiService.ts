
import { GoogleGenAI, Type } from "@google/genai";
import { ValidationResult } from '../types';

// Use Vite's recommended way to access env variables on the client: import.meta.env
// This is more reliable during Vite build / on platforms like Vercel than process.env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const validationSchema = {
  type: Type.OBJECT,
  properties: {
    validationScore: {
      type: Type.INTEGER,
      description: "Skor dari 1 sampai 10 yang menunjukkan potensi ide, di mana 1 sangat rendah dan 10 sangat tinggi.",
    },
    opportunities: {
      type: Type.ARRAY,
      description: "Daftar 3-5 peluang utama dan indikator pasar yang positif untuk ide ini.",
      items: { type: Type.STRING },
    },
    risks: {
      type: Type.ARRAY,
      description: "Daftar 3-5 potensi risiko, tantangan, atau kompetitor untuk ide ini.",
      items: { type: Type.STRING },
    },
    audienceProfile: {
      type: Type.OBJECT,
      properties: {
        demographics: {
          type: Type.STRING,
          description: "Ringkasan singkat demografi target audiens (misalnya, usia, lokasi, minat).",
        },
        painPoints: {
          type: Type.ARRAY,
          description: "Daftar 2-3 masalah spesifik atau 'pain points' yang dihadapi audiens yang bisa diatasi oleh ide ini.",
          items: { type: Type.STRING },
        },
      },
      required: ["demographics", "painPoints"],
    },
  },
  required: ["validationScore", "opportunities", "risks", "audienceProfile"],
};


export const validateIdea = async (idea: string): Promise<ValidationResult> => {
  const prompt = `
    Analisis ide produk digital berikut: "${idea}".

    Berikan analisis kelayakan yang komprehensif dalam Bahasa Indonesia yang familiar, mencakup tren pasar, potensi pencarian, kompetitor utama, dan profil target audiens.
    
    Berdasarkan analisis Anda, berikan "Skor Validasi" dari 1 hingga 10, daftar peluang, daftar risiko, dan profil audiens yang terperinci.

    Sajikan seluruh analisis Anda secara eksklusif dalam format JSON yang telah ditentukan. Jangan sertakan format markdown seperti \`\`\`json.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: validationSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Basic validation to ensure the result matches the expected structure
    if (
      typeof result.validationScore !== 'number' ||
      !Array.isArray(result.opportunities) ||
      !Array.isArray(result.risks) ||
      typeof result.audienceProfile?.demographics !== 'string' ||
      !Array.isArray(result.audienceProfile?.painPoints)
    ) {
      throw new Error("Menerima data dengan format yang salah dari API.");
    }

    return result as ValidationResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gagal memvalidasi ide: ${error.message}`);
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui saat validasi ide.");
  }
};
