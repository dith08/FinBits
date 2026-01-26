import { useState } from 'react';
import { ChevronDown, X, Loader2, Zap } from 'lucide-react';
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

interface EditMySkillProps {
  onClose: () => void;
  onSave: (skill: SkillData) => void;
  initialData: SkillData;
}

const EditMySkill: React.FC<EditMySkillProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData);
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
      [name]: name === 'skillProgress' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    skillsService.edit(formData.id, {
      main_skill: formData.mainSkill,
      current_level: formData.currentLevel,
      skill_progress: formData.skillProgress,
      sub_skills: formData.subSkills,
      weekly_improvement: formData.weeklyImprovement,
      next_step: formData.nextStep
    })
    .then(() => {
      onSave(formData);
      onClose();
    })
    .catch((error) => {
      console.error('Error updating skill:', error);
      alert('Gagal mengupdate skill');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 overflow-y-auto animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl shadow-green-500/10 border border-gray-800 my-auto animate-slideUp relative">
        
        <button 
          onClick={onClose}
          className="absolute right-3 top-3 md:right-4 md:top-4 p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Edit My Skill
            </h1>
            <p className="text-gray-400 text-xs">Perbarui skill Anda</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-gray-300 font-medium text-xs">Main Skill</label>
              <input 
                type="text" 
                name="mainSkill"
                value={formData.mainSkill}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-gray-300 font-medium text-xs">Sub Skills</label>
              <input 
                type="text" 
                name="subSkills"
                value={formData.subSkills}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-gray-300 font-medium text-xs">Current Level</label>
              <div className="relative">
                <select 
                  name="currentLevel"
                  value={formData.currentLevel}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 text-sm text-white appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 cursor-pointer transition-all"
                  required
                >
                  <option value="">Pilih Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 text-gray-500 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-gray-300 font-medium text-xs">Weekly Improvement</label>
              <input 
                type="text" 
                name="weeklyImprovement"
                value={formData.weeklyImprovement}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all"
                placeholder="e.g. +5%"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-gray-300 font-medium text-xs">
              Skill Progress: <span className="text-green-400 font-bold">{formData.skillProgress}%</span>
            </label>
            <input 
              type="range"
              name="skillProgress"
              min="0"
              max="100"
              value={formData.skillProgress}
              onChange={handleInputChange}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-gray-300 font-medium text-xs">Next Step</label>
            <textarea 
              name="nextStep"
              value={formData.nextStep}
              onChange={handleInputChange}
              rows={2}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 resize-none transition-all"
              placeholder="Describe your next learning steps..."
              required
            />
          </div>

          <div className="pt-2 flex gap-2 justify-end">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs border border-gray-700 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800/50 transition-all font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-1 shadow-lg hover:shadow-green-500/30"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Skill'
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
};

export default EditMySkill;