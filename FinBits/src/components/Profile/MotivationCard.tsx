import React from 'react';

interface MotivationCardProps {
  habitTitle?: string;
  habitDetail?: string;
}

const MotivationCard: React.FC<MotivationCardProps> = ({ 
  habitTitle = "Habit paling ngaruh minggu ini:",
  habitDetail = "Bangun pagi jam 04.00"
}) => {
  return (
    <div className="bg-zinc-900/50 rounded-2xl p-8 min-h-[400px] border border-zinc-800 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-10 text-white">Motivation</h2>
      <div className="text-center text-gray-300 leading-relaxed max-w-[200px]">
        <p>{habitTitle}</p>
        <p className="font-semibold text-emerald-400 mt-2">{habitDetail}</p>
      </div>
    </div>
  );
};

export default MotivationCard;