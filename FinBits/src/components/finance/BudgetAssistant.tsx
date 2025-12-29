import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";

export const BudgetAssistant = () => {
  // State buat nampung inputan user
  const [income, setIncome] = useState("2.000.000");
  const [profile, setProfile] = useState("Pelajar");
  const [isOpen, setIsOpen] = useState(false);

  const profileOptions = [
    "Pelajar",
    "Mahasiswa",
    "Karyawan",
    "Freelancer",
    "Anak Kost",
    "Kepala Keluarga"
  ];

  const analysisCards = [
    {
      title: "Needs",
      desc: "Idealnya 50%, tapi kondisi Kamu sekarang cuma aman di 55% turunin dikit bagian transport dan jajan. jadi budget needs kamu Rp 1.000.000"
    },
    {
      title: "Wants",
      desc: "Bagian 'Wants' harusnya 30%, tapi Kamu baru bisa 20% kalau mau nabung stabil jadi budget wants kamu Rp 300.000"
    },
    {
      title: "Saving",
      desc: "Target saving realistis buat income Kamu adalah 25%. Fokus ke pengeluaran harian yang kecil tapi sering. budget saving kamu Rp 750.000"
    },
    {
      title: "Limit Jajan",
      desc: "Limit jajan per hari: Rp 25.000. Lewat dari itu saldo Kamu bakal koyak."
    }
  ];

  return (
    <div className=" text-white p-6 rounded-lg border border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex gap-3 w-full md:w-auto">
          {/* Input Income Biar Bisa Diubah */}
          <input
            type="text"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="bg-transparent border border-gray-700 rounded-lg px-4 py-2 min-w-[140px] text-center text-sm focus:outline-none focus:border-[#00b894]"
            placeholder="Input Income"
          />
          
          {/* Custom Dropdown Profile */}
          <div className="relative min-w-[160px]">
            <div 
              onClick={() => setIsOpen(!isOpen)}
              className="border border-gray-700 rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-800 transition-colors text-sm"
            >
              <span>{profile}</span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* List Dropdown */}
            {isOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden z-10 shadow-xl">
                {profileOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      setProfile(opt);
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 text-sm hover:bg-[#00b894] hover:text-white cursor-pointer transition-colors"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <h1 className="text-[#00b894] text-xl font-bold">
          Budget Assistant
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {analysisCards.map((card, index) => (
          <div key={index} className="border border-gray-700 rounded-lg p-4 flex flex-col h-full hover:border-gray-500 transition-colors">
            <h2 className="text-center font-bold mb-3 text-sm">{card.title}</h2>
            <p className="text-xs leading-relaxed text-gray-300 text-center flex-grow">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="border border-gray-700 rounded-lg p-4 max-w-xs w-full">
          <p className="text-xs font-bold mb-2">Note :</p>
          <p className="text-[10px] text-gray-300 leading-relaxed">
            Kalau ngikut rencana ini, saldo kamu 30 hari lagi bisa naik ke Rp 2.800.000.
          </p>
        </div>

        <button className="flex items-center gap-2 border border-gray-600 rounded-lg px-6 py-3 hover:bg-gray-800 transition-all group">
          <span className="font-bold text-sm">Generate With AI</span>
          <Sparkles size={18} className="text-[#00b894] fill-[#00b894]" />
        </button>
      </div>
    </div>
  );
};