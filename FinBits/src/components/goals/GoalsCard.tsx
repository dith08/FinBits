// components/GoalsCard.tsx
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import EditGoalForm from './EditGoals';
import ViewRoadmapModal from './ViewRoadmapModal';
import DeleteGoals from './DeleteGoals';

interface GoalData {
  id: number;
  name: string;
  progress: number;
  category: string;
  outcome: string;
  why: string;
  deadline: string;
  roadmapImage?: string;
}

interface GoalsCardProps {
  goalData: GoalData;
  onUpdate: (goal: GoalData) => void;
  onDelete: (goalId: number) => void;
}

const GoalsCard: React.FC<GoalsCardProps> = ({ goalData, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSaveEdit = (updatedGoal: GoalData) => {
    onUpdate(updatedGoal);
    setShowEditModal(false);
  };

  const handleDelete = () => {
    onDelete(goalData.id);
    setShowDeleteModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Fungsi untuk menangani klik tombol Edit dan mencegah event bubbling
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah event bubbling ke parent
    setShowEditModal(true);
  };

  // Fungsi untuk tombol lainnya juga
  const handleViewRoadmapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRoadmapModal(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  return (
    <>
      <div className="w-full text-gray-300 rounded-xl p-6 shadow-2xl border border-gray-800 bg-[#1a1a1a] relative">
        
        {/* Delete Button */}
        <button 
          onClick={handleDeleteClick}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          title="Delete Goal"
        >
          <Trash2 size={16} />
        </button>
        
        {/* Title dengan Progress Bar */}
        <div className="mb-6 pr-10">
          <h2 className="text-2xl font-bold text-white mb-4">
            {goalData.name}
          </h2>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-[#10B981] font-bold">{goalData.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-[#10B981] h-2 rounded-full transition-all duration-300"
                style={{ width: `${goalData.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-5 mb-8">
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-500">Category:</span>
            <span className="text-white font-medium">{goalData.category}</span>
          </div>

          <div className="py-2 border-b border-gray-800">
            <p className="text-gray-500 mb-2">Outcome:</p>
            <p className="text-white italic bg-gray-900/30 p-3 rounded-lg">
              {goalData.outcome}
            </p>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-500">Why:</span>
            <span className="text-white italic">{goalData.why}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-500">Deadline:</span>
            <span className="text-white font-medium">{formatDate(goalData.deadline)}</span>
          </div>

          {goalData.roadmapImage && (
            <div className="pt-2">
              <p className="text-gray-500 mb-2">Roadmap Available:</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                  📊
                </div>
                <span className="text-sm text-gray-300">Click "View Roadmap" to see details</span>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={handleViewRoadmapClick}
            className="flex-1 py-3 px-4 rounded-lg border border-gray-700 bg-transparent hover:bg-gray-800 hover:border-[#10B981] transition-all font-medium text-white flex items-center justify-center gap-2"
          >
            <span>View Roadmap</span>
          </button>
          <button 
            onClick={handleEditClick} // Menggunakan handler baru
            className="flex-1 py-3 px-4 rounded-lg border border-gray-700 bg-transparent hover:bg-gray-800 hover:border-[#599EFF] transition-all font-medium text-white flex items-center justify-center gap-2"
          >
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* Edit Goal Modal */}
      {showEditModal && (
        <EditGoalForm 
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          initialData={goalData}
        />
      )}

      {/* View Roadmap Modal */}
      {showRoadmapModal && (
        <ViewRoadmapModal 
          onClose={() => setShowRoadmapModal(false)}
          goalData={goalData}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteGoals 
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default GoalsCard;