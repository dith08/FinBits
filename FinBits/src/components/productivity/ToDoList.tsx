import { useState } from 'react';
import { ChevronDown, Sparkles, Edit, Trash2 } from 'lucide-react';
import AddTodoListModal from './AddToDoListModal';
import AddTodoListAIModal from './AddToDoListAiModal';
import DeleteModalToDoList from './DeleteModalToDoList';
import EditTodoListModal from './EditToDoListModal';


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

const TodoApp = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, title: 'Mengerjakan Project App', status: 'Pending', start: '-', end: '-', note: '-', isOpen: false, isSelected: false },
    { id: 2, title: 'Mengerjakan Project Web', status: 'In Progress', start: '1 Januari 2026', end: '20 Januari 2026', note: 'Dokumentasi code nya jangan lupa', isOpen: true, isSelected: false },
    { id: 3, title: 'Belajar pemrograman baru', status: 'Completed', start: '-', end: '-', note: '-', isOpen: false, isSelected: false },
    { id: 4, title: 'Lari Pagi', status: 'Pending', start: '-', end: '-', note: '-', isOpen: false, isSelected: false },
    { id: 5, title: 'Workout Biceps', status: 'Completed', start: '-', end: '-', note: '-', isOpen: false, isSelected: false },
  ]);
  
  // State untuk mengontrol modal
  const [showAIModal, setShowAIModal] = useState(false);
  const [showRegularModal, setShowRegularModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [actionMode, setActionMode] = useState<'none' | 'edit' | 'delete'>('none');

  // Map buat nentuin warna berdasarkan status
  const statusConfig = {
    'Pending': 'border-red-600 bg-red-600',
    'In Progress': 'border-blue-500 bg-blue-500',
    'Completed': 'border-green-600 bg-green-600'
  };

  const toggleOpen = (id: number) => {
    if (actionMode === 'none') {
      setTodos(todos.map(t => t.id === id ? { ...t, isOpen: !t.isOpen } : t));
    }
  };

  const updateStatus = (id: number, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    setTodos(todos.map(t => t.id === id ? { ...t, status: newStatus } : t));
    setActiveDropdown(null);
  };

  const handleActionClick = (mode: 'edit' | 'delete') => {
    if (actionMode === mode) {
      // Jika sudah dalam mode yang sama, cari todo yang dipilih
      const selectedTodo = todos.find(todo => todo.isSelected);
      
      if (selectedTodo) {
        setSelectedTodo(selectedTodo);
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
      setTodos(todos.map(t => ({ ...t, isSelected: false })));
    }
  };

  const handleSelectTodo = (id: number) => {
    if (actionMode !== 'none') {
      // Hanya pilih 1 todo, unselect yang lain
      setTodos(todos.map(t => ({
        ...t,
        isSelected: t.id === id ? !t.isSelected : false
      })));
    }
  };

  const exitActionMode = () => {
    setActionMode('none');
    setTodos(todos.map(t => ({ ...t, isSelected: false })));
  };

  const handleDeleteConfirm = () => {
    if (selectedTodo) {
      // Hapus todo dari state
      setTodos(todos.filter(t => t.id !== selectedTodo.id));
      setShowDeleteModal(false);
      setSelectedTodo(null);
    }
  };

  const handleEditSave = (updatedTodo: TodoItem) => {
    // Update todo di state
    setTodos(todos.map(t => t.id === updatedTodo.id ? updatedTodo : t));
    setShowEditModal(false);
    setSelectedTodo(null);
  };

  // Cari todo yang dipilih
  const selectedTodoForAction = todos.find(todo => todo.isSelected);

  return (
    <div className="text-white p-6 font-sans">
      {/* Action Mode Info Bar */}
      {actionMode !== 'none' && (
        <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg flex items-center justify-between">
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
                ? 'Pilih 1 todo yang akan diedit' 
                : 'Pilih 1 todo yang akan dihapus'}
              {selectedTodoForAction && (
                <span className="ml-2 text-emerald-400">
                  • {selectedTodoForAction.title}
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

      <div className="space-y-3">
        {todos.map((todo) => (
          <div key={todo.id} className="relative space-y-2">
            {/* Header Accordion */}
            <div className={`flex items-center justify-between p-3 bg-[#1e1e1e] border rounded-lg group transition-colors ${
              todo.isSelected 
                ? actionMode === 'edit' 
                  ? 'border-blue-500 bg-blue-900/10' 
                  : 'border-red-500 bg-red-900/10'
                : 'border-gray-700 hover:border-emerald-500/50'
            }`}>
              <div className="flex items-center gap-3 flex-1">
                {/* Radio button untuk seleksi (hanya 1 bisa dipilih) */}
                {actionMode !== 'none' && (
                  <button
                    onClick={() => handleSelectTodo(todo.id)}
                    className={`w-5 h-5 border rounded-full flex items-center justify-center transition-colors ${
                      todo.isSelected 
                        ? actionMode === 'edit'
                          ? 'bg-blue-500 border-blue-500'
                          : 'bg-red-500 border-red-500'
                        : 'border-gray-500 hover:border-emerald-500'
                    }`}
                  >
                    {todo.isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                )}
                
                <div 
                  className="cursor-pointer flex-1 flex items-center gap-3"
                  onClick={() => toggleOpen(todo.id)}
                >
                  <span className="text-sm font-medium">{todo.title}</span>
                  {todo.isSelected && actionMode !== 'none' && (
                    <span className={`text-xs px-2 py-1 rounded ${
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
                {/* Lingkaran Warna + Dropdown Logic */}
                {actionMode === 'none' && (
                  <div className="relative">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === todo.id ? null : todo.id);
                      }}
                      className={`w-4 h-4 rounded-full border-2 cursor-pointer transition-transform hover:scale-125 ${statusConfig[todo.status]}`}
                    ></div>

                    {/* Popover Pilihan Warna */}
                    {activeDropdown === todo.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-[#252525] border border-gray-600 rounded-md shadow-xl z-10 overflow-hidden">
                        <button onClick={() => updateStatus(todo.id, 'Pending')} className="w-full text-left px-3 py-2 text-xs hover:bg-red-900/30 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-600"></div> Pending
                        </button>
                        <button onClick={() => updateStatus(todo.id, 'In Progress')} className="w-full text-left px-3 py-2 text-xs hover:bg-blue-900/30 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div> In Progress
                        </button>
                        <button onClick={() => updateStatus(todo.id, 'Completed')} className="w-full text-left px-3 py-2 text-xs hover:bg-green-900/30 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-600"></div> Completed
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <ChevronDown 
                  onClick={() => toggleOpen(todo.id)}
                  className={`w-5 h-5 cursor-pointer transition-transform ${todo.isOpen ? 'rotate-180' : ''} ${actionMode !== 'none' ? 'opacity-50 cursor-default' : ''}`} 
                />
              </div>
            </div>

            {/* Detail Panel */}
            {todo.isOpen && actionMode === 'none' && (
              <div className="p-4 bg-[#121212] border border-gray-700 rounded-xl mx-1 text-sm space-y-4 animate-in fade-in slide-in-from-top-1">
                <div className="flex justify-between">
                  <p><span className="text-gray-400">Tugas :</span> {todo.title}</p>
                  <p className="flex items-center gap-2">
                    <span className="text-gray-400">Status :</span> 
                    <span className={todo.status === 'Pending' ? 'text-red-400' : todo.status === 'In Progress' ? 'text-blue-400' : 'text-green-400'}>
                      {todo.status}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <p><span className="text-gray-400">Start :</span> {todo.start}</p>
                  <p><span className="text-gray-400">End :</span> {todo.end}</p>
                </div>
                <p><span className="text-gray-400">Note :</span> {todo.note}</p>
              </div>
            )}
          </div>
        ))}

        {/* Buttons Group */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6">
          <button 
            onClick={() => setShowAIModal(true)}
            className="flex items-center justify-center gap-2 bg-[#1e1e1e] border border-gray-700 py-2 px-4 rounded-md text-xs hover:bg-[#2a2a2a] hover:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={actionMode !== 'none'}
          >
            Add To Do List AI <Sparkles className="w-3 h-3 text-emerald-400" />
          </button>
          
          <button 
            onClick={() => setShowRegularModal(true)}
            className="bg-[#1e1e1e] border border-gray-700 py-2 px-4 rounded-md text-xs hover:bg-[#2a2a2a] hover:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={actionMode !== 'none'}
          >
            Add To Do List
          </button>
          
          <button 
            onClick={() => handleActionClick('edit')}
            className={`flex items-center justify-center gap-2 border py-2 px-4 rounded-md text-xs transition-colors ${
              actionMode === 'edit'
                ? 'bg-blue-900/30 border-blue-500 hover:bg-blue-800/30'
                : 'bg-[#1e1e1e] border-gray-700 hover:bg-[#2a2a2a] hover:border-blue-500'
            }`}
          >
            <Edit className="w-3 h-3" />
            {actionMode === 'edit' && selectedTodoForAction
              ? 'Edit Selected'
              : 'Edit To Do List'
            }
          </button>
          
          <button 
            onClick={() => handleActionClick('delete')}
            className={`flex items-center justify-center gap-2 border py-2 px-4 rounded-md text-xs transition-colors ${
              actionMode === 'delete'
                ? 'bg-red-900/30 border-red-500 hover:bg-red-800/30'
                : 'bg-[#1e1e1e] border-gray-700 hover:bg-[#2a2a2a] hover:border-red-500'
            }`}
          >
            <Trash2 className="w-3 h-3" />
            {actionMode === 'delete' && selectedTodoForAction
              ? 'Delete Selected'
              : 'Delete To Do List'
            }
          </button>
        </div>
      </div>

      {/* Render Modal AI */}
      {showAIModal && (
        <AddTodoListAIModal onClose={() => setShowAIModal(false)} />
      )}

      {/* Render Modal Regular */}
      {showRegularModal && (
        <AddTodoListModal onClose={() => setShowRegularModal(false)} />
      )}

      {/* Render Modal Edit */}
      {showEditModal && selectedTodo && (
        <EditTodoListModal 
          todo={selectedTodo}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTodo(null);
          }}
          onSave={handleEditSave}
        />
      )}

      {/* Render Delete Modal */}
      {showDeleteModal && (
        <DeleteModalToDoList 
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedTodo(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default TodoApp;