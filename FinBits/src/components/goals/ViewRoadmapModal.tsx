// Update ViewRoadmapModal.tsx (modal lebih kecil)
import React from 'react';
import { X, Download } from 'lucide-react';

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

interface ViewRoadmapModalProps {
  onClose: () => void;
  goalData: GoalData;
}

const ViewRoadmapModal: React.FC<ViewRoadmapModalProps> = ({ onClose, goalData }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    if (goalData.roadmapImage) {
      const link = document.createElement('a');
      link.href = goalData.roadmapImage;
      link.download = `roadmap-${goalData.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      {/* Container lebih kecil */}
      <div className="w-full max-w-lg bg-[#121212] rounded-xl p-6 shadow-2xl border border-gray-800 relative my-4">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">
              {goalData.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{goalData.category}</span>
              <span>•</span>
              <span>Deadline: {goalData.deadline}</span>
            </div>
          </div>
          
          <div className="flex gap-1">
            {goalData.roadmapImage && (
              <button 
                onClick={handleDownload}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                title="Download"
              >
                <Download size={16} className="text-gray-300" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
            >
              <X size={16} className="text-gray-300" />
            </button>
          </div>
        </div>

        {/* Goal Info - Compact */}
        <div className="space-y-3 mb-6">
          <div className="bg-gray-900/50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-300">Progress</span>
              <span className="text-[#10B981] font-bold">{goalData.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-[#10B981] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${goalData.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-900/50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-300 mb-1">Target</div>
            <p className="text-white text-sm">{goalData.outcome}</p>
          </div>

          <div className="bg-gray-900/50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-300 mb-1">Motivation</div>
            <p className="text-white text-sm italic">"{goalData.why}"</p>
          </div>
        </div>

        {/* Roadmap Image */}
        <div className="border border-gray-700 rounded-lg p-3 bg-gray-900/30">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-white">Roadmap</h3>
          </div>
          
          {goalData.roadmapImage ? (
            <div className="w-full max-h-64 bg-black rounded overflow-auto flex items-center justify-center p-2">
              <img 
                src={goalData.roadmapImage} 
                alt={`${goalData.name} roadmap`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-32 bg-gray-900/50 rounded flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-gray-400 text-xs mb-1">No roadmap image</p>
                <p className="text-gray-500 text-xs">Edit goal to add roadmap</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-end mt-6">
          <button 
            onClick={onClose}
            className="border border-gray-600 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded text-sm font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewRoadmapModal;