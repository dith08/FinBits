import { useState } from 'react';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { RefreshCw } from 'lucide-react';
import scoringService from '../../../services/scoringService';
import { COLOR_CLASSES } from '../../../constants/colors';

const ProductivityScoreCard = () => {
  const { data, loading, refresh } = useDashboardData({
    selector: (d) => ({ score: d.data.productivity.score, trend: d.data.productivity.trend }),
    cacheKey: 'productivity_score',
  });
  const [refreshing, setRefreshing] = useState(false);
  const [newScore, setNewScore] = useState<number | null>(null);

  const score = newScore !== null ? newScore : (data?.score ?? 0);
  const trend = data?.trend ?? '0%';
  
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "text-cyan-500";
    if (s >= 50) return "text-amber-500";
    return "text-zinc-500";
  };
  
  const themeColor = getColor(score);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const result = await scoringService.recalculateProductivity();
      const newVal = result.productivityScore || null;
      setNewScore(newVal);
      setTimeout(() => {
        refresh();
      }, 1000);
    } catch (error) {
      console.error('Error refreshing productivity score:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900/60 p-6 rounded-3xl w-full h-full border border-zinc-800 animate-pulse min-h-[250px] flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border-4 border-zinc-800" />
      </div>
    );
  }

  return (
    <div className={`group relative w-full h-full bg-[#09090b] p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col items-center justify-between border border-zinc-800 ${COLOR_CLASSES.accent.hover} transition-all duration-300 ${COLOR_CLASSES.accent.glow}`}>
      
      <div className="w-full flex justify-between items-center mb-2">
        <h3 className="text-white font-bold text-base md:text-lg tracking-wide">Produktivitas</h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)] hover:bg-cyan-400 transition-all disabled:opacity-50 p-1"
          title="Hitung Ulang Skor Produktivitas"
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>
      
      <div className="relative flex items-center justify-center py-2 md:py-4 w-full">
        <div className={`absolute inset-0 bg-cyan-500/20 blur-[30px] md:blur-[40px] rounded-full transform scale-75 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <svg className="w-32 h-32 md:w-48 md:h-48 transform -rotate-90 drop-shadow-2xl transition-all duration-500" viewBox="0 0 192 192">
          <circle 
            cx="96" cy="96" r={radius} 
            stroke="currentColor" 
            strokeWidth="8" 
            fill="transparent" 
            className="text-zinc-800/50" 
          />
          <circle 
            cx="96" cy="96" r={radius} 
            stroke="currentColor" 
            strokeWidth="8" 
            fill="transparent"
            className={`${themeColor} transition-all duration-1000 ease-out`}
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
            strokeLinecap="round" 
            style={{ filter: "drop-shadow(0px 0px 6px currentColor)" }}
          />
        </svg>
        
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl md:text-5xl font-bold text-white tracking-tighter font-mono">{score}</span>
          <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mt-1">Skor</span>
        </div>
      </div>

      <div className="w-full bg-zinc-900/80 rounded-xl p-2 md:p-3 border border-zinc-800 flex items-center justify-between mt-2">
        <span className="text-zinc-400 text-[10px] md:text-xs">Tren</span>
        <span className="text-white text-xs md:text-sm font-medium font-mono">{trend}</span>
      </div>
    </div>
  );
};

export default ProductivityScoreCard;