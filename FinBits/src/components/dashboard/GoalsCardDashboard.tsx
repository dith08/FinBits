import { useEffect, useState } from 'react';
import type { DashboardData } from '../../types/dashboard';
import { dashboardService } from '../../services/dashboardService';
import { Target, Calendar } from 'lucide-react';

const GoalsCardDashboard = () => {
  const [goalsData, setGoalsData] = useState<DashboardData['goals'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoalsData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getDashboardData();
        setGoalsData(response.data.goals);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || 'Gagal memuat data goals');
      } finally {
        setLoading(false);
      }
    };

    fetchGoalsData();
  }, []);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Tidak Ada Batas Waktu';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="w-full h-full min-h-[300px] bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 animate-pulse">
         <div className="h-8 w-1/3 bg-zinc-800 rounded mb-8" />
         <div className="space-y-4">
           {[1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-zinc-800 rounded-2xl" />)}
         </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-zinc-900/60 border border-zinc-800 rounded-3xl">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!goalsData || goalsData.activeGoals.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 text-center">
        <Target size={48} className="text-zinc-700 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Tidak Ada Target Aktif</h2>
        <p className="text-zinc-500 text-sm">Saatnya menetapkan target baru!</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#09090b] p-6 md:p-8 rounded-3xl border border-zinc-800 hover:border-violet-500/30 transition-all duration-300 flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="text-violet-500" /> Target Aktif
          </h2>
          <p className="text-zinc-500 text-xs md:text-sm mt-1 max-w-xs leading-relaxed">
            {goalsData.totalGoalsMessage}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-mono text-violet-400 bg-violet-500/10 px-2 py-1 rounded border border-violet-500/20">
            {goalsData.activeGoals.length} TARGET
          </span>
          {goalsData.activeGoals.some(g => g.progress === 100) && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              {goalsData.activeGoals.filter(g => g.progress === 100).length} SELESAI
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {goalsData.activeGoals.slice(0, 4).map((goal, index) => {
          const isCompleted = goal.progress === 100;
          return (
            <div key={index} className={`group relative border rounded-2xl p-4 transition-all duration-300 ${
              isCompleted 
                ? 'bg-emerald-900/20 border-emerald-500/40 hover:border-emerald-500/60' 
                : 'bg-zinc-900/50 border-zinc-800/50 hover:border-violet-500/40'
            }`}>
              
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <h3 className={`text-sm font-medium line-clamp-1 transition-colors ${
                    isCompleted 
                      ? 'text-emerald-300 line-through' 
                      : 'text-zinc-200 group-hover:text-violet-300'
                  }`}>
                    {goal.name}
                  </h3>
                  {isCompleted && (
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
                      ✓ SELESAI
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                  <Calendar size={10} />
                  {formatDate(goal.dueDate)}
                </div>
              </div>

              <div className="relative">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-500 font-mono">Progres</span>
                  <span className={`font-bold font-mono ${isCompleted ? 'text-emerald-400' : 'text-violet-400'}`}>
                    {goal.progress}%
                  </span>
                </div>
                
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-emerald-600 to-green-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                        : 'bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                    }`}
                    style={{ width: `${goal.progress}%` }} 
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsCardDashboard;