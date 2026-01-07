// Update DetailBudget.tsx
import React, { useState } from 'react';
import { PencilLine, Trash2, X, Edit } from 'lucide-react';
import EditBudget from './EditBudget';
import EditWants from './EditWants';

interface WantItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

interface BudgetItem {
  id: number;
  amount: number;
  date: string;
}

interface DetailBudgetProps {
  onClose: () => void;
  wantItem: WantItem;
  budgetItems: BudgetItem[];
  currentBudget: number;
  onEditClick: (item: BudgetItem) => void;
  onDelete: (id: number) => void;
  onEditWant: (name: string, price: number, imageUrl: string) => void; // Update untuk menerima parameter
}

const DetailBudget: React.FC<DetailBudgetProps> = ({ 
  onClose, 
  wantItem, 
  budgetItems, 
  currentBudget,
  onEditClick,
  onDelete,
  onEditWant
}) => {
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [showEditWantsModal, setShowEditWantsModal] = useState(false); // State baru untuk edit wants
  const [selectedBudgetItem, setSelectedBudgetItem] = useState<BudgetItem | null>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount).replace('Rp', 'Rp ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleEditBudgetClick = (item: BudgetItem) => {
    setSelectedBudgetItem(item);
    setShowEditBudgetModal(true);
  };

  const handleEditWantsClick = () => {
    setShowEditWantsModal(true);
  };

  const progress = (currentBudget / wantItem.price) * 100;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50 overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div className="bg-[#121212] text-white p-8 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-800 my-8">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-[#1db978] text-3xl font-bold">
              Detail Budget
            </h1>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Section */}
          <div className="mb-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Progress Menuju Target:</span>
              <span className="text-[#1db978] font-bold">{Math.min(100, progress).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-[#1db978] h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, progress)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{formatIDR(currentBudget)}</span>
              <span>{formatIDR(wantItem.price)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Kolom Kiri: Info Produk */}
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-xs">
                <div className="w-full h-64 bg-white rounded-lg overflow-hidden flex items-center justify-center p-4 mb-6">
                  <img 
                    src={wantItem.imageUrl}
                    alt={wantItem.name}
                    className="object-contain w-full h-full max-h-full"
                  />
                </div>
                <button 
                  onClick={handleEditWantsClick} // Panggil fungsi baru
                  className="absolute top-2 right-2 p-2 bg-blue-900/50 hover:bg-blue-800/70 rounded-lg transition-colors"
                  title="Edit Product"
                >
                  <Edit size={18} className="text-blue-400" />
                </button>
              </div>
              
              <div className="text-center space-y-3 w-full">
                <h2 className="text-xl font-semibold mb-2">{wantItem.name}</h2>
                <div className="space-y-2 bg-gray-900/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Harga :</span>
                    <span className="font-bold">{formatIDR(wantItem.price)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Budget saat ini:</span>
                    <span className="font-bold">{formatIDR(currentBudget)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Kekurangan:</span>
                    <span className="font-bold text-[#1db978]">
                      {formatIDR(Math.max(0, wantItem.price - currentBudget))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: List Riwayat */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-300">Riwayat Budget</h3>
                <span className="text-gray-400 text-sm">
                  {budgetItems.length} transaksi
                </span>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {budgetItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex justify-between items-center border border-gray-700 rounded-lg p-4 bg-gray-900/30 hover:bg-gray-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[#1db978] font-bold">+ {formatIDR(item.amount)}</span>
                      <span className="text-gray-400 text-sm">{formatDate(item.date)}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditBudgetClick(item)}
                        className="p-2 bg-blue-900/30 hover:bg-blue-800/40 rounded-lg transition-colors"
                        title="Edit Budget"
                      >
                        <PencilLine size={16} className="text-blue-400" />
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="p-2 bg-red-900/30 hover:bg-red-800/40 rounded-lg transition-colors"
                        title="Delete Budget"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {budgetItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border border-gray-700 rounded-lg">
                    Belum ada riwayat budget. Tambahkan budget pertama Anda!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between gap-4 mt-12">
            <button 
              onClick={handleEditWantsClick} // Panggil fungsi baru
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2"
            >
              <Edit size={18} />
              Edit Product
            </button>
            
            <div className="flex gap-4">
              <button 
                onClick={onClose}
                className="border border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-3 rounded-lg font-bold transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={onClose}
                className="bg-[#1db978] hover:bg-[#19a369] text-white px-6 py-3 rounded-lg font-bold transition-all"
              >
                Save & Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Budget Modal */}
      {showEditBudgetModal && selectedBudgetItem && (
        <EditBudget 
          onClose={() => {
            setShowEditBudgetModal(false);
            setSelectedBudgetItem(null);
          }}
          onAdd={(amount: number, date: string) => {
            onEditClick({ ...selectedBudgetItem, amount, date });
            setShowEditBudgetModal(false);
            setSelectedBudgetItem(null);
          }}
        />
      )}

      {/* Edit Wants Modal */}
      {showEditWantsModal && (
        <EditWants 
          onClose={() => setShowEditWantsModal(false)}
          onSave={(name, price, imageUrl) => {
            // Update data wants langsung di parent dan tutup modal
            onEditWant(name, price, imageUrl);
            setShowEditWantsModal(false);
            // User tetap di detail budget, tidak navigasi ke edit budget
          }}
          initialData={wantItem}
        />
      )}
    </>
  );
};

export default DetailBudget;