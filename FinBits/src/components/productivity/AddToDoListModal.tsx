import React, { useState } from 'react';
import { X, ChevronDown, Calendar, Clock, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { productivityService } from '../../services/productivityService';

interface AddTodoListModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AddTodoListModal: React.FC<AddTodoListModalProps> = ({ onClose, onSuccess }) => {
  const [taskName, setTaskName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('06:00');
  const [endDate, setEndDate] = useState('');
  const [note, setNote] = useState('');
  const [reminder, setReminder] = useState(true);
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>('Pending');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async () => {
    if (!taskName.trim()) {
      setError('Nama To Do List harus diisi!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        task_name: taskName,
        status: status,
        start_date: startDate || new Date().toISOString().split('T')[0],
        start_time: startTime, 
        end_date: endDate || new Date().toISOString().split('T')[0],
        note: note,
        reminder: reminder
      };
      
      await productivityService.addTodo(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Gagal menambah todo');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: CheckCircle };
      case 'In Progress': return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: AlertCircle };
      default: return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', icon: AlertCircle };
    }
  };

  const statusColor = getStatusColor(status);
  const StatusIcon = statusColor.icon;

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div 
        className="w-full max-w-lg md:max-w-4xl bg-gradient-to-br from-gray-900 to-black rounded-2xl md:rounded-3xl p-5 md:p-8 border border-emerald-500/30 relative shadow-2xl shadow-emerald-500/10 max-h-[95vh] overflow-y-auto animate-slideUp"
      >
        <button onClick={onClose} className="absolute right-3 top-3 md:right-5 md:top-5 p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white transition-all z-10">
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 md:mb-8 border-b border-gray-800 pb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Add New Task
            </h2>
            <p className="text-gray-400 text-xs">Kelola To Do List harian Anda lebih efisien</p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-white text-sm font-medium flex items-center gap-2">Nama To Do List</label>
            <input 
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white focus:border-emerald-500 transition-all outline-none"
              placeholder="Apa yang ingin Anda kerjakan?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-400" /> Tanggal Mulai
              </label>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none [color-scheme:dark]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" /> Jam Mulai
              </label>
              <input 
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none [color-scheme:dark]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-white text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" /> Tanggal Selesai
              </label>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white focus:border-orange-500 outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2 relative">
                <label className="text-white text-sm font-medium">Status & Reminder</label>
                <div className="flex flex-col gap-3">
                  <div 
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white cursor-pointer flex items-center justify-between"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${statusColor.bg} ${statusColor.border}`}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      <span className={`text-sm ${statusColor.text}`}>{status}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Reminder Toggle */}
                  <div className="flex items-center justify-between bg-gray-800/30 p-2 rounded-xl border border-gray-700">
                    <span className="text-xs text-gray-400 px-2">Aktifkan Reminder</span>
                    <button
                      onClick={() => setReminder(!reminder)}
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${reminder ? 'bg-emerald-500' : 'bg-gray-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reminder ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
                
                {showStatusDropdown && (
                  <div className="absolute top-12 left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                    {['Pending', 'In Progress', 'Completed'].map((option) => (
                      <button
                        key={option}
                        onClick={() => { setStatus(option as any); setShowStatusDropdown(false); }}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-900/30 text-sm text-white border-b border-gray-700 last:border-none"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Catatan</label>
              <textarea 
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white text-sm focus:border-emerald-500 outline-none resize-none"
                placeholder="Detail To Do List..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 transition-all font-medium text-sm">
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading || !taskName.trim()}
              className="flex-[2] py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all font-medium text-sm flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Save Task
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default AddTodoListModal;