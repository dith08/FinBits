import { useState, useRef } from 'react';
import { Camera, X, Upload, DollarSign } from 'lucide-react';
import { AlertModal, ModalPortal } from '../common';
import { useAlert } from '../../hooks';

interface WantItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

interface EditWantsProps {
  onClose: () => void;
  onSave: (name: string, price: number, imageUrl: string, imageFile?: File | null) => void;
  initialData: WantItem;
}

const EditWants: React.FC<EditWantsProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData.name,
    price: initialData.price.toString(),
    imageUrl: initialData.imageUrl,
    imageFile: null as File | null
  });
  const { alert, showWarning, closeAlert } = useAlert();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatCurrency = (value: string) => {
    const num = value.replace(/\D/g, '');
    return num ? Number(num).toLocaleString('id-ID') : '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      price: rawValue
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showWarning('File terlalu besar. Maksimal 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result as string,
          imageFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.price) {
      onSave(
        formData.name, 
        parseInt(formData.price), 
        formData.imageUrl,
        formData.imageFile
      );
      onClose();
    }
  };

  return (
    <ModalPortal>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div className="w-full max-w-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl shadow-2xl border border-gray-800/50 overflow-hidden my-auto">
          <div className="bg-gradient-to-r from-blue-500/20 to-transparent p-6 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Edit Wants</h1>
                  <p className="text-gray-400 text-sm">Ubah barang impian Anda</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <form className="p-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-gray-300 font-medium text-sm mb-2">Foto Barang</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[4/3] bg-[#1e1e1e] border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center group cursor-pointer hover:border-blue-500 hover:bg-[#252525] transition-all overflow-hidden"
                >
                  {formData.imageUrl ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload size={40} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-4 text-center">
                      <Camera size={48} className="text-gray-600 group-hover:text-blue-400 transition-colors mb-2" strokeWidth={1.5} />
                      <span className="text-gray-400 text-sm font-medium">
                        Klik untuk upload foto
                        <br />
                        <span className="text-xs text-gray-500">Max 5MB</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-medium text-sm mb-2">Nama Barang</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#1e1e1e] border border-gray-700 text-white rounded-xl p-3 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="Contoh: Laptop ROG..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium text-sm flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                  Harga Barang
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                  <input
                    type="text"
                    value={formatCurrency(formData.price)}
                    onChange={handlePriceChange}
                    className="w-full bg-[#1e1e1e] border border-gray-700 text-white rounded-xl p-3 pl-12 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-600 text-gray-300 hover:text-white py-3 rounded-xl hover:bg-gray-800 transition-all font-medium"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/30"
              >
                Update Wants
              </button>
            </div>
          </form>

          <AlertModal
            isOpen={alert.isOpen}
            onClose={closeAlert}
            type={alert.type}
            title={alert.title}
            message={alert.message}
          />
        </div>
      </div>
    </ModalPortal>
  );
};

export default EditWants;
