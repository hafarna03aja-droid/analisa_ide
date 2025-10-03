
export interface ValidationResult {
  validationScore: number;
  opportunities: string[];
  risks: string[];
  audienceProfile: {
    demographics: string;
    painPoints: string[];
  };
}
