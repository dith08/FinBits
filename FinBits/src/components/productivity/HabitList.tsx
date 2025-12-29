import { useState } from 'react';
import { ChevronDown, Sparkles, Edit, Trash2, Check } from 'lucide-react';
import AddHabbitModal from './AddHabbitsModal';
import AddHabbitAI from './AddHabbitsAiModal';
import EditHabbitModal from './EditHabbitsModal';
import DeleteModalHabbits from './DeleteModalHabbits';


interface Habbit {
  id: number;
  title: string;
  date: string;
  frequency: string;
  category: string;
  progress: string;
  isOpen: boolean;
  completed: boolean;
  isSelected: boolean;
}

const HabbitsList = () => {
  const [habbits, setHabbits] = useState<Habbit[]>([
    { 
      id: 1, 
      title: 'Bangun pagi jam 04.00', 
      date: '1 Jan - 31 Des 2025', 
      frequency: 'Daily', 
      category: 'Healthy', 
      progress: '70%', 
      isOpen: true,
      completed: false,
      isSelected: false
    },
    { 
      id: 2, 
      title: 'Makan sayur waktu sarapan', 
      date: '-', 
      frequency: '-', 
      category: '-', 
      progress: '-', 
      isOpen: false, 
      completed: false, 
      isSelected: false 
    },
    { 
      id: 3, 
      title: 'Lari pagi', 
      date: '-', 
      frequency: '-', 
      category: '-', 
      progress: '-', 
      isOpen: false, 
      completed: false, 
      isSelected: false 
    },
    { 
      id: 4, 
      title: 'Workout', 
      date: '-', 
      frequency: '-', 
      category: '-', 
      progress: '-', 
      isOpen: false, 
      completed: false, 
      isSelected: false 
    },
  ]);

  // State untuk mengontrol modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHabbit, setSelectedHabbit] = useState<Habbit | null>(null);
  const [actionMode, setActionMode] = useState<'none' | 'edit' | 'delete'>('none');

  const toggleOpen = (id: number) => {
    if (actionMode === 'none') {
      setHabbits(habbits.map(h => h.id === id ? { ...h, isOpen: !h.isOpen } : h));
    }
  };

  const toggleCheck = (id: number) => {
    if (actionMode === 'none') {
      setHabbits(habbits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
    }
  };

  const handleActionClick = (mode: 'edit' | 'delete') => {
    if (actionMode === mode) {
      // Jika sudah dalam mode yang sama, cari habbit yang dipilih
      const selectedHabbit = habbits.find(habbit => habbit.isSelected);
      
      if (selectedHabbit) {
        setSelectedHabbit(selectedHabbit);
        if (mode === 'edit') {
          setShowEditModal(true);
        } else {
          setShowDeleteModal(true);
        }
        exitActionMode();
      } else {
        // Jika tidak ada yang dipilih, keluar dari mode
        exitActionMode();
      }
    } else {
      // Masuk ke mode baru
      setActionMode(mode);
      // Reset semua seleksi sebelumnya
      setHabbits(habbits.map(h => ({ ...h, isSelected: false })));
    }
  };

  const handleSelectHabbit = (id: number) => {
    if (actionMode !== 'none') {
      // Hanya pilih 1 habbit, unselect yang lain
      setHabbits(habbits.map(h => ({
        ...h,
        isSelected: h.id === id ? !h.isSelected : false
      })));
    }
  };

  const exitActionMode = () => {
    setActionMode('none');
    setHabbits(habbits.map(h => ({ ...h, isSelected: false })));
  };

  const handleDeleteConfirm = () => {
    if (selectedHabbit) {
      // Hapus habbit dari state
      setHabbits(habbits.filter(h => h.id !== selectedHabbit.id));
      setShowDeleteModal(false);
      setSelectedHabbit(null);
    }
  };

  const handleEditSave = (updatedHabbit: Habbit) => {
    // Update habbit di state
    setHabbits(habbits.map(h => h.id === updatedHabbit.id ? updatedHabbit : h));
    setShowEditModal(false);
    setSelectedHabbit(null);
  };

  // Cari habbit yang dipilih
  const selectedHabbitForAction = habbits.find(habbit => habbit.isSelected);

  return (
    <div className="text-white p-8 font-sans">
      <div className="space-y-4">
        {/* Action Mode Info Bar */}
        {actionMode !== 'none' && (
          <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                actionMode === 'edit' ? 'bg-blue-600' : 'bg-red-600'
              }`}>
                {actionMode === 'edit' ? (
                  <Edit className="w-3 h-3" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
              </div>
              <span className="text-sm">
                {actionMode === 'edit' 
                  ? 'Pilih 1 habbit yang akan diedit' 
                  : 'Pilih 1 habbit yang akan dihapus'}
                {selectedHabbitForAction && (
                  <span className="ml-2 text-emerald-400">
                    • {selectedHabbitForAction.title}
                  </span>
                )}
              </span>
            </div>
            <button
              onClick={exitActionMode}
              className="text-xs px-3 py-1 bg-red-900/30 border border-red-700 rounded hover:bg-red-800/30 transition-colors"
            >
              Batal
            </button>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold text-emerald-400 mb-8">
          Habbits List
        </h1>

        {/* Habbits Items */}
        {habbits.map((habbit) => (
          <div key={habbit.id} className="space-y-2">
            <div className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
              habbit.isSelected 
                ? actionMode === 'edit' 
                  ? 'border-blue-500 bg-blue-900/10' 
                  : 'border-red-500 bg-red-900/10'
                : 'bg-[#1e1e1e] border-gray-700 hover:border-emerald-500/50'
            }`}>
              <div className="flex items-center gap-3 flex-1">
                {/* Radio button untuk seleksi */}
                {actionMode !== 'none' && (
                  <button
                    onClick={() => handleSelectHabbit(habbit.id)}
                    className={`w-5 h-5 border rounded-full flex items-center justify-center transition-colors ${
                      habbit.isSelected 
                        ? actionMode === 'edit'
                          ? 'bg-blue-500 border-blue-500'
                          : 'bg-red-500 border-red-500'
                        : 'border-gray-500 hover:border-emerald-500'
                    }`}
                  >
                    {habbit.isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                )}
                
                <div 
                  className="cursor-pointer flex-1"
                  onClick={() => toggleOpen(habbit.id)}
                >
                  <span className={`text-lg transition-all ${habbit.completed ? 'text-gray-500 line-through' : ''}`}>
                    {habbit.title}
                  </span>
                  {habbit.isSelected && actionMode !== 'none' && (
                    <span className={`ml-2 text-xs px-2 py-1 rounded ${
                      actionMode === 'edit'
                        ? 'bg-blue-900/30 border border-blue-700'
                        : 'bg-red-900/30 border border-red-700'
                    }`}>
                      {actionMode === 'edit' ? 'Akan Diedit' : 'Akan Dihapus'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Custom Checkbox - hanya aktif saat tidak dalam action mode */}
                {actionMode === 'none' && (
                  <div 
                    onClick={() => toggleCheck(habbit.id)}
                    className={`w-6 h-6 border-2 rounded flex items-center justify-center cursor-pointer transition-colors
                      ${habbit.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600 bg-transparent'}`}
                  >
                    {habbit.completed && <Check className="w-3 h-3 text-white" />}
                  </div>
                )}

                <ChevronDown 
                  onClick={() => toggleOpen(habbit.id)}
                  className={`w-6 h-6 cursor-pointer transition-transform ${habbit.isOpen ? 'rotate-180' : ''} ${actionMode !== 'none' ? 'opacity-50 cursor-default' : ''}`} 
                />
              </div>
            </div>

            {/* Detail Panel */}
            {habbit.isOpen && actionMode === 'none' && (
              <div className="p-5 bg-[#121212] border border-gray-700 rounded-xl mx-1 text-sm grid grid-cols-2 gap-y-4">
                <div className="space-y-3">
                  <p><span className="text-gray-400">Habbits :</span> <br/> {habbit.title}</p>
                  <p><span className="text-gray-400">Frekuensi :</span> <br/> {habbit.frequency}</p>
                  <p><span className="text-gray-400">Kategori :</span> <br/> {habbit.category}</p>
                </div>
                <div className="space-y-3 text-right">
                  <p><span className="text-gray-400">Date :</span> <br/> {habbit.date}</p>
                  <div className="pt-4">
                    <p><span className="text-gray-400">Progress :</span> {habbit.progress}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Buttons Section */}
        <div className="grid grid-cols-2 gap-4 mt-12">
          <button 
            onClick={() => setShowAIModal(true)}
            className="flex items-center justify-center gap-2 bg-[#1e1e1e] border border-gray-700 p-3 rounded-lg text-xs font-medium hover:bg-[#252525] hover:border-emerald-500 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={actionMode !== 'none'}
          >
            Add New Habbits With AI 
            <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110" />
          </button>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#1e1e1e] border border-gray-700 p-3 rounded-lg text-xs font-medium hover:bg-[#252525] hover:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={actionMode !== 'none'}
          >
            Add New Habbits
          </button>
          
          <button 
            onClick={() => handleActionClick('edit')}
            className={`flex items-center justify-center gap-2 border p-3 rounded-lg text-xs font-medium transition-colors ${
              actionMode === 'edit'
                ? 'bg-blue-900/30 border-blue-500 hover:bg-blue-800/30'
                : 'bg-[#1e1e1e] border-gray-700 hover:bg-[#252525] hover:border-blue-500'
            }`}
          >
            <Edit className="w-4 h-4" />
            {actionMode === 'edit' && selectedHabbitForAction
              ? 'Edit Selected'
              : 'Edit Habbits'
            }
          </button>
          
          <button 
            onClick={() => handleActionClick('delete')}
            className={`flex items-center justify-center gap-2 border p-3 rounded-lg text-xs font-medium transition-colors ${
              actionMode === 'delete'
                ? 'bg-red-900/30 border-red-500 hover:bg-red-800/30'
                : 'bg-[#1e1e1e] border-gray-700 hover:bg-[#252525] hover:border-red-500'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            {actionMode === 'delete' && selectedHabbitForAction
              ? 'Delete Selected'
              : 'Delete Habbits'
            }
          </button>
        </div>
      </div>

      {/* Modal untuk Add Habbits */}
      {showAddModal && (
        <AddHabbitModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Modal untuk Add Habbits dengan AI */}
      {showAIModal && (
        <AddHabbitAI onClose={() => setShowAIModal(false)} />
      )}

      {/* Modal untuk Edit Habbit */}
      {showEditModal && selectedHabbit && (
        <EditHabbitModal 
          habbit={selectedHabbit}
          onClose={() => {
            setShowEditModal(false);
            setSelectedHabbit(null);
          }}
          onSave={handleEditSave}
        />
      )}

      {/* Modal untuk Delete Confirmation */}
      {showDeleteModal && (
        <DeleteModalHabbits
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedHabbit(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default HabbitsList;