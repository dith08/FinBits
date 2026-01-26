import { useState } from 'react';
import { Rocket, Sparkles, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { aiGoalsService } from '../../services/goalsService';

interface AIGoalPlannerProps {
  onGoalGenerated?: () => void;
  defaultCategory?: string;
}

const AIGoalPlanner: React.FC<AIGoalPlannerProps> = ({ onGoalGenerated, defaultCategory = 'financial' }) => {
  const [target, setTarget] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [generatingGoal, setGeneratingGoal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState(false);

  const categories = [
    { value: 'financial', label: '💰 Keuangan', description: 'Tujuan uang & kekayaan' },
    { value: 'career', label: '💼 Karir', description: 'Tujuan pekerjaan & profesional' },
    { value: 'health', label: '🏃 Kesehatan', description: 'Tujuan kebugaran & kesejahteraan' },
    { value: 'education', label: '📚 Pendidikan', description: 'Pembelajaran & keterampilan' },
    { value: 'personal', label: '🎯 Pribadi', description: 'Pengembangan diri' },
  ];

  const handleGenerateGoal = async () => {
    if (!target.trim()) {
      setError('Masukkan target kamu terlebih dahulu');
      return;
    }

    setGeneratingGoal(true);
    setError(null);

    try {
      await aiGoalsService.addGoalsWithAI(target, category);
      setSuccessModal(true);
      if (onGoalGenerated) onGoalGenerated();
      setTarget('');
    } catch (err: unknown) {
      console.error('Error generating goal:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Gagal generate goal');
    } finally {
      setGeneratingGoal(false);
    }
  };

  return (
    <>
      <div className="w-full min-h-[400px] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl flex flex-col justify-center overflow-hidden relative bg-slate-950/40">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-10">
            <div className="inline-flex p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-6 animate-pulse">
              <Rocket className="text-emerald-400" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent tracking-tight mb-4">
              Perencana Tujuan AI
            </h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
              Tulis target kamu, biar AI yang ngeracik strategi terbaik buat kamu capai itu.
            </p>
          </div>

          <div className="w-full max-w-xl space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  disabled={generatingGoal}
                  className={`p-3 rounded-xl transition-all text-sm font-medium ${
                    category === cat.value
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  } disabled:opacity-50`}
                  title={cat.description}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative group">
              <input 
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Apa target besar lu bulan ini?" 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-8 py-5 text-white text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all placeholder:text-slate-600 shadow-inner"
                disabled={generatingGoal}
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                 <Sparkles className="text-emerald-500/40 group-focus-within:text-emerald-400 transition-colors" size={24} />
              </div>
            </div>

            {error && (
              <div className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <button 
              onClick={handleGenerateGoal}
              disabled={generatingGoal || !target.trim()}
              className="group relative w-full overflow-hidden flex items-center justify-center gap-3 py-5 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100"
            >
              {generatingGoal ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <span>GENERATE TUJUAN</span>
                  <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-slate-500 text-xs font-medium tracking-widest uppercase">
              Didukung oleh kecerdasan canggih
            </p>
          </div>
        </div>
      </div>

      {successModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-[2.5rem] p-10 text-center shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-emerald-500/20 rounded-full">
                <CheckCircle className="w-12 h-12 text-emerald-400" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-3">Tujuan Terkunci! 🚀</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Target kamu udah masuk ke sistem. AI kita udah bikinin roadmap rahasia buat kamu di halaman Tujuan.
            </p>
            
            <button
              onClick={() => setSuccessModal(false)}
              className="w-full py-4 bg-white hover:bg-slate-200 text-slate-950 font-bold rounded-2xl transition-all active:scale-95"
            >
              Mantap, Cek Sekarang
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIGoalPlanner;