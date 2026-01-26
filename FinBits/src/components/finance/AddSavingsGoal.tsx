import React, { useState } from 'react';
import { X, Loader2, Target, DollarSign, Calendar } from 'lucide-react';

interface AddSavingsGoalProps {
  onClose: () => void;
  onAdd: (goalName: string, targetAmount: number, targetDate: string) => Promise<void> | void;
}

const AddSavingsGoal: React.FC<AddSavingsGoalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    goalName: '',
    targetAmount: '',
    targetDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'targetAmount') {
      let numValue = value.replace(/\D/g, '');
      
      if (numValue.length > 15) {
        numValue = numValue.slice(0, 15);
      }
      
      const formatted = numValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const parseCurrency = (value: string): number => {
    const numStr = value.replace(/\./g, '');
    return parseInt(numStr, 10) || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.goalName || !formData.targetAmount || !formData.targetDate) return;
    
    setLoading(true);
    try {
      await onAdd(formData.goalName, parseCurrency(formData.targetAmount), formData.targetDate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 overflow-y-auto animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl shadow-blue-500/10 border border-gray-800 my-auto animate-slideUp relative">
        
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 md:right-6 md:top-6 p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Buat Saving Goal
            </h1>
            <p className="text-gray-400 text-xs md:text-sm">Tetapkan target tabungan Anda</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-gray-300 font-medium text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              Nama Goal
            </label>
            <input
              type="text"
              name="goalName"
              value={formData.goalName}
              onChange={handleInputChange}
              className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-3 md:p-4 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              placeholder="Contoh: Liburan ke Bali"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-300 font-medium text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              Target Nominal
            </label>
            <div className="relative">
              <input
                type="text"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-3 md:p-4 pl-10 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="0"
                required
              />
            </div>
            {formData.targetAmount && (
              <p className="text-xs text-blue-400 mt-2 font-medium">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(parseCurrency(formData.targetAmount))}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-gray-300 font-medium text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Target Tanggal
            </label>
            <input
              type="date"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleInputChange}
              className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-3 md:p-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              style={{ colorScheme: 'dark' }}
              required
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border border-gray-700 text-gray-300 hover:text-white py-3 rounded-xl hover:bg-gray-800/50 transition-all disabled:opacity-50 font-medium"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/30"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Membuat...
                </>
              ) : (
                'Buat Goal'
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
};

export default AddSavingsGoal;