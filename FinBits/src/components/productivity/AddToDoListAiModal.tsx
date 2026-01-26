import React, { useState } from 'react';
import { Sparkles, X, Brain, Calendar, Clock, Loader2 } from 'lucide-react';
import { productivityService } from '../../services/productivityService';

interface AddTodoListAIModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AddTodoListAIModal: React.FC<AddTodoListAIModalProps> = ({ onClose, onSuccess }) => {
  const [target, setTarget] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reminder, setReminder] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async () => {
    if (!target.trim()) {
      setError('Target harus diisi!');
      return;
    }
    if (!startDate || !endDate) {
      setError('Tanggal mulai dan selesai harus diisi!');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Tanggal selesai harus setelah tanggal mulai!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await productivityService.addTodoAI({
        target: target,
        description: description,
        start_date: startDate,
        end_date: endDate,
        goal_detail_id: 0,
        reminder: reminder
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

  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 animate-fadeIn overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div 
        className="w-full max-w-lg bg-gradient-to-br from-gray-900 to-black rounded-2xl md:rounded-3xl p-5 md:p-8 border border-blue-500/30 relative shadow-2xl shadow-blue-500/10 my-4 max-h-[95vh] overflow-y-auto animate-slideUp"
      >
        <button 
          onClick={onClose}
          className="absolute right-3 top-3 md:right-4 md:top-4 p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all z-10"
        >
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-6 border-b border-gray-800 pb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg flex-shrink-0">
            <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              AI Task Planner
            </h2>
            <p className="text-gray-400 text-xs">Biarkan AI merencanakan To Do List anda</p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-white text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Target Utama
            </label>
            <input 
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
              placeholder="Contoh: Belajar NodeJS..."
              disabled={loading}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Deskripsi Detail</label>
            <textarea 
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none transition-all text-sm"
              placeholder="Jelaskan detail target..."
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-400" />
                Tanggal Mulai
              </label>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-green-500 transition-all cursor-pointer"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-white text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                Tanggal Selesai
              </label>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
                disabled={loading}
                min={startDate}
              />
            </div>
          </div>

          {startDate && endDate && calculateDays() > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-300 text-xs">Durasi:</span>
                <span className="text-white font-bold">{calculateDays()} hari</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between bg-gray-800/30 p-3 rounded-xl border border-gray-700">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400">Aktifkan Reminder</span>
            </div>
            <button
              type="button"
              onClick={() => setReminder(!reminder)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                reminder ? 'bg-blue-500' : 'bg-gray-700'
              }`}
              disabled={loading}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reminder ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 transition-all font-medium text-sm"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading || !target.trim() || !startDate || !endDate}
              className="flex-[2] py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all font-medium text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
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
        
        /* Mengatur tampilan ikon kalender bawaan browser */
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(1); /* Membuat ikon menjadi putih agar kontras dengan background gelap */
          opacity: 0.5;
          padding: 5px;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default AddTodoListAIModal;