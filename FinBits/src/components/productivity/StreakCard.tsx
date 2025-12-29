import React from 'react';
import { Flame } from 'lucide-react';

const StreakCard = () => {
  return (
    <div className=" flex items-center justify-center p-6 font-sans">
      {/* Container Card Utama */}
      <div className="w-full max-w-sm bg-[#1e1e1e] rounded-2xl p-8 shadow-2xl relative overflow-hidden border border-gray-800">
        
        {/* Judul Streak */}
        <h2 className="text-3xl font-black text-[#ff3b00] italic uppercase tracking-wider mb-8">
          Streak
        </h2>

        {/* Konten Utama: Icon Api & Angka */}
        <div className="flex items-center justify-between px-2">
          {/* Icon Api Besar */}
          <div className="relative">
            <Flame 
              size={120} 
              fill="#ff3b00" 
              stroke="none" 
              className="drop-shadow-[0_0_20px_rgba(255,59,0,0.4)]"
            />
          </div>

          {/* Angka Days */}
          <div className="text-right">
            <h1 className="text-5xl font-black text-[#ff3b00] tracking-tighter italic leading-none">
              174 DAYS
            </h1>
          </div>
        </div>

        {/* Footer Tanggal Start */}
        <div className="mt-12">
          <p className="text-gray-500 text-sm font-medium">
            Start 12 Maret 2025
          </p>
        </div>

        {/* Aksen hiasan dikit biar makin pro */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ff3b00] opacity-5 blur-[80px] rounded-full"></div>
      </div>
    </div>
  );
};

export default StreakCard;