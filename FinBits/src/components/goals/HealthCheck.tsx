import { useState, useEffect } from 'react';
import { Activity, AlertCircle, Heart, Loader2, RefreshCw, Target, TrendingUp, Zap } from 'lucide-react';
import { healthCheckService } from '../../services/goalsService';
import { AlertModal } from '../common';
import { useAlert } from '../../hooks';

interface HealthStat {
  title: string;
  desc: string;
  status: string;
  color: string;
}

const HealthCheck = () => {
  const [stats, setStats] = useState<HealthStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { alert, showError, closeAlert } = useAlert();

  const getStatusColor = (status: string) => {
    const statusLower = String(status || '').toLowerCase();
    switch (statusLower) {
      case 'good':
        return 'bg-green-800 text-white';
      case 'bad':
        return 'bg-red-900 text-white';
      case 'normal':
      default:
        return 'bg-yellow-700 text-white';
    }
  };

  const safeString = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      if (obj.description) return String(obj.description);
      if (obj.message) return String(obj.message);
      if (obj.text) return String(obj.text);
      return JSON.stringify(value);
    }
    return String(value);
  };

  const fetchHealthCheck = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await healthCheckService.get();
      
      console.log('Health check response:', response);
      
      const transformedStats: HealthStat[] = [];
      const data = response.data || response;
      
      if (data) {
        if (data.consistency) {
          const item = data.consistency;
          transformedStats.push({
            title: 'Consistency',
            desc: safeString(typeof item === 'object' ? item.description || item.message || item : item),
            status: safeString(typeof item === 'object' ? item.status : 'Normal'),
            color: getStatusColor(typeof item === 'object' ? item.status : 'Normal'),
          });
        }
        
        if (data.new_skill || data.newSkill) {
          const item = data.new_skill || data.newSkill;
          transformedStats.push({
            title: 'New Skill',
            desc: safeString(typeof item === 'object' ? item.description || item.message || item : item),
            status: safeString(typeof item === 'object' ? item.status : 'Normal'),
            color: getStatusColor(typeof item === 'object' ? item.status : 'Normal'),
          });
        }
        
        if (data.finish_goal || data.finishGoal) {
          const item = data.finish_goal || data.finishGoal;
          transformedStats.push({
            title: 'Finish Goal',
            desc: safeString(typeof item === 'object' ? item.description || item.message || item : item),
            status: safeString(typeof item === 'object' ? item.status : 'Normal'),
            color: getStatusColor(typeof item === 'object' ? item.status : 'Normal'),
          });
        }
        
        if (data.skill_boost || data.skillBoost) {
          const item = data.skill_boost || data.skillBoost;
          transformedStats.push({
            title: 'Skill Boost',
            desc: safeString(typeof item === 'object' ? item.description || item.message || item : item),
            status: safeString(typeof item === 'object' ? item.status : 'Normal'),
            color: getStatusColor(typeof item === 'object' ? item.status : 'Normal'),
          });
        }

        if (Array.isArray(data)) {
          data.forEach((item: Record<string, unknown>) => {
            transformedStats.push({
              title: safeString(item.title),
              desc: safeString(item.description || item.desc),
              status: safeString(item.status || 'Normal'),
              color: getStatusColor(safeString(item.status)),
            });
          });
        }

        if (data.status && data.message && transformedStats.length === 0) {
          setError(safeString(data.message));
        }
      }
      
      setStats(transformedStats);
    } catch (err: unknown) {
      console.error('Error fetching health check:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Gagal memuat health check');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async () => {
  try {
    setCheckingIn(true);
    setError(null);
    
    await healthCheckService.checkin({
      metCommitment: true,
      notes: 'Auto check-in via health check'
    });
    
    await fetchHealthCheck();
  } catch (err: unknown) {
    console.error('Error checking in:', err);
    const error = err as { response?: { data?: { message?: string } } };
    showError(error.response?.data?.message || 'Gagal melakukan check-in');
    setError(error.response?.data?.message || 'Gagal melakukan check-in');
  } finally {
    setCheckingIn(false);
  }
};

  useEffect(() => {
    fetchHealthCheck();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#10B981]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent tracking-tighter">
          Pemeriksaan Kesehatan Tujuan
        </h1>
        <p className="text-slate-500 text-sm mt-1">Review performa dan status mental target Kamu.</p>
      </div>
      
      <button
        onClick={handleCheckin}
        disabled={checkingIn}
        className="flex items-center justify-center gap-3 px-6 py-3 bg-slate-900 border border-slate-700 rounded-2xl hover:border-emerald-500/50 hover:bg-slate-800 transition-all text-white disabled:opacity-50 group"
      >
        {checkingIn ? (
          <Loader2 size={18} className="animate-spin text-emerald-400" />
        ) : (
          <RefreshCw size={18} className="text-emerald-400 group-hover:rotate-180 transition-transform duration-700" />
        )}
        <span className="text-sm font-bold tracking-wide uppercase">Sinkronkan Status</span>
      </button>
    </div>

    {error && (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 mb-10 flex items-center justify-between text-red-400">
        <div className="flex items-center gap-3 text-sm">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
        <button onClick={fetchHealthCheck} className="text-xs font-black uppercase underline tracking-widest">Coba Lagi</button>
      </div>
    )}

    {stats.length === 0 && !error ? (
      <div className="flex flex-col items-center justify-center py-24 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800">
        <Activity size={48} className="text-slate-800 mb-6" />
        <p className="text-slate-500 font-medium mb-6">Belum ada data pemeriksaan kesehatan. Sinkronkan sekarang?</p>
        <button
          onClick={handleCheckin}
          disabled={checkingIn}
          className="px-8 py-4 bg-emerald-500 text-slate-950 font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10"
        >
          MULAI CHECK-IN
        </button>
      </div>
    ) : stats.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div 
            key={index} 
            className="group bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-[2rem] p-8 flex flex-col items-center text-center hover:border-slate-600 transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-0 inset-x-0 h-1 blur-sm opacity-50 ${item.color.includes('emerald') ? 'bg-emerald-500' : item.color.includes('red') ? 'bg-red-500' : 'bg-amber-500'}`}></div>

            <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform duration-500">
               {index === 0 && <Heart className="text-red-400 fill-red-400/10" size={28} />}
               {index === 1 && <Zap className="text-amber-400 fill-amber-400/10" size={28} />}
               {index === 2 && <TrendingUp className="text-emerald-400" size={28} />}
               {index === 3 && <Target className="text-cyan-400" size={28} />}
            </div>

            <h3 className="text-white text-lg font-black tracking-tight mb-4 uppercase">
              {item.title}
            </h3>

            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
              {item.desc}
            </p>

            <div className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg ${item.color}`}>
              {item.status}
            </div>
          </div>
        ))}
      </div>
    ) : null}

    {/* Alert Modal */}
    <AlertModal {...alert} onClose={closeAlert} />
  </div>
);
};

export default HealthCheck;
