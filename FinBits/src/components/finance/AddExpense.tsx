import React, { useState } from "react";
import { Calendar, X, Loader2, CreditCard, ShoppingBag, Tag } from "lucide-react";

interface AddExpenseProps {
  onClose: () => void;
  onAdd: (amount: string, source: string, date: string, category?: string) => Promise<void> | void;
}

const AddExpense: React.FC<AddExpenseProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    date: "",
    category: "Lainnya",
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { name: 'Makanan', icon: '🍔' },
    { name: 'Transport', icon: '🚗' },
    { name: 'Hiburan', icon: '🎮' },
    { name: 'Belanja', icon: '🛍️' },
    { name: 'Tagihan', icon: '📄' },
    { name: 'Kesehatan', icon: '💊' },
    { name: 'Pendidikan', icon: '📚' },
    { name: 'Lainnya', icon: '📦' }
  ];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        await onAdd(formData.amount, formData.source, formData.date, formData.category);
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
        <div className="bg-gradient-to-r from-[#ef4444]/20 to-transparent p-6 border-b border-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#ef4444]/20 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#ef4444]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Tambah Pengeluaran</h1>
                <p className="text-gray-400 text-sm">Catat pengeluaran baru kamu</p>
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
                <CreditCard size={16} className="text-[#ef4444]" />
                Jumlah Pengeluaran
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                <input
                  type="text"
                  value={formatCurrency(formData.amount)}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full bg-[#1e1e1e] border border-gray-700 text-white text-xl font-semibold rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#ef4444]/50 focus:border-[#ef4444] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-300 font-medium mb-2">
                <ShoppingBag size={16} className="text-[#ef4444]" />
                Pengeluaran Untuk
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                placeholder="Contoh: Makan siang"
                className="w-full bg-[#1e1e1e] border border-gray-700 text-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ef4444]/50 focus:border-[#ef4444] transition-all"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-300 font-medium mb-2">
                <Calendar size={16} className="text-[#ef4444]" />
                Tanggal
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full bg-[#1e1e1e] border border-gray-700 text-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ef4444]/50 focus:border-[#ef4444] transition-all"
                style={{ colorScheme: 'dark' }}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-gray-300 font-medium mb-3">
                <Tag size={16} className="text-[#ef4444]" />
                Kategori
              </label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.name }))}
                    className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                      formData.category === cat.name
                        ? 'bg-[#ef4444]/20 border-[#ef4444] text-white'
                        : 'bg-[#1e1e1e] border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-xs font-medium">{cat.name}</span>
                  </button>
                ))}
              </div>
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
              className="flex-1 bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#ef4444]/20"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Tambah Pengeluaran'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
