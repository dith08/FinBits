import React, { useState, useEffect } from 'react';
import { X, Download, Loader2, Sparkles, RefreshCw, ChevronDown } from 'lucide-react';
import { roadmapsService, roadmapsAIService } from '../../services/goalsService';

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

interface RoadmapStep {
  id: number;
  week: number;
  step_description: string;
  completed: boolean;
}

interface ViewRoadmapModalProps {
  onClose: () => void;
  goalData: GoalData;
}

const ViewRoadmapModal: React.FC<ViewRoadmapModalProps> = ({ onClose, goalData }) => {
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [roadmapImage, setRoadmapImage] = useState<string | null>(goalData.roadmapImage || null);
  const [aiSteps, setAiSteps] = useState<RoadmapStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());

  const fetchRoadmap = async () => {
    if (!goalData.id || goalData.id <= 0) {
      setLoading(false);
      setError('Goal ID tidak valid');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      try {
        const roadmapRes = await roadmapsService.get(goalData.id);
        console.log('Roadmap response:', roadmapRes);
        if (roadmapRes?.image || roadmapRes?.image_url) {
          setRoadmapImage(roadmapRes.image || roadmapRes.image_url);
        }
      } catch {
      }
      try {
        const aiRes = await roadmapsAIService.get(goalData.id);
        console.log('AI Roadmap response:', aiRes);
        
        const data = aiRes || aiRes;
        
        if (data && Array.isArray(data)) {
          const steps: RoadmapStep[] = data.map((item: Record<string, unknown>, index: number) => ({
            id: Number(item.id || item.step_id) || index + 1,
            week: Number(item.week) || index + 1,
            step_description: String(item.step_description || item.description || item.task || item.title || ''),
            completed: Boolean(item.completed || item.is_completed),
          }));
          setAiSteps(steps);
        } else if (data?.steps && Array.isArray(data.steps)) {
          const steps: RoadmapStep[] = data.steps.map((item: Record<string, unknown>, index: number) => ({
            id: Number(item.id || item.step_id) || index + 1,
            week: Number(item.week) || index + 1,
            step_description: String(item.step_description || item.description || item.task || item.title || ''),
            completed: Boolean(item.completed || item.is_completed),
          }));
          setAiSteps(steps);
        } else if (data?.roadmap && Array.isArray(data.roadmap)) {
          const steps: RoadmapStep[] = data.roadmap.map((item: Record<string, unknown>, index: number) => ({
            id: Number(item.id || item.step_id) || index + 1,
            week: Number(item.week) || index + 1,
            step_description: String(item.step_description || item.description || item.task || item.title || ''),
            completed: Boolean(item.completed || item.is_completed),
          }));
          setAiSteps(steps);
        }
      } catch {
      }
    } catch (err: unknown) {
      console.error('Error fetching roadmap:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Gagal memuat roadmap');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!goalData.id || goalData.id <= 0) {
      setError('Goal ID tidak valid untuk generate roadmap');
      return;
    }

    try {
      setGeneratingAI(true);
      setError(null);
      console.log('Generating AI roadmap for goal:', goalData.id);
      await roadmapsAIService.add(goalData.id);
      await fetchRoadmap();
    } catch (err: unknown) {
      console.error('Error generating AI roadmap:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Gagal generate roadmap AI');
    } finally {
      setGeneratingAI(false);
    }
  };

  const toggleWeek = (weekId: number) => {
    setExpandedWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(weekId)) {
        newSet.delete(weekId);
      } else {
        newSet.add(weekId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    fetchRoadmap();
  }, [goalData.id]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    if (roadmapImage) {
      const link = document.createElement('a');
      link.href = roadmapImage;
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
      <div className="w-full max-w-lg bg-[#121212] rounded-xl p-6 shadow-2xl border border-gray-800 relative my-4 max-h-[90vh] overflow-y-auto">
        
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
            {roadmapImage && (
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

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#10B981]" />
          </div>
        ) : (
          <>
            <div className="border border-gray-700 rounded-lg p-3 bg-gray-900/30 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles size={14} className="text-[#10B981]" />
                  Roadmap
                </h3>
                <button
                  onClick={fetchRoadmap}
                  className="p-1 hover:bg-gray-800 rounded transition-colors"
                >
                  <RefreshCw size={14} className="text-gray-400" />
                </button>
              </div>
              
              {aiSteps.length > 0 ? (
                <div className="space-y-2">
                  {aiSteps.map((step) => {
                    const isExpanded = expandedWeeks.has(step.id);
                    return (
                      <div 
                        key={step.id}
                        className={`rounded-lg border ${step.completed ? 'border-[#10B981]/50 bg-[#10B981]/10' : 'border-gray-700 bg-gray-800/50'}`}
                      >
                        <button
                          onClick={() => toggleWeek(step.id)}
                          className="w-full p-3 flex items-center justify-between hover:bg-gray-700/30 transition-colors rounded-lg"
                        >
                          <span className={`text-sm font-medium ${step.completed ? 'text-[#10B981]' : 'text-gray-300'}`}>
                            Week {step.week}
                          </span>
                          <ChevronDown 
                            size={16} 
                            className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                        
                        {isExpanded && (
                          <div className="px-3 pb-3 pt-1">
                            <p className={`text-sm ${step.completed ? 'text-gray-300 line-through' : 'text-white'}`}>
                              {step.step_description}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm mb-2">Belum ada roadmap</p>
                  <p className="text-xs">Klik "Generate AI Roadmap" untuk membuat roadmap otomatis</p>
                </div>
              )}
            </div>

            {roadmapImage && (
              <div className="border border-gray-700 rounded-lg p-3 bg-gray-900/30">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-white">Roadmap Image</h3>
                </div>
                
                <div className="w-full max-h-64 bg-black rounded overflow-auto flex items-center justify-center p-2">
                  <img 
                    src={roadmapImage} 
                    alt={`${goalData.name} roadmap`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex gap-2 mt-6">
          <button 
            onClick={handleGenerateAI}
            disabled={generatingAI}
            className="flex-1 flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded text-sm font-medium transition-all disabled:opacity-50"
          >
            {generatingAI ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                {aiSteps.length > 0 ? 'Buat Roadmap AI' : 'Buat AI Roadmap'}
              </>
            )}
          </button>
          <button 
            onClick={onClose}
            className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded text-sm font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewRoadmapModal;