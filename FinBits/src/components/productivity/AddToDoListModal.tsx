import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface AddTodoListModalProps {
  onClose: () => void;
}

const AddTodoListModal: React.FC<AddTodoListModalProps> = ({ onClose }) => {
  const [reminder, setReminder] = useState(false);
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed' | ''>('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Fungsi untuk menutup modal ketika klik di luar konten
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const statusOptions: Array<'Pending' | 'In Progress' | 'Completed'> = ['Pending', 'In Progress', 'Completed'];

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      {/* Container Modal */}
      <div className="w-full max-w-2xl bg-[#1e1e1e] rounded-xl p-8 border border-gray-800 relative shadow-2xl">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-emerald-400 text-center mb-8">
          Add To Do List
        </h2>

        <div className="space-y-6">
          {/* Input Tugas */}
          <div className="space-y-2">
            <label className="text-white font-medium">Masukan Tugas Baru</label>
            <input 
              type="text" 
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Masukkan tugas baru..."
            />
          </div>

          {/* Tanggal & Jam Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tanggal */}
            <div className="space-y-2">
              <label className="text-white font-medium">Tanggal</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Start" 
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-2 text-white text-sm focus:outline-none focus:border-emerald-500" 
                />
                <span className="text-white">-</span>
                <input 
                  type="text" 
                  placeholder="End" 
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-2 text-white text-sm focus:outline-none focus:border-emerald-500" 
                />
              </div>
            </div>

            {/* Jam */}
            <div className="space-y-2">
              <label className="text-white font-medium">Jam</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Start" 
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-2 text-white text-sm focus:outline-none focus:border-emerald-500" 
                />
                <span className="text-white">-</span>
                <input 
                  type="text" 
                  placeholder="End" 
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-2 text-white text-sm focus:outline-none focus:border-emerald-500" 
                />
              </div>
            </div>
          </div>

          {/* Status & Reminder Row */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Status Dropdown */}
            <div className="flex-1 space-y-2">
              <label className="text-white font-medium">Status</label>
              <div className="relative">
                <div 
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-2 h-10 flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-colors"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  <span className={status ? 'text-white' : 'text-gray-400'}>
                    {status || 'Pilih Status'}
                  </span>
                  <ChevronDown className={`text-gray-400 w-5 h-5 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                </div>
                
                {/* Dropdown Options */}
                {showStatusDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2a2a] border border-gray-700 rounded-md shadow-lg z-10 overflow-hidden">
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setStatus(option);
                          setShowStatusDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-emerald-900/30 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reminder Toggle */}
            <div className="space-y-2">
              <label className="text-white font-medium block">Reminder</label>
              <div className="flex border border-gray-700 rounded-md overflow-hidden w-fit">
                <button 
                  onClick={() => setReminder(true)}
                  className={`px-4 py-1 text-sm font-bold transition-colors ${reminder ? 'bg-[#2a2a2a] text-white' : 'bg-transparent text-gray-500 hover:text-white'}`}
                >
                  On
                </button>
                <button 
                  onClick={() => setReminder(false)}
                  className={`px-4 py-1 text-sm font-bold transition-colors ${!reminder ? 'bg-[#e0e0e0] text-black' : 'bg-transparent text-gray-500 hover:text-white'}`}
                >
                  Off
                </button>
              </div>
            </div>
          </div>

          {/* Note & Submit Row */}
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-white font-medium">Note</label>
              <textarea 
                rows={4}
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-emerald-500 resize-none"
                placeholder="Tambahkan catatan..."
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={onClose}
                className="bg-transparent border border-gray-500 text-white text-xs py-3 px-6 rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button className="bg-transparent border border-emerald-500 text-white text-xs py-3 px-6 rounded-md hover:bg-emerald-900/20 transition-colors whitespace-nowrap">
                Add New To Do List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTodoListModal;