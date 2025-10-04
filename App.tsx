
import React, { useState, useCallback } from 'react';
import { ValidationResult } from './types';
import { validateIdea } from './services/geminiService';
import IdeaInputForm from './components/IdeaInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (idea: string) => {
    if (!idea.trim()) {
      setError("Harap masukkan ide untuk divalidasi.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await validateIdea(idea);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan tak terduga.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-emerald-400 pb-2">
            AI Analis Ide
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Ubah ide brilianmu menjadi produk nyata. Ayo analisis potensinya.
          </p>
        </header>

        <main>
          <IdeaInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          
          <div className="mt-8 md:mt-12">
            {isLoading && <Loader />}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
                <p className="font-bold">Analisis Gagal</p>
                <p>{error}</p>
              </div>
            )}
            {result && !isLoading && (
              <div className="animate-fade-in-up">
                <ResultsDisplay result={result} />
              </div>
            )}
            {!isLoading && !error && !result && (
              <div className="text-center text-slate-500 p-8 border-2 border-dashed border-slate-700 rounded-lg">
                 <p>Hasil analisis idemu akan muncul di sini.</p>
              </div>
            )}
          </div>
        </main>

        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Dibuat 24 Learning Centre</p>
        </footer>
      </div>
    </div>
  );
};

export default App;