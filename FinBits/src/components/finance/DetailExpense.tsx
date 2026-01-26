import React, { useState } from 'react';
import { PencilLine, Trash2, X, Loader2, TrendingDown, DollarSign } from 'lucide-react';
import EditExpense from './EditExpense';

interface ExpenseItem {
  id: number;
  label: string;
  value: string;
  amount: number;
  date: string;
  source: string;
  category: string;
}

interface DetailExpenseProps {
  onClose: () => void;
  expenseItems: ExpenseItem[];
  onDelete?: (id: number) => Promise<void> | Promise<boolean>;
  onUpdate?: (id: number, data: any) => Promise<void> | Promise<boolean>;
}

const DetailExpense: React.FC<DetailExpenseProps> = ({ onClose, expenseItems, onDelete, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ExpenseItem | null>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDeleteClick = (item: ExpenseItem) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      setDeletingId(itemToDelete.id);
      try {
        if (onDelete) {
          await onDelete(itemToDelete.id);
        }
      } finally {
        setDeletingId(null);
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    }
  };

  const handleEditClick = (item: ExpenseItem) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedExpense: { label: string; value: string; date?: string }) => {
    if (editingItem && onUpdate) {
      const amount = parseInt(updatedExpense.value.replace(/[^0-9]/g, ''));
      
      await onUpdate(editingItem.id, {
        amount,
        source: updatedExpense.label,
        date: updatedExpense.date || editingItem.date,
        category: editingItem.category || 'Lainnya',
      });
      
      setShowEditModal(false);
      setEditingItem(null);
    }
  };

  const totalAmount = expenseItems.reduce((total, item) => total + item.amount, 0);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 overflow-y-auto animate-fadeIn"
        onClick={handleBackdropClick}
      >
        <div className="w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-2xl shadow-red-500/10 border border-gray-800 my-auto animate-slideUp">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center shadow-lg">
                <TrendingDown className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent">
                  Detail Pengeluaran
                </h1>
                <p className="text-gray-400 text-xs md:text-sm">Pantau semua pengeluaran Anda</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
            <div className="lg:col-span-2">
              {expenseItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <DollarSign className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400">Belum ada data pengeluaran</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {expenseItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="group bg-gradient-to-r from-gray-800/40 to-gray-900/40 hover:from-gray-800/60 hover:to-gray-900/60 border border-gray-700/50 hover:border-red-500/30 rounded-xl p-4 md:p-5 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <h3 className="text-gray-100 font-semibold text-sm md:text-base truncate">
                              {item.label}
                            </h3>
                          </div>
                          <div className="flex gap-2 text-xs md:text-sm">
                            <span className="text-gray-500">{item.date}</span>
                            <span className="text-gray-600">•</span>
                            <span className="px-2 py-0.5 rounded-md bg-gray-700/50 text-gray-300">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-red-400 font-bold text-base md:text-lg">
                              {item.value}
                            </p>
                          </div>
                          
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditClick(item)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <PencilLine size={16} className="text-blue-400" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(item)}
                              disabled={deletingId === item.id}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId === item.id ? (
                                <Loader2 size={16} className="text-red-400 animate-spin" />
                              ) : (
                                <Trash2 size={16} className="text-red-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1 h-full">
              <div className="bg-gradient-to-br from-red-500/15 to-orange-500/15 border border-red-500/40 rounded-2xl p-6 md:p-8 h-full flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/30 to-orange-500/30 flex items-center justify-center border border-red-500/50">
                      <TrendingDown className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm font-medium">Total Pengeluaran</p>
                      <p className="text-gray-500 text-xs">Ringkasan pengeluaran</p>
                    </div>
                  </div>
                  
                  <div className="mb-8 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <p className="text-red-400 text-4xl md:text-2xl font-bold mb-2">
                      Rp {totalAmount.toLocaleString('id-ID')}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {expenseItems.length} {expenseItems.length === 1 ? 'item' : 'Pengeluaran'}
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <p className="text-gray-400 text-xs mb-1">Rata-rata per item</p>
                      <p className="text-red-400 font-bold text-lg">
                        Rp {expenseItems.length > 0 ? (totalAmount / expenseItems.length).toLocaleString('id-ID') : '0'}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <p className="text-gray-400 text-xs mb-1">Total Pengeluaran</p>
                      <p className="text-red-400 font-bold text-lg">
                        {expenseItems.length}
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-red-500/30"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && editingItem && (
        <EditExpense
          onClose={() => {
            setShowEditModal(false);
            setEditingItem(null);
          }}
          onSave={handleSaveEdit}
          initialData={{
            label: editingItem.label,
            value: editingItem.value,
            date: editingItem.date,
          }}
        />
      )}

      {showDeleteModal && itemToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteModal(false);
              setItemToDelete(null);
            }
          }}
        >
          <div className="w-[400px] rounded-[32px] bg-[#121212] p-8 text-center shadow-2xl">
            
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-36 bg-red-500 rounded-sm flex justify-center items-center">
                <div className="absolute -top-2 w-36 h-4 bg-red-500 rounded-t-md"></div>
                <div className="flex gap-3">
                  <div className="w-4 h-24 bg-[#121212] rounded-full"></div>
                  <div className="w-4 h-24 bg-[#121212] rounded-full"></div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              Apakah Anda Yakin?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 px-4">
              Pengeluaran "{itemToDelete.label}" akan dihapus secara permanen dari sistem. Mohon pastikan kembali sebelum melanjutkan.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className="flex-1 py-4 bg-[#1EB980] text-white font-bold rounded-xl hover:bg-[#17a370] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingId === itemToDelete.id}
                className="flex-1 py-4 bg-[#800000] text-white font-bold rounded-xl hover:bg-[#660000] transition-colors disabled:opacity-50"
              >
                {deletingId === itemToDelete.id ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
};

export default DetailExpense;