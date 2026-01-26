import { useEffect, useState } from 'react';
import type { DashboardData } from '../../types/dashboard';
import { dashboardService } from '../../services/dashboardService';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, RefreshCw } from 'lucide-react';

const FinanceCardDashboard = () => {
  const [financeData, setFinanceData] = useState<DashboardData['finance'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getDashboardData();
        setFinanceData(response.data.finance);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || 'Gagal memuat data keuangan');
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="w-full h-full min-h-[300px] rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col gap-4 animate-pulse">
        <div className="w-32 h-8 bg-zinc-800 rounded-lg mx-auto" />
        <div className="grid grid-cols-1 gap-6 mt-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
                <div className="w-20 h-6 bg-zinc-800 rounded-lg" />
              </div>
              <div className="w-32 h-8 bg-zinc-800 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[300px] rounded-3xl border border-red-500/20 bg-zinc-900/60 p-6 flex flex-col items-center justify-center text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition border border-red-500/20"
        >
          <RefreshCw size={16} /> Coba Lagi
        </button>
      </div>
    );
  }

  if (!financeData) return null;

  return (
    <div className="relative w-full h-full flex flex-col p-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex items-center gap-2 mb-8">
        <div className="p-2 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
          <Wallet size={20} className="text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Ringkasan Keuangan</h3>
          <p className="text-sm text-zinc-400">Ringkasan keuangan bulan ini</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/30 hover:bg-zinc-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium">Pemasukan</p>
              <p className="text-white font-semibold text-lg">
                {formatCurrency(financeData.pemasukan)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-400">Per bulan</p>
            <p className="text-emerald-400 text-sm font-medium">+{formatCurrency(financeData.pemasukan)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/30 hover:bg-zinc-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <TrendingDown size={20} className="text-rose-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium">Pengeluaran</p>
              <p className="text-white font-semibold text-lg">
                {formatCurrency(financeData.pengeluaran)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-400">Per bulan</p>
            <p className="text-rose-400 text-sm font-medium">-{formatCurrency(financeData.pengeluaran)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/30 hover:bg-zinc-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <PiggyBank size={20} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium">Tabungan</p>
              <p className="text-white font-semibold text-lg">
                {formatCurrency(financeData.tabungan)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-400">Total tabungan</p>
            <p className="text-amber-400 text-sm font-medium">+{formatCurrency(financeData.tabungan)}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-zinc-800/50">
        <p className="text-xs text-zinc-500 text-center">
          Data diperbarui {new Date().toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>
      </div>
    </div>
  );
};

export default FinanceCardDashboard;