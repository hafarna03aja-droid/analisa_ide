
import React, { useState } from 'react';

interface IdeaInputFormProps {
  onAnalyze: (idea: string) => void;
  isLoading: boolean;
}

const IdeaInputForm: React.FC<IdeaInputFormProps> = ({ onAnalyze, isLoading }) => {
  const [idea, setIdea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(idea);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
      <form onSubmit={handleSubmit}>
        <label htmlFor="idea-input" className="block text-lg font-medium text-slate-300 mb-2">
          Masukkan Ide Produk Digitalmu
        </label>
        <textarea
          id="idea-input"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Contoh: 'Aplikasi rencana makan berbasis AI untuk keluarga sibuk' atau 'Platform kolaborasi untuk developer game indie'"
          className="w-full h-32 p-4 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 resize-none text-slate-200 placeholder-slate-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !idea.trim()}
          className="mt-4 w-full flex items-center justify-center bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menganalisis...
            </>
          ) : (
            'Validasi Ide'
          )}
        </button>
      </form>
    </div>
  );
};

export default IdeaInputForm;
