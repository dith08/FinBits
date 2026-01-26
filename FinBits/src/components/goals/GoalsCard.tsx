import React, { useState } from 'react';
import { Trash2, Calendar, Tag, Target, ArrowRight, Layers } from 'lucide-react';
import EditGoalForm from './EditGoals';
import ViewRoadmapModal from './ViewRoadmapModal';
import DeleteGoals from './DeleteGoals';
import { COLOR_CLASSES } from '../../constants/colors';

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

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditModal(true);
  };

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
      <div className={`group w-full  backdrop-blur-sm border border-slate-800 rounded-[1.5rem] p-6 shadow-xl ${COLOR_CLASSES.secondary.hover} transition-all duration-300 relative overflow-hidden`}>
        
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className={`flex items-center gap-2 px-3 py-1 ${COLOR_CLASSES.secondary.bgLight} border ${COLOR_CLASSES.secondary.borderLight} rounded-full`}>
            <Tag size={12} className={COLOR_CLASSES.secondary.text} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${COLOR_CLASSES.secondary.text}`}>{goalData.category}</span>
          </div>
          
          <button 
            onClick={handleDeleteClick}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
            title="Delete Goal"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        <div className="mb-6">
          <h2 className={`text-2xl font-extrabold text-white mb-4 group-hover:${COLOR_CLASSES.secondary.text} transition-colors`}>
            {goalData.name}
          </h2>
          
          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-tighter">Progres Saat Ini</span>
              <span className={`text-lg font-black ${COLOR_CLASSES.secondary.text}`}>{goalData.progress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div 
                className={`bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(59,130,246,0.4)]`}
                style={{ width: `${goalData.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-slate-800 rounded-lg text-slate-400">
              <Target size={14} />
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Hasil yang Diharapkan</p>
              <p className="text-sm text-slate-200 leading-relaxed italic">"{goalData.outcome}"</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl border border-slate-800/50">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar size={14} />
              <span className="text-xs font-medium">Batas Waktu</span>
            </div>
            <span className="text-xs font-bold text-slate-200">{formatDate(goalData.deadline)}</span>
          </div>
        </div>

        <div className="flex gap-3 relative z-10">
          <button 
            onClick={handleViewRoadmapClick}
            className="flex-[2] py-3 px-4 rounded-xl bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 transition-all text-xs font-bold flex items-center justify-center gap-2 group/btn"
          >
            <Layers size={16} className="text-emerald-400" />
            <span>Lihat Roadmap</span>
          </button>
          
          <button 
            onClick={handleEditClick}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 transition-all text-xs font-bold flex items-center justify-center gap-2"
          >
            <span>Edit</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {showEditModal && (
        <EditGoalForm 
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          initialData={goalData}
        />
      )}

      {showRoadmapModal && (
        <ViewRoadmapModal 
          onClose={() => setShowRoadmapModal(false)}
          goalData={goalData}
        />
      )}

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