import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface TodoItem {
  id: number;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  start: string;
  end: string;
  note: string;
  isOpen: boolean;
  isSelected: boolean;
}

interface EditTodoListModalProps {
  todo: TodoItem;
  onClose: () => void;
  onSave: (updatedTodo: TodoItem) => void;
}

const EditTodoListModal: React.FC<EditTodoListModalProps> = ({ todo, onClose, onSave }) => {
  const [reminder, setReminder] = useState(false);
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>(todo.status);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [formData, setFormData] = useState({
    title: todo.title,
    start: todo.start,
    end: todo.end,
    note: todo.note,
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const statusOptions: Array<'Pending' | 'In Progress' | 'Completed'> = ['Pending', 'In Progress', 'Completed'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const updatedTodo: TodoItem = {
      ...todo,
      ...formData,
      status
    };
    onSave(updatedTodo);
  };

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
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-emerald-400">
            Edit To Do List
          </h2>
          <p className="text-sm text-gray-400 mt-1">ID: #{todo.id}</p>
        </div>

        <div className="space-y-6">
          {/* Input Tugas */}
          <div className="space-y-2">
            <label className="text-white font-medium">Tugas</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
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
                  name="start"
                  value={formData.start}
                  onChange={handleInputChange}
                  placeholder="Start" 
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
                <span className="text-white">-</span>
                <input 
                  type="text" 
                  name="end"
                  value={formData.end}
                  onChange={handleInputChange}
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
                  <span className="text-white">{status}</span>
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
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-emerald-900/30 transition-colors ${
                          status === option ? 'text-emerald-400' : 'text-white'
                        }`}
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
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={onClose}
                className="bg-transparent border border-gray-500 text-white text-xs py-3 px-6 rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="bg-transparent border border-emerald-500 text-white text-xs py-3 px-6 rounded-md hover:bg-emerald-900/20 transition-colors whitespace-nowrap"
              >
                Update To Do List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTodoListModal;