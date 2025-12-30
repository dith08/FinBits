import { Sparkles, ChevronDown, X } from 'lucide-react';

interface SkillData {
  id: number;
  mainSkill: string;
  currentLevel: string;
  skillProgress: number;
  subSkills: string;
  weeklyImprovement: string;
  nextStep: string;
}

interface BoostMySkillProps {
  onClose: () => void;
  skillData: SkillData;
}

const BoostMySkill: React.FC<BoostMySkillProps> = ({ onClose, skillData }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-4xl bg-zinc-900/95 border border-zinc-800 rounded-xl p-8 text-zinc-100 shadow-2xl relative my-4">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-10">
          <h1 className="text-2xl font-bold tracking-tight">Boost My Skill</h1>
          <Sparkles className="w-6 h-6 text-emerald-400 fill-emerald-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Side: Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Current Skill</label>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg py-3 px-4">
                <span className="text-white">{skillData.mainSkill}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Current Level</label>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg py-3 px-4">
                <span className="text-white">{skillData.currentLevel}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Target Level</label>
              <div className="relative">
                <select className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer text-white">
                  <option value="">Pilih Target Level</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Durasi waktu</label>
              <div className="relative">
                <select className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer text-white">
                  <option value="">Pilih Durasi</option>
                  <option value="1-month">1 Bulan</option>
                  <option value="3-months">3 Bulan</option>
                  <option value="6-months">6 Bulan</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 w-full md:w-fit bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-8 rounded-lg transition-colors mt-8 group">
              Boost Skill
              <Sparkles className="w-5 h-5 fill-white" />
            </button>
          </div>

          {/* Right Side: Results */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold mb-4">Hasil :</h2>
            
            <div className="space-y-1 text-zinc-400 text-sm leading-relaxed">
              <p><span className="text-zinc-300">Week 1:</span> Belajar dasar Queue + bikin simple worker</p>
              <p><span className="text-zinc-300">Week 2:</span> Build REST API lengkap (CRUD + Validation)</p>
              <p><span className="text-zinc-300">Week 3:</span> Testing + implement database indexing</p>
              <p><span className="text-zinc-300">Week 4:</span> Deploy mini project ke server</p>
            </div>

            <div className="pt-4">
              <p className="text-zinc-400 text-sm italic">Daily Action (optional, simple)</p>
              <p className="text-zinc-300 font-medium italic text-sm">"Belajar 45 menit per hari fokus 1 task."</p>
            </div>

            <div className="pt-2">
              <p className="text-zinc-400 text-sm italic">Skill Progress Projection</p>
              <p className="text-zinc-300 font-medium italic text-sm">"Dengan konsistensi normal, progress naik estimasi +18%."</p>
            </div>

            <div className="pt-2">
              <p className="text-zinc-400 text-sm italic">AI Note</p>
              <p className="text-zinc-300 font-medium italic text-sm">"Fokus di REST API karena ini yang paling nge-boost value lu."</p>
            </div>

            <div className="pt-4 space-y-2">
              <p className="text-sm font-medium text-zinc-300 underline underline-offset-4 decoration-zinc-700">New Sub Skills yang terbentuk</p>
              <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1 pl-1">
                <li>Worker queue</li>
                <li>API architecture</li>
                <li>Error handling</li>
                <li>Unit testing</li>
              </ul>
            </div>

            <div className="pt-6 flex justify-end">
              <button className="border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-medium py-2 px-6 rounded-lg transition-colors">
                Add To Goals
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BoostMySkill;