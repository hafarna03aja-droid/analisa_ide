
import { GoogleGenAI, Type } from "@google/genai";
import { ValidationResult } from '../types';

// =================== KODE DEBUGGING ===================

// Kita cetak seluruh isi env untuk melihat apa saja yang tersedia
console.log("Mencoba membaca environment variables...");
console.log("Isi lengkap dari import.meta.env:", import.meta.env);

// Kita baca variabel spesifik kita
const API_KEY = import.meta.env.VITE_API_KEY;

// Kita cetak nilainya, apakah undefined, kosong, atau ada isinya
console.log("Nilai VITE_API_KEY yang terbaca adalah:", API_KEY);

if (!API_KEY) {
  console.error("ERROR: Variabel VITE_API_KEY tidak ditemukan atau nilainya kosong!");
  // throw new Error("API_KEY environment variable not set"); // Error ini kita matikan sementara agar halaman tidak blank
}

// Kita hanya akan menginisialisasi GoogleGenAI jika API_KEY ada
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
  console.error("Koneksi ke Google AI tidak dapat dibuat karena API Key bermasalah.");
}

// Pastikan Anda juga mengekspor apa yang dibutuhkan oleh file lain
// Contoh:
// export const model = ai ? ai.getGenerativeModel({ model: "gemini-pro" }) : null;
// Sesuaikan dengan apa yang perlu Anda ekspor dari file ini.

// =======================================================

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
    if (!ai) {
      throw new Error("AI client belum terinisialisasi. Periksa VITE_API_KEY di environment Anda.");
    }

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

// Export the AI client so other parts of the app can reuse it if needed.
// Note: `ai` may be null if the environment variable wasn't provided.
export { ai };
