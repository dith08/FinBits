import React, { useState } from 'react';
import { ChevronDown, X, Clock, Target, Calendar, Tag, Loader2 } from 'lucide-react';
import { productivityService } from '../../services/productivityService';

interface AddHabitModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ onClose, onSuccess }) => {
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [category, setCategory] = useState('Health');
  const [note, setNote] = useState('');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [progressTarget, setProgressTarget] = useState(100);
  const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const frequencyOptions: Array<'Daily' | 'Weekly' | 'Monthly'> = ['Daily', 'Weekly', 'Monthly'];
  const categoryOptions = [
    { value: 'Health', color: 'text-green-400', bg: 'bg-green-500/10' },
    { value: 'Productivity', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { value: 'Study', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { value: 'Sport', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { value: 'Finance', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { value: 'Mindfulness', color: 'text-pink-400', bg: 'bg-pink-500/10' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!habitName.trim()) {
      setError('Nama habit harus diisi!');
      return;
    }

    if (progressTarget < 1 || progressTarget > 100) {
      setError('Progress target harus antara 1-100%');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        habit_name: habitName,
        frequency: frequency,
        category: category,
        note: note,
        reminder_time: reminderTime + ':00',
        progress_target: progressTarget
      };
      
      await productivityService.addHabit(payload);
      
      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Gagal menambah habit');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    const found = categoryOptions.find(c => c.value === cat);
    return found || { color: 'text-gray-400', bg: 'bg-gray-500/10' };
  };

  return (
    <div 
  className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 overflow-y-auto animate-fadeIn"
  onClick={handleBackdropClick}
>
  <div 
    className="w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black rounded-2xl md:rounded-3xl p-5 md:p-6 border border-gray-800 shadow-2xl shadow-emerald-500/5 my-auto animate-slideUp relative"
  >
    <div className="flex items-center gap-4 mb-6 relative">
      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg">
        <Target className="w-6 h-6 text-white" />
      </div>
      <div className="text-left flex-1">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          Create New Habit
        </h1>
        <p className="text-gray-400 text-xs md:text-sm">Bangun kebiasaan baru sekarang.</p>
      </div>
      <button 
        onClick={onClose}
        className="flex-shrink-0 p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
      >
        <X className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>

    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm animate-pulse">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium flex items-center gap-2">
              Habit Name
            </label>
            <input 
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              placeholder="Contoh: Olahraga Pagi"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 relative">
              <label className="text-white text-sm font-medium">Frequency</label>
              <div 
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white cursor-pointer flex items-center justify-between hover:border-emerald-500 transition-all text-sm"
                onClick={() => { setShowFrequencyDropdown(!showFrequencyDropdown); setShowCategoryDropdown(false); }}
              >
                <span>{frequency}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFrequencyDropdown ? 'rotate-180' : ''}`} />
              </div>
              {showFrequencyDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFrequencyDropdown(false)} />
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                    {frequencyOptions.map((option) => (
                      <button 
                        key={option} 
                        type="button"
                        onClick={() => { setFrequency(option); setShowFrequencyDropdown(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-emerald-900/30 text-white text-sm transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2 relative">
              <label className="text-white text-sm font-medium">Category</label>
              <div 
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white cursor-pointer flex items-center justify-between hover:border-emerald-500 transition-all text-sm"
                onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowFrequencyDropdown(false); }}
              >
                <span className={`px-2 py-0.5 rounded-md ${getCategoryColor(category).bg} ${getCategoryColor(category).color} text-xs`}>
                  {category}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </div>
              {showCategoryDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                    {categoryOptions.map((option) => (
                      <button 
                        key={option.value} 
                        type="button"
                        onClick={() => { setCategory(option.value); setShowCategoryDropdown(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-emerald-900/30 text-white text-sm transition-colors"
                      >
                        {option.value}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" /> Reminder
            </label>
            <input 
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="text-white font-medium">Target</label>
              <span className="text-emerald-400 font-bold">{progressTarget}%</span>
            </div>
            <input 
              type="range"
              min="1"
              max="100"
              value={progressTarget}
              onChange={(e) => setProgressTarget(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              disabled={loading}
            />
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${progressTarget}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="md:col-span-2">
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all h-20 md:h-24 resize-none text-sm"
            placeholder="Catatan kecil..."
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-2 justify-end">
          <button 
            type="submit" 
            disabled={loading || !habitName.trim()}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all font-bold flex items-center justify-center gap-2 order-1 md:order-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
            Create Habit
          </button>
          <button 
            type="button" 
            onClick={onClose}
            className="w-full py-3 text-gray-400 hover:text-white transition-all text-sm order-2 md:order-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        /* Custom time input styling */
        input[type="time"]::-webkit-calendar-picker-indicator {
          background: none;
          display: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #0f172a;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #0f172a;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default AddHabitModal;