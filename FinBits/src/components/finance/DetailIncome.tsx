// Update DetailIncome.tsx
import React, { useState } from 'react';
import { PencilLine, Trash2, X } from 'lucide-react';
import EditIncome from './EditIncome';

interface IncomeItem {
  label: string;
  value: string;
}

interface DetailIncomeProps {
  onClose: () => void;
  incomeItems: IncomeItem[];
  onUpdateItems: (items: IncomeItem[]) => void;
}

const DetailIncome: React.FC<DetailIncomeProps> = ({ onClose, incomeItems, onUpdateItems }) => {
  const [items, setItems] = useState(incomeItems);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<IncomeItem | null>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
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

  const handleSaveEdit = (updatedIncome: IncomeItem) => {
    if (editingIndex !== null) {
      const newItems = [...items];
      newItems[editingIndex] = updatedIncome;
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
            <h1 className="text-2xl font-bold text-[#1DB978]">
              Detail Income
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
                    <span className="text-[#1DB978] font-bold text-sm md:text-base">
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
                <div className="flex items-center gap-1 text-[#1DB978] text-3xl font-bold">
                  <span>+</span>
                  <span>12 %</span>
                </div>
                <p className="text-[#1DB978] text-xs mt-4 font-medium uppercase tracking-wider">
                  Dari Bulan Lalu
                </p>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-300 text-sm mb-2">Total Income:</div>
                <div className="text-[#1DB978] text-xl font-bold">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </div>
                <div className="text-gray-400 text-xs mt-2">
                  {items.length} items
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full bg-[#1DB978] hover:bg-[#18a369] text-white font-bold py-3 rounded-lg transition-all shadow-lg"
              >
                Back
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <EditIncome
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

export default DetailIncome;