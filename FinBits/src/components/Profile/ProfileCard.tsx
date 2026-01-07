import React from 'react';
import Profile from '../../assets/Profile.png'



const ProfileCard: React.FC = () => {
  return (
    <div className="flex items-center justify-center bg-black p-6 font-sans">
      <div className="flex flex-col md:flex-row gap-6 max-w-5xl w-full">
        
        {/* Foto Profil / Avatar */}
        <div className="w-full md:w-1/3 aspect-square bg-white rounded-2xl overflow-hidden flex items-center justify-center">
          <img
            src={Profile}
            alt="Heiley Beiber Avatar" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Konten Utama */}
        <div className="flex flex-col gap-6 w-full md:w-2/3">
          
          {/* Box Deskripsi */}
          <div className="bg-[#121212] p-8 rounded-3xl border border-gray-800/50 flex flex-col justify-center h-full">
            <h1 className="text-3xl font-bold text-white mb-4">Heiley Beiber</h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              I believe the best technologies are the invisible ones solutions so seamless you almost forget they're there.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Currently a student and full-stack developer with expertise in <span className="text-white font-medium">React, Laravel, and Python</span>, I've helped clients increase business efficiency by up to 40% through intuitive yet powerful applications.
            </p>
          </div>

          {/* Box Interest */}
          <div className="bg-transparent border border-gray-800 rounded-[2rem] p-2 flex items-center gap-4">
            <div className="px-6 py-4 border-r border-gray-800">
              <span className="text-white font-bold text-sm tracking-wide">Interest</span>
            </div>
            
            <div className="flex flex-wrap gap-4 px-4 py-2 w-full justify-around">
              <InterestBadge label="Web Development" />
              <InterestBadge label="Gaming" />
              <InterestBadge label="Music" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Sub-komponen buat Badge biar gak repot
const InterestBadge: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div className="px-6 py-2 rounded-xl border border-[#00ff9d] hover:bg-[#00ff9d]/10 transition-colors cursor-default">
      <span className="text-white text-sm font-semibold whitespace-nowrap">
        {label}
      </span>
    </div>
  );
};

export default ProfileCard;