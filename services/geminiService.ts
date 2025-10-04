import { GoogleGenAI, Type } from "@google/genai";
import { ValidationResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const validationSchema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: {
      type: Type.STRING,
      description: "Ringkasan eksekutif 2-3 kalimat yang menyoroti potensi inti ide dan kesimpulan utama dari analisis.",
    },
    validationScore: {
      type: Type.INTEGER,
      description: "Skor dari 1 sampai 10 yang menunjukkan potensi ide, di mana 1 sangat rendah dan 10 sangat tinggi.",
    },
    marketAnalysis: {
      type: Type.OBJECT,
      properties: {
        marketSize: {
          type: Type.STRING,
          description: "Estimasi ukuran pasar dan potensi pertumbuhan, jika ada data yang relevan (misalnya, 'Pasar global untuk [industri] diperkirakan mencapai X pada tahun Y').",
        },
        trends: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Daftar 2-4 tren pasar utama yang mendukung ide ini.",
        },
        targetAudience: {
          type: Type.OBJECT,
          properties: {
            demographics: {
              type: Type.STRING,
              description: "Deskripsi demografi target audiens (usia, lokasi, pekerjaan, dll.).",
            },
            psychographics: {
              type: Type.STRING,
              description: "Deskripsi psikografis audiens (gaya hidup, nilai, minat, perilaku).",
            },
            painPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Daftar 3-5 masalah spesifik atau 'pain points' yang dihadapi audiens.",
            },
            userPersonas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["name", "description"],
              },
              description: "Satu atau dua persona pengguna fiktif yang mewakili target audiens ideal.",
            },
          },
          required: ["demographics", "psychographics", "painPoints", "userPersonas"],
        },
      },
      required: ["marketSize", "trends", "targetAudience"],
    },
    competitiveLandscape: {
      type: Type.OBJECT,
      properties: {
        directCompetitors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { name: { type: Type.STRING }, description: { type: Type.STRING } },
            required: ["name", "description"],
          },
          description: "Daftar 2-3 kompetitor langsung dengan deskripsi singkat.",
        },
        indirectCompetitors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { name: { type: Type.STRING }, description: { type: Type.STRING } },
            required: ["name", "description"],
          },
          description: "Daftar 2-3 kompetitor tidak langsung atau solusi alternatif.",
        },
        differentiators: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Daftar 2-3 poin pembeda utama (Unique Selling Proposition) yang dapat membuat ide ini menonjol.",
        },
      },
      required: ["directCompetitors", "indirectCompetitors", "differentiators"],
    },
    swotAnalysis: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Kekuatan internal ide." },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Kelemahan internal ide." },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Peluang eksternal di pasar." },
        threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Ancaman eksternal di pasar." },
      },
      required: ["strengths", "weaknesses", "opportunities", "threats"],
    },
    monetizationStrategies: {
      type: Type.OBJECT,
      properties: {
        primaryModels: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Saran 1-2 model monetisasi utama (misalnya, 'Langganan bulanan Rp 50.000', 'Freemium'). Gunakan mata uang Rupiah (Rp) jika menyebutkan harga." },
        secondaryModels: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Saran 1-2 model monetisasi sekunder (misalnya, 'Pasar afiliasi', 'Penjualan data anonim'). Gunakan mata uang Rupiah (Rp) jika menyebutkan harga." },
      },
      required: ["primaryModels", "secondaryModels"],
    },
    actionableNextSteps: {
      type: Type.OBJECT,
      properties: {
        validationSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Daftar langkah-langkah konkret berikutnya untuk memvalidasi ide lebih lanjut." },
        mvpFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Daftar fitur inti yang direkomendasikan untuk Minimum Viable Product (MVP)." },
      },
      required: ["validationSteps", "mvpFeatures"],
    },
  },
  required: [
    "executiveSummary",
    "validationScore",
    "marketAnalysis",
    "competitiveLandscape",
    "swotAnalysis",
    "monetizationStrategies",
    "actionableNextSteps",
  ],
};


export const validateIdea = async (idea: string): Promise<ValidationResult> => {
  const prompt = `
    Anda adalah seorang analis bisnis dan produk strategis yang sangat berpengalaman. Tugas Anda adalah memberikan analisis kelayakan yang mendalam dan komprehensif untuk ide produk digital.
    
    Analisis ide berikut untuk seorang calon pendiri startup: "${idea}".

    Berikan analisis yang sangat detail dan terstruktur dalam Bahasa Indonesia yang profesional namun mudah dipahami.
    Cakupan analisis harus mencakup:
    1.  Ringkasan Eksekutif: Kesimpulan utama dari analisis Anda.
    2.  Analisis Pasar: Ukuran pasar, tren yang relevan, dan profil audiens yang sangat detail (demografi, psikografi, masalah utama, dan persona pengguna).
    3.  Lanskap Kompetitif: Identifikasi kompetitor langsung dan tidak langsung, serta jelaskan faktor pembeda utama (USP).
    4.  Analisis SWOT: Kekuatan, Kelemahan, Peluang, dan Ancaman.
    5.  Strategi Monetisasi: Sarankan model pendapatan primer dan sekunder. Jika ada saran harga, gunakan mata uang Rupiah (Rp).
    6.  Langkah-Langkah Berikutnya: Berikan saran konkret untuk validasi lebih lanjut dan fitur inti untuk MVP.
    
    Berdasarkan analisis lengkap Anda, berikan juga "Skor Validasi" dari 1 hingga 10.

    PENTING: Sajikan seluruh analisis Anda secara eksklusif dalam format JSON yang telah ditentukan. Jangan sertakan teks atau format markdown apa pun di luar objek JSON, seperti \`\`\`json.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: validationSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // More comprehensive validation
    if (
      typeof result.executiveSummary !== 'string' ||
      typeof result.validationScore !== 'number' ||
      !result.marketAnalysis ||
      !result.competitiveLandscape ||
      !result.swotAnalysis ||
      !result.monetizationStrategies ||
      !result.actionableNextSteps
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