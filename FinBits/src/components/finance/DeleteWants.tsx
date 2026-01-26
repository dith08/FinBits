import React, { useState } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';

interface DeleteWantsProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  wantName: string;
}

const DeleteWants: React.FC<DeleteWantsProps> = ({ onClose, onConfirm, wantName }) => {
  const [loading, setLoading] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error deleting want:', error);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#121212] text-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-800 relative">
        
        <button 
          onClick={onClose}
          disabled={loading}
          className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">
          Hapus Wants?
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Anda akan menghapus wants <span className="font-semibold text-white">"{wantName}"</span>. Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-sm">
            ⚠️ Semua data budget untuk wants ini akan dihapus secara permanen.
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 font-medium"
          >
            Batal
          </button>
          <button 
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Menghapus...
              </>
            ) : (
              'Hapus Wants'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteWants;
