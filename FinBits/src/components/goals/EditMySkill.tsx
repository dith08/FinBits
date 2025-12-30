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

interface EditMySkillProps {
  onClose: () => void;
  onSave: (skill: SkillData) => void;
  initialData: SkillData;
}

const EditMySkill: React.FC<EditMySkillProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData);

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
    onSave(formData);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl bg-[#121212] rounded-xl p-6 shadow-2xl border border-gray-800 relative my-4">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        {/* Title */}
        <h2 className="text-xl font-bold text-[#599EFF] text-center mb-6">
          Edit My Skill
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Row 1: Main Skill & Sub Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-white text-xs font-medium">Main Skill</label>
              <input 
                type="text" 
                name="mainSkill"
                value={formData.mainSkill}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#599EFF] transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-white text-xs font-medium">Sub Skills</label>
              <input 
                type="text" 
                name="subSkills"
                value={formData.subSkills}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#599EFF]"
                required
              />
            </div>
          </div>

          {/* Row 2: Current Level & Weekly Improvement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-white text-xs font-medium">Current Level</label>
              <div className="relative">
                <select 
                  name="currentLevel"
                  value={formData.currentLevel}
                  onChange={handleInputChange}
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-sm text-white appearance-none focus:outline-none focus:border-[#599EFF] cursor-pointer"
                  required
                >
                  <option value="">Pilih Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-3 text-gray-500 pointer-events-none" size={14} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-white text-xs font-medium">Weekly Improvement</label>
              <input 
                type="text" 
                name="weeklyImprovement"
                value={formData.weeklyImprovement}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#599EFF]"
                placeholder="e.g. +5%"
              />
            </div>
          </div>

          {/* Row 3: Skill Progress */}
          <div className="space-y-1.5">
            <label className="block text-white text-xs font-medium">
              Skill Progress: {formData.skillProgress}%
            </label>
            <input 
              type="range"
              name="skillProgress"
              min="0"
              max="100"
              value={formData.skillProgress}
              onChange={handleInputChange}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#599EFF]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 px-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Row 4: Next Step (Full Width) */}
          <div className="space-y-1.5">
            <label className="block text-white text-xs font-medium">Next Step</label>
            <textarea 
              name="nextStep"
              value={formData.nextStep}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#599EFF] resize-none"
              placeholder="Describe your next learning steps..."
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4">
            <div className="flex justify-end gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-sm border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 text-sm bg-[#599EFF] hover:bg-[#478cff] text-white font-medium rounded-lg transition-all shadow-lg active:scale-95"
              >
                Update Skill
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMySkill;