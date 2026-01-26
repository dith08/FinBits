import { useState, useRef } from "react";
import { Camera, Calendar, ChevronDown, X, Loader2, Target } from "lucide-react";
import { AlertModal } from "../common";

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

interface EditGoalFormProps {
  onClose: () => void;
  onSave: (goal: GoalData) => Promise<void> | void;
  initialData: GoalData;
}

const EditGoalForm: React.FC<EditGoalFormProps> = ({
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<GoalData>(initialData);
  const [roadmapImage, setRoadmapImage] = useState<string | null>(
    initialData.roadmapImage || null,
  );
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setAlertMessage("File terlalu besar. Maksimal 3MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setRoadmapImage(imageUrl);
        setFormData((prev) => ({ ...prev, roadmapImage: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSave({
        ...formData,
        roadmapImage: roadmapImage || undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setRoadmapImage(null);
    setFormData((prev) => ({ ...prev, roadmapImage: undefined }));
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 overflow-y-auto animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl shadow-blue-500/10 border border-gray-800 my-auto animate-slideUp relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 md:right-4 md:top-4 p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Edit Tujuan
            </h1>
            <p className="text-gray-400 text-xs">Perbarui tujuan Anda</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-gray-300 font-medium text-xs">
                Nama Tujuan
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="Masukkan nama tujuan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-gray-300 font-medium text-xs">
                Kategori
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 text-sm text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 cursor-pointer transition-all"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Career">Karir</option>
                  <option value="Education">Pendidikan</option>
                  <option value="Health">Kesehatan</option>
                  <option value="Finance">Keuangan</option>
                  <option value="Personal">Pribadi</option>
                </select>
                <ChevronDown
                  className="absolute right-2.5 top-2.5 text-gray-500 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-gray-300 font-medium text-xs">
                Hasil yang Diharapkan
              </label>
              <input
                type="text"
                name="outcome"
                value={formData.outcome}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="Hasil yang diharapkan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-gray-300 font-medium text-xs">
                Alasan
              </label>
              <input
                type="text"
                name="why"
                value={formData.why}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="Alasan mencapai tujuan ini"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-gray-300 font-medium text-xs">
                Progres: <span className="text-blue-400 font-bold">{formData.progress}%</span>
              </label>
              <input
                type="range"
                name="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleInputChange}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-gray-300 font-medium text-xs">
                Batas Waktu
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 appearance-none cursor-pointer transition-all"
                  style={{ colorScheme: "dark" }}
                />
                <Calendar
                  className="absolute right-2.5 top-2.5 text-gray-500 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-gray-300 font-medium text-xs">
              Roadmap
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center bg-gray-800/50 hover:bg-gray-800/70 transition-all cursor-pointer ${roadmapImage ? "border-blue-500/50" : "border-gray-700"}`}
            >
              {roadmapImage ? (
                <div className="relative w-fit mx-auto">
                  <img
                    src={roadmapImage}
                    alt="Roadmap preview"
                    className="h-24 w-auto object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors z-10"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <Camera className="text-gray-500 mb-1" size={24} />
                  <span className="text-gray-400 font-medium text-xs">
                    Unggah Roadmap
                  </span>
                  <span className="text-gray-500 text-xs">
                    PNG, JPG (Maks 3MB)
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="pt-2 flex gap-2 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs border border-gray-700 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800/50 transition-all disabled:opacity-50 font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-xs bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-1 shadow-lg hover:shadow-blue-500/30"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Memperbarui...
                </>
              ) : (
                "Perbarui Tujuan"
              )}
            </button>
          </div>
        </div>

        <AlertModal
          isOpen={!!alertMessage}
          onClose={() => setAlertMessage(null)}
          type="warning"
          message={alertMessage || ""}
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

export default EditGoalForm;
