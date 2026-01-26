import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Sparkles, Edit, Trash2, Check, Clock } from 'lucide-react';
import AddHabitModal from './AddHabitModal';
import EditHabitModal from './EditHabitModal';
import DeleteHabitModal from './DeleteHabitModal';
import AddHabbitAI from './AddHabitAiModal';
import { productivityService } from '../../services/productivityService';
import { AlertModal } from '../common';
import { useAlert, useHabitReset } from '../../hooks';
import { COLOR_CLASSES } from '../../constants/colors';
import type { HabitItem } from '../../types/productivity';

interface HabitDisplay extends HabitItem {
  isOpen: boolean;
  isSelected: boolean;
  completed: boolean;
  completedAt?: string;
}

const parseTimeFromNote = (note?: string): string | null => {
  if (!note) return null;
  const timeMatch = note.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
  if (timeMatch) {
    return timeMatch[1];
  }
  const singleMatch = note.match(/(\d{1,2}:\d{2})/);
  return singleMatch ? singleMatch[1] : null;
};

const canResetHabit = (completedAt?: string): boolean => {
  if (!completedAt) return true;
  
  const completedDate = new Date(completedAt);
  const nextReset = new Date(completedDate);
  nextReset.setDate(nextReset.getDate() + 1);
  nextReset.setHours(0, 0, 0, 0);
  
  return new Date() >= nextReset;
};

const getTimeUntilReset = (completedAt?: string): string => {
  if (!completedAt) return '';
  
  const completedDate = new Date(completedAt);
  const nextReset = new Date(completedDate);
  nextReset.setDate(nextReset.getDate() + 1);
  nextReset.setHours(0, 0, 0, 0);
  
  const remaining = nextReset.getTime() - Date.now();
  if (remaining <= 0) return '';
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}j ${mins}m`;
};

const HabitsList = () => {
  const [habits, setHabits] = useState<HabitDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<HabitDisplay | null>(null);
  const [actionMode, setActionMode] = useState<'none' | 'edit' | 'delete'>('none');
  const { alert, showSuccess, showError, closeAlert } = useAlert();

  const loadCompletedTimestamps = (): Record<number, string> => {
    try {
      const saved = localStorage.getItem('habitCompletedTimestamps');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const saveCompletedTimestamp = (habitId: number, timestamp: string | null) => {
    const timestamps = loadCompletedTimestamps();
    if (timestamp) {
      timestamps[habitId] = timestamp;
    } else {
      delete timestamps[habitId];
    }
    localStorage.setItem('habitCompletedTimestamps', JSON.stringify(timestamps));
  };

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productivityService.getHabits();
      const timestamps = loadCompletedTimestamps();
      const habitsWithUI: HabitDisplay[] = (response.data || []).map((habit: HabitItem) => {
        const completedAt = timestamps[habit.habit_id];
        const isCompleted = completedAt && !canResetHabit(completedAt);
        return {
          ...habit,
          isOpen: false,
          isSelected: false,
          completed: isCompleted || false,
          completedAt,
        };
      });
      setHabits(habitsWithUI);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
    const interval = setInterval(() => {
      setHabits(prev => prev.map(h => {
        if (h.completedAt && canResetHabit(h.completedAt)) {
          return { ...h, completed: false, completedAt: undefined };
        }
        return h;
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchHabits]);

  useHabitReset({
    onReset: () => {
      console.log('🔄 Resetting all habits at midnight');
      setHabits(prev => prev.map(h => ({ ...h, completed: false, completedAt: undefined })));
      fetchHabits();
    }
  });

  const toggleOpen = (id: number) => {
    if (actionMode === 'none') {
      setHabits(habits.map(h => h.habit_id === id ? { ...h, isOpen: !h.isOpen } : h));
    }
  };

  const toggleCheck = async (id: number) => {
    if (actionMode !== 'none') return;
    
    const habit = habits.find(h => h.habit_id === id);
    if (!habit) return;

    if (habit.completed) {
      saveCompletedTimestamp(id, null);
      setHabits(habits.map(h => h.habit_id === id ? { ...h, completed: false, completedAt: undefined } : h));
    } else {
      try {
        const today = new Date().toISOString().split('T')[0];
        await productivityService.trackHabit(id, {
          date: today,
          is_completed: true
        });
        const timestamp = new Date().toISOString();
        saveCompletedTimestamp(id, timestamp);
        setHabits(habits.map(h => h.habit_id === id ? { ...h, completed: true, completedAt: timestamp } : h));
      } catch (err) {
        console.error('Error tracking habit:', err);
      }
    }
  };

  const handleActionClick = (mode: 'edit' | 'delete') => {
    if (actionMode === mode) {
      const selected = habits.filter(habit => habit.isSelected);
      if (selected.length > 0) {
        if (mode === 'edit') {
          setSelectedHabit(selected[0]);
          setShowEditModal(true);
          exitActionMode();
        } else {
          setShowDeleteModal(true);
        }
      } else {
        exitActionMode();
      }
    } else {
      setActionMode(mode);
      setHabits(habits.map(h => ({ ...h, isSelected: false })));
    }
  };

  const handleSelectHabit = (id: number) => {
    if (actionMode !== 'none') {
      if (actionMode === 'edit') {
        setHabits(habits.map(h => ({
          ...h,
          isSelected: h.habit_id === id ? !h.isSelected : false
        })));
      } else {
        setHabits(habits.map(h => ({
          ...h,
          isSelected: h.habit_id === id ? !h.isSelected : h.isSelected
        })));
      }
    }
  };

  const exitActionMode = () => {
    setActionMode('none');
    setHabits(habits.map(h => ({ ...h, isSelected: false })));
  };

  const handleDeleteConfirm = async () => {
    const selectedHabits = habits.filter(h => h.isSelected);
    if (selectedHabits.length > 0) {
      try {
        await Promise.all(selectedHabits.map(h => productivityService.deleteHabit(h.habit_id)));
        await fetchHabits();
        setShowDeleteModal(false);
        setSelectedHabit(null);
        exitActionMode();
        showSuccess(`${selectedHabits.length} habit berhasil dihapus!`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        console.error('Error deleting habits:', err);
        showError('Gagal menghapus habit');
      }
    } else if (selectedHabit) {
      try {
        await productivityService.deleteHabit(selectedHabit.habit_id);
        await fetchHabits();
        setShowDeleteModal(false);
        setSelectedHabit(null);
        exitActionMode();
        showSuccess('Habit berhasil dihapus!');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        console.error('Error deleting habit:', err);
        showError('Gagal menghapus habit');
      }
    }
  };

  const handleAddSuccess = () => {
    fetchHabits();
    setShowAddModal(false);
    setShowAIModal(false);
  };

  const handleEditSave = async () => {
    await fetchHabits();
    setShowEditModal(false);
    setSelectedHabit(null);
  };

  const selectedHabitsForAction = habits.filter(habit => habit.isSelected);
  const selectedCount = selectedHabitsForAction.length;

  if (loading) {
    return (
      <div className="text-white p-8 flex items-center justify-center">
        <div className="animate-pulse text-zinc-400">Memuat kebiasaan...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchHabits} className="px-4 py-2 bg-emerald-600 rounded-md hover:bg-emerald-700">
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="text-white p-8 font-sans">
      <div className="space-y-4">
        {actionMode !== 'none' && (
          <div className={`p-3 ${COLOR_CLASSES.accent.bgLight} border ${COLOR_CLASSES.accent.borderLight} rounded-lg flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${actionMode === 'edit' ? COLOR_CLASSES.accent.bg : 'bg-red-600'}`}>
                {actionMode === 'edit' ? <Edit className="w-3 h-3" /> : <Trash2 className="w-3 h-3" />}
              </div>
              <span className="text-sm">
                {actionMode === 'edit' ? 'Pilih 1 kebiasaan yang akan diedit' : `Pilih kebiasaan yang akan dihapus (${selectedCount} dipilih)`}
                {selectedCount > 0 && (
                  <span className="ml-2 text-emerald-400">
                    • {selectedHabitsForAction.map(h => h.habit_name).join(', ')}
                  </span>
                )}
              </span>
            </div>
            <div className="flex gap-2">
              {actionMode === 'delete' && (
                <button
                  onClick={() => {
                    setHabits(prev => prev.map(h => ({ ...h, isSelected: true })));
                  }}
                  className={`text-xs px-3 py-1 ${COLOR_CLASSES.accent.bg} hover:bg-cyan-600 rounded transition-colors`}
                >
                  Pilih Semua
                </button>
              )}
              <button onClick={exitActionMode} className="text-xs px-3 py-1 bg-red-900/30 border border-red-700 rounded hover:bg-red-800/30">Batal</button>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold text-emerald-400 mb-8">Daftar Kebiasaan</h1>

        {habits.length === 0 ? (
          <div className="text-center text-zinc-500 py-8">Belum ada kebiasaan. Tambahkan yang baru!</div>
        ) : (
          habits.map((habit) => {
            const canReset = canResetHabit(habit.completedAt);
            const timeUntilReset = getTimeUntilReset(habit.completedAt);
            const displayTime = parseTimeFromNote(habit.note);
            
            return (
              <div key={habit.habit_id} className="space-y-2">
                <div className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  habit.isSelected 
                    ? actionMode === 'edit' ? `${COLOR_CLASSES.accent.border} ${COLOR_CLASSES.accent.bgLight}` : 'border-red-500 bg-red-900/10'
                    : 'bg-[#1e1e1e] border-gray-700 hover:border-cyan-500/50'
                }`}>
                  <div className="flex items-center gap-3 flex-1">
                    {actionMode !== 'none' && (
                      <button
                        onClick={() => handleSelectHabit(habit.habit_id)}
                        className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${
                          habit.isSelected 
                            ? actionMode === 'edit' ? `${COLOR_CLASSES.accent.bg} ${COLOR_CLASSES.accent.border}` : 'bg-red-500 border-red-500'
                            : 'border-gray-500 hover:border-cyan-500'
                        }`}
                      >
                        {habit.isSelected && <Check className="w-3 h-3 text-white" />}
                      </button>
                    )}
                    
                    <div className="cursor-pointer flex-1 flex items-center gap-3" onClick={() => toggleOpen(habit.habit_id)}>
                      <span className={`text-lg transition-all ${habit.completed ? 'text-gray-500 line-through' : ''}`}>
                        {habit.habit_name}
                      </span>
                      
                      {/* Time from note display */}
                      {displayTime && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {displayTime}
                        </span>
                      )}
                      
                      {/* Cooldown indicator */}
                      {habit.completed && !canReset && timeUntilReset && (
                        <span className="text-xs text-amber-500 bg-amber-900/20 px-2 py-0.5 rounded">
                          Reset: {timeUntilReset}
                        </span>
                      )}
                      
                      {habit.isSelected && actionMode !== 'none' && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          actionMode === 'edit' ? `${COLOR_CLASSES.accent.bgLight} border ${COLOR_CLASSES.accent.borderLight}` : 'bg-red-900/30 border border-red-700'
                        }`}>
                          {actionMode === 'edit' ? 'Akan Diedit' : 'Akan Dihapus'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {actionMode === 'none' && (
                      <button
                        onClick={() => toggleCheck(habit.habit_id)}
                        className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors cursor-pointer
                          ${habit.completed ? 'bg-emerald-500 border-emerald-500 hover:bg-emerald-600' : 'border-gray-600 bg-transparent hover:border-emerald-500'}`}
                        title={habit.completed ? 'Klik untuk batalkan' : 'Klik untuk tandai selesai'}
                      >
                        {habit.completed && <Check className="w-3 h-3 text-white" />}
                      </button>
                    )}
                    <ChevronDown 
                      onClick={() => toggleOpen(habit.habit_id)}
                      className={`w-6 h-6 cursor-pointer transition-transform ${habit.isOpen ? 'rotate-180' : ''} ${actionMode !== 'none' ? 'opacity-50' : ''}`} 
                    />
                  </div>
                </div>

                {habit.isOpen && actionMode === 'none' && (
                  <div className="p-5 bg-[#121212] border border-gray-700 rounded-xl mx-1 text-sm grid grid-cols-2 gap-y-4">
                    <div className="space-y-3">
                      <p><span className="text-gray-400">Kebiasaan :</span> <br/> {habit.habit_name}</p>
                      <p><span className="text-gray-400">Frekuensi :</span> <br/> {habit.frequency}</p>
                      <p><span className="text-gray-400">Kategori :</span> <br/> {habit.category}</p>
                    </div>
                    <div className="space-y-3 text-right">
                      <p><span className="text-gray-400">Pengingat :</span> <br/> {habit.reminder_time || '-'}</p>
                      <p><span className="text-gray-400">Target :</span> <br/> {habit.progress_target}%</p>
                      <p><span className="text-gray-400">Catatan :</span> <br/> {habit.note || '-'}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        <div className="grid grid-cols-2 gap-4 mt-12">
          <button onClick={() => setShowAIModal(true)} disabled={actionMode !== 'none'}
            className="flex items-center justify-center gap-2 bg-[#1e1e1e] border border-gray-700 p-3 rounded-lg text-xs font-medium hover:bg-[#252525] hover:border-emerald-500 transition-all group disabled:opacity-50">
            Tambah Kebiasaan AI <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110" />
          </button>
          <button onClick={() => setShowAddModal(true)} disabled={actionMode !== 'none'}
            className="bg-[#1e1e1e] border border-gray-700 p-3 rounded-lg text-xs font-medium hover:bg-[#252525] hover:border-emerald-500 transition-colors disabled:opacity-50">
            Tambah Kebiasaan
          </button>
          <button onClick={() => handleActionClick('edit')}
            className={`flex items-center justify-center gap-2 border p-3 rounded-lg text-xs font-medium transition-colors ${
              actionMode === 'edit' ? `${COLOR_CLASSES.accent.bgLight} ${COLOR_CLASSES.accent.border}` : 'bg-[#1e1e1e] border-gray-700 hover:border-cyan-500'
            }`}>
            <Edit className="w-4 h-4" />
            {actionMode === 'edit' && selectedCount > 0 ? 'Edit Terpilih' : 'Edit Kebiasaan'}
          </button>
          <button onClick={() => handleActionClick('delete')}
            className={`flex items-center justify-center gap-2 border p-3 rounded-lg text-xs font-medium transition-colors ${
              actionMode === 'delete' ? 'bg-red-900/30 border-red-500' : 'bg-[#1e1e1e] border-gray-700 hover:border-red-500'
            }`}>
            <Trash2 className="w-4 h-4" />
            {actionMode === 'delete' && selectedCount > 0 ? `Hapus (${selectedCount})` : 'Hapus Kebiasaan'}
          </button>
        </div>
      </div>

      {showAddModal && <AddHabitModal onClose={() => setShowAddModal(false)} onSuccess={handleAddSuccess} />}
      {showAIModal && <AddHabbitAI onClose={() => setShowAIModal(false)} onSuccess={handleAddSuccess} />}
      {showEditModal && selectedHabit && (
        <EditHabitModal habit={selectedHabit} onClose={() => { setShowEditModal(false); setSelectedHabit(null); }} onSave={handleEditSave} />
      )}
      {showDeleteModal && (
        <DeleteHabitModal 
          isOpen={showDeleteModal} 
          onClose={() => { setShowDeleteModal(false); setSelectedHabit(null); setHabits(habits.map(h => ({ ...h, isSelected: false }))); }} 
          onConfirm={handleDeleteConfirm}
          count={selectedCount || 1}
        />
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
    </div>
  );
};

export default HabitsList;