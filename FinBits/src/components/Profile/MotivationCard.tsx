import React, { useState, useEffect } from 'react';
import { Edit3, X, Check, Quote, Sparkles } from 'lucide-react';

interface MotivationCardProps {
  motivation?: string;
  onUpdate?: (data: { motivation?: string }) => void;
}

const MotivationCard: React.FC<MotivationCardProps> = ({ 
  motivation = '',
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editMotivation, setEditMotivation] = useState(motivation);

  useEffect(() => {
    setEditMotivation(motivation);
  }, [motivation]);

  const handleSave = () => {
    onUpdate?.({ motivation: editMotivation });
    setIsEditing(false);
  };

  return (
    <div className="group relative w-full max-w-md overflow-hidden">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl group-hover:bg-purple-600/30 transition-all duration-700"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-all duration-700"></div>

      <div className="relative bg-zinc-950/40 backdrop-blur-md rounded-3xl p-8 min-h-[400px] border border-white/10 flex flex-col items-center justify-center shadow-2xl">
        
        {onUpdate && (
          <div className="absolute top-6 right-6 flex gap-3 z-10">
            {isEditing ? (
              <div className="flex bg-zinc-900/80 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-lg">
                <button
                  onClick={() => { setIsEditing(false); setEditMotivation(motivation); }}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-full transition-all"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={handleSave}
                  className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2.5 bg-zinc-900/50 text-zinc-400 hover:text-white border border-white/5 hover:border-white/20 rounded-full transition-all shadow-xl"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>
        )}

        <div className="mb-6 opacity-20">
          <Quote size={40} className="text-purple-400 fill-purple-400" />
        </div>

        <div className="flex items-center gap-2 mb-8">
          <Sparkles size={18} className="text-yellow-500 animate-pulse" />
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">Semangat Harian</h2>
        </div>
        
        {isEditing ? (
          <div className="w-full flex-1 flex flex-col">
            <textarea
              autoFocus
              value={editMotivation}
              onChange={(e) => setEditMotivation(e.target.value)}
              className="w-full flex-1 bg-white/5 text-zinc-100 rounded-2xl p-5 text-center text-lg italic border border-white/10 focus:border-purple-500/50 outline-none resize-none transition-all"
              placeholder="Tuliskan motivasi sakti kamu hari ini?"
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center">
            <p className="text-2xl md:text-3xl font-medium text-zinc-100 text-center leading-[1.4] italic font-serif">
              {motivation ? (
                `“${motivation}”`
              ) : (
                <span className="text-zinc-600 not-italic">Belum ada bahan bakar semangat hari ini...</span>
              )}
            </p>
          </div>
        )}

        <div className="mt-8 w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-50"></div>
      </div>
    </div>
  );
};

export default MotivationCard;