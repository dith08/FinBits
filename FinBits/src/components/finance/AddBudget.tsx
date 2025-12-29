// Update AddBudget.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddBudgetProps {
  onClose: () => void;
  onAdd: (amount: number, date: string) => void;
}

const AddBudget: React.FC<AddBudgetProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    amount: '',
    date: ''
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#121212] text-white p-8 rounded-xl shadow-2xl w-full max-w-sm border border-gray-800 relative">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h1 className="text-[#1db978] text-3xl font-bold text-center mb-10">
          Add Budget
        </h1>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xl font-bold mb-3">Masukan Budget</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full bg-transparent border border-gray-700 rounded-lg p-3.5 outline-none focus:border-[#1db978] transition-colors text-lg"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-xl font-bold mb-3">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full bg-transparent border border-gray-700 rounded-lg p-3.5 outline-none focus:border-[#1db978] transition-colors text-lg appearance-none cursor-pointer"
              style={{ colorScheme: 'dark' }}
              required
            />
          </div>

          <div className="pt-4">
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 bg-[#1db978] hover:bg-[#19a369] text-white py-3 rounded-lg font-bold transition-all"
              >
                Add Budget
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudget;