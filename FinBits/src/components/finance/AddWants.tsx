import React, { useState, useRef } from 'react';
import { Camera, X, Upload, ShoppingBag, DollarSign, AlertCircle } from 'lucide-react';
import { AlertModal, ModalPortal } from '../common';

interface AddWantsProps {
  onClose: () => void;
  onAdd: (name: string, price: number, imageUrl: string, imageFile?: File) => void;
}

const AddWants: React.FC<AddWantsProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: ''
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Konstanta batas maksimal (sesuai DECIMAL(15,2))
  const MAX_PRICE = 9999999999999.99;
  const MIN_PRICE = 0.01;
  const MAX_ITEM_NAME_LENGTH = 150;

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
    
    // ✅ Validasi panjang nama barang
    if (name === 'name' && value.length > MAX_ITEM_NAME_LENGTH) {
      setError(`Nama barang maksimal ${MAX_ITEM_NAME_LENGTH} karakter`);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error saat input berubah
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    
    // ✅ Validasi batas maksimal harga
    if (rawValue !== '') {
      const numericValue = parseFloat(rawValue);
      
      if (numericValue > MAX_PRICE) {
        setError(`Harga maksimal adalah Rp ${MAX_PRICE.toLocaleString('id-ID')}`);
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      price: rawValue
    }));
    setError(''); // Clear error saat input berubah
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ✅ Validasi ukuran file
      if (file.size > 5 * 1024 * 1024) { 
        setAlertMessage('File terlalu besar. Maksimal 5MB.');
        return;
      }

      // ✅ Validasi tipe file
      if (!file.type.startsWith('image/')) {
        setAlertMessage('File harus berupa gambar (JPG, PNG, etc).');
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
    setError('');

    // ✅ Validasi nama barang
    if (!formData.name.trim()) {
      setError('Nama barang tidak boleh kosong');
      return;
    }

    if (formData.name.trim().length < 3) {
      setError('Nama barang minimal 3 karakter');
      return;
    }

    if (formData.name.length > MAX_ITEM_NAME_LENGTH) {
      setError(`Nama barang maksimal ${MAX_ITEM_NAME_LENGTH} karakter`);
      return;
    }

    // ✅ Validasi harga
    if (!formData.price) {
      setError('Harga tidak boleh kosong');
      return;
    }

    const numericPrice = parseFloat(formData.price);

    if (isNaN(numericPrice)) {
      setError('Harga harus berupa angka valid');
      return;
    }

    if (numericPrice < MIN_PRICE) {
      setError(`Harga minimal adalah Rp ${MIN_PRICE.toLocaleString('id-ID')}`);
      return;
    }

    if (numericPrice > MAX_PRICE) {
      setError(`Harga maksimal adalah Rp ${MAX_PRICE.toLocaleString('id-ID')}`);
      return;
    }

    // ✅ Validasi gambar (opsional tapi recommended)
    const uploadedFile = fileInputRef.current?.files?.[0];
    if (!uploadedFile && !formData.imageUrl) {
      setError('Silakan upload gambar barang');
      return;
    }

    // ✅ Submit data
    onAdd(
      formData.name.trim(), 
      numericPrice, 
      formData.imageUrl || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=300',
      uploadedFile || undefined
    );
    onClose();
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
                  <ShoppingBag className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Add Wants</h1>
                  <p className="text-gray-400 text-sm">Tambahkan barang impian Anda</p>
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
            {/* ✅ Alert Error */}
            {error && (
              <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-gray-300 font-medium text-sm mb-2">
                  Foto Barang <span className="text-red-400">*</span>
                </label>
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
                        <span className="text-xs text-gray-500">Max 5MB (JPG, PNG)</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-medium text-sm mb-2">
                  Nama Barang <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#1e1e1e] border border-gray-700 text-white rounded-xl p-3 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="Contoh: Laptop ROG..."
                  maxLength={MAX_ITEM_NAME_LENGTH}
                  required
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  {formData.name.length}/{MAX_ITEM_NAME_LENGTH} karakter
                </p>
              </div>

              <div>
                <label className="block text-gray-300 font-medium text-sm flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                  Harga Barang <span className="text-red-400">*</span>
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
                <p className="text-xs text-gray-500 mt-1.5">
                  Maksimal: Rp {MAX_PRICE.toLocaleString('id-ID')}
                </p>
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
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/30 active:scale-95"
              >
                Add Wants
              </button>
            </div>
          </form>

          <AlertModal
            isOpen={!!alertMessage}
            onClose={() => setAlertMessage(null)}
            type="warning"
            message={alertMessage || ''}
          />
        </div>
      </div>
    </ModalPortal>
  );
};

export default AddWants;