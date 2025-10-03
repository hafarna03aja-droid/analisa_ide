import React, { useState } from 'react';
import { ValidationResult } from '../types';
import ScoreGauge from './ScoreGauge';

interface ResultsDisplayProps {
  result: ValidationResult;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 h-full">
    <div className="flex items-center mb-4">
      <div className="text-sky-400 mr-3">{icon}</div>
      <h3 className="text-xl font-bold text-slate-200">{title}</h3>
    </div>
    {children}
  </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const formattedText = `
Analisis Ide AI
====================

Skor Validasi: ${result.validationScore}/10
--------------------

Peluang:
${result.opportunities.map(item => `- ${item}`).join('\n')}
--------------------

Risiko & Tantangan:
${result.risks.map(item => `- ${item}`).join('\n')}
--------------------

Profil Target Audiens:
  Demografi: ${result.audienceProfile.demographics}

  Masalah Utama (Pain Points):
${result.audienceProfile.painPoints.map(item => `  - ${item}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(formattedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }).catch(err => {
      console.error('Gagal menyalin hasil: ', err);
      alert('Gagal menyalin hasil.');
    });
  };

  const handleExport = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Analisis Ide AI</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; }
          h1 { font-size: 24px; color: #000; }
          h2 { font-size: 20px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 30px;}
          ul { list-style-type: disc; margin-left: 20px; }
          li { margin-bottom: 10px; }
          strong { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Analisis Ide AI</h1>
        <h2>Skor Validasi: ${result.validationScore}/10</h2>
        
        <h2>Peluang</h2>
        <ul>${result.opportunities.map(item => `<li>${item}</li>`).join('')}</ul>

        <h2>Risiko & Tantangan</h2>
        <ul>${result.risks.map(item => `<li>${item}</li>`).join('')}</ul>

        <h2>Profil Target Audiens</h2>
        <p><strong>Demografi:</strong> ${result.audienceProfile.demographics}</p>
        <h3>Masalah Utama (Pain Points):</h3>
        <ul>${result.audienceProfile.painPoints.map(item => `<li>${item}</li>`).join('')}</ul>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'analisis-ide.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };


  return (
    <div className="space-y-6">
      <div className="relative bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
         <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleCopy}
            className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-3 rounded-lg transition-all duration-200 text-sm flex items-center gap-2 disabled:opacity-50"
            aria-label="Salin hasil ke papan klip"
            disabled={isCopied}
          >
            {isCopied ? <CheckIconMini /> : <ClipboardIcon />}
            <span>{isCopied ? 'Tersalin!' : 'Salin'}</span>
          </button>
           <button
            onClick={handleExport}
            className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-3 rounded-lg transition-all duration-200 text-sm flex items-center gap-2"
            aria-label="Ekspor hasil ke dokumen"
          >
            <ExportIcon />
            <span>Ekspor</span>
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-slate-100">Skor Validasi Ide</h2>
        <ScoreGauge score={result.validationScore} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title="Peluang" icon={<CheckIcon />}>
          <ul className="space-y-3 text-slate-300 list-inside">
            {result.opportunities.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-emerald-400 mr-2 mt-1">&#10003;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard title="Risiko & Tantangan" icon={<AlertIcon />}>
          <ul className="space-y-3 text-slate-300 list-inside">
            {result.risks.map((item, index) => (
               <li key={index} className="flex items-start">
                <span className="text-amber-400 mr-2 mt-1">&#9888;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </InfoCard>
      </div>

      <InfoCard title="Profil Target Audiens" icon={<UsersIcon />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-300 mb-1">Demografi:</h4>
            <p className="text-slate-400">{result.audienceProfile.demographics}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-300 mb-1">Masalah Utama (Pain Points):</h4>
            <ul className="space-y-2 text-slate-400 list-inside">
              {result.audienceProfile.painPoints.map((item, index) => (
                <li key={index} className="flex items-start">
                 <span className="text-sky-400 mr-2 mt-1">&#8227;</span>
                 <span>{item}</span>
               </li>
              ))}
            </ul>
          </div>
        </div>
      </InfoCard>
    </div>
  );
};

// SVG Icons
const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const ExportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const CheckIconMini = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default ResultsDisplay;