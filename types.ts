export interface ValidationResult {
  executiveSummary: string;
  validationScore: number;
  marketAnalysis: {
    marketSize: string;
    trends: string[];
    targetAudience: {
      demographics: string;
      psychographics: string;
      painPoints: string[];
      userPersonas: {
        name: string;
        description: string;
      }[];
    };
  };
  competitiveLandscape: {
    directCompetitors: {
      name: string;
      description: string;
    }[];
    indirectCompetitors: {
      name: string;
      description: string;
    }[];
    differentiators: string[];
  };
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  monetizationStrategies: {
    primaryModels: string[];
    secondaryModels: string[];
  };
  actionableNextSteps: {
    validationSteps: string[];
    mvpFeatures: string[];
  };
}
