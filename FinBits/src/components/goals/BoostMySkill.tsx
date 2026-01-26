import { useState } from 'react';
import { Sparkles, ChevronDown, X, Loader2, Layers, AlertCircle } from 'lucide-react';
import { aiGoalsService, goalsService, roadmapsAIService } from '../../services/goalsService';
import apiInstance from '../../services/apiInstance';
import { AlertModal } from '../common';
import { useAlert } from '../../hooks';

interface SkillData {
  id: number;
  mainSkill: string;
  currentLevel: string;
  skillProgress: number;
  subSkills: string;
  weeklyImprovement: string;
  nextStep: string;
}

interface BoostResult {
  weeks?: Array<{ week: number; task: string }>;
  dailyAction?: string;
  projection?: string;
  aiNote?: string;
  newSubSkills?: string[];
}

interface BoostMySkillProps {
  onClose: () => void;
  skillData: SkillData;
  goalId?: number;
  onGoalCreated?: () => void;
}

const BoostMySkill: React.FC<BoostMySkillProps> = ({ onClose, skillData, goalId, onGoalCreated }) => {
  const [targetLevel, setTargetLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingToGoals, setAddingToGoals] = useState(false);
  const [result, setResult] = useState<BoostResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { alert, showSuccess, closeAlert } = useAlert();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

const handleBoost = async () => {
    if (!targetLevel || !duration) {
      setError('Pilih target level dan durasi terlebih dahulu');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const deadlineDate = new Date();
      if (duration === '1-month') {
        deadlineDate.setMonth(deadlineDate.getMonth() + 1);
      } else if (duration === '3-months') {
        deadlineDate.setMonth(deadlineDate.getMonth() + 3);
      } else if (duration === '6-months') {
        deadlineDate.setMonth(deadlineDate.getMonth() + 6);
      }

      const goalData = {
        name: `${skillData.mainSkill} - ${targetLevel}`,
        category: 'Career',
        outcome: `Mencapai level ${targetLevel} dalam ${skillData.mainSkill}`,
        why: `Meningkatkan skill ${skillData.mainSkill} dari ${skillData.currentLevel} ke ${targetLevel}`,
        deadline: deadlineDate.toISOString().split('T')[0],
        progress: 0,
      };

      console.log('Creating goal with data:', goalData);
      const goalResponse = await goalsService.add(goalData);
      console.log('Goal created:', goalResponse);

      const newGoalId = goalResponse.data?.id || goalResponse.data?.goal_id || 
                        goalResponse.data?.goal_detail_id || goalResponse.id || 
                        goalResponse.goal_id || goalResponse.goal_detail_id;
      
      if (newGoalId) {
        console.log('Generating AI roadmap for goal:', newGoalId);
        try {
          await roadmapsAIService.add(newGoalId);
          console.log('AI Roadmap created');
        } catch (roadmapErr) {
          console.log('Roadmap AI generation skipped or failed:', roadmapErr);
        }
      }

      showSuccess(`Skill "${skillData.mainSkill}" berhasil dikonversi menjadi goal! 🎯`);
      
      if (onGoalCreated) {
        onGoalCreated();
      }
      
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (err: unknown) {
      console.error('Error converting skill to goal:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Gagal mengkonversi skill ke goal');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToGoals = async () => {
    if (!result || !result.weeks || result.weeks.length === 0) {
      setError('Tidak ada hasil untuk ditambahkan ke goals');
      return;
    }

    setAddingToGoals(true);
    setError(null);
    
    try {
      const deadlineDate = new Date();
      if (duration === '1-month') {
        deadlineDate.setMonth(deadlineDate.getMonth() + 1);
      } else if (duration === '3-months') {
        deadlineDate.setMonth(deadlineDate.getMonth() + 3);
      } else if (duration === '6-months') {
        deadlineDate.setMonth(deadlineDate.getMonth() + 6);
      } else {
        deadlineDate.setMonth(deadlineDate.getMonth() + 1);
      }

      const goalData = {
        name: `${skillData.mainSkill} - ${targetLevel}`,
        category: 'Career',
        outcome: result.newSubSkills?.join(', ') || `Mencapai level ${targetLevel} dalam ${skillData.mainSkill}`,
        why: result.aiNote || `Meningkatkan skill ${skillData.mainSkill} dari ${skillData.currentLevel} ke ${targetLevel}`,
        deadline: deadlineDate.toISOString().split('T')[0],
        progress: 0,
      };

      console.log('Creating goal with data:', goalData);
      const goalResponse = await goalsService.add(goalData);
      console.log('Goal created:', goalResponse);

      const newGoalId = goalResponse.data?.id || goalResponse.data?.goal_id || goalResponse.id || goalResponse.goal_id;
      
      if (newGoalId) {
        console.log('Generating AI roadmap for goal:', newGoalId);
        try {
          await roadmapsAIService.add(newGoalId);
          console.log('AI Roadmap created');
        } catch (roadmapErr) {
          console.log('Roadmap AI generation skipped or failed:', roadmapErr);
        }
      }

      showSuccess('Skill boost plan berhasil ditambahkan ke goals!');
      
      if (onGoalCreated) {
        onGoalCreated();
      }
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      console.error('Error adding to goals:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Gagal menambahkan ke goals');
    } finally {
      setAddingToGoals(false);
    }
  };

  return (
  <div 
    className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
  >
    <div className="w-full max-w-5xl border border-slate-800 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative my-4 max-h-[95vh] overflow-hidden flex flex-col">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>

      <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Sparkles className="w-6 h-6 text-slate-900 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Boost Your Skill</h1>
            <p className="text-xs text-slate-500 font-medium">Accelerated AI Learning Path</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Skill</label>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-emerald-400 font-bold text-sm">
                  {skillData.mainSkill}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Current</label>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-white font-bold text-sm">
                  {skillData.currentLevel}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300">Target Proficiency</label>
              <div className="relative">
                <select 
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 px-5 appearance-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm font-medium text-white"
                >
                  <option value="">Pilih Target Level</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300">Time Commitment</label>
              <div className="relative">
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 px-5 appearance-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm font-medium text-white"
                >
                  <option value="">Pilih Durasi</option>
                  <option value="1-month">1 Bulan (Intensive)</option>
                  <option value="3-months">3 Bulan (Steady)</option>
                  <option value="6-months">6 Bulan (Deep Dive)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 pointer-events-none" />
              </div>
            </div>

            <button 
              onClick={handleBoost}
              disabled={loading || !targetLevel || !duration}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/10 disabled:opacity-30 mt-8"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5 fill-current" /> CONVERT TO GOAL</>}
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900/30 rounded-[2rem] border border-slate-800/50 p-8">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              Konversi Skill ke Goal
            </h2>
            
            <div className="space-y-4 text-slate-300">
              <p className="text-sm leading-relaxed">
                Dengan mengklik tombol <span className="font-bold text-emerald-400">"CONVERT TO GOAL"</span>, skill ini akan langsung dikonversi menjadi goal dengan:
              </p>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold mt-1">✓</span>
                  <span>Target level yang kamu pilih</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold mt-1">✓</span>
                  <span>Durasi komitmen yang realistis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold mt-1">✓</span>
                  <span>AI-generated roadmap otomatis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold mt-1">✓</span>
                  <span>Progress tracking yang terukur</span>
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-xs font-bold text-emerald-400 mb-2">💡 PRO TIP</p>
                <p className="text-xs text-slate-400">Pilih durasi yang sesuai dengan kapasitas lu. Lebih lama = lebih dalam, tapi lebih fleksibel.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    
    <AlertModal {...alert} onClose={closeAlert} />
  </div>
);
};

export default BoostMySkill;
