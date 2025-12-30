import { useState, useRef } from 'react';
import { Camera, Calendar, ChevronDown, X } from 'lucide-react';

interface GoalData {
  name: string;
  progress: number;
  category: string;
  outcome: string;
  why: string;
  deadline: string;
  roadmapImage?: string;
}

interface AddGoalsProps {
  onClose: () => void;
  onAdd: (goal: GoalData) => void;
}

const AddGoalForm: React.FC<AddGoalsProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState<GoalData>({
    name: '',
    progress: 0,
    category: '',
    outcome: '',
    why: '',
    deadline: '',
    roadmapImage: undefined
  });
  
  const [roadmapImage, setRoadmapImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) { // 3MB
        alert('File terlalu besar. Maksimal 3MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setRoadmapImage(imageUrl);
        setFormData(prev => ({ ...prev, roadmapImage: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (formData.name && formData.category && formData.outcome && formData.why && formData.deadline) {
      onAdd({
        ...formData,
        roadmapImage: roadmapImage || undefined
      });
      onClose();
    }
  };

  const handleRemoveImage = () => {
    setRoadmapImage(null);
    setFormData(prev => ({ ...prev, roadmapImage: undefined }));
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
        
        {/* Title - lebih kecil */}
        <h2 className="text-xl font-bold text-[#10B981] text-center mb-5">
          Add New Goals
        </h2>

        <div className="space-y-4">
          {/* Row 1: Nama Goals & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Goals */}
            <div className="space-y-1.5">
              <label className="block text-white text-xs font-medium">Nama Goals</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#10B981] transition-all"
                placeholder="Masukkan nama goal"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-white text-xs font-medium">Category</label>
              <div className="relative">
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-sm text-white appearance-none focus:outline-none focus:border-[#10B981]"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Career">Career</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                  <option value="Personal">Personal</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-3 text-gray-500 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          {/* Row 2: Outcome & Why */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Outcome */}
            <div className="space-y-1.5">
              <label className="block text-white text-xs font-medium">Outcome</label>
              <input 
                type="text" 
                name="outcome"
                value={formData.outcome}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                placeholder="Hasil yang diharapkan"
              />
            </div>

            {/* Why */}
            <div className="space-y-1.5">
              <label className="block text-white text-xs font-medium">Why</label>
              <input 
                type="text" 
                name="why"
                value={formData.why}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                placeholder="Alasan mencapai goal ini"
              />
            </div>
          </div>

          {/* Row 3: Progress & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Progress */}
            <div className="space-y-1.5">
              <label className="block text-white text-xs font-medium">
                Progress: {formData.progress}%
              </label>
              <input 
                type="range"
                name="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleInputChange}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#10B981]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 px-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-1.5">
              <label className="block text-white text-xs font-medium">Deadline</label>
              <div className="relative">
                <input 
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#10B981] appearance-none cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                />
                <Calendar className="absolute right-2.5 top-3 text-gray-500 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          {/* Roadmaps / Upload Image - Full Width */}
          <div className="space-y-1.5">
            <label className="block text-white text-xs font-medium">Roadmaps</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border ${roadmapImage ? 'border-[#10B981]' : 'border-gray-700'} border-dashed rounded-lg p-4 flex flex-col items-center justify-center bg-[#1A1A1A] hover:bg-[#222] transition-colors cursor-pointer`}
            >
              {roadmapImage ? (
                <div className="relative w-full max-w-xs">
                  <img 
                    src={roadmapImage} 
                    alt="Roadmap preview" 
                    className="w-full h-28 object-contain rounded mb-1"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="absolute top-1 right-1 p-1.5 bg-red-900/50 hover:bg-red-800/70 rounded transition-colors"
                  >
                    <X size={14} className="text-red-400" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-full mb-2">
                    <Camera className="text-gray-500" size={24} />
                  </div>
                  <span className="text-gray-500 font-medium text-sm">Upload Roadmap</span>
                  <span className="text-gray-600 text-xs mt-0.5">PNG, JPG (Max 3MB)</span>
                </>
              )}
            </div>
          </div>

          {/* Submit Button */}
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
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 text-sm bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-lg transition-all"
              >
                Add Goals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGoalForm;