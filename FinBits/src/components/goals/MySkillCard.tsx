import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import AddMySkill from './AddMySkill';
import EditMySkill from './EditMySkill';
import BoostMySkill from './BoostMySkill';

interface SkillData {
  id: number;
  mainSkill: string;
  currentLevel: string;
  skillProgress: number;
  subSkills: string;
  weeklyImprovement: string;
  nextStep: string;
}

const MySkillCard = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  
  const [skillData, setSkillData] = useState<SkillData>({
    id: 1,
    mainSkill: "Backend Development",
    currentLevel: "Intermediate",
    skillProgress: 42,
    subSkills: "SQL, REST API, Queue, Testing",
    weeklyImprovement: "+5%",
    nextStep: "Bangun API CRUD + belajar dasar Queue."
  });

  const handleUpdateSkill = (updatedSkill: SkillData) => {
    setSkillData(updatedSkill);
    setShowEditForm(false);
  };

  const handleAddSkill = (newSkill: SkillData) => {
    setSkillData(newSkill);
    setShowAddForm(false);
  };

  // Jika sedang menampilkan form, tampilkan form saja
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
    <div className="w-full min-h-[600px] border border-gray-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
      
      <div>
        {/* Header Title dengan Add Button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#10B981] tracking-tight">
            My Skill
          </h2>
          <button 
            onClick={() => setShowAddForm(true)}
            className="text-[#10B981] text-sm hover:text-emerald-300 transition-colors"
          >
            Add New Skill
          </button>
        </div>

        {/* Skill Details */}
        <div className="space-y-4">
          <p className="text-white text-lg">
            <span className="font-bold">Main Skill:</span> {skillData.mainSkill}
          </p>
          <p className="text-white text-lg">
            <span className="font-bold">Current Level:</span> {skillData.currentLevel}
          </p>
          <p className="text-white text-lg">
            <span className="font-bold">Skill Progress:</span> {skillData.skillProgress}%
          </p>
          <p className="text-white text-lg leading-snug">
            <span className="font-bold">Sub Skills:</span> {skillData.subSkills}
          </p>
          <p className="text-white text-lg">
            <span className="font-bold">Weekly Improvement:</span> {skillData.weeklyImprovement}
          </p>
          <div className="text-white text-lg leading-relaxed">
            <span className="font-bold">Next Step:</span> {skillData.nextStep}
          </div>
        </div>
      </div>

      {/* Action Buttons - akan tetap di bawah */}
      <div className="flex gap-3 mt-6">
        {/* Edit Button */}
        <button 
          onClick={() => setShowEditForm(true)}
          className="flex-1 py-3 px-4 rounded-xl border border-gray-700 text-white font-bold hover:bg-gray-900 transition-all text-sm"
        >
          Edit
        </button>
        
        {/* Boost Button */}
        <button 
          onClick={() => setShowBoostModal(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-700 text-white font-bold hover:bg-gray-900 transition-all text-sm group"
        >
          Boost My Skills
          <Sparkles size={16} className="text-[#10B981] group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Boost Modal - tetap sebagai modal karena kompleks */}
      {showBoostModal && (
        <BoostMySkill 
          onClose={() => setShowBoostModal(false)}
          skillData={skillData}
        />
      )}

    </div>
  );
};

export default MySkillCard;