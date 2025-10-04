
export interface ValidationResult {
  validationScore: number;
  opportunities: string[];
  risks: string[];
  audienceProfile: {
    demographics: string;
    painPoints: string[];
  };
}

// Vite provides import.meta.env; declare the shape we use to satisfy TypeScript
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
