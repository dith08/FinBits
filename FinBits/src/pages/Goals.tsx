import { useState } from 'react';
import AIGoalPlanner from "../components/goals/AiGoalsPlanner";
import GoalsCard from "../components/goals/GoalsCard";
import HealthCheck from "../components/goals/HealthCheck";
import MySkillCard from "../components/goals/MySkillCard";
import AddGoalForm from "../components/goals/AddGoals";

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
  const [goals, setGoals] = useState<GoalData[]>([
    {
      id: 1,
      name: "Naikin Skill Programming",
      progress: 45,
      category: "Career",
      outcome: "Website portofolio selesai & bisa dipake apply PKL",
      why: "Biar punya nilai jual",
      deadline: "2025-12-30",
      roadmapImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 2,
      name: "Improve Health & Fitness",
      progress: 30,
      category: "Health",
      outcome: "Berat badan ideal dan stamina meningkat",
      why: "Untuk kesehatan jangka panjang",
      deadline: "2025-06-30",
    },
    {
      id: 3,
      name: "Learn Financial Management",
      progress: 60,
      category: "Finance",
      outcome: "Bisa manage keuangan dengan baik",
      why: "Untuk masa depan yang lebih stabil",
      deadline: "2025-03-31",
    }
  ]);

  const handleAddGoal = (newGoal: Omit<GoalData, 'id'>) => {
    const goal: GoalData = {
      ...newGoal,
      id: Date.now(), // Simple ID generation
    };
    setGoals(prev => [...prev, goal]);
    setShowAddGoalsModal(false);
  };

  const handleUpdateGoal = (updatedGoal: GoalData) => {
    setGoals(prev => prev.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    ));
  };

  const handleDeleteGoal = (goalId: number) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };
  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 space-y-6 font-sans">
      
      {/* Goals Section */}
      <section className="max-w-6xl mx-auto mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-emerald-400">Goals</h2>
          <button 
  onClick={() => setShowAddGoalsModal(true)}
  className="px-4 py-2 bg-transparent border border-emerald-400/50 text-emerald-400 text-sm rounded-lg hover:bg-emerald-400/10 hover:border-emerald-400 transition-all duration-200"
>
  Add New Goals
</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalsCard 
              key={goal.id}
              goalData={goal}
              onUpdate={handleUpdateGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
          {goals.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p className="text-lg mb-4">Belum ada goals yang dibuat</p>
              <button 
                onClick={() => setShowAddGoalsModal(true)}
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Tambah Goal Pertama
              </button>
            </div>
          )}
        </div>
      </section>

      {/* AI Goal Planner & My Skill Section */}
      <section className="max-w-6xl mx-auto mt-5 mb-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold text-emerald-400 mb-4">AI Goal Planner</h2>
            <AIGoalPlanner />
          </div>
          <div>
            <h2 className="text-xl font-bold text-emerald-400 mb-4">My Skill</h2>
            <MySkillCard />
          </div>
        </div>
      </section>

      {/* Goal Health Check Section */}
      <section className="max-w-6xl mx-auto mt-5">
        <HealthCheck />
      </section>

      {/* Add Goals Form */}
      {showAddGoalsModal && (
        <section className="max-w-6xl mx-auto mt-5">
          <AddGoalForm 
            onClose={() => setShowAddGoalsModal(false)}
            onAdd={handleAddGoal}
          />
        </section>
      )}
      
    </div>
  );
}