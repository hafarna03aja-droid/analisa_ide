import React, { useState } from 'react';
import { ValidationResult } from '../types';
import ScoreGauge from './ScoreGauge';

interface ResultsDisplayProps {
  result: ValidationResult;
}

type TabKey = 'summary' | 'market' | 'competition' | 'swot' | 'monetization' | 'nextSteps';

// Fix: Moved icon components before their usage in TABS constant to prevent declaration errors.
// --- SVG Icons ---
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const HtmlIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const DocIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const SummaryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const MarketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const CompetitorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-12 0v2" /></svg>;
const SwotIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const MonetizationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const NextStepsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;
const TrendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const DirectCompetitorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const IndirectCompetitorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-12 0v2" /></svg>;
const DifferentiatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l4 4m0 0l4-4m-4 4V3m0 18v-4m-2 2h4m5-16l4 4m0 0l4-4m-4 4V3m0 18v-4m-2 2h4" /></svg>;
const ValidationStepsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const MvpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

const TABS: Record<TabKey, { label: string, icon: React.ReactNode }> = {
  summary: { label: 'Ringkasan', icon: <SummaryIcon /> },
  market: { label: 'Analisis Pasar', icon: <MarketIcon /> },
  competition: { label: 'Kompetitor', icon: <CompetitorIcon /> },
  swot: { label: 'Analisis SWOT', icon: <SwotIcon /> },
  monetization: { label: 'Monetisasi', icon: <MonetizationIcon /> },
  nextSteps: { label: 'Langkah Berikutnya', icon: <NextStepsIcon /> },
};

const Section: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="mb-8">
    <div className="flex items-center mb-4">
      <div className="text-sky-400 mr-3">{icon}</div>
      <h3 className="text-xl font-bold text-slate-200">{title}</h3>
    </div>
    <div className="pl-9">{children}</div>
  </div>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
  <div className="mb-4">
    <h4 className="font-semibold text-slate-300 mb-2">{title}</h4>
    <div className="text-slate-400">{children}</div>
  </div>
);


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('summary');
  const [isCopied, setIsCopied] = useState(false);

  const formatTextForCopy = () => {
    return `
ANALISIS IDE LENGKAP
=========================
SKOR VALIDASI: ${result.validationScore}/10

RINGKASAN EKSEKUTIF
-------------------------
${result.executiveSummary}

ANALISIS PASAR
-------------------------
Ukuran & Potensi Pasar:
${result.marketAnalysis.marketSize}

Tren Pasar Utama:
${result.marketAnalysis.trends.map(item => `- ${item}`).join('\n')}

Profil Target Audiens:
- Demografi: ${result.marketAnalysis.targetAudience.demographics}
- Psikografi: ${result.marketAnalysis.targetAudience.psychographics}
- Masalah Utama (Pain Points):
${result.marketAnalysis.targetAudience.painPoints.map(item => `  - ${item}`).join('\n')}
- Persona Pengguna:
${result.marketAnalysis.targetAudience.userPersonas.map(p => `  * ${p.name}: ${p.description}`).join('\n')}

LANSKAP KOMPETITIF
-------------------------
Kompetitor Langsung:
${result.competitiveLandscape.directCompetitors.map(c => `- ${c.name}: ${c.description}`).join('\n')}

Kompetitor Tidak Langsung:
${result.competitiveLandscape.indirectCompetitors.map(c => `- ${c.name}: ${c.description}`).join('\n')}

Pembeda Utama:
${result.competitiveLandscape.differentiators.map(item => `- ${item}`).join('\n')}

ANALISIS SWOT
-------------------------
Kekuatan (Strengths):
${result.swotAnalysis.strengths.map(item => `- ${item}`).join('\n')}

Kelemahan (Weaknesses):
${result.swotAnalysis.weaknesses.map(item => `- ${item}`).join('\n')}

Peluang (Opportunities):
${result.swotAnalysis.opportunities.map(item => `- ${item}`).join('\n')}

Ancaman (Threats):
${result.swotAnalysis.threats.map(item => `- ${item}`).join('\n')}

STRATEGI MONETISASI
-------------------------
Model Utama:
${result.monetizationStrategies.primaryModels.map(item => `- ${item}`).join('\n')}

Model Sekunder:
${result.monetizationStrategies.secondaryModels.map(item => `- ${item}`).join('\n')}

LANGKAH BERIKUTNYA
-------------------------
Langkah Validasi:
${result.actionableNextSteps.validationSteps.map(item => `- ${item}`).join('\n')}

Fitur MVP:
${result.actionableNextSteps.mvpFeatures.map(item => `- ${item}`).join('\n')}
    `.trim();
  };
  
  const handleCopy = () => {
    const formattedText = formatTextForCopy();
    navigator.clipboard.writeText(formattedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }).catch(err => {
      console.error('Gagal menyalin hasil: ', err);
      alert('Gagal menyalin hasil.');
    });
  };

  const createHtmlContent = () => {
    const listify = (items: string[]) => items.map(item => `<li>${item}</li>`).join('');
    const competitorList = (items: {name: string, description: string}[]) => items.map(item => `<li><strong>${item.name}:</strong> ${item.description}</li>`).join('');
    const personaList = (items: {name: string, description: string}[]) => items.map(item => `<div class="persona"><h4>${item.name}</h4><p>${item.description}</p></div>`).join('');
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Analisis Ide AI</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }
          h1 { font-size: 28px; color: #000; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; }
          h2 { font-size: 22px; color: #1e293b; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 40px;}
          h3 { font-size: 18px; color: #334155; margin-top: 30px; }
          ul { list-style-type: disc; margin-left: 20px; }
          li { margin-bottom: 10px; }
          strong { font-weight: bold; color: #000; }
          .summary { background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; }
          .persona { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 15px; margin-top: 10px;}
        </style>
      </head>
      <body>
        <h1>Laporan Analisis Ide</h1>
        <h2>Skor Validasi: ${result.validationScore}/10</h2>
        <div class="summary">
          <h3>Ringkasan Eksekutif</h3>
          <p>${result.executiveSummary}</p>
        </div>
        
        <h2>Analisis Pasar</h2>
        <h3>Ukuran & Potensi Pasar</h3><p>${result.marketAnalysis.marketSize}</p>
        <h3>Tren Pasar Utama</h3><ul>${listify(result.marketAnalysis.trends)}</ul>
        <h3>Profil Target Audiens</h3>
        <p><strong>Demografi:</strong> ${result.marketAnalysis.targetAudience.demographics}</p>
        <p><strong>Psikografi:</strong> ${result.marketAnalysis.targetAudience.psychographics}</p>
        <h4>Masalah Utama (Pain Points):</h4><ul>${listify(result.marketAnalysis.targetAudience.painPoints)}</ul>
        <h4>Persona Pengguna:</h4>${personaList(result.marketAnalysis.targetAudience.userPersonas)}

        <h2>Lanskap Kompetitif</h2>
        <h3>Kompetitor Langsung</h3><ul>${competitorList(result.competitiveLandscape.directCompetitors)}</ul>
        <h3>Kompetitor Tidak Langsung</h3><ul>${competitorList(result.competitiveLandscape.indirectCompetitors)}</ul>
        <h3>Pembeda Utama (USP)</h3><ul>${listify(result.competitiveLandscape.differentiators)}</ul>

        <h2>Analisis SWOT</h2>
        <h3>Kekuatan</h3><ul>${listify(result.swotAnalysis.strengths)}</ul>
        <h3>Kelemahan</h3><ul>${listify(result.swotAnalysis.weaknesses)}</ul>
        <h3>Peluang</h3><ul>${listify(result.swotAnalysis.opportunities)}</ul>
        <h3>Ancaman</h3><ul>${listify(result.swotAnalysis.threats)}</ul>
        
        <h2>Strategi Monetisasi</h2>
        <h3>Model Utama</h3><ul>${listify(result.monetizationStrategies.primaryModels)}</ul>
        <h3>Model Sekunder</h3><ul>${listify(result.monetizationStrategies.secondaryModels)}</ul>

        <h2>Langkah Berikutnya</h2>
        <h3>Langkah Validasi</h3><ul>${listify(result.actionableNextSteps.validationSteps)}</ul>
        <h3>Fitur MVP yang Direkomendasikan</h3><ul>${listify(result.actionableNextSteps.mvpFeatures)}</ul>
      </body>
      </html>
    `;
  };

  const handleExportHtml = () => {
    const htmlContent = createHtmlContent();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'analisis-ide.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };
  
  const handleExportDoc = () => {
    const htmlContent = createHtmlContent();
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'analisis-ide.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };


  const TabContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-slate-100">Ringkasan Eksekutif</h2>
            <p className="text-slate-300 mb-8 leading-relaxed">{result.executiveSummary}</p>
            <div className="text-center bg-slate-900/50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-slate-100">Skor Validasi Ide</h2>
                <ScoreGauge score={result.validationScore} />
            </div>
          </div>
        );
      case 'market':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-100">Analisis Pasar</h2>
            <Section title="Ukuran & Potensi Pasar" icon={<ChartIcon />}><p>{result.marketAnalysis.marketSize}</p></Section>
            <Section title="Tren Pasar Utama" icon={<TrendIcon />}><ul className="space-y-3 text-slate-300">{result.marketAnalysis.trends.map((item, i) => <li key={i} className="flex items-start"><span className="text-sky-400 mr-3 mt-1">&#8227;</span><span>{item}</span></li>)}</ul></Section>
            <Section title="Profil Target Audiens" icon={<UsersIcon />}>
              <SubSection title="Demografi"><p>{result.marketAnalysis.targetAudience.demographics}</p></SubSection>
              <SubSection title="Psikografi"><p>{result.marketAnalysis.targetAudience.psychographics}</p></SubSection>
              <SubSection title="Masalah Utama (Pain Points)"><ul className="space-y-3">{result.marketAnalysis.targetAudience.painPoints.map((item, i) => <li key={i} className="flex items-start"><span className="text-amber-400 mr-3 mt-1">&#9888;</span><span>{item}</span></li>)}</ul></SubSection>
              <SubSection title="Persona Pengguna">{result.marketAnalysis.targetAudience.userPersonas.map((persona, i) => (
                    <div key={i} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg mt-2 transition-all hover:border-sky-500">
                        <p className="font-bold text-sky-400">{persona.name}</p>
                        <p className="text-sm text-slate-400">{persona.description}</p>
                    </div>
                ))}</SubSection>
            </Section>
          </div>
        );
      case 'competition':
        const renderCompetitors = (competitors: { name: string; description: string }[]) => (
          <div className="space-y-4">{competitors.map((c, i) => (
            <div key={i}><p className="font-semibold text-slate-300">{c.name}</p><p className="text-slate-400 text-sm">{c.description}</p></div>
          ))}</div>
        );
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-100">Lanskap Kompetitif</h2>
            <Section title="Kompetitor Langsung" icon={<DirectCompetitorIcon />}>{renderCompetitors(result.competitiveLandscape.directCompetitors)}</Section>
            <Section title="Kompetitor Tidak Langsung" icon={<IndirectCompetitorIcon />}>{renderCompetitors(result.competitiveLandscape.indirectCompetitors)}</Section>
            <Section title="Pembeda Utama (USP)" icon={<DifferentiatorIcon />}><ul className="space-y-3 text-slate-300">{result.competitiveLandscape.differentiators.map((item, i) => <li key={i} className="flex items-start"><span className="text-emerald-400 mr-3 mt-1">&#10003;</span><span>{item}</span></li>)}</ul></Section>
          </div>
        );
      case 'swot':
        const renderSwotList = (items: string[], color: string) => (
          <ul className="space-y-2">{items.map((item, i) => <li key={i} className={`flex items-start ${color}`}><span className="mr-3 mt-1">&#8227;</span><span>{item}</span></li>)}</ul>
        );
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-100">Analisis SWOT</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="font-bold text-lg mb-2 text-emerald-400">Kekuatan</h3>
                  {renderSwotList(result.swotAnalysis.strengths, 'text-slate-300')}
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="font-bold text-lg mb-2 text-amber-400">Kelemahan</h3>
                  {renderSwotList(result.swotAnalysis.weaknesses, 'text-slate-300')}
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="font-bold text-lg mb-2 text-sky-400">Peluang</h3>
                  {renderSwotList(result.swotAnalysis.opportunities, 'text-slate-300')}
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="font-bold text-lg mb-2 text-red-400">Ancaman</h3>
                  {renderSwotList(result.swotAnalysis.threats, 'text-slate-300')}
                </div>
            </div>
          </div>
        );
      case 'monetization':
        const renderModels = (models: string[]) => <ul className="space-y-3 text-slate-300">{models.map((item, i) => <li key={i} className="flex items-start"><span className="text-emerald-400 mr-2 font-bold">Rp</span><span>{item}</span></li>)}</ul>;
        return(
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-100">Strategi Monetisasi</h2>
            <Section title="Model Monetisasi Utama" icon={<MonetizationIcon />}>{renderModels(result.monetizationStrategies.primaryModels)}</Section>
            <Section title="Model Monetisasi Sekunder" icon={<MonetizationIcon />}>{renderModels(result.monetizationStrategies.secondaryModels)}</Section>
          </div>
        );
      case 'nextSteps':
        return(
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-100">Langkah Berikutnya</h2>
            <Section title="Langkah Validasi" icon={<ValidationStepsIcon />}><ul className="space-y-3 text-slate-300">{result.actionableNextSteps.validationSteps.map((item, i) => <li key={i} className="flex items-start"><span className="text-sky-400 mr-3 mt-1">&#10140;</span><span>{item}</span></li>)}</ul></Section>
            <Section title="Fitur MVP yang Direkomendasikan" icon={<MvpIcon />}><ul className="space-y-3 text-slate-300">{result.actionableNextSteps.mvpFeatures.map((item, i) => <li key={i} className="flex items-start"><span className="text-emerald-400 mr-3 mt-1">&#10003;</span><span>{item}</span></li>)}</ul></Section>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100">Laporan Analisis</h2>
         <div className="flex gap-2">
          <button onClick={handleCopy} disabled={isCopied} className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-3 rounded-lg transition-all duration-200 text-sm flex items-center gap-2 disabled:opacity-50" aria-label="Salin hasil"><ClipboardIcon /><span>{isCopied ? 'Tersalin!' : 'Salin'}</span></button>
          <button onClick={handleExportHtml} className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-3 rounded-lg transition-all duration-200 text-sm flex items-center gap-2" aria-label="Ekspor hasil HTML"><HtmlIcon /><span>HTML</span></button>
          <button onClick={handleExportDoc} className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-3 rounded-lg transition-all duration-200 text-sm flex items-center gap-2" aria-label="Ekspor hasil DOC"><DocIcon /><span>DOC</span></button>
        </div>
      </div>

      <div className="lg:flex lg:gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-1/4 mb-6 lg:mb-0">
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {Object.entries(TABS).map(([key, {label, icon}]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as TabKey)}
                className={`w-full flex-shrink-0 lg:flex-shrink-1 text-left p-3 rounded-lg transition-all duration-200 text-sm font-semibold flex items-center gap-3 ${activeTab === key ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50'}`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="lg:w-3/4 bg-slate-800/50 border border-slate-700 rounded-xl p-6 md:p-8 min-h-[400px] overflow-hidden">
          <div key={activeTab} className="animate-fade-in-up">
            <TabContent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResultsDisplay;