import HabbitsList from "../components/productivity/HabitList";
import StreakCard from "../components/productivity/StreakCard";
import TodoApp from "../components/productivity/ToDoList";
import TopHabbitsCard from "../components/productivity/TopHabitsCard";

export default function ProductivityPage() {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-4 space-y-6 font-sans pt-20 lg:pt-4">
        
        <section className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">Daftar To Do List</h2>
          <TodoApp />
        </section>
  
        <section className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">Kebiasaan</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <HabbitsList />
            </div>
  
            <div className="lg:col-span-4 flex flex-col gap-4">
              <StreakCard />
              <TopHabbitsCard />
            </div>
          </div>
        </section>
        
      </div>
    );
  }