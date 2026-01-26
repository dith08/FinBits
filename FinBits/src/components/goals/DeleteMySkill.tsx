import React, { useState } from 'react';
import skillsService from '../../services/skillsService';

interface DeleteModalMySkill {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  skillId?: number;
  onDeleted?: () => void;
}

const DeleteModalMySkill: React.FC<DeleteModalMySkill> = ({ isOpen, onClose, onConfirm, skillId, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!skillId) {
      onConfirm?.();
      return;
    }

    setLoading(true);
    try {
      await skillsService.delete(skillId);
      onDeleted?.();
      onClose();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Gagal menghapus skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[400px] rounded-[32px] bg-[#121212] p-8 text-center shadow-2xl">
        
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-36 bg-[#1EB980] rounded-sm flex justify-center items-center">
            <div className="absolute -top-2 w-36 h-4 bg-[#1EB980] rounded-t-md"></div>
            <div className="flex gap-3">
              <div className="w-4 h-24 bg-[#121212] rounded-full"></div>
              <div className="w-4 h-24 bg-[#121212] rounded-full"></div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          Apakah Anda Yakin?
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 px-4">
          Semua informasi terkait Data tersebut akan dihapus secara permanen dari sistem. 
          Mohon pastikan kembali sebelum melanjutkan
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-4 bg-[#1EB980] text-white font-bold rounded-xl hover:bg-[#17a370] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-4 bg-[#800000] text-white font-bold rounded-xl hover:bg-[#660000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModalMySkill;