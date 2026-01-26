import { useState, useRef } from "react";
import { Camera, AlertCircle, Loader2, Sparkles, BrainCircuit, TrendingDown, Wallet, Lightbulb, History } from 'lucide-react';
import { aiFinanceService } from "../../services/financeService";

interface AnalysisReport {
  pola_boros: string;
  kebiasaan: string;
  kategori_bocor: string;
  saran_hemat: string;
  prediksi_saldo: string;
}

export const AiScannerMutasi = () => {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAnalysisResult(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError("Pilih gambar mutasi terlebih dahulu");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await aiFinanceService.scanMutasi(selectedFile);
      
      if (response.success && response.analysis_report) {
        setAnalysisResult(response.analysis_report);
      } else {
        setError(response.message || "Gagal menganalisis mutasi");
      }
    } catch (err: unknown) {
      console.error("Error scanning mutasi:", err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Gagal menganalisis mutasi. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const defaultAnalysis: AnalysisReport = {
    pola_boros: "Upload mutasi rekening untuk melihat analisis pola boros kamu.",
    kebiasaan: "AI akan menganalisis kebiasaan pengeluaran kamu.",
    kategori_bocor: "Kategori pengeluaran yang perlu diperhatikan akan ditampilkan di sini.",
    saran_hemat: "Saran hemat akan muncul setelah analisis.",
    prediksi_saldo: "Prediksi saldo akan dihitung berdasarkan pola pengeluaran.",
  };

  const analysis = analysisResult || defaultAnalysis;

  return (
    <div className="max-w-md mx-auto relative overflow-hidden text-white p-6 rounded-[2.5rem] border border-gray-800 shadow-2xl backdrop-blur-md">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="text-center mb-6">
        <h1 className="bg-gradient-to-r from-[#00b894] to-[#00cec9] bg-clip-text text-transparent text-xl font-black uppercase tracking-tight">
          AI Mutasi Analyzer
        </h1>
        <p className="text-gray-500 text-[10px] font-medium tracking-widest mt-1 uppercase">Lacak kebiasaan belanja Anda</p>
      </div>

      <div 
        onClick={handleBoxClick}
        className={`relative w-full aspect-[16/10] bg-gray-900/50 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center mb-6 transition-all cursor-pointer overflow-hidden group 
          ${image ? 'border-[#00b894]/50' : 'border-gray-700 hover:border-[#00b894]'}`}
      >
        {image ? (
          <>
            <img src={image} alt="Preview Mutasi" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 group-hover:opacity-100 opacity-0 transition-opacity flex items-center justify-center">
               <p className="text-xs font-bold bg-black/60 px-4 py-2 rounded-full border border-white/20">Ganti Foto</p>
            </div>
            {loading && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00b894]/20 to-transparent h-20 w-full animate-scan pointer-events-none"></div>
            )}
          </>
        ) : (
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-700 group-hover:scale-110 transition-transform duration-300">
              <Camera size={32} className="text-gray-500 group-hover:text-[#00b894]" strokeWidth={1.5} />
            </div>
            <p className="text-gray-400 text-sm font-semibold">Upload Mutasi</p>
            <p className="text-gray-600 text-[10px] mt-1">Tap untuk upload mutasi rekening</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 text-red-400 text-xs flex items-center gap-3 animate-shake">
          <AlertCircle size={18} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="w-full flex justify-center mb-8">
        <button 
          onClick={handleScan}
          disabled={loading || !selectedFile}
          className="relative group overflow-hidden flex items-center gap-3 bg-white text-black rounded-2xl px-8 py-3.5 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#00b894] to-[#00cec9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 font-black text-sm uppercase group-hover:text-white transition-colors leading-none">
            {loading ? 'Analyzing...' : 'Analyze with AI'}
          </span>
          {loading ? (
            <Loader2 size={18} className="animate-spin relative z-10 group-hover:text-white" />
          ) : (
            <Sparkles size={18} className="text-[#00b894] fill-[#00b894] relative z-10 group-hover:text-white group-hover:fill-white transition-all" />
          )}
        </button>
      </div>

      <div className={`space-y-4 transition-all duration-700 ${analysisResult ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4 pointer-events-none'}`}>
        <div className="flex items-center gap-2 mb-2">
          <BrainCircuit size={16} className="text-[#00b894]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">AI Financial Insights</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl hover:border-red-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-red-400">
              <TrendingDown size={14} />
              <p className="font-black text-[11px] uppercase tracking-tighter">Pola Boros</p>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-400">{analysis.pola_boros || "Data belum tersedia"}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl min-h-[100px]">
              <div className="flex items-center gap-2 mb-2 text-yellow-500">
                <History size={14} />
                <p className="font-black text-[11px] uppercase tracking-tighter">Kebiasaan</p>
              </div>
              <p className="text-[10px] leading-relaxed text-gray-400">
                {analysis.kebiasaan || "-"}
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl min-h-[100px]">
              <div className="flex items-center gap-2 mb-2 text-orange-500">
                <AlertCircle size={14} />
                <p className="font-black text-[11px] uppercase tracking-tighter">Kebocoran</p>
              </div>
              <p className="text-[10px] leading-relaxed text-gray-400">
                {analysis.kategori_bocor || "-"}
              </p>
            </div>
          </div>

          <div className="bg-[#00b894]/5 border border-[#00b894]/20 p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 text-[#00b894]">
              <Lightbulb size={14} />
              <p className="font-black text-[11px] uppercase tracking-tighter">Smart Solution</p>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-300 italic">"{analysis.saran_hemat || "-"}"</p>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <Wallet size={14} />
              <p className="font-black text-[11px] uppercase tracking-tighter">Prediksi Saldo</p>
            </div>
            <p className="text-[11px] font-bold text-blue-200 leading-relaxed">{analysis.prediksi_saldo || "-"}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AiScannerMutasi;