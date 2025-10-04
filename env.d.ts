/// <reference types="vite/client" />

// Project-specific environment variables used at runtime
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
