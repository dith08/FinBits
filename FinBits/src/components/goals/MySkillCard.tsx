import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Target, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import AddMySkill from './AddMySkill';
import EditMySkill from './EditMySkill';
import BoostMySkill from './BoostMySkill';
import skillsService from '../../services/skillsService';

interface SkillData {
  id: number;
  mainSkill: string;
  currentLevel: string;
  skillProgress: number;
  subSkills: string;
  weeklyImprovement: string;
  nextStep: string;
}

interface MySkillCardProps {
  onGoalCreated?: () => void;
}

const MySkillCard: React.FC<MySkillCardProps> = ({ onGoalCreated }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedGoalId, setSelectedGoalId] = useState<number | undefined>(undefined);
  
  const [skillData, setSkillData] = useState<SkillData>({
    id: 0,
    mainSkill: "",
    currentLevel: "Beginner",
    skillProgress: 0,
    subSkills: "",
    weeklyImprovement: "0%",
    nextStep: ""
  });

  const fetchSkillData = async () => {
    try {
      setLoading(true);
      const response = await skillsService.getAll();
      console.log('Skills data:', response);
      
      if (response.length > 0) {
        const firstSkill = response[0];
        const skillId = Number(firstSkill.skill_id || firstSkill.id) || 0;
        setSelectedGoalId(skillId);
        
        setSkillData({
          id: skillId,
          mainSkill: String(firstSkill.main_skill || 'No Skill'),
          currentLevel: String(firstSkill.current_level || 'Beginner'),
          skillProgress: Number(firstSkill.skill_progress) || 0,
          subSkills: String(firstSkill.sub_skills || ''),
          weeklyImprovement: String(firstSkill.weekly_improvement || '+0%'),
          nextStep: String(firstSkill.next_step || '')
        });
      }
    } catch (err) {
      console.error('Error fetching skill data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillData();
  }, []);

  const handleUpdateSkill = (updatedSkill: SkillData) => {
    setSkillData(updatedSkill);
    setShowEditForm(false);
  };

  const handleAddSkill = (newSkill: SkillData) => {
    setSkillData(newSkill);
    setShowAddForm(false);
  };

  const handleGoalCreated = () => {
    fetchSkillData();
    if (onGoalCreated) {
      onGoalCreated();
    }
  };

  if (showAddForm) {
    return (
      <div className="w-full border border-gray-800 rounded-2xl shadow-2xl">
        <AddMySkill 
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddSkill}
        />
      </div>
    );
  }

  if (showEditForm) {
    return (
      <div className="w-full border border-gray-800 rounded-2xl shadow-2xl">
        <EditMySkill 
          onClose={() => setShowEditForm(false)}
          onSave={handleUpdateSkill}
          initialData={skillData}
        />
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-h-[600px] backdrop-blur-md border border-slate-800 rounded-[2rem] p-8 shadow-2xl flex flex-col justify-between relative">
        <div className="absolute -bottom-10 -right-10 opacity-[0.03] text-white rotate-12">
          <Sparkles size={250} />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Memuat Statistik Anda...</p>
          </div>
        ) : (
          <>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                    Skill Saya
                  </h2>
                  <p className="text-slate-500 text-xs mt-1 font-medium italic">Monitor perkembangan Kamu di sini.</p>
                </div>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl hover:bg-emerald-500 hover:text-slate-900 transition-all"
                >
                  + Tambah Baru
                </button>
              </div>

              {skillData.mainSkill ? (
                <div className="space-y-6">
                  <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800/50 shadow-inner">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Disiplin Utama</p>
                        <p className="text-xl font-bold text-white">{skillData.mainSkill}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Level</p>
                        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg text-xs font-bold">
                          {skillData.currentLevel}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-400">Progres Penguasaan</span>
                        <span className="text-emerald-400">{skillData.skillProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                          style={{ width: `${skillData.skillProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800/30 transition-colors group">
                      <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                        <Layers size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Sub Skill</p>
                        <p className="text-sm text-slate-200 leading-snug">{skillData.subSkills || '-'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800/30 transition-colors group">
                      <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-colors">
                        <RefreshCw size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Peningkatan Mingguan</p>
                        <p className="text-sm text-slate-200 font-medium italic">"{skillData.weeklyImprovement}"</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                      <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <ArrowRight size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase">Tindakan Berikutnya</p>
                        <p className="text-sm text-slate-200 font-bold">{skillData.nextStep || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-slate-700">
                    <Target size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-300 font-bold">Kosong Melompong</p>
                    <p className="text-xs text-slate-500 max-w-[200px]">Mending Kamu tambahin Skill sekarang biar masa depan makin cerah.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 text-sm font-black text-emerald-500 hover:text-emerald-400 underline underline-offset-8"
                  >
                    INPUT SKILL PERTAMA
                  </button>
                </div>
              )}
            </div>

            {skillData.mainSkill && (
              <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
                <button 
                  onClick={() => setShowEditForm(true)}
                  className="py-4 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all text-xs border border-slate-700"
                >
                  EDIT DATA
                </button>
                <button 
                  onClick={() => setShowBoostModal(true)}
                  className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all text-xs shadow-lg shadow-emerald-500/20 group"
                >
                  TINGKATKAN KETERAMPILAN
                  <Sparkles size={16} className="fill-current group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showBoostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl">
            <BoostMySkill 
              onClose={() => setShowBoostModal(false)}
              skillData={skillData}
              goalId={selectedGoalId}
              onGoalCreated={handleGoalCreated}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MySkillCard;