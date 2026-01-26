import React, { useState } from 'react';
import { X, DollarSign, Calendar } from 'lucide-react';
import { ModalPortal } from '../common';

interface EditBudgetProps {
  onClose: () => void;
  onAdd: (amount: number, date: string) => void;
}

const EditBudget: React.FC<EditBudgetProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    amount: '',
    date: ''
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.date) {
      onAdd(parseInt(formData.amount), formData.date);
      onClose();
    }
  };

  return (
    <ModalPortal>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={handleBackdropClick}
      >
        <div className="w-full max-w-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl shadow-2xl border border-gray-800/50 overflow-hidden my-auto">
          <div className="bg-gradient-to-r from-green-500/20 to-transparent p-6 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Edit Budget</h1>
                  <p className="text-gray-400 text-sm">Ubah budget target keinginan</p>
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
                  <DollarSign size={16} className="text-green-400" />
                  Jumlah Budget
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                  <input
                    type="text"
                    value={formatCurrency(formData.amount)}
                    onChange={handleAmountChange}
                    placeholder="0"
                    className="w-full bg-[#1e1e1e] border border-gray-700 text-white text-xl font-semibold rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-300 font-medium mb-2">
                  <Calendar size={16} className="text-green-400" />
                  Tanggal
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-[#1e1e1e] border border-gray-700 text-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                  style={{ colorScheme: 'dark' }}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-xl hover:bg-gray-800 transition-all font-medium"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-green-500/30"
              >
                Edit Budget
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};

export default EditBudget;
