import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface AddHabbitAIProps {
  onClose: () => void;
}

const AddHabbitAI: React.FC<AddHabbitAIProps> = ({ onClose }) => {
  const [reminder, setReminder] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      {/* Container Modal dengan Border Emerald */}
      <div className="w-full max-w-2xl bg-[#121212] rounded-xl p-8 border-2 border-emerald-500 relative shadow-[0_0_20px_rgba(16,185,129,0.2)]">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Title dengan Icon AI */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-emerald-400">
            Add New Habbits With AI
          </h2>
        </div>

        <div className="space-y-6">
          {/* Input Habbit Goal */}
          <div className="space-y-2">
            <label className="text-white font-medium">Masukan Tujuan Habbit</label>
            <input 
              type="text" 
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Contoh: Ingin menjadi lebih produktif di pagi hari"
            />
          </div>

          {/* Row Tengah: Detail Habbit & Reminder */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Detail Habbit */}
            <div className="flex-1 space-y-2">
              <label className="text-white font-medium">Detail Habbit</label>
              <textarea 
                rows={5}
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 resize-none"
                placeholder="Jelaskan lebih detail tentang habbit yang ingin dibangun..."
              />
            </div>

            {/* Reminder Toggle */}
            <div className="space-y-2 self-start md:self-center">
              <label className="text-white font-medium block mb-2">Reminder</label>
              <div className="flex border border-gray-600 rounded-md overflow-hidden bg-[#1e1e1e]">
                <button 
                  onClick={() => setReminder(true)}
                  className={`px-6 py-1.5 text-sm font-bold transition-all ${reminder ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  On
                </button>
                <button 
                  onClick={() => setReminder(false)}
                  className={`px-6 py-1.5 text-sm font-bold transition-all ${!reminder ? 'bg-[#e0e0e0] text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  Off
                </button>
              </div>
            </div>
          </div>

          {/* Row Bawah: Frekuensi & Durasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Frekuensi */}
            <div className="space-y-2">
              <label className="text-white font-medium">Frekuensi</label>
              <div className="relative">
                <select className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:border-emerald-500 transition-colors">
                  <option value="">Pilih Frekuensi</option>
                  <option value="daily">Harian</option>
                  <option value="weekly">Mingguan</option>
                  <option value="monthly">Bulanan</option>
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Durasi */}
            <div className="space-y-2">
              <label className="text-white font-medium">Durasi Habbit</label>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  placeholder="Mulai" 
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" 
                />
                <span className="text-white">-</span>
                <input 
                  type="text" 
                  placeholder="Selesai" 
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" 
                />
              </div>
            </div>
          </div>

          {/* Kategori */}
          <div className="space-y-2">
            <label className="text-white font-medium">Kategori</label>
            <div className="relative">
              <select className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:border-emerald-500 transition-colors">
                <option value="">Pilih Kategori Habbit</option>
                <option value="health">Kesehatan</option>
                <option value="productivity">Produktivitas</option>
                <option value="learning">Pembelajaran</option>
                <option value="sport">Olahraga</option>
                <option value="mindfulness">Mindfulness</option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Button Submit AI */}
          <div className="flex justify-end pt-4 gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-transparent border border-gray-600 text-white text-sm rounded-md hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-transparent border border-emerald-500 text-emerald-400 text-sm rounded-md hover:bg-emerald-900/20 transition-all group">
              Generate Habbit Plan With AI
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:animate-pulse" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHabbitAI;