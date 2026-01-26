import { useState, useEffect } from 'react';
import { productivityService } from '../../services/productivityService';
import type { TopHabit } from '../../types/productivity';

const TopHabitsCard = () => {
  const [topHabit, setTopHabit] = useState<TopHabit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopHabits = async () => {
      try {
        const response = await productivityService.getTopHabits();
        const habits = response.data || [];
        
        if (habits.length > 0) {
          setTopHabit(habits[0]);
        }
      } catch (err) {
        console.error('Error fetching top habits:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopHabits();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-[#1e1e1e] rounded-2xl p-6 border border-gray-800 flex items-center justify-center">
          <div className="animate-pulse text-zinc-400">Memuat...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative w-full max-w-sm rounded-[2rem] bg-emerald-500/5 p-px border border-white/10 overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.15),transparent)]" />
      
      <div className="relative p-7">
        <div className="flex items-center justify-between mb-8">
          <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Kebiasaan MVP</span>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
        </div>

        {topHabit ? (
          <>
            <div className="mb-8">
              <h3 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Juara Mingguan</h3>
              <p className="text-3xl font-bold text-white tracking-tight leading-tight">
                {topHabit.habit_name}
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl p-5 border border-white/5">
              <div className="flex justify-between items-end mb-3">
                <span className="text-zinc-400 text-xs font-medium">Level Progres</span>
                <span className="text-2xl font-black text-emerald-400 tracking-tighter">
                  {topHabit.progress_percentage}%
                </span>
              </div>
              
              <div className="relative h-3 w-full bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${topHabit.progress_percentage}%` }}
                >
                  <div className="absolute top-0 right-0 h-full w-4 bg-white/20 skew-x-12 translate-x-2" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex -space-x-1">
                   {[1,2,3].map(i => (
                     <div key={i} className="h-2 w-2 rounded-full bg-emerald-500/40 border border-zinc-900" />
                   ))}
                </div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                  {topHabit.monthly_completed} penyelesaian bulan ini
                </p>
              </div>
            </div>

            {topHabit.note && (
              <div className="mt-6 flex gap-3 items-start opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="mt-1 h-4 w-1 bg-emerald-500 rounded-full" />
                <p className="text-sm italic text-zinc-400 leading-relaxed font-medium">
                  "{topHabit.note}"
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="py-10 text-center">
            <p className="text-zinc-500 text-sm font-medium italic">Tidak ada kebiasaan. Saatnya mulai!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopHabitsCard;