// Update AddExpanse.tsx (rename to AddExpense.tsx)
import React, { useState } from "react";
import { Calendar, X } from "lucide-react";

interface AddExpenseProps {
  onClose: () => void;
  onAdd: (amount: string, purpose: string, date: string) => void;
}

const AddExpense: React.FC<AddExpenseProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    amount: "",
    purpose: "",
    date: "",
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.purpose) {
      onAdd(formData.amount, formData.purpose, formData.date);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 font-sans"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md  rounded-3xl p-8 shadow-2xl border border-gray-800 relative">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h1 className="text-3xl font-bold text-[#D60000] text-center mb-8">
          Add Expense
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-gray-300 font-medium">
              Masukan Expense
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Contoh: 5000000"
              className="w-full bg-[#2a2f36] border border-gray-700 text-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#D60000] focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-300 font-medium">
              Expense Untuk
            </label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="Contoh: Langganan Domain"
              className="w-full bg-[#2a2f36] border border-gray-700 text-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#D60000] focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-300 font-medium">Date</label>
            <div className="relative">
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="Contoh: 12-12-2023"
                className="w-full bg-[#2a2f36] text-gray-900 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#D60000] transition-all"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md">
                <Calendar size={18} className="text-gray-600" />
              </div>
            </div>
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
                className="flex-1 bg-[#D60000] hover:bg-[#b30000] text-white font-bold py-3 rounded-lg transition-all shadow-lg"
              >
                Add Expense
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
