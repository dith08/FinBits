import React, { useState } from 'react';
import { X, ChevronDown, Target, Calendar, Tag, Clock, Loader2 } from 'lucide-react';
import { productivityService } from '../../services/productivityService';
import type { HabitItem } from '../../types/productivity';

interface EditHabitModalProps {
  habit: HabitItem;
  onClose: () => void;
  onSave: () => void;
}

const EditHabitModal: React.FC<EditHabitModalProps> = ({ habit, onClose, onSave }) => {
  const [habitName, setHabitName] = useState(habit.habit_name);
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>(habit.frequency as 'Daily' | 'Weekly' | 'Monthly');
  const [category, setCategory] = useState(habit.category);
  const [note, setNote] = useState(habit.note || '');
  const [reminderTime, setReminderTime] = useState(habit.reminder_time?.slice(0, 5) || '08:00');
  const [progressTarget, setProgressTarget] = useState(habit.progress_target);
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

  const getCategoryColor = (cat: string) => {
    const found = categoryOptions.find(c => c.value === cat);
    return found || { color: 'text-gray-400', bg: 'bg-gray-500/10' };
  };

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
      await productivityService.updateHabit(habit.habit_id, {
        habit_name: habitName,
        frequency: frequency,
        category: category,
        note: note,
        reminder_time: reminderTime + ':00',
        progress_target: progressTarget
      });
      
      onSave();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
  className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 overflow-y-auto animate-fadeIn"
  onClick={handleBackdropClick}
>
  <div 
    className="w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black rounded-2xl md:rounded-3xl p-5 md:p-6 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 my-auto animate-slideUp relative"
  >
    <button 
      onClick={onClose}
      className="absolute right-3 top-3 md:right-5 md:top-5 p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all z-10"
    >
      <X className="w-4 h-4 md:w-5 md:h-5" />
    </button>

    <div className="flex items-center gap-4 mb-6 border-b border-gray-800 pb-4">
      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg">
        <Target className="w-6 h-6 text-white" />
      </div>
      <div className="text-left">
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          Edit Habit
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] bg-emerald-900/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20">
            ID: #{habit.habit_id}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${getCategoryColor(category).bg} ${getCategoryColor(category).color}`}>
            {category}
          </span>
        </div>
      </div>
    </div>

    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm animate-pulse">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Habit Name</label>
            <input 
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all"
              placeholder="Nama habit..."
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 relative">
              <label className="text-white text-sm font-medium flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-blue-400" /> Frequency
              </label>
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
              <label className="text-white text-sm font-medium flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-purple-400" /> Category
              </label>
              <div 
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white cursor-pointer flex items-center justify-between hover:border-emerald-500 transition-all text-sm"
                onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowFrequencyDropdown(false); }}
              >
                <span className={`px-2 py-0.5 rounded-md ${getCategoryColor(category).bg} ${getCategoryColor(category).color} text-xs`}>
                  {category}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 p-4 rounded-2xl border border-gray-800/50 space-y-4">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-orange-400" /> Reminder
            </label>
            <input 
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Target Progress</span>
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
            <div className="pt-2 border-t border-gray-700/50 mt-2">
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>Current: {habit.progress || 0}%</span>
                <span>Goal: {progressTarget}%</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${habit.progress || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 items-end">
        <div className="md:col-span-2">
          <label className="text-white text-xs font-medium mb-1 block">Notes</label>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all h-20 resize-none text-sm"
            placeholder="Catatan progres..."
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-2">
          <button 
            type="submit" 
            disabled={loading || !habitName.trim()}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 transition-all font-bold flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
            Update Habit
          </button>
          <button 
            type="button" 
            onClick={onClose}
            className="w-full py-2 text-gray-400 hover:text-white transition-all text-xs"
          >
            Cancel Changes
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

export default EditHabitModal;