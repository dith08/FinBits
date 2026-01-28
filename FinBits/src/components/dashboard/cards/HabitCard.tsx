import { Activity, Zap } from 'lucide-react';
import { useDashboardData } from '../../../hooks/useDashboardData';

const HabitCard = () => {
  const { data: consistency, loading } = useDashboardData({
    selector: (data) => {
      const value = data.data.habit.consistency;
      if (typeof value === 'number') {
        return Math.min(Math.max(Math.round(value), 0), 100);
      }
      if (Array.isArray(value) && value.length > 0) {
        const num = Number(value[0]);
        return isNaN(num) ? 0 : Math.min(Math.max(Math.round(num), 0), 100);
      }
      return 0;
    },
    cacheKey: 'habit_consistency',
  });

  const displayValue = consistency ?? 0;

  if (loading) return <CardSkeleton />;

  return (
    <div className="relative w-full h-full overflow-hidden group rounded-2xl md:rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-4 md:p-6 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]">
      <div className="absolute -left-10 -bottom-10 h-24 w-24 md:h-32 md:w-32 rounded-full bg-cyan-500/10 blur-3xl group-hover:bg-cyan-500/20 transition-all duration-500" />

      <div className="relative z-10 flex flex-col h-full min-h-[140px]">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-zinc-800/50 border border-zinc-700/50 text-cyan-400">
            <Activity className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex gap-0.5 items-end h-6 md:h-8">
            {[40, 70, 50, 90, 60].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} className="w-1 bg-zinc-700/50 rounded-t-sm group-hover:bg-cyan-500/50 transition-colors" />
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <h3 className="text-zinc-400 font-medium text-xs md:text-sm tracking-wide">Konsistensi</h3>
          <div className="flex items-center gap-2 md:gap-3 mt-1">
            <span className="text-3xl md:text-4xl font-bold text-white font-mono">{displayValue}%</span>
            {displayValue > 80 && (
               <span className="flex items-center text-[10px] md:text-xs text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 whitespace-nowrap">
                 <Zap size={10} className="mr-1 fill-amber-400" /> LUAR BIASA
               </span>
            )}
          </div>
          
          <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 md:mt-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${displayValue}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CardSkeleton = () => (
  <div className="w-full h-full min-h-[160px] rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 animate-pulse flex flex-col justify-between">
    <div className="w-10 h-10 bg-zinc-800 rounded-2xl" />
    <div className="space-y-2 w-full">
      <div className="w-24 h-4 bg-zinc-800 rounded" />
      <div className="w-full h-2 bg-zinc-800 rounded-full" />
    </div>
  </div>
);

export default HabitCard;