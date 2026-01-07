import React from 'react';

interface NoteCardProps {
  notes?: string[];
}

const NoteCard: React.FC<NoteCardProps> = ({ 
  notes = ["Jadi lebih baik setiap hari", "Jadi lebih baik setiap hari", "Jadi lebih baik setiap hari", "Jadi lebih baik setiap hari", "Jadi lebih baik setiap hari"] 
}) => {
  return (
    <div className="bg-zinc-900/50 rounded-2xl p-8 min-h-[400px] border border-zinc-800 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-10 text-white">Note</h2>
      <ul className="space-y-4 text-gray-300">
        {notes.map((note, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="w-4 h-[2px] bg-gray-400"></span>
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoteCard;