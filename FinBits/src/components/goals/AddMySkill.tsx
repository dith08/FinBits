import { useState } from 'react';
import { ChevronDown, Cpu, Layers, Plus, Star, TrendingUp, X, Zap } from 'lucide-react';
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

interface AddMySkillProps {
  onClose: () => void;
  onAdd: (skill: SkillData) => void;
}

const AddMySkill: React.FC<AddMySkillProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    mainSkill: '',
    currentLevel: '',
    skillProgress: 0,
    subSkills: '',
    weeklyImprovement: '',
    nextStep: ''
  });
  const [loading, setLoading] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.mainSkill && formData.currentLevel && formData.nextStep) {
      setLoading(true);
      
      skillsService.add({
        main_skill: formData.mainSkill,
        current_level: formData.currentLevel,
        skill_progress: Number(formData.skillProgress),
        sub_skills: formData.subSkills,
        weekly_improvement: formData.weeklyImprovement,
        next_step: formData.nextStep
      })
      .then((response) => {
        const newSkill: SkillData = {
          id: response.data?.id || response.id || Date.now(),
          mainSkill: response.data?.mainSkill || formData.mainSkill,
          currentLevel: response.data?.currentLevel || formData.currentLevel,
          skillProgress: response.data?.skillProgress || 0,
          subSkills: response.data?.subSkill || formData.subSkills,
          weeklyImprovement: response.data?.weeklyCommitment || formData.weeklyImprovement,
          nextStep: response.data?.skillGoal || formData.nextStep
        };
        onAdd(newSkill);
      })
      .catch((error) => {
        console.error('Error adding skill:', error);
        alert('Gagal menambah skill');
      })
      .finally(() => {
        setLoading(false);
      });
    }
  };

  return (
    <div 
  className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 overflow-y-auto animate-fadeIn"
  onClick={handleBackdropClick}
>
  <div className="w-full max-w-4xl bg-gradient-to-br from-gray-900 to-[#0a0a0a] rounded-2xl md:rounded-3xl p-5 md:p-6 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 relative my-auto animate-slideUp">
    
    <button 
      onClick={onClose}
      className="absolute right-4 top-4 p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all z-10"
    >
      <X className="w-5 h-5" />
    </button>
    
    <div className="flex items-center gap-4 mb-6 border-b border-gray-800 pb-4">
      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg">
        <Cpu className="w-6 h-6 text-white" />
      </div>
      <div className="text-left">
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent tracking-wide">
          Add New Skill
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Level up your professional arsenal</p>
      </div>
    </div>

    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-white font-semibold text-sm flex items-center gap-2">
              <Star className="w-4 h-4 text-emerald-400" /> Main Skill
            </label>
            <input 
              type="text" 
              name="mainSkill"
              value={formData.mainSkill}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              placeholder="e.g. Frontend Development"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-white font-semibold text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Sub Skills
            </label>
            <input 
              type="text" 
              name="subSkills"
              value={formData.subSkills}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition-all"
              placeholder="e.g. React, JavaScript, CSS"
              required
            />
          </div>
        </div>

        <div className="space-y-4 bg-gray-800/20 p-4 rounded-2xl border border-gray-800/50">
          <div className="space-y-2">
            <label className="text-white font-semibold text-sm">Current Level</label>
            <div className="relative">
              <select 
                name="currentLevel"
                value={formData.currentLevel}
                onChange={handleInputChange}
                className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl p-3 text-white appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer text-sm"
                required
              >
                <option value="">Pilih Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" /> Weekly Improvement
            </label>
            <input 
              type="text" 
              name="weeklyImprovement"
              value={formData.weeklyImprovement}
              onChange={handleInputChange}
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
              placeholder="e.g. +5%"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-white font-semibold text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-400" /> Next Step
        </label>
        <textarea 
          name="nextStep"
          value={formData.nextStep}
          onChange={handleInputChange}
          rows={3}
          className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 resize-none transition-all text-sm"
          placeholder="Describe your next learning steps..."
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-800">
        <button 
          type="button"
          onClick={onClose}
          className="flex-1 border border-gray-700 text-gray-400 py-3 rounded-xl hover:bg-gray-800 hover:text-white transition-all font-medium order-2 sm:order-1"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          {loading ? 'Adding...' : 'Add Skill'}
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default AddMySkill;