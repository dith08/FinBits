import React, { useState } from 'react';
import { useFinanceData } from '../../hooks/useFinanceData';
import { expenseService } from '../../services/financeService';
import { LoadingSpinner, ErrorMessage } from '../common';
import AddExpense from './AddExpense';
import DetailExpense from './DetailExpense';
import { COLOR_CLASSES } from '../../constants/colors';

export interface ExpenseItem {
  id: number;
  label: string;
  value: string;
  amount: number;
  date: string;
  source: string;
  category: string;
}

const transformExpense = (item: any): ExpenseItem => ({
  id: item.expense_id,
  label: item.source || item.category || 'Expense',
  value: `Rp ${Number(item.amount).toLocaleString('id-ID')}`,
  amount: Number(item.amount),
  date: item.date,
  source: item.source,
  category: item.category,
});

export const ExpenseCard: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { data, loading, error, total, refresh, add, update, remove } = useFinanceData({
    service: expenseService,
    transform: transformExpense,
  });

  const handleAddExpense = async (amount: string, source: string, date: string, category?: string) => {
    const success = await add({
      amount: parseInt(amount),
      source,
      date,
      category: category || 'Lainnya',
    });
    if (success) setShowAddModal(false);
  };

  if (loading) return <LoadingSpinner color="#ef4444" />;

  return (
    <div className="relative group overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 p-1 rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-400 opacity-10 group-hover:opacity-30 transition duration-500 blur-md"></div>

      <div className="relative bg-[#0d0d0d] p-6 rounded-[calc(1rem-1px)] h-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">
              Pengeluaran<span className={COLOR_CLASSES.danger.text}>.</span>
            </h2>
            <p className="text-xs text-gray-500 font-medium tracking-widest">ALIRAN KELUAR BULANAN</p>
          </div>
          <div className={`p-2 ${COLOR_CLASSES.danger.bgLight} rounded-lg`}>
            <svg className={`w-6 h-6 ${COLOR_CLASSES.danger.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>

        {error && <ErrorMessage message={error} onRetry={refresh} />}

        <div className="space-y-4 mb-8">
          {data.length === 0 ? (
            <div className="flex flex-col items-center py-8 opacity-40">
              <p className="text-sm">Catatan Kosong</p>
            </div>
          ) : (
            <>
              {data.slice(0, 5).map((item) => (
                <div key={item.id} className={`group/item flex justify-between items-center py-2 border-b border-gray-800/50 hover:border-red-500/30 transition-colors`}>
                  <div className="flex flex-col">
                    <span className="text-gray-200 text-sm font-medium group-hover/item:text-white transition-colors">{item.label}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{item.category}</span>
                  </div>
                  <span className={`${COLOR_CLASSES.danger.text} font-mono font-bold tracking-tighter`}>{item.value}</span>
                </div>
              ))}
              {data.length > 5 && (
                <button onClick={() => setShowDetailModal(true)} className="w-full text-[11px] text-gray-500 hover:text-gray-300 transition-colors py-1">
                  LIHAT SEMUA {data.length} TRANSAKSI
                </button>
              )}
            </>
          )}
        </div>

        <div className="bg-gray-800/30 p-4 rounded-xl mb-6 border border-gray-700/50">
          <div className="flex justify-between items-center gap-2">
            <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-bold tracking-widest shrink-0">
              Total Pengeluaran
            </span>

            <span className="text-sm sm:text-lg md:text-2xl font-black text-white leading-none text-right break-all">
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className={`py-3 px-4 ${COLOR_CLASSES.danger.bg} hover:bg-red-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all`}
          >
            Tambah Baru
          </button>
          <button
            onClick={() => setShowDetailModal(true)}
            className="py-3 px-4 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 rounded-xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all"
          >
            Riwayat
          </button>
        </div>
      </div>

      {showAddModal && (
        <AddExpense onClose={() => setShowAddModal(false)} onAdd={handleAddExpense} />
      )}

      {showDetailModal && (
        <DetailExpense
          onClose={() => setShowDetailModal(false)}
          expenseItems={data}
          onDelete={remove}
          onUpdate={update}
        />
      )}
    </div>
  );
};

export default ExpenseCard;
