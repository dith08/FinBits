import HabbitsList from "../components/productivity/HabitList";
import StreakCard from "../components/productivity/StreakCard";
import TodoApp from "../components/productivity/ToDoList";
import TopHabbitsCard from "../components/productivity/TopHabbitsCard";

export default function ProductivityPage() {
    return (
      // Background utama cuma ada di sini
      <div className="min-h-screen bg-[#121212] text-white p-6 space-y-8 font-sans">
        
        {/* Section Atas: To Do List */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-emerald-400 mb-6">To Do List</h2>
          <TodoApp />
        </section>
  
        {/* Section Bawah: Habbits Layout (Grid) */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-emerald-400 mb-6">Habbits</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Kolom Kiri: Habbits List (Porsi Lebih Besar) */}
            <div className="lg:col-span-8">
              <HabbitsList />
            </div>
  
            {/* Kolom Kanan: Streak & Top Habits */}
            <div className="lg:col-span-4 flex flex-col ">
              <StreakCard />
              <TopHabbitsCard />
            </div>
          </div>
        </section>
        
      </div>
    );
  }