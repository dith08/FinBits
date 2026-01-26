import { useState } from 'react';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { Wallet, RefreshCw } from 'lucide-react';
import scoringService from '../../../services/scoringService';
import { COLOR_CLASSES } from '../../../constants/colors';

const FinanceScoreCard = () => {
  const { data: score, loading, refresh } = useDashboardData({
    selector: (data) => data.data.finance.score,
    cacheKey: 'finance_score',
  });
  const [refreshing, setRefreshing] = useState(false);
  const [newScore, setNewScore] = useState<number | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const result = await scoringService.recalculateFinance();
      const newVal = result.financeScore || null;
      setNewScore(newVal);
      setTimeout(() => {
        refresh();
      }, 1000);
    } catch (error) {
      console.error('Error refreshing finance score:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const displayScore = newScore !== null ? newScore : score;

  if (loading) return <CardSkeleton />;

  return (
    <div className={`relative w-full h-[200] overflow-hidden group rounded-2xl md:rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-4 md:p-6 transition-all duration-300 ${COLOR_CLASSES.primary.hover} ${COLOR_CLASSES.primary.glow}`}>
      <div className="absolute -right-10 -top-10 h-24 w-24 md:h-32 md:w-32 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
      
      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
        <div className="flex items-center justify-between">
          <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl bg-zinc-800/50 border border-zinc-700/50 ${COLOR_CLASSES.primary.text}`}>
            <Wallet className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`text-[10px] md:text-xs font-mono ${COLOR_CLASSES.primary.text} ${COLOR_CLASSES.primary.bgLight} px-2 py-1 rounded-full ${COLOR_CLASSES.primary.border} ${COLOR_CLASSES.primary.borderLight} flex items-center gap-1 hover:bg-emerald-500/20 transition-all disabled:opacity-50`}
            title="Hitung Ulang Skor Keuangan"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'MEMPERBARUI' : 'SEHAT'}
          </button>
        </div>

        <div>
          <p className="text-zinc-400 font-medium text-xs md:text-sm tracking-wide">Skor Keuangan</p>
          <div className="flex items-baseline gap-1 mt-1">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-sans">
              {displayScore}
            </h2>
            <span className={`text-lg md:text-xl ${COLOR_CLASSES.primary.text} font-bold`}>%</span>
          </div>
          <p className="text-[10px] md:text-xs text-zinc-500 mt-1 md:mt-2">Kesehatan Finansial</p>
        </div>
      </div>
    </div>
  );
};

const CardSkeleton = () => (
  <div className="w-full h-full min-h-[160px] rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 md:p-6 animate-pulse flex flex-col justify-between">
    <div className="w-10 h-10 bg-zinc-800 rounded-2xl" />
    <div className="space-y-2">
      <div className="w-24 h-4 bg-zinc-800 rounded" />
      <div className="w-16 h-8 bg-zinc-800 rounded" />
    </div>
  </div>
);

export default FinanceScoreCard;