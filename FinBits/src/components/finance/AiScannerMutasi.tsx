import { useState, useRef } from "react";
import { Camera, Sparkles, FileText } from "lucide-react";

export const AiScannerMutasi = () => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  // Fungsi buat trigger klik pada input file yang sembunyi
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  // Fungsi pas file udah dipilih
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-md mx-auto text-white p-6 rounded-lg border border-gray-800">
      {/* Input File (Hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Upload Area */}
      <div 
        onClick={handleBoxClick}
        className="w-full aspect-[4/3] bg-transparent border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center mb-4 hover:border-[#00b894] transition-all cursor-pointer overflow-hidden group"
      >
        {image ? (
          <img src={image} alt="Preview Mutasi" className="w-full h-full object-cover" />
        ) : (
          <>
            <Camera size={60} className="text-gray-600 group-hover:text-[#00b894] transition-colors" strokeWidth={1} />
            <p className="text-gray-500 text-sm mt-2">Ketuk buat upload foto</p>
          </>
        )}
      </div>

      <h1 className="text-[#00b894] text-lg font-bold mb-4 text-center">
        Upload Mutasi Rekening
      </h1>

      <div className="w-full flex justify-end mb-4">
        <button className="flex items-center gap-2 border border-gray-600 rounded-lg px-3 py-2 hover:bg-gray-800 transition-all text-sm">
          <span className="font-medium">Scanner AI</span>
          <Sparkles size={14} className="text-[#00b894] fill-[#00b894]" />
        </button>
      </div>

      {/* Analysis Section (Hanya muncul kalau udah upload biar keren) */}
      <div className={`border border-gray-700 rounded-lg p-4 space-y-3 text-[10px] leading-relaxed text-gray-300 transition-opacity ${image ? 'opacity-100' : 'opacity-50'}`}>
        <section>
          <p className="font-bold text-white flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span> Pola Boros
          </p>
          <p>Pengeluaran nongkrong lu naik 27% minggu ini. Kalau diterusin, ini jadi penyebab utama saldo lu bocor halus.</p>
        </section>

        <section>
          <p className="font-bold text-white flex items-center gap-1">
             <span className="w-1 h-1 bg-yellow-500 rounded-full"></span> Kebiasaan Pengeluaran
          </p>
          <p>Lu konsisten belanja kecil tapi sering: 18 transaksi &lt; 25 ribu. Totalnya 312 ribu, lumayan kan?</p>
        </section>

        <section>
          <p className="font-bold text-white flex items-center gap-1">
             <span className="w-1 h-1 bg-[#00b894] rounded-full"></span> Saran Hemat
          </p>
          <p>Kurangin makan luar 2x seminggu + hemat ±180 ribu/bulan tanpa nyiksa hidup.</p>
        </section>
      </div>
    </div>
  );
};