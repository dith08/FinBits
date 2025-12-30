import { Rocket, Sparkles } from 'lucide-react';

const AIGoalPlanner = () => {
  return (
    <div className="w-full min-h-[600px] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      
      <div>
        {/* Header Title */}
        <h1 className="text-3xl font-bold text-[#10B981] mb-6 tracking-tight">
          AI Goal Planner
        </h1>

        {/* Input Section */}
        <div className="flex gap-2 mb-8">
          <input 
            type="text" 
            placeholder="Masukan Target Kamu...." 
            className="flex-1 bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-[#10B981] placeholder:text-gray-600"
          />
          <button className="bg-[#1A1A1A] border border-gray-800 p-3 rounded-lg hover:bg-gray-800 transition-colors group">
            <Rocket className="text-gray-500 group-hover:text-white transition-colors" size={24} />
          </button>
        </div>

        {/* Hasil Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Hasil :</h2>
          
          <div className="space-y-1 text-lg">
            <p className="text-white"><span className="font-bold">Week 1:</span> Riset kebutuhan & bikin list tools.</p>
            <p className="text-white"><span className="font-bold">Week 2:</span> Selesaikan minimal 2 task inti.</p>
            <p className="text-white"><span className="font-bold">Week 3:</span> Review progress + adjust rencana.</p>
            <p className="text-white"><span className="font-bold">Week 4:</span> Capai 1 milestone besar.</p>
          </div>

          {/* AI Insight/Advice */}
          <p className="text-gray-500 text-lg leading-relaxed pt-2">
            kamu jarang mulai kalau task kebanyakan. <br />
            Fokus 3 task paling berdampak
          </p>
        </div>
      </div>

      {/* Action Buttons - akan tetap di bawah */}
      <div className="flex gap-3 mt-6">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-700 text-white font-bold hover:bg-gray-900 transition-all text-sm">
          Generate Roadmap
          <Sparkles size={18} className="text-[#10B981]" />
        </button>
        
        <button className="flex-1 py-3 px-4 rounded-xl border border-gray-700 text-white font-bold hover:bg-gray-900 transition-all text-sm">
          Generate Goals
        </button>
      </div>

    </div>
  );
};

export default AIGoalPlanner;