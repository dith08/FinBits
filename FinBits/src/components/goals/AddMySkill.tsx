import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

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
      const newSkill: SkillData = {
        id: Date.now(),
        ...formData,
        skillProgress: Number(formData.skillProgress)
      };
      onAdd(newSkill);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      {/* Container Utama */}
      <div className="w-full max-w-md bg-[#121212] rounded-2xl p-8 shadow-2xl border border-gray-800 relative my-4">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-[#10B981] text-center mb-8 tracking-wide">
          Add My Skill
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Main Skill */}
          <div className="space-y-2">
            <label className="block text-white font-semibold text-sm tracking-tight">Main Skill</label>
            <input 
              type="text" 
              name="mainSkill"
              value={formData.mainSkill}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#10B981] transition-all"
              placeholder="e.g. Frontend Development"
              required
            />
          </div>

          {/* Sub Skill */}
          <div className="space-y-2">
            <label className="block text-white font-semibold text-sm tracking-tight">Sub Skills</label>
            <input 
              type="text" 
              name="subSkills"
              value={formData.subSkills}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#10B981]"
              placeholder="e.g. React, JavaScript, CSS"
              required
            />
          </div>

          {/* Current Level */}
          <div className="space-y-2">
            <label className="block text-white font-semibold text-sm tracking-tight">Current Level</label>
            <div className="relative">
              <select 
                name="currentLevel"
                value={formData.currentLevel}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-[#10B981] cursor-pointer"
                required
              >
                <option value="">Pilih Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>

          {/* Weekly Improvement */}
          <div className="space-y-2">
            <label className="block text-white font-semibold text-sm tracking-tight">Weekly Improvement</label>
            <input 
              type="text" 
              name="weeklyImprovement"
              value={formData.weeklyImprovement}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#10B981]"
              placeholder="e.g. +5%"
            />
          </div>

          {/* Next Step */}
          <div className="space-y-2">
            <label className="block text-white font-semibold text-sm tracking-tight">Next Step</label>
            <textarea 
              name="nextStep"
              value={formData.nextStep}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#10B981] resize-none"
              placeholder="Describe your next learning steps..."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-xl hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95"
              >
                Add Skill
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddMySkill;