import React, { useState, useRef } from 'react';
import { X, Camera, Loader2 } from 'lucide-react';
import { uploadImage } from '../../services/imageService';

interface ProfileData {
  image_url?: string;
  description?: string;
  main_skill?: string;
  sub_skill?: string;
  interest?: string;
  note?: string;
  motivation?: string;
  full_name?: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
  initialData?: ProfileData;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<ProfileData>({
    image_url: initialData?.image_url || '',
    description: initialData?.description || '',
    main_skill: initialData?.main_skill || '',
    sub_skill: initialData?.sub_skill || '',
    interest: initialData?.interest || '',
    note: initialData?.note || '',
    motivation: initialData?.motivation || '',
    full_name: initialData?.full_name || '',
  });
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const url = await uploadImage(file);
      setFormData({ ...formData, image_url: url });
    } catch (err) {
      console.error('Upload failed:', err);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch {
      // Error handled in parent
    } finally {
      setSaving(false);
    }
  };

  const displayImage = previewUrl || formData.image_url;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
  <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
    
    {/* Header - Dibuat lebih clean */}
    <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-800/50 bg-zinc-900/50">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Edit Profil</h2>
        <p className="text-zinc-500 text-sm">Perbarui info pribadi dan preferensi lu di sini.</p>
      </div>
      <button 
        onClick={onClose} 
        className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all"
      >
        <X size={24} />
      </button>
    </div>

    <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        
        {/* Left Column: Avatar & Basic Info (4 Cols) */}
        <div className="md:col-span-5 p-8 bg-zinc-800/20 border-r border-zinc-800/50 space-y-8">
          <div className="flex flex-col items-center group">
            <div className="relative">
              <div className="w-40 h-40 rounded-3xl overflow-hidden ring-4 ring-zinc-800 group-hover:ring-emerald-500/30 transition-all duration-500 rotate-3 group-hover:rotate-0">
                {displayImage ? (
                  <img src={displayImage} alt="Profile" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">No Image</div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-2xl shadow-xl transition-transform hover:scale-110 active:scale-95"
              >
                {uploading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
              </button>
            </div>
            
          <div className="w-full mt-8">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Nama Lengkap</label>
              <input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full mt-2 bg-zinc-900/50 text-white rounded-xl p-3 text-xs border border-zinc-700/50 focus:border-emerald-500 outline-none transition-all"
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>

            <div className="w-full mt-8">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">URL Gambar Profil</label>
              <input
                value={formData.image_url}
                onChange={(e) => {
                  setFormData({ ...formData, image_url: e.target.value });
                  setPreviewUrl(null);
                }}
                className="w-full mt-2 bg-zinc-900/50 text-white rounded-xl p-3 text-xs border border-zinc-700/50 focus:border-emerald-500 outline-none transition-all"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Tentang Anda</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full mt-2 bg-zinc-900/50 text-white rounded-xl p-4 text-sm min-h-[140px] border border-zinc-700/50 focus:border-emerald-500 outline-none resize-none transition-all"
              placeholder="Ceritakan singkat siapa lu..."
            />
          </div>
        </div>

        {/* Right Column: Skills & Others (7 Cols) */}
        <div className="md:col-span-7 p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <h4 className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Keahlian & Minat</h4>
              
              <div className="group">
                <label className="text-xs text-zinc-400 mb-1.5 block ml-1">Keterampilan Utama</label>
                <input
                  value={formData.main_skill}
                  onChange={(e) => setFormData({ ...formData, main_skill: e.target.value })}
                  className="w-full bg-zinc-800/40 text-white rounded-xl p-3 border border-zinc-700/50 focus:bg-zinc-800/80 focus:border-emerald-500 outline-none transition-all"
                  placeholder="React, Next.js, TypeScript"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 mb-1.5 block ml-1">Sub Keterampilan</label>
                  <input
                    value={formData.sub_skill}
                    onChange={(e) => setFormData({ ...formData, sub_skill: e.target.value })}
                    className="w-full bg-zinc-800/40 text-white rounded-xl p-3 border border-zinc-700/50 focus:border-emerald-500 outline-none"
                    placeholder="Tailwind, Vitest"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1.5 block ml-1">Minat</label>
                  <input
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full bg-zinc-800/40 text-white rounded-xl p-3 border border-zinc-700/50 focus:border-emerald-500 outline-none"
                    placeholder="Gaming, AI"
                  />
                </div>
              </div>
            </div>

            <hr className="border-zinc-800/50" />

            <div className="space-y-4">
              <h4 className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Inspirasi</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                   <label className="text-xs text-zinc-400 mb-1.5 block ml-1">Catatan Harian</label>
                   <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full bg-zinc-800/40 text-white rounded-xl p-3 text-sm min-h-[80px] border border-zinc-700/50 focus:border-emerald-500 outline-none resize-none"
                  />
                </div>
                <div>
                   <label className="text-xs text-zinc-400 mb-1.5 block ml-1">Motivasi</label>
                   <textarea
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    className="w-full bg-zinc-800/40 text-white rounded-xl p-3 text-sm min-h-[80px] border border-zinc-700/50 focus:border-emerald-500 outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-8 bg-zinc-900/80 border-t border-zinc-800/50 backdrop-blur-md sticky bottom-0 flex gap-3 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all font-medium"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-8 py-2.5 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default EditProfileModal;
