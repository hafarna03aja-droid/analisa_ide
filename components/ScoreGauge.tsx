
import React from 'react';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const percentage = (score / 10) * 100;
  const rotation = -90 + (percentage * 1.8);
  const circumference = 2 * Math.PI * 52; // 2 * pi * radius
  const strokeDashoffset = circumference - (percentage / 100) * (circumference / 2); // Half circle

  const getColor = (s: number) => {
    if (s <= 3) return 'stroke-red-500';
    if (s <= 6) return 'stroke-yellow-500';
    return 'stroke-emerald-500';
  };

  const getTextColor = (s: number) => {
    if (s <= 3) return 'text-red-500';
    if (s <= 6) return 'text-yellow-500';
    return 'text-emerald-500';
  };

  const getFeedback = (s: number) => {
    if (s <= 3) return 'Risiko Tinggi';
    if (s <= 6) return 'Perlu Riset';
    if (s <= 8) return 'Menjanjikan';
    return 'Potensi Tinggi';
  };

  const colorClass = getColor(score);
  const textColorClass = getTextColor(score);
  const feedbackText = getFeedback(score);

  return (
    <div className="relative w-52 h-32 mx-auto flex flex-col items-center justify-end">
      <svg className="absolute top-0 w-full h-full" viewBox="0 0 120 65">
        {/* Background Arc */}
        <path
          d="M10 60 A 50 50 0 0 1 110 60"
          fill="none"
          strokeWidth="10"
          className="stroke-slate-700"
          strokeLinecap="round"
        />
        {/* Foreground Arc */}
        <path
          d="M10 60 A 50 50 0 0 1 110 60"
          fill="none"
          strokeWidth="10"
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
          strokeDasharray={circumference / 2}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className={`absolute bottom-0 text-5xl font-extrabold ${textColorClass}`}>{score}<span className="text-2xl text-slate-400">/10</span></div>
      <p className="absolute bottom-[-20px] text-sm font-semibold text-slate-300">{feedbackText}</p>
    </div>
  );
};

export default ScoreGauge;
