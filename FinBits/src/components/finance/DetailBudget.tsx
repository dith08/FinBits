import React, { useState } from 'react';
import { PencilLine, Trash2, X, Edit, Target, TrendingUp, Calendar } from 'lucide-react';
import EditBudget from './EditBudget';
import EditWants from './EditWants';
import DeleteWants from './DeleteWants';
import { ModalPortal } from '../common';

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
  onEditWant: (name: string, price: number, imageUrl: string, imageFile?: File | null) => void;
  onDeleteWant: (id: number) => Promise<void>;
}

const DetailBudget: React.FC<DetailBudgetProps> = ({ 
  onClose, 
  wantItem, 
  budgetItems, 
  currentBudget,
  onEditClick,
  onDelete,
  onEditWant,
  onDeleteWant
}) => {
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [showEditWantsModal, setShowEditWantsModal] = useState(false);
  const [showDeleteWantsModal, setShowDeleteWantsModal] = useState(false);
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
    <ModalPortal>
      <>
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <div className="w-full max-w-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl shadow-2xl border border-gray-800/50 overflow-hidden my-auto">
            <div className="bg-gradient-to-r from-emerald-500/20 to-transparent p-6 border-b border-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Detail Budget</h1>
                    <p className="text-gray-400 text-sm">Kelola target keinginan Anda</p>
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

            <div className="p-6">
              {/* Progress Section */}
              <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 font-medium text-sm">Progress Menuju Target</span>
                  <span className="text-emerald-400 font-bold">{Math.min(100, progress).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-800/50 rounded-full h-3 p-0.5 border border-gray-700/30 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span className="font-mono">{formatIDR(currentBudget)}</span>
                  <span className="font-mono">{formatIDR(wantItem.price)}</span>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                
                {/* Left: Product Info */}
                <div className="flex flex-col">
                  <div className="relative group mb-4">
                    <div className="relative w-full bg-white rounded-xl overflow-hidden flex items-center justify-center p-3 shadow-lg">
                      <img 
                        src={wantItem.imageUrl}
                        alt={wantItem.name}
                        className="object-contain w-full h-full max-h-48 transform group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <button 
                      onClick={handleEditWantsClick}
                      className="absolute top-2 right-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-lg"
                      title="Edit Product"
                    >
                      <Edit size={16} className="text-white" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h2 className="text-lg font-bold text-white">{wantItem.name}</h2>
                      <p className="text-gray-400 text-xs">Target Keinginan</p>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-white/5 border border-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs">Harga Target</span>
                          <span className="font-bold text-white text-sm">{formatIDR(wantItem.price)}</span>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs">Budget Terkumpul</span>
                          <span className="font-bold text-emerald-400 text-sm">{formatIDR(currentBudget)}</span>
                        </div>
                      </div>

                      <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-xs font-medium">Sisa Dibutuhkan</span>
                          <span className="font-bold text-emerald-400 text-sm">
                            {formatIDR(Math.max(0, wantItem.price - currentBudget))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Budget History */}
                <div className="flex flex-col">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <TrendingUp size={18} className="text-emerald-400" />
                      Riwayat Budget
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">{budgetItems.length} transaksi</p>
                  </div>
                  
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 flex-1">
                    {budgetItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-gray-700 rounded-lg">
                        <Target size={24} className="text-gray-600 mb-2" />
                        <p className="text-gray-400 text-xs">Belum ada riwayat budget</p>
                      </div>
                    ) : (
                      budgetItems.map((item) => (
                        <div 
                          key={item.id} 
                          className="group bg-gradient-to-r from-gray-800/40 to-gray-900/40 hover:from-gray-800/60 hover:to-gray-900/60 border border-gray-700/50 hover:border-emerald-500/30 rounded-lg p-3 transition-all"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span className="text-emerald-400 font-bold text-xs">
                                  +{formatIDR(item.amount)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-400 text-xs">
                                <Calendar size={10} />
                                {formatDate(item.date)}
                              </div>
                            </div>
                            
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleEditBudgetClick(item)}
                                className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded transition-colors"
                                title="Edit"
                              >
                                <PencilLine size={14} className="text-blue-400" />
                              </button>
                              <button 
                                onClick={() => onDelete(item.id)}
                                className="p-1.5 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={14} className="text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button 
                  onClick={handleEditWantsClick}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-lg"
                >
                  <Edit size={16} />
                  Edit Produk
                </button>
                
                <button 
                  onClick={() => setShowDeleteWantsModal(true)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-lg"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
                
                <button 
                  onClick={onClose}
                  className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-800/50 px-4 py-2 rounded-lg font-bold transition-all text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>

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

      {showEditWantsModal && (
        <EditWants 
          onClose={() => setShowEditWantsModal(false)}
          onSave={(name, price, imageUrl, imageFile) => {
            onEditWant(name, price, imageUrl, imageFile);
            setShowEditWantsModal(false);
          }}
          initialData={wantItem}
        />
      )}

      {showDeleteWantsModal && (
        <DeleteWants 
          onClose={() => setShowDeleteWantsModal(false)}
          onConfirm={() => onDeleteWant(wantItem.id)}
          wantName={wantItem.name}
        />
      )}
      </>
    </ModalPortal>
  );
};

export default DetailBudget;