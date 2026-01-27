import React, { useState } from 'react';
import { useFinanceData } from '../../hooks/useFinanceData';
import { incomeService } from '../../services/financeService';
import { LoadingSpinner, ErrorMessage } from '../common';
import DetailIncome from './DetailIncome';
import AddIncome from './AddIncome';
import { COLOR_CLASSES, COLORS } from '../../constants/colors';

export interface IncomeItem {
  id: number;
  label: string;
  value: string;
  amount: number;
  date: string;
  source: string;
  description?: string;
  category?: string;
  notes?: string;
}

const transformIncome = (item: any): IncomeItem => ({
  id: item.income_id,
  label: item.source || item.description || 'Income',
  value: `Rp ${Number(item.amount).toLocaleString('id-ID')}`,
  amount: Number(item.amount),
  date: item.date,
  source: item.source,
  description: item.description,
  category: item.category,
  notes: item.notes,
});

const IncomeCard: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { data, loading, error, total, refresh, add, update, remove } = useFinanceData({
    service: incomeService,
    transform: transformIncome,
  });

  const handleAddIncome = async (amount: string, source: string, date: string, description?: string, category?: string, notes?: string) => {
    const success = await add({
      amount: parseInt(amount),
      source,
      date,
      description: description || source,
      category: category || 'Lainnya',
      notes: notes || '',
    });
    if (success) setShowAddModal(false);
  };

  if (loading) return <LoadingSpinner color="#00b894" />;

  return (
    <div className="relative group overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 p-1 rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,184,148,0.15)]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-10 group-hover:opacity-30 transition duration-500 blur-md"></div>
      
      <div className="relative bg-[#0d0d0d] p-6 rounded-[calc(1rem-1px)] h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Pemasukan<span className={`${COLOR_CLASSES.primary.text}`}>.</span>
            </h2>
            <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Aliran Pendapatan</p>
          </div>
          <div className={`p-2.5 ${COLOR_CLASSES.primary.bgLight} rounded-xl border ${COLOR_CLASSES.primary.borderLight}`}>
            <svg className={`w-5 h-5 ${COLOR_CLASSES.primary.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>

        {error && <ErrorMessage message={error} onRetry={refresh} />}

        <div className="flex-1 space-y-3 mb-8">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-12 h-12 bg-gray-800/30 rounded-full flex items-center justify-center mb-3">
                 <span className="text-gray-600">∅</span>
              </div>
              <p className="text-xs text-gray-500 font-medium italic">Belum ada pemasukan yang tercatat</p>
            </div>
          ) : (
            <>
              {data.slice(0, 5).map((item) => (
                <div key={item.id} className="group/item flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-all">
                  <div className="flex flex-col">
                    <span className={`text-gray-200 text-sm font-semibold tracking-tight group-hover/item:${COLOR_CLASSES.primary.text} transition-colors`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">{new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
                  </div>
                  <div className="text-right">
                    <span className={`${COLOR_CLASSES.primary.text} font-mono font-bold tracking-tighter text-sm`}>+{item.value}</span>
                  </div>
                </div>
              ))}
              {data.length > 5 && (
                <div className="pt-2">
                  <button 
                    onClick={() => setShowDetailModal(true)}
                    className="w-full py-1.5 text-[10px] text-gray-500 hover:text-white bg-gray-800/20 hover:bg-gray-800/50 rounded-md transition-all uppercase tracking-widest font-bold"
                  >
                    Lihat {data.length - 5} Transaksi Lainnya
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="relative overflow-hidden bg-gradient-to-r from-gray-800/40 to-transparent p-4 rounded-2xl border border-gray-800/50 mb-6">
           <div className="relative z-10 flex justify-between items-center">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Saldo Bersih</span>
              <span className="text-sm md:text-lg font-black text-white tracking-tight">
                Rp. {total.toLocaleString('id-ID')}
              </span>
           </div>
           <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full -mr-8 -mt-8 blur-xl"></div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className={`flex-[2] py-3 ${COLOR_CLASSES.primary.bg} hover:bg-emerald-600 text-white font-black text-[10px] md:text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_14px_0_rgba(0,184,148,0.39)] active:scale-95`}
          >
            Tambah Pemasukan
          </button>
          <button 
            onClick={() => setShowDetailModal(true)}
            className="flex-1 py-3 bg-gray-800/50 hover:bg-gray-800 text-gray-300 border border-gray-700 font-bold text-[10px] md:text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95"
          >
            Statistik
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <AddIncome onClose={() => setShowAddModal(false)} onAdd={handleAddIncome} />
        </div>
      )}

      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <DetailIncome
            onClose={() => setShowDetailModal(false)}
            incomeItems={data}
            onDelete={remove}
            onUpdate={update}
          />
        </div>
      )}
    </div>
  );
};

export default IncomeCard;
