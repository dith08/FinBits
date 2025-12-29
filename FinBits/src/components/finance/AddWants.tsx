// Update AddWants.tsx (dengan scrollable image upload)
import React, { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';

interface AddWantsProps {
  onClose: () => void;
  onAdd: (name: string, price: number, imageUrl: string) => void;
}

const AddWants: React.FC<AddWantsProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File terlalu besar. Maksimal 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.price) {
      onAdd(
        formData.name, 
        parseInt(formData.price), 
        formData.imageUrl || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=300'
      );
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#121212] text-white p-8 rounded-xl shadow-2xl w-full max-w-sm border border-gray-800 relative my-8">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h1 className="text-[#1db978] text-3xl font-bold text-center mb-8">
          Add Wants
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Image Upload dengan Scroll */}
          <div className="flex flex-col items-center mb-8">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[4/3] bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center group cursor-pointer hover:border-[#1db978] transition-colors mb-3 overflow-hidden"
            >
              {formData.imageUrl ? (
                <div className="relative w-full h-full">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-contain max-h-full"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload size={40} className="text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center p-4">
                  <Camera size={80} className="text-gray-600 group-hover:text-gray-400 transition-colors mb-2" strokeWidth={1} />
                  <span className="text-gray-400 text-center text-sm">
                    Click to upload image
                    <br />
                    <span className="text-xs text-gray-500">Max 5MB</span>
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm font-semibold text-gray-200">Upload Foto Barang</span>
          </div>

          <div>
            <label className="block text-lg font-bold mb-2">Nama Barang</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 outline-none focus:border-[#1db978] transition-colors"
              placeholder="Contoh: Laptop ROG..."
              required
            />
          </div>

          <div>
            <label className="block text-lg font-bold mb-2">Harga Barang</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 outline-none focus:border-[#1db978] transition-colors"
              placeholder="Masukkan harga..."
              required
            />
          </div>

          <div className="pt-4">
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 bg-[#1db978] hover:bg-[#19a369] text-white py-3 rounded-lg font-bold transition-all"
              >
                Add Wants
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWants;