import { useState } from 'react';
import { Calendar, ChevronDown, X, Loader2, Target } from 'lucide-react';
import { AlertModal } from '../common';

interface GoalData {
  name: string;
  progress: number;
  category: string;
  outcome: string;
  why: string;
  deadline: string;
  roadmapImage?: string;
}

interface AddGoalsProps {
  onClose: () => void;
  onAdd: (goal: GoalData) => Promise<void> | void;
}

const AddGoalForm: React.FC<AddGoalsProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState<GoalData>({
    name: '',
    progress: 0,
    category: '',
    outcome: '',
    why: '',
    deadline: '',
    roadmapImage: undefined
  });
  
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    console.log('Form data:', formData);
    
    if (!formData.name) {
      setValidationError('Nama tujuan harus diisi');
      return;
    }
    if (!formData.category) {
      setValidationError('Kategori harus dipilih');
      return;
    }
    if (!formData.outcome) {
      setValidationError('Hasil yang diharapkan harus diisi');
      return;
    }
    if (!formData.why) {
      setValidationError('Alasan harus diisi');
      return;
    }
    if (!formData.deadline) {
      setValidationError('Batas waktu harus diisi');
      return;
    }

    setLoading(true);
    try {
      console.log('Calling onAdd with:', formData);
      await onAdd(formData);
      console.log('onAdd completed');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 overflow-y-auto animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl shadow-green-500/10 border border-gray-800 my-auto animate-slideUp relative">
        
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 md:right-6 md:top-6 p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Tambah Tujuan Baru
            </h1>
            <p className="text-gray-400 text-xs md:text-sm">Tetapkan tujuan baru Anda</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium text-sm">Nama Tujuan</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 md:p-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all"
                placeholder="Masukkan nama tujuan"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 font-medium text-sm">Kategori</label>
              <div className="relative">
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 md:p-4 text-white appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all cursor-pointer"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Career">Karir</option>
                  <option value="Education">Pendidikan</option>
                  <option value="Health">Kesehatan</option>
                  <option value="Finance">Keuangan</option>
                  <option value="Personal">Pribadi</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 md:top-4 text-gray-500 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium text-sm">Hasil yang Diharapkan</label>
              <input 
                type="text" 
                name="outcome"
                value={formData.outcome}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 md:p-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all"
                placeholder="Hasil yang diharapkan"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 font-medium text-sm">Alasan</label>
              <input 
                type="text" 
                name="why"
                value={formData.why}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 md:p-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all"
                placeholder="Alasan mencapai tujuan ini"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium text-sm">
                Progres: <span className="text-green-400 font-bold">{formData.progress}%</span>
              </label>
              <input 
                type="range"
                name="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-400 px-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 font-medium text-sm">Batas Waktu</label>
              <div className="relative">
                <input 
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 md:p-4 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 appearance-none cursor-pointer transition-all"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <p className="text-green-400 text-sm font-medium">
              💡 Roadmap bisa di-generate otomatis dengan AI setelah tujuan dibuat. Klik "Lihat Roadmap" pada kartu tujuan.
            </p>
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 text-sm border border-gray-700 text-gray-300 hover:text-white rounded-xl hover:bg-gray-800/50 transition-all disabled:opacity-50 font-medium"
            >
              Batal
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 text-sm bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-green-500/30"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Tambah Tujuan'
              )}
            </button>
          </div>
        </div>

        <AlertModal
          isOpen={!!validationError}
          onClose={() => setValidationError(null)}
          type="warning"
          title="Validasi Form"
          message={validationError || ''}
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
};

export default AddGoalForm;
