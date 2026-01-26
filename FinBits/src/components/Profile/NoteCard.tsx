import React, { useState, useEffect } from 'react';
import { Edit3, X, Check, StickyNote, Edit2 } from 'lucide-react';

interface NoteCardProps {
  note?: string;
  onUpdate?: (data: { note?: string }) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ 
  note = '',
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState(note);

  // Sync state kalau prop note berubah dari luar
  useEffect(() => {
    setEditNote(note);
  }, [note]);

  const handleSave = () => {
    onUpdate?.({ note: editNote });
    setIsEditing(false);
  };

    return (
  <div className="group relative min-h-[400px] flex flex-col items-center p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] overflow-hidden">
    
    {/* Decorative Background Glow - Biar makin estetik */}
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-colors duration-500" />
    
    {/* Action Buttons */}
    {onUpdate && (
      <div className="absolute top-6 right-6 flex gap-3 z-10">
        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 bg-zinc-800/50 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-xl transition-all duration-300 border border-zinc-700/50"
          >
            <X size={18} />
          </button>
        )}
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`p-2 rounded-xl transition-all duration-300 border ${
            isEditing 
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30" 
              : "bg-zinc-800/50 border-zinc-700/50 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30"
          }`}
        >
          {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
        </button>
      </div>
    )}

    {/* Header Section */}
    <div className="flex flex-col items-center mb-8">
      <div className="w-12 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full mb-6 opacity-50" />
      <h2 className="text-sm uppercase tracking-[0.3em] font-medium text-emerald-500/80 mb-2">
        {/* Bisa diganti 'Motivation' atau 'Daily Note' */}
        Ruang Pribadi
      </h2>
      <h3 className="text-3xl font-bold bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
        Catatan
      </h3>
    </div>

    {/* Content Area */}
    <div className="w-full flex-1 flex flex-col items-center justify-center relative">
      {isEditing ? (
        <textarea
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
          className="w-full h-full min-h-[200px] bg-zinc-800/30 text-zinc-100 rounded-2xl p-5 text-base focus:ring-2 focus:ring-emerald-500/20 focus:outline-none border border-zinc-700/50 transition-all resize-none leading-relaxed"
          placeholder="Tulis sesuatu yang bermakna..."
        />
      ) : (
        <div className="relative">
           {/* Quote Icon Background */}
          <span className="absolute -top-8 -left-8 text-6xl text-emerald-500/5 select-none font-serif">“</span>
          
          <p className={`text-xl md:text-2xl text-center leading-relaxed font-medium ${
            note ? "text-zinc-200" : "text-zinc-500 italic"
          }`}>
            {note || 'Belum ada catatan hari ini...'}
          </p>

          <span className="absolute -bottom-12 -right-8 text-6xl text-emerald-500/5 select-none font-serif">”</span>
        </div>
      )}
    </div>

    {/* Bottom Accent */}
    {!isEditing && (
      <div className="mt-8 px-4 py-1.5 rounded-full bg-zinc-800/30 border border-zinc-700/30 text-[10px] text-zinc-500 uppercase tracking-widest">
        Terakhir Diperbarui: Baru Saja
      </div>
    )}
  </div>
  );
};

export default NoteCard;