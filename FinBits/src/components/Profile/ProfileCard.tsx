import React, { useState } from 'react';
import { Edit3, Target, User as UserIcon, Zap } from 'lucide-react';
import DefaultProfile from '../../assets/Profile.png';
import EditProfileModal from './EditProfileModal';

interface ProfileData {
  image_url?: string;
  description?: string;
  main_skill?: string;
  sub_skill?: string;
  interest?: string;
  note?: string;
  motivation?: string;
}

interface ProfileCardProps {
  imageUrl?: string;
  fullName?: string;
  description?: string;
  interest?: string;
  profileData?: ProfileData;
  onUpdate?: (data: ProfileData) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  imageUrl, 
  fullName, 
  description = '',
  interest = '',
  profileData,
  onUpdate
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const interests = interest ? interest.split(',').map(i => i.trim()).filter(Boolean) : [];
  const displayName = fullName || 'Pengguna';

  const handleSave = async (data: ProfileData) => {
    if (onUpdate) {
      await onUpdate(data);
    }
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4">
        <div className="relative flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-stretch">
          
          <div className="w-full sm:w-64 md:w-80 shrink-0 mx-auto sm:mx-0">
            <div 
              className="relative group cursor-pointer aspect-square rounded-2xl sm:rounded-[2rem] overflow-hidden border-2 border-white/5 hover:border-emerald-500/50 transition-all duration-500 shadow-2xl"
              onClick={() => onUpdate && setShowEditModal(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-end p-4 sm:p-6">
                <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs sm:text-sm">
                  <Edit3 size={14} className="sm:w-4 sm:h-4" />
                  <span>Perbarui Foto</span>
                </div>
              </div>

              <img
                src={imageUrl || DefaultProfile}
                alt={displayName} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Status Indicator */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-zinc-950/60 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-white/10 z-20">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] sm:text-[10px] text-zinc-300 font-bold uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 sm:gap-6">
            
            <div className="relative bg-zinc-900/40 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2.5rem] border border-white/5 flex flex-col h-full group overflow-hidden">
              <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <UserIcon size={80} className="sm:w-[120px] sm:h-[120px]" />
              </div>

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter break-words">
                    {displayName}
                  </h1>
                  {onUpdate && (
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="p-2 bg-white/5 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400 rounded-xl transition-all border border-white/5 shrink-0"
                    >
                      <Edit3 size={18} className="sm:w-5 sm:h-5" />
                    </button>
                  )}
                </div>
                
                <p className="text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl">
                  {description || 'Belum ada deskripsi. Klik tombol edit untuk memberitahu dunia tentang diri Anda.'}
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/20 backdrop-blur-sm border border-white/5 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-500/10 rounded-xl sm:rounded-2xl border border-emerald-500/20 w-fit">
                <Target size={16} className="sm:w-[18px] sm:h-[18px] text-emerald-400" />
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Minat</span>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full">
                {interests.length > 0 ? (
                  interests.map((item, idx) => (
                    <InterestBadge key={idx} label={item} />
                  ))
                ) : (
                  <span className="text-zinc-600 text-xs sm:text-sm italic">Belum ada minat...</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
        initialData={profileData}
      />
    </>
  );
};

const InterestBadge: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-zinc-800/50 border border-white/5 hover:border-emerald-500/30 hover:bg-zinc-800 transition-all cursor-default">
      <Zap size={10} className="sm:w-3 sm:h-3 text-zinc-500 group-hover:text-yellow-400 transition-colors" />
      <span className="text-zinc-300 text-xs font-medium whitespace-nowrap group-hover:text-white">
        {label}
      </span>
    </div>
  );
};

export default ProfileCard;