import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import AIGoalPlanner from "../components/goals/AiGoalsPlanner";
import GoalsCard from "../components/goals/GoalsCard";
import HealthCheck from "../components/goals/HealthCheck";
import MySkillCard from "../components/goals/MySkillCard";
import AddGoalForm from "../components/goals/AddGoals";
import { goalsService } from "../services/goalsService";
import { AlertModal } from "../components/common";
import { useAlert } from "../hooks";

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

export default function GoalsPage() {
  const [showAddGoalsModal, setShowAddGoalsModal] = useState(false);
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { alert, showError, closeAlert } = useAlert();

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await goalsService.getAll();
      
      console.log('Goals API response:', response);
      
      let goalsData = [];
      if (response.data && Array.isArray(response.data)) {
        goalsData = response.data;
      } else if (Array.isArray(response)) {
        goalsData = response;
      } else if (response.goals && Array.isArray(response.goals)) {
        goalsData = response.goals;
      }
      
      const transformedData: GoalData[] = goalsData.map((item: Record<string, unknown>) => {
        return {
          id: Number(item.goal_detail_id),
          name: String(item.goal_name || ''),
          progress: Number(item.progress_percentage) || 0,
          category: String(item.category || ''),
          outcome: String(item.outcome || ''),
          why: String(item.why || ''),
          deadline: String(item.deadline || ''),
          roadmapImage: item.roadmap_image ? String(item.roadmap_image) : undefined,
        };
      });
      
      console.log('Transformed goals:', transformedData);
      setGoals(transformedData);
    } catch (err: unknown) {
      console.error('Error fetching goals:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Gagal memuat data goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (newGoal: Omit<GoalData, 'id'>) => {
    try {
      console.log('Submitting goal:', newGoal);
      await goalsService.add({
        name: newGoal.name,
        category: newGoal.category,
        outcome: newGoal.outcome,
        why: newGoal.why,
        deadline: newGoal.deadline,
        progress: newGoal.progress,
      });
      
      await fetchGoals();
      setShowAddGoalsModal(false);
    } catch (err: unknown) {
      console.error('Error adding goal:', err);
      const error = err as { response?: { data?: { message?: string }; status?: number } };
      console.error('Error response:', error.response);
      showError(error.response?.data?.message || `Gagal menambah goal (${error.response?.status || 'unknown'})`);
    }
  };

  const handleUpdateGoal = async (updatedGoal: GoalData) => {
    try {
      await goalsService.edit(updatedGoal.id, {
        name: updatedGoal.name,
        category: updatedGoal.category,
        outcome: updatedGoal.outcome,
        why: updatedGoal.why,
        deadline: updatedGoal.deadline,
        progress: updatedGoal.progress,
      });
      
      await fetchGoals();
    } catch (err: unknown) {
      console.error('Error updating goal:', err);
      const error = err as { response?: { data?: { message?: string } } };
      showError(error.response?.data?.message || 'Gagal mengupdate goal');
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    try {
      await goalsService.delete(goalId);
      await fetchGoals();
    } catch (err: unknown) {
      console.error('Error deleting goal:', err);
      const error = err as { response?: { data?: { message?: string } } };
      showError(error.response?.data?.message || 'Gagal menghapus goal');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 space-y-6 font-sans pt-20 lg:pt-4">
      
      <section className="max-w-6xl mx-auto mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-emerald-400">Tujuan</h2>
          <button 
            onClick={() => setShowAddGoalsModal(true)}
            className="px-4 py-2 bg-transparent border border-emerald-400/50 text-emerald-400 text-sm rounded-lg hover:bg-emerald-400/10 hover:border-emerald-400 transition-all duration-200"
          >
            Tambah Tujuan Baru
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 text-red-400 text-sm">
            {error}
            <button onClick={fetchGoals} className="ml-2 underline">Coba lagi</button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <GoalsCard 
                key={goal.id}
                goalData={goal}
                onUpdate={handleUpdateGoal}
                onDelete={handleDeleteGoal}
              />
            ))}
            {goals.length === 0 && !loading && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p className="text-lg mb-4">Belum ada tujuan yang dibuat</p>
                <button 
                  onClick={() => setShowAddGoalsModal(true)}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Tambah Tujuan Pertama
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto mt-5 mb-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold text-emerald-400 mb-4">Perencana Tujuan AI</h2>
            <AIGoalPlanner onGoalGenerated={fetchGoals} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-emerald-400 mb-4">Keterampilan Saya</h2>
            <MySkillCard onGoalCreated={fetchGoals} />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-5">
        <HealthCheck />
      </section>

      {showAddGoalsModal && (
        <section className="max-w-6xl mx-auto mt-5">
          <AddGoalForm 
            onClose={() => setShowAddGoalsModal(false)}
            onAdd={handleAddGoal}
          />
        </section>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
      
    </div>
  );
}
