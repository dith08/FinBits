import React, { useState } from 'react';
import { X, ChevronDown, Calendar, Clock, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { productivityService } from '../../services/productivityService';
import type { TodoItem } from '../../types/productivity';

interface EditTodoListModalProps {
  todo: TodoItem;
  onClose: () => void;
  onSave: () => void;
}

const EditTodoListModal: React.FC<EditTodoListModalProps> = ({ todo, onClose, onSave }) => {
  const [taskName, setTaskName] = useState(todo.task_name);
  const [startDate, setStartDate] = useState(todo.start_date?.split('T')[0] || '');
  const [endDate, setEndDate] = useState(todo.end_date?.split('T')[0] || '');
  const [note, setNote] = useState(todo.note || '');
  const [reminder, setReminder] = useState(todo.reminder);
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>(todo.status as 'Pending' | 'In Progress' | 'Completed');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const statusOptions: Array<'Pending' | 'In Progress' | 'Completed'> = ['Pending', 'In Progress', 'Completed'];

  const handleSubmit = async () => {
    if (!taskName.trim()) {
      setError('Nama To Do List harus diisi!');
      return;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('Tanggal selesai harus setelah tanggal mulai!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await productivityService.updateTodo(todo.todo_id, {
        task_name: taskName,
        status: status,
        start_date: startDate,
        end_date: endDate,
        note: note,
        reminder: reminder
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: CheckCircle };
      case 'In Progress': return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: AlertCircle };
      default: return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', icon: AlertCircle };
    }
  };

  const statusColor = getStatusColor(status);
  const StatusIcon = statusColor.icon;

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
        <FileText className="w-6 h-6 text-white" />
      </div>
      <div className="text-left">
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          Edit Task
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] bg-emerald-900/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20">
            ID: #{todo.todo_id}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColor.bg} ${statusColor.text}`}>
            {status}
          </span>
        </div>
      </div>
    </div>

    <div className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm animate-pulse">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Task Name
            </label>
            <input 
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all"
              placeholder="Nama To Do List..."
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-400" /> Start Date
              </label>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-green-500 transition-all text-sm"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-white text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" /> End Date
              </label>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500 transition-all text-sm"
                disabled={loading}
                min={startDate}
              />
            </div>
          </div>

          {startDate && endDate && calculateDays() > 0 && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-emerald-300 text-sm">Project Duration</span>
              </div>
              <span className="text-white font-bold">{calculateDays()} Days</span>
            </div>
          )}
        </div>

        <div className="bg-gray-800/30 p-4 rounded-2xl border border-gray-800/50 space-y-5">
          <div className="space-y-2 relative">
            <label className="text-white text-sm font-medium">Status</label>
            <div 
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white cursor-pointer flex items-center justify-between hover:border-emerald-500 transition-all text-sm"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <div className="flex items-center gap-2">
                <StatusIcon className={`w-4 h-4 ${statusColor.text}`} />
                <span className={statusColor.text}>{status}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-800">
            <label className="text-white text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" /> Reminder
            </label>
            <div className="flex items-center justify-between bg-gray-900/40 p-2 rounded-lg">
              <span className="text-xs text-gray-400">{reminder ? 'Active' : 'Off'}</span>
              <button
                type="button"
                onClick={() => setReminder(!reminder)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  reminder ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
                disabled={loading}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reminder ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 items-end border-t border-gray-800">
        <div className="md:col-span-2">
          <label className="text-white text-xs font-medium mb-1 block">Notes</label>
          <textarea 
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all resize-none text-sm"
            placeholder="Tambahkan detail..."
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-2">
          <button 
            onClick={handleSubmit}
            disabled={loading || !taskName.trim()}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 transition-all font-bold flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Update Task
          </button>
          <button 
            onClick={onClose}
            disabled={loading}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all font-medium text-sm disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
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
        
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: none;
          display: none;
        }
      `}</style>
    </div>
  );
};

export default EditTodoListModal;