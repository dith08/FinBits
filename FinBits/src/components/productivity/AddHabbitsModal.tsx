import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface AddHabbitModalProps {
  onClose: () => void;
}

const AddHabbitModal: React.FC<AddHabbitModalProps> = ({ onClose }) => {
  const [reminder, setReminder] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl bg-[#1a1a1a] rounded-2xl p-8 shadow-xl border border-white/5 relative">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#1EB980] text-center mb-10">
          Add Habbits
        </h1>

        <form className="space-y-6">
          {/* Input: Masukan Habbit Baru */}
          <div className="space-y-2">
            <label className="block text-white font-semibold">Masukan Habbit Baru</label>
            <input 
              type="text" 
              className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#1EB980] transition-colors"
              placeholder="Masukkan habbit baru..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Select: Frekuensi */}
              <div className="space-y-2">
                <label className="block text-white font-semibold">Frekuensi</label>
                <div className="relative">
                  <select className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:border-[#1EB980]">
                    <option value="">Pilih Frekuensi</option>
                    <option value="daily">Harian</option>
                    <option value="weekly">Mingguan</option>
                    <option value="monthly">Bulanan</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Select: Kategori */}
              <div className="space-y-2">
                <label className="block text-white font-semibold">Kategori</label>
                <div className="relative">
                  <select className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:border-[#1EB980]">
                    <option value="">Pilih Kategori</option>
                    <option value="health">Kesehatan</option>
                    <option value="productivity">Produktivitas</option>
                    <option value="learning">Belajar</option>
                    <option value="sport">Olahraga</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Textarea: Note */}
              <div className="space-y-2">
                <label className="block text-white font-semibold">Note</label>
                <textarea 
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg py-3 px-4 text-white h-32 focus:outline-none focus:border-[#1EB980] resize-none"
                  placeholder="Tambahkan catatan..."
                />
              </div>
            </div>

            <div className="flex flex-col justify-between items-end">
              {/* Reminder Switch */}
              <div className="space-y-3 text-right">
                <label className="block text-white font-semibold text-lg">Reminder</label>
                <div className="flex bg-[#2a2a2a] rounded-lg p-1 w-fit border border-gray-600">
                  <button
                    type="button"
                    onClick={() => setReminder(true)}
                    className={`px-6 py-1.5 rounded-md font-bold transition-all ${
                      reminder ? 'bg-white text-black' : 'text-white hover:text-gray-300'
                    }`}
                  >
                    On
                  </button>
                  <button
                    type="button"
                    onClick={() => setReminder(false)}
                    className={`px-6 py-1.5 rounded-md font-bold transition-all ${
                      !reminder ? 'bg-[#cccccc] text-black' : 'text-white hover:text-gray-300'
                    }`}
                  >
                    Off
                  </button>
                </div>
              </div>

              {/* Button Section */}
              <div className="flex gap-3 mt-10">
                <button 
                  type="button"
                  onClick={onClose}
                  className="border border-gray-500 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="border border-emerald-500 text-emerald-400 px-6 py-3 rounded-lg hover:bg-emerald-900/20 transition-all"
                >
                  Add New Habbit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabbitModal;