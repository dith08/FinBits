import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface AddTodoListAIModalProps {
  onClose: () => void;
}

const AddTodoListAIModal: React.FC<AddTodoListAIModalProps> = ({ onClose }) => {
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
          <h2 className="text-2xl font-bold text-emerald-400">
            Add To Do List AI
          </h2>
          <Sparkles className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="space-y-6">
          {/* Input Target */}
          <div className="space-y-2">
            <label className="text-white font-medium ml-1">Masukan Target</label>
            <input 
              type="text" 
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Row Tengah: Deskripsi & Reminder */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Deskripsi */}
            <div className="flex-1 space-y-2">
              <label className="text-white font-medium ml-1">Deskripsi</label>
              <textarea 
                rows={5}
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Reminder Toggle */}
            <div className="space-y-2 self-start md:self-center">
              <label className="text-white font-medium block mb-2 text-center md:text-left">Reminder</label>
              <div className="flex border border-gray-600 rounded-md overflow-hidden bg-[#1e1e1e]">
                <button 
                  onClick={() => setReminder(true)}
                  className={`px-6 py-1.5 text-sm font-bold transition-all ${reminder ? 'bg-white text-black' : 'text-gray-400'}`}
                >
                  On
                </button> 
                <button 
                  onClick={() => setReminder(false)}
                  className={`px-6 py-1.5 text-sm font-bold transition-all ${!reminder ? 'bg-[#e0e0e0] text-black' : 'text-gray-400'}`}
                >
                  Off
                </button>
              </div>
            </div>
          </div>

          {/* Row Bawah: Tanggal & Jam */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tanggal */}
            <div className="space-y-2">
              <label className="text-white font-medium ml-1">Tanggal</label>
              <div className="flex items-center gap-3">
                <input type="text" placeholder="Start" className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-2.5 text-center text-gray-500 text-sm" />
                <span className="text-white">-</span>
                <input type="text" placeholder="End" className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-2.5 text-center text-gray-500 text-sm" />
              </div>
            </div>

            {/* Jam */}
            <div className="space-y-2">
              <label className="text-white font-medium ml-1">Jam</label>
              <div className="flex items-center gap-3">
                <input type="text" placeholder="Start" className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-2.5 text-center text-gray-500 text-sm" />
                <span className="text-white">-</span>
                <input type="text" placeholder="End" className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-2.5 text-center text-gray-500 text-sm" />
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
              Add New To Do List With AI 
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:animate-pulse" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTodoListAIModal;