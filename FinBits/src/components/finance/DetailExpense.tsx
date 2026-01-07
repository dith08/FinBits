// ui/DetailExpense.tsx
import React, { useState } from 'react';
import { PencilLine, Trash2, X } from 'lucide-react';
import EditExpense from './EditExpense';


interface ExpenseItem {
  label: string;
  value: string;
}

interface DetailExpenseProps {
  onClose: () => void;
  expenseItems: ExpenseItem[];
  onUpdateItems: (items: ExpenseItem[]) => void;
}

const DetailExpense: React.FC<DetailExpenseProps> = ({ onClose, expenseItems, onUpdateItems }) => {
  const [items, setItems] = useState<ExpenseItem[]>(expenseItems);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      onUpdateItems(newItems);
    }
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditingItem(items[index]);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedExpense: ExpenseItem) => {
    if (editingIndex !== null) {
      const newItems = [...items];
      newItems[editingIndex] = updatedExpense;
      setItems(newItems);
      onUpdateItems(newItems);
      setShowEditModal(false);
      setEditingIndex(null);
      setEditingItem(null);
    }
  };

  const totalAmount = items.reduce((total, item) => {
    const amount = parseInt(item.value.replace(/[^0-9]/g, ''));
    return total + amount;
  }, 0);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        onClick={handleBackdropClick}
      >
        <div className="w-full max-w-3xl bg-[#121212] rounded-xl p-8 shadow-2xl border border-gray-800">
          
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-bold text-[#D60000]">
              Detail Expense
            </h1>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            <div className="flex-1 w-full space-y-6">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between group p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-200 font-medium text-sm md:text-base">
                      {item.label} :
                    </span>
                    <span className="text-[#D60000] font-bold text-sm md:text-base">
                      {item.value}
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleEditClick(index)}
                      className="p-2 bg-blue-900/30 hover:bg-blue-800/40 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilLine size={18} className="text-blue-400" />
                    </button>
                    <button 
                      onClick={() => handleDelete(index)}
                      className="p-2 bg-red-900/30 hover:bg-red-800/40 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full md:w-48 flex flex-col gap-6">
              <div className="aspect-square rounded-xl border border-gray-700 flex flex-col items-center justify-center p-4 bg-gray-900/50">
                <div className="flex items-center gap-1 text-[#D60000] text-3xl font-bold">
                  <span>+</span>
                  <span>12 %</span>
                </div>
                <p className="text-[#D60000] text-xs mt-4 font-medium uppercase tracking-wider">
                  Dari Bulan Lalu
                </p>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-300 text-sm mb-2">Total Expense:</div>
                <div className="text-[#D60000] text-xl font-bold">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </div>
                <div className="text-gray-400 text-xs mt-2">
                  {items.length} items
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full bg-[#D60000] hover:bg-[#b30000] text-white font-bold py-3 rounded-lg transition-all shadow-lg"
              >
                Back
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <EditExpense
          onClose={() => {
            setShowEditModal(false);
            setEditingIndex(null);
            setEditingItem(null);
          }}
          onSave={handleSaveEdit}
          initialData={editingItem}
        />
      )}
    </>
  );
};

export default DetailExpense;