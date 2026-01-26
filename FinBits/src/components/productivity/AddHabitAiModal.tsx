import React, { useState } from 'react';
import { Sparkles, X, Brain, Wand2, Loader2 } from 'lucide-react';
import { productivityService } from '../../services/productivityService';

interface AddHabitAIProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AddHabitAI: React.FC<AddHabitAIProps> = ({ onClose, onSuccess }) => {
  const [targetText, setTargetText] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async () => {
    if (!targetText.trim()) {
      setError('Target habit harus diisi!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await productivityService.addHabitAI({
        targetText: targetText,
        description: description
      });
      
      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const aiTips = [
    "Analisis pola terbaik",
    "Jadwal fleksibel",
    "Reminder optimal",
    "Kategori otomatis"
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div 
        className="w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 md:p-10 border border-emerald-500/30 relative shadow-2xl shadow-emerald-500/10 animate-slideUp overflow-y-auto max-h-[95vh]"
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            AI Habit Assistant
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Rancang habit optimal dalam hitungan detik
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm animate-pulse">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Target Habit Input */}
              <div className="space-y-2">
                <label className="text-white font-medium flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-emerald-400" />
                  Target Habit
                </label>
                <input 
                  type="text"
                  value={targetText}
                  onChange={(e) => setTargetText(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  placeholder="Contoh: Olahraga pagi jam 6..."
                  disabled={loading}
                />
                <div className="text-right">
                  <span className={`text-[10px] ${targetText.length > 200 ? 'text-red-400' : 'text-gray-500'}`}>
                    {targetText.length}/200 karakter
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/10 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-emerald-300 font-medium text-xs mb-2 uppercase tracking-wider">AI Capabilities:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {aiTips.map((tip, index) => (
                        <div key={index} className="text-gray-300 text-[11px] flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0"></div>
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              <label className="text-white font-medium">Deskripsi Detail</label>
              <textarea 
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-3 bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 resize-none transition-all  min-h-[150px]"
                placeholder="Jelaskan detail: kapan, di mana, dan metodenya..."
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-800">
            <button 
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-gray-800/50 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all disabled:opacity-50 font-medium order-2 sm:order-1"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading || !targetText.trim()}
              className="flex-[2] py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold flex items-center justify-center gap-2 order-1 sm:order-2 shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI sedang meracik...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Generate Habit Sekarang
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
};

export default AddHabitAI;