import React, { useState } from 'react';
import { Edit3, X, Check, Code2, Terminal, Layers } from 'lucide-react';

interface ProfileDashboardProps {
  mainSkill?: string;
  subSkill?: string;
  onUpdate?: (data: { main_skill?: string; sub_skill?: string }) => void;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  mainSkill = '',
  subSkill = '',
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    main_skill: mainSkill,
    sub_skill: subSkill
  });

  const mainSkills = mainSkill ? mainSkill.split(',').map(s => s.trim()).filter(Boolean) : [];
  const subSkills = subSkill ? subSkill.split(',').map(s => s.trim()).filter(Boolean) : [];

  const handleSave = () => {
    onUpdate?.(editData);
    setIsEditing(false);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-10 px-6 overflow-hidden">
      
      {/* Tombol Aksi - Floating Style */}
      {onUpdate && (
        <div className="absolute top-4 right-6 z-20">
          {isEditing ? (
            <div className="flex gap-2 bg-zinc-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-2xl">
              <button
                onClick={() => { setIsEditing(false); setEditData({ main_skill: mainSkill, sub_skill: subSkill }); }}
                className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
              <button
                onClick={handleSave}
                className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all"
              >
                <Check size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="group flex items-center gap-2 px-4 py-2 bg-zinc-900/50 hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/30 rounded-2xl transition-all backdrop-blur-sm"
            >
              <Edit3 size={16} />
              <span className="text-sm font-semibold tracking-wide">Perbarui Keterampilan</span>
            </button>
          )}
        </div>
      )}

      <div className="space-y-12">
        
        {/* SECTION MAIN SKILLS */}
        <section className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Code2 className="text-emerald-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Skill Utama</h2>
              <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] mt-0.5">Keahlian Utama</p>
            </div>
          </div>

          {isEditing ? (
            <input
              autoFocus
              value={editData.main_skill}
              onChange={(e) => setEditData({ ...editData, main_skill: e.target.value })}
              className="w-full bg-zinc-900/50 text-emerald-400 border border-emerald-500/30 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
              placeholder="e.g. React, TypeScript, Next.js"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mainSkills.length > 0 ? (
                mainSkills.map((skill) => (
                  <div 
                    key={skill} 
                    className="group relative px-4 py-3 bg-zinc-900/40 border border-white/5 rounded-2xl flex items-center justify-center hover:border-emerald-500/50 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative text-sm font-bold text-zinc-300 group-hover:text-emerald-400 tracking-wide transition-colors">
                      {skill}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center">
                  <p className="text-zinc-600 italic">Belum ada keterampilan utama...</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* SECTION SUB SKILLS */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Layers className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Keterampilan Pendukung</h2>
              <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] mt-0.5">Alat & Utilitas</p>
            </div>
          </div>

          {isEditing ? (
            <input
              value={editData.sub_skill}
              onChange={(e) => setEditData({ ...editData, sub_skill: e.target.value })}
              className="w-full bg-zinc-900/50 text-blue-400 border border-blue-500/30 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
              placeholder="e.g. Docker, Git, Figma, Jest"
            />
          ) : (
            <div className="flex flex-wrap gap-3">
              {subSkills.length > 0 ? (
                subSkills.map((skill) => (
                  <div 
                    key={skill} 
                    className="flex items-center gap-2 px-5 py-2 bg-zinc-800/30 border border-white/5 rounded-full hover:bg-zinc-800 transition-all"
                  >
                    <Terminal size={14} className="text-zinc-500" />
                    <span className="text-xs font-medium text-zinc-400">
                      {skill}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-zinc-600 text-sm italic ml-2">Belum ada sub keterampilan...</p>
              )}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default ProfileDashboard;