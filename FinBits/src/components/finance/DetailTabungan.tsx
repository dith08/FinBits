// ui/DetailTabungan.tsx
import React, { useState } from 'react';
import { PencilLine, Trash2, X, TrendingUp } from 'lucide-react';
import EditTabungan from './EditTabungan';

interface TabunganItem {
  id: number;
  amount: number;
  date: string;
}

interface DetailTabunganProps {
  onClose: () => void;
  tabunganItems: TabunganItem[];
  currentSaving: number;
  targetSaving: number;
  onUpdateItems: (items: TabunganItem[]) => void;
}

const DetailTabungan: React.FC<DetailTabunganProps> = ({ 
  onClose, 
  tabunganItems, 
  currentSaving, 
  targetSaving,
  onUpdateItems 
}) => {
  const [items, setItems] = useState<TabunganItem[]>(tabunganItems);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TabunganItem | null>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this saving?')) {
      const newItems = items.filter(item => item.id !== id);
      setItems(newItems);
      onUpdateItems(newItems);
    }
  };

  const handleEditClick = (item: TabunganItem) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = (amount: number, date: string) => {
    if (editingItem) {
      const updatedItem = { ...editingItem, amount, date };
      const newItems = items.map(item => 
        item.id === editingItem.id ? updatedItem : item
      );
      setItems(newItems);
      onUpdateItems(newItems);
      setShowEditModal(false);
      setEditingItem(null);
    }
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount).replace('Rp', 'Rp ');
  };

  const calculateProgress = () => {
    return Math.min(100, (currentSaving / targetSaving) * 100);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        onClick={handleBackdropClick}
      >
        <div className="w-full max-w-3xl bg-[#121212] rounded-xl p-8 shadow-2xl border border-gray-800">
          
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-bold text-[#00b894]">
              Detail Tabungan
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
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Progress:</span>
                  <span className="text-[#00b894] font-bold">
                    {calculateProgress().toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-[#00b894] h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>{formatIDR(currentSaving)}</span>
                  <span>{formatIDR(targetSaving)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Riwayat Tabungan</h3>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between group p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-[#00b894]">
                        <TrendingUp size={20} />
                      </div>
                      <div>
                        <span className="text-gray-200 font-medium text-sm md:text-base block">
                          {formatIDR(item.amount)}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {item.date}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEditClick(item)}
                        className="p-2 bg-blue-900/30 hover:bg-blue-800/40 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PencilLine size={18} className="text-blue-400" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-900/30 hover:bg-red-800/40 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-48 flex flex-col gap-6">
              <div className="aspect-square rounded-xl border border-gray-700 flex flex-col items-center justify-center p-4 bg-gray-900/50">
                <div className="flex items-center gap-1 text-[#00b894] text-3xl font-bold">
                  <span>+</span>
                  <span>12 %</span>
                </div>
                <p className="text-[#00b894] text-xs mt-4 font-medium uppercase tracking-wider">
                  Dari Bulan Lalu
                </p>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-300 text-sm mb-2">Total Tabungan:</div>
                <div className="text-[#00b894] text-xl font-bold">
                  {formatIDR(currentSaving)}
                </div>
                <div className="text-gray-400 text-xs mt-2">
                  {items.length} transaksi
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full bg-[#00b894] hover:bg-[#00a884] text-white font-bold py-3 rounded-lg transition-all shadow-lg"
              >
                Back
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <EditTabungan
          onClose={() => {
            setShowEditModal(false);
            setEditingItem(null);
          }}
          onSave={handleSaveEdit}
          initialData={editingItem}
        />
      )}
    </>
  );
};

export default DetailTabungan;