import { useState, useEffect } from 'react';
import { Flame, Calendar, Trophy } from 'lucide-react';
import { productivityService } from '../../services/productivityService';


const StreakCard = () => {
  const [streakData, setStreakData] = useState<{
    currentStreak: number;
    startDate: string | null;
    totalHabits: number;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const habitsResponse = await productivityService.getHabits();
        const habits = habitsResponse.data || [];
        
        if (habits.length > 0) {
          const streakResponse = await productivityService.getHabitStreak(habits[0].habit_id);
          setStreakData({
            currentStreak: streakResponse.current_streak,
            startDate: streakResponse.streak_start_date,
            totalHabits: streakResponse.total_active_habits,
            message: streakResponse.streak_message
          });
        } else {
          setStreakData({
            currentStreak: 0,
            startDate: null,
            totalHabits: 0,
            message: 'Mulai dengan menambahkan habit baru!'
          });
        }
      } catch (err) {
        console.error('Error fetching streak:', err);
        setStreakData({
          currentStreak: 0,
          startDate: null,
          totalHabits: 0,
          message: 'Gagal memuat data streak'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-[#1e1e1e] rounded-2xl p-8 border border-gray-800 flex items-center justify-center">
          <div className="animate-pulse text-zinc-400">Memuat streak...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-zinc-900 p-1 transition-all hover:scale-[1.02]">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-600/20 blur-[80px] transition-all group-hover:bg-orange-600/30" />
      
      <div className="relative h-full rounded-[1.8rem] bg-zinc-950 p-8 border border-white/5">
        <div className="flex justify-between items-start mb-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500/80">Momentum Saat Ini</span>
            <h2 className="text-3xl font-black italic text-white tracking-tighter leading-none mt-1">
              STREAK KEBIASAAN
            </h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/20">
            <Trophy size={20} className="text-orange-500" />
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-orange-600/40 animate-pulse rounded-full" />
            <Flame 
              size={100} 
              fill={streakData?.currentStreak ? "#f97316" : "#27272a"}
              stroke="none" 
              className="relative z-10"
            />
          </div>

          <div className="text-right pb-2">
            <div className="flex flex-col">
              <span className="text-7xl font-black italic tracking-tighter text-white leading-none">
                {streakData?.currentStreak || 0}
              </span>
              <span className="text-xl font-bold italic text-orange-500 tracking-widest uppercase">
                Hari
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-zinc-500" />
            <span className="text-[11px] font-medium text-zinc-400">
              {formatDate(streakData?.startDate)}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2 text-right">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
             <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-tighter">
               {streakData?.totalHabits} Tugas Aktif
             </span>
          </div>
        </div>
        
        {streakData?.message && (
          <div className="mt-4 rounded-xl bg-emerald-500/5 p-3 border border-emerald-500/10">
            <p className="text-[11px] text-center text-emerald-400 font-medium italic">
              " {streakData.message} "
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakCard;