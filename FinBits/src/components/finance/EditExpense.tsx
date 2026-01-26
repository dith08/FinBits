import React, { useState, useEffect, useRef } from 'react';
import { Calendar, X, TrendingDown, DollarSign } from 'lucide-react';

interface EditExpenseProps {
  onClose: () => void;
  onSave: (updatedExpense: { label: string; value: string; date: string }) => void;
  initialData: {
    label: string;
    value: string;
    date?: string;
  };
}

const EditExpense: React.FC<EditExpenseProps> = ({ onClose, onSave, initialData }) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const formatNumber = (val: string) => {
    if (!val) return "";
    const numberString = val.replace(/[^,\d]/g, ""); 
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumber = (val: string) => {
    return val.replace(/\./g, "");
  };

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    label: initialData.label,
    amount: formatNumber(initialData.value.replace('Rp ', '').replace(/\./g, '')),
    date: initialData.date || today // Gunakan date lama jika ada
  });

  useEffect(() => {
    setFormData({
      label: initialData.label,
      amount: formatNumber(initialData.value.replace('Rp ', '').replace(/\./g, '')),
      date: initialData.date || today
    });
  }, [initialData, today]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" ? formatNumber(value) : value
    }));
  };

  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawAmount = parseNumber(formData.amount);
    
    onSave({
      label: formData.label,
      value: `Rp ${parseInt(rawAmount || "0").toLocaleString("id-ID")}`,
      date: formData.date,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 font-sans animate-fadeIn" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl shadow-red-500/10 border border-gray-800 relative animate-slideUp">
        
        <button onClick={onClose} className="absolute right-4 top-4 md:right-6 md:top-6 p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center shadow-lg">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent">
              Edit Expense
            </h1>
            <p className="text-gray-400 text-xs md:text-sm">Perbarui data pengeluaran Anda</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-gray-300 font-medium text-sm">Kategori Pengeluaran</label>
            <input 
              type="text" 
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 px-4 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
              placeholder="Contoh: Makan, Transportasi"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-300 font-medium text-sm">Jumlah Pengeluaran</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-400 text-sm">Rp</span>
              <input 
                type="text" 
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 pl-10 pr-4 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-300 font-medium text-sm">Tanggal</label>
            <div className="relative group cursor-pointer" onClick={handleCalendarClick}>
              <input 
                type="date"
                name="date"
                ref={dateInputRef}
                value={formData.date}
                onChange={handleInputChange}
                className="absolute opacity-0 inset-0 w-full h-full cursor-pointer -z-10"
              />
              <div className="w-full bg-gray-800/50 border border-gray-700 text-gray-200 rounded-xl py-3 px-4 flex justify-between items-center hover:border-red-500 transition-all">
                <span className="text-gray-200">{formData.date || "Pilih Tanggal"}</span>
                <div className="bg-red-500/20 p-2 rounded-lg border border-red-500/30">
                  <Calendar size={18} className="text-red-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-700 text-gray-300 hover:text-white py-3 rounded-xl hover:bg-gray-800/50 transition-all font-medium">Batal</button>
            <button type="submit" className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-red-500/30">Perbarui</button>
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

export default EditExpense;