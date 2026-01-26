import React, { useState } from 'react';
import { Calendar, Loader2, X, DollarSign, FileText, Tag, StickyNote, Building } from 'lucide-react';

interface AddIncomeProps {
  onClose: () => void;
  onAdd: (amount: string, source: string, date: string, description?: string, category?: string, notes?: string) => Promise<void> | void;
}

const AddIncome: React.FC<AddIncomeProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    date: '',
    description: '',
    category: 'Lainnya',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const categories = ['Gaji', 'Freelance', 'Investasi', 'Bonus', 'Hadiah', 'Bisnis', 'Lainnya'];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (value: string) => {
    const num = value.replace(/\D/g, '');
    return num ? Number(num).toLocaleString('id-ID') : '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      amount: rawValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.source && formData.date) {
      setLoading(true);
      try {
        await onAdd(
          formData.amount, 
          formData.source, 
          formData.date,
          formData.description || formData.source,
          formData.category,
          formData.notes
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl shadow-2xl border border-gray-800/50 overflow-hidden">
        <div className="bg-gradient-to-r from-[#10B981]/20 to-transparent p-6 border-b border-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#10B981]/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#10B981]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Tambah Pemasukan</h1>
                <p className="text-gray-400 text-sm">Catat pemasukan baru kamu</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <form className="p-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-gray-300 font-medium mb-2">
                <DollarSign size={16} className="text-[#10B981]" />
                Jumlah Pemasukan
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                <input 
                  type="text"
                  value={formatCurrency(formData.amount)}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full bg-[#1e1e1e] border border-gray-700 text-white text-xl font-semibold rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-300 font-medium mb-2">
                <Building size={16} className="text-[#10B981]" />
                Sumber Pemasukan
              </label>
              <input 
                type="text" 
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                placeholder="Contoh: Bank BNI"
                className="w-full bg-[#1e1e1e] border border-gray-700 text-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-300 font-medium mb-2">
                <Tag size={16} className="text-[#10B981]" />
                Kategori
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-[#1e1e1e] border border-gray-700 text-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-300 font-medium mb-2">
                <FileText size={16} className="text-[#10B981]" />
                Deskripsi
              </label>
              <input 
                type="text" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Contoh: Gaji Bulanan Januari"
                className="w-full bg-[#1e1e1e] border border-gray-700 text-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-300 font-medium mb-2">
                <Calendar size={16} className="text-[#10B981]" />
                Tanggal
              </label>
              <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full bg-[#1e1e1e] border border-gray-700 text-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all"
                style={{ colorScheme: 'dark' }}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-gray-300 font-medium mb-2">
                <StickyNote size={16} className="text-[#10B981]" />
                Catatan (opsional)
              </label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Tambahkan catatan..."
                rows={2}
                className="w-full bg-[#1e1e1e] border border-gray-700 text-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 font-medium"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/20"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Tambah Pemasukan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncome;
