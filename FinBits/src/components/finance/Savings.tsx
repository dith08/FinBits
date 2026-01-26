import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import AddSavings from './AddSavings';
import AddSavingsGoal from './AddSavingsGoal';
import DetailSavings from './DetailSavings';
import { savingService } from '../../services/financeService';
import { AlertModal } from '../common';

interface SavingGoal {
  id: number;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  isActive: boolean;
}

export const Tabungan: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertError, setAlertError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [currentGoal, setCurrentGoal] = useState<SavingGoal | null>(null);

  const fetchSavingData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await savingService.getAll();
      
      const transformedData: SavingGoal[] = (response.data || []).map((item: Record<string, unknown>) => ({
        id: item.saving_id,
        goalName: item.goal_name,
        targetAmount: Number(item.target_amount),
        currentAmount: Number(item.current_amount || 0),
        targetDate: item.target_date,
        isActive: item.is_active,
      }));
      
      if (transformedData.length > 0) {
        setCurrentGoal(transformedData[0]);
      }
    } catch (err: unknown) {
      console.error('Error fetching savings:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Gagal memuat data tabungan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavingData();
  }, []);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('Rp', 'Rp ');
  };

  const handleAddTabungan = async (amount: number, date: string) => {
    try {
      if (currentGoal) {
        await savingService.topup(currentGoal.id, {
          amount,
          topup_date: date,
        });
        setSuccessMessage('Top up berhasil!');
        await fetchSavingData();
      }
      setShowAddModal(false);
    } catch (err: unknown) {
      console.error('Error adding saving:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setAlertError(error.response?.data?.message || 'Gagal menambah tabungan');
    }
  };

  const handleAddGoal = async (goalName: string, targetAmount: number, targetDate: string) => {
    try {
      await savingService.add({
        goal_name: goalName,
        target_amount: targetAmount,
        target_date: targetDate,
      });
      setSuccessMessage('Goal berhasil dibuat!');
      await fetchSavingData();
      setShowAddGoalModal(false);
    } catch (err: unknown) {
      console.error('Error creating goal:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setAlertError(error.response?.data?.message || 'Gagal membuat goal');
    }
  };

  const handleDeleteGoal = async (id: number) => {
    try {
      await savingService.delete(id);
      setSuccessMessage('Goal berhasil dihapus!');
      await fetchSavingData();
    } catch (err: unknown) {
      console.error('Error deleting saving:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setAlertError(error.response?.data?.message || 'Gagal menghapus tabungan');
    }
  };

  const calculateProgress = () => {
    if (!currentGoal) return 0;
    return Math.min(100, (currentGoal.currentAmount / currentGoal.targetAmount) * 100);
  };

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-[#0d0d0d] rounded-2xl border border-gray-800 shadow-2xl">
        <Loader2 className="w-10 h-10 animate-spin text-[#00b894] opacity-50" />
      </div>
    );
  }

  const progress = calculateProgress();

  if (loading) {
    return (
      <div className="text-white p-6 rounded-lg border border-gray-800 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#00b894]" />
      </div>
    );
  }

  return (
    <div className="relative group overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 p-1 rounded-2xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,184,148,0.1)]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00b894] to-[#00cec9] opacity-10 group-hover:opacity-25 transition duration-500 blur-xl"></div>
      
      <div className="relative bg-[#0d0d0d] p-6 rounded-[calc(1rem-1px)] h-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Tabungan<span className="text-[#00b894]">.</span>
            </h2>
            <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Bermimpi Besar, Menabung Kecil</p>
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${currentGoal ? 'bg-[#00b894]/20 text-[#00b894]' : 'bg-gray-800 text-gray-500'}`}>
              {currentGoal ? 'Target Aktif' : 'Tidak Ada Target'}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 flex justify-between items-center">
            <p className="text-red-400 text-xs font-medium">{error}</p>
            <button onClick={fetchSavingData} className="text-[10px] bg-red-500 text-white px-2 py-1 rounded-md font-bold">RETRY</button>
          </div>
        )}

        {!currentGoal ? (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-800 rounded-2xl">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-700">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
               </svg>
            </div>
            <p className="text-gray-500 text-sm mb-6 italic text-center px-6">"Tabungan adalah langkah pertama menuju kebebasan finansial."</p>
            <button 
              onClick={() => setShowAddGoalModal(true)}
              className="py-3 px-8 bg-white text-black hover:bg-[#00b894] hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
            >
              Buat Target Baru
            </button>
          </div>
        ) : (
          <>
            <div className="mb-10 relative">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight leading-none mb-1">{currentGoal.goalName}</h3>
                  <p className="text-[10px] text-gray-500 font-medium">Hingga: {new Date(currentGoal.targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-[#00b894] tracking-tighter leading-none">
                    {progress.toFixed(0)}<span className="text-sm ml-0.5">%</span>
                  </span>
                </div>
              </div>
              
              <div className="h-4 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800 p-[2px]">
                <div 
                  className="h-full bg-gradient-to-r from-[#00b894] to-[#00cec9] rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,184,148,0.4)]"
                  style={{ width: `${progress}%` }}
                >
                  <div className="w-full h-full opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
              <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex justify-between items-center group/card hover:bg-white/[0.06] transition-colors">
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Target</span>
                 <span className="text-sm font-bold text-gray-200">{formatIDR(currentGoal.targetAmount)}</span>
              </div>
              
              <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex justify-between items-center group/card hover:bg-white/[0.06] transition-colors">
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Saat Ini</span>
                 <span className="text-sm font-bold text-[#00b894]">{formatIDR(currentGoal.currentAmount)}</span>
              </div>

              <div className="bg-[#00b894]/5 border border-[#00b894]/10 p-4 rounded-2xl flex justify-between items-center">
                 <span className="text-[10px] text-[#00b894] font-bold uppercase tracking-widest leading-none">Sisa</span>
                 <span className="text-sm font-black text-white">
                   {formatIDR(Math.max(0, currentGoal.targetAmount - currentGoal.currentAmount))}
                 </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex-[2] py-4 bg-[#00b894] hover:bg-[#00cec9] text-black font-black text-xs uppercase tracking-[0.15em] rounded-2xl transition-all shadow-lg active:scale-95"
              >
                Top Up
              </button>
              <button 
                onClick={() => setShowDetailModal(true)}
                className="flex-1 py-4 bg-transparent border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all"
              >
                Detail
              </button>
            </div>
          </>
        )}
      </div>

      {showAddModal && (
        <AddSavings 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddTabungan}
        />
      )}

      {showAddGoalModal && (
        <AddSavingsGoal 
          onClose={() => setShowAddGoalModal(false)}
          onAdd={handleAddGoal}
        />
      )}

      {showDetailModal && currentGoal && (
        <DetailSavings 
          onClose={() => setShowDetailModal(false)}
          currentSaving={currentGoal.currentAmount}
          targetSaving={currentGoal.targetAmount}
          savingGoal={currentGoal}
          onDeleteGoal={handleDeleteGoal}
        />
      )}

      <AlertModal
        isOpen={!!alertError}
        onClose={() => setAlertError(null)}
        type="error"
        message={alertError || ''}
      />

      <AlertModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage(null)}
        type="success"
        message={successMessage || ''}
      />
    </div>
  );
};

export default Tabungan;
