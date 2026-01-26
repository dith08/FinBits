import React, { useState } from 'react';
import { X } from 'lucide-react';
import DeleteSavingsGoal from './DeleteSavingsGoal';

interface SavingGoal {
  id: number;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  isActive: boolean;
}

interface DetailTabunganProps {
  onClose: () => void;
  currentSaving: number;
  targetSaving: number;
  savingGoal?: SavingGoal;
  onDeleteGoal?: (id: number) => Promise<void>;
}

const DetailTabungan: React.FC<DetailTabunganProps> = ({ 
  onClose, 
  currentSaving, 
  targetSaving,
  savingGoal,
  onDeleteGoal
}) => {
  const [deletingGoal, setDeletingGoal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDeleteGoal = async () => {
    if (!savingGoal || !onDeleteGoal) return;
    
    setDeletingGoal(true);
    try {
      await onDeleteGoal(savingGoal.id);
      onClose();
    } finally {
      setDeletingGoal(false);
      setShowDeleteModal(false);
    }
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
        <div className="w-full max-w-3xl bg-[#121212] rounded-xl p-8 shadow-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#00b894]">
                Detail Tabungan
              </h1>
              {savingGoal && (
                <p className="text-gray-400 text-sm mt-1">{savingGoal.goalName}</p>
              )}
            </div>
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
                {savingGoal && (
                  <p className="text-gray-500 text-xs mt-2">
                    Target: {savingGoal.targetDate}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Info Goal</h3>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400 text-sm">Target Tanggal:</span>
                    <span className="text-gray-200 font-medium">
                      {savingGoal ? new Date(savingGoal.targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${savingGoal?.isActive ? 'bg-[#00b894]/20 text-[#00b894]' : 'bg-gray-700 text-gray-300'}`}>
                      {savingGoal?.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-48 flex flex-col gap-6">
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-300 text-sm mb-2">Total Tabungan:</div>
                <div className="text-[#00b894] text-xl font-bold">
                  {formatIDR(currentSaving)}
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full bg-[#00b894] hover:bg-[#00a884] text-white font-bold py-3 rounded-lg transition-all shadow-lg"
              >
                Kembali
              </button>

              {savingGoal && onDeleteGoal && (
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  disabled={deletingGoal}
                  className="w-full border border-red-500/50 text-red-400 hover:bg-red-500/10 font-medium py-2 rounded-lg transition-all text-sm disabled:opacity-50"
                >
                  Hapus Goal
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {showDeleteModal && savingGoal && (
        <DeleteSavingsGoal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteGoal}
          goalName={savingGoal.goalName}
        />
      )}
    </>
  );
};

export default DetailTabungan;
