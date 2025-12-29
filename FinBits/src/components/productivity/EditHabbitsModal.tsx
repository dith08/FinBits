// ui/EditHabbitModal.tsx
import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import type { Habbit } from '../../assets/types/habbits.types';

interface EditHabbitModalProps {
  habbit: Habbit;
  onClose: () => void;
  onSave: (updatedHabbit: Habbit) => void;
}

const EditHabbitModal: React.FC<EditHabbitModalProps> = ({ habbit, onClose, onSave }) => {
  const [reminder, setReminder] = useState(false);
  const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    title: habbit.title,
    date: habbit.date,
    frequency: habbit.frequency,
    category: habbit.category,
    progress: habbit.progress,
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const frequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly', '-'];
  const categoryOptions = ['Healthy', 'Productivity', 'Learning', 'Sport', 'Mindfulness', 'Finance', '-'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedHabbit: Habbit = {
      ...habbit,
      ...formData
    };
    onSave(updatedHabbit);
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
          Edit Habbit
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Input: Habbit Title */}
          <div className="space-y-2">
            <label className="block text-white font-semibold">Habbit Title</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#1EB980] transition-colors"
              required
            />
          </div>

          {/* Tanggal */}
          <div className="space-y-2">
            <label className="block text-white font-semibold">Date Range</label>
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg py-2 px-4 text-white text-sm focus:outline-none focus:border-[#1EB980]"
                placeholder="Contoh: 1 Jan - 31 Des 2025"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Frekuensi Dropdown */}
              <div className="space-y-2 relative">
                <label className="block text-white font-semibold">Frekuensi</label>
                <div className="relative">
                  <div 
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg py-3 px-4 text-white cursor-pointer flex items-center justify-between hover:border-[#1EB980] transition-colors"
                    onClick={() => {
                      setShowFrequencyDropdown(!showFrequencyDropdown);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    <span>{formData.frequency || 'Select Frequency'}</span>
                    <ChevronDown className={`transition-transform ${showFrequencyDropdown ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {showFrequencyDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2a2a] border border-gray-600 rounded-lg shadow-lg z-20 overflow-hidden">
                      {frequencyOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, frequency: option }));
                            setShowFrequencyDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-900/30 transition-colors ${
                            formData.frequency === option ? 'text-emerald-400 bg-emerald-900/20' : 'text-white'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <label className="block text-white font-semibold">Progress</label>
                <input 
                  type="text" 
                  name="progress"
                  value={formData.progress}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#1EB980] transition-colors"
                  placeholder="Contoh: 70%"
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Kategori Dropdown */}
              <div className="space-y-2 relative">
                <label className="block text-white font-semibold">Kategori</label>
                <div className="relative">
                  <div 
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg py-3 px-4 text-white cursor-pointer flex items-center justify-between hover:border-[#1EB980] transition-colors"
                    onClick={() => {
                      setShowCategoryDropdown(!showCategoryDropdown);
                      setShowFrequencyDropdown(false);
                    }}
                  >
                    <span>{formData.category || 'Select Category'}</span>
                    <ChevronDown className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2a2a] border border-gray-600 rounded-lg shadow-lg z-20 overflow-hidden">
                      {categoryOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, category: option }));
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-900/30 transition-colors ${
                            formData.category === option ? 'text-emerald-400 bg-emerald-900/20' : 'text-white'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Reminder Switch */}
              <div className="space-y-3">
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
            </div>
          </div>

          {/* Note Section */}
          <div className="space-y-2">
            <label className="block text-white font-semibold">Note</label>
            <textarea 
              className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg py-3 px-4 text-white h-24 focus:outline-none focus:border-[#1EB980] resize-none"
              placeholder="Tambahkan catatan..."
            />
          </div>

          {/* Button Section */}
          <div className="flex justify-end gap-3 pt-6">
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
              Update Habbit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHabbitModal;