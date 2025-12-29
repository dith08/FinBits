import React from 'react';

const goalsData = [
  { id: 1, title: 'Bangun Pagi Setiap Hari Jam 4.00', progress: 25, deadline: '7 Januari 2026' },
  { id: 2, title: 'Belajar Machine Learning', progress: 50, deadline: '31 Januari 2026' },
  { id: 3, title: 'Workout Setiap Hari Jam 17.00', progress: 20, deadline: '2 Desember 2026' },
  { id: 4, title: 'Menyelesaikan Project Web', progress: 76, deadline: '19 Januari 2026' },
];

const GoalsCardDashboard = () => {
  return (
    <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 w-full text-white font-sans">
      <h2 className="text-emerald-400 text-3xl font-bold text-center mb-10 tracking-tight">Goals</h2>
      
      <div className="space-y-8">
        {goalsData.map((goal) => (
          <div key={goal.id} className="flex items-center gap-6 group">
            {/* Bullet Point & Title */}
            <div className="flex items-center gap-3 w-1/3">
              <span className="text-xl font-bold">-</span>
              <p className="text-zinc-300 text-sm font-medium leading-tight line-clamp-2">
                {goal.title}
              </p>
            </div>

            {/* Progress Slider (Custom Style) */}
            <div className="flex-1 relative flex items-center h-2 bg-zinc-900 rounded-full overflow-visible">
              {/* Progress Bar Fill */}
              <div 
                className="absolute h-full bg-zinc-800 rounded-full" 
                style={{ width: `${goal.progress}%` }} 
              />
              {/* Green Dot (Thumb) */}
              <div 
                className="absolute w-5 h-5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform group-hover:scale-110"
                style={{ left: `calc(${goal.progress}% - 10px)` }}
              />
            </div>

            {/* Percentage */}
            <div className="w-12 text-right">
              <span className="text-zinc-300 font-semibold">{goal.progress}%</span>
            </div>

            {/* Deadline */}
            <div className="w-1/4 text-right">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Selesai:</p>
              <p className="text-xs text-zinc-300 font-medium">{goal.deadline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsCardDashboard;