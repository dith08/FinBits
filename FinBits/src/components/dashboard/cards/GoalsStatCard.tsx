import { Target } from 'lucide-react';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { COLOR_CLASSES } from '../../../constants/colors';

const GoalsStatCard = () => {
  const { data: goalsData, loading } = useDashboardData({
    selector: (data) => ({
      message: data.data.goals.totalGoalsMessage,
      activeGoals: data.data.goals.activeGoals,
    }),
    cacheKey: 'goals_message',
  });

  const completedCount = goalsData?.activeGoals?.filter((g: { progress: number }) => g.progress === 100).length || 0;
  const totalCount = goalsData?.activeGoals?.length || 0;
  
  const displayMessage = completedCount > 0 
    ? `Menyelesaikan ${completedCount} dari ${totalCount} target`
    : goalsData?.message || "Tidak ada target yang ditetapkan";

  if (loading) return <CardSkeleton />;

  return (
    <div className={`relative w-full h-full overflow-hidden group rounded-2xl md:rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-4 md:p-6 transition-all duration-300 ${COLOR_CLASSES.primary.hover} ${COLOR_CLASSES.primary.glow}`}>
      <Target 
        className="absolute -bottom-4 -right-4 text-emerald-500/5 group-hover:text-emerald-500/10 transition-all duration-500 transform group-hover:scale-110 rotate-12 w-20 h-20 md:w-32 md:h-32" 
        strokeWidth={1}
      />
      
      <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
        <div className={`p-2 md:p-3 w-fit rounded-xl md:rounded-2xl bg-zinc-800/50 border border-zinc-700/50 ${COLOR_CLASSES.primary.text}`}>
          <Target className="w-5 h-5 md:w-6 md:h-6" />
        </div>

        <div className="mt-4 md:mt-6">
          <h3 className="text-zinc-400 font-medium text-xs md:text-sm tracking-wide mb-1">Fokus Saat Ini</h3>
          <p className="text-lg md:text-xl font-semibold text-white leading-snug max-w-[95%] line-clamp-2 md:line-clamp-none">
            {displayMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

const CardSkeleton = () => (
  <div className="w-full h-full min-h-[180px] rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 animate-pulse">
    <div className="w-10 h-10 bg-zinc-800 rounded-2xl mb-8" />
    <div className="w-3/4 h-6 bg-zinc-800 rounded mb-2" />
    <div className="w-1/2 h-6 bg-zinc-800 rounded" />
  </div>
);

export default GoalsStatCard;