import { useState } from "react";
import { ChevronDown, Sparkles, Loader2, AlertCircle, Wallet, ShoppingBag, PiggyBank, Coffee, Info } from "lucide-react";
import { aiFinanceService } from "../../services/financeService";

interface BudgetResult {
  needs_amount: number;
  wants_amount: number;
  saving_amount: number;
  daily_snack_limit: number;
  estimated_balance_30_days: number;
  needs_note: string;
  wants_note: string;
  saving_note: string;
  general_note: string;
}

export const BudgetAssistant = () => {
  const [income, setIncome] = useState("");
  const [profile, setProfile] = useState("Pelajar");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [budgetResult, setBudgetResult] = useState<BudgetResult | null>(null);

  const profileOptions = ["Pelajar", "Mahasiswa", "Karyawan", "Freelancer", "Anak Kost", "Kepala Keluarga"];

  const roundToThousand = (num: number) => Math.ceil(num / 1000) * 1000;

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const parseIncome = (value: string): number => {
    return parseInt(value.replace(/[^0-9]/g, '')) || 0;
  };

  const handleGenerate = async () => {
    const incomeValue = parseIncome(income);
    if (!incomeValue || incomeValue <= 0) {
      setError("Input income dulu dong, masa mau ngatur angin?");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await aiFinanceService.generateBudget({
        income: incomeValue,
        role: profile,
      });

      if (response.success && response.data) {
        const raw = response.data;
        const roundedData: BudgetResult = {
          ...raw,
          needs_amount: roundToThousand(raw.needs_amount),
          wants_amount: roundToThousand(raw.wants_amount),
          saving_amount: roundToThousand(raw.saving_amount),
          daily_snack_limit: roundToThousand(raw.daily_snack_limit),
          estimated_balance_30_days: roundToThousand(raw.estimated_balance_30_days),
        };
        
        setBudgetResult(roundedData);
      } else {
        setError(response.message || "Gagal generate budget nih.");
      }
    } catch (err: any) {
      setError("Server lagi pusing, coba lagi ntar ya!");
    } finally {
      setLoading(false);
    }
  };

  const cardsData = [
    { 
      title: "Needs", 
      icon: <Wallet className="text-emerald-400" />, 
      amount: budgetResult?.needs_amount, 
      note: budgetResult?.needs_note || "Budget buat makan & kewajiban utama kamu."
    },
    { 
      title: "Wants", 
      icon: <ShoppingBag className="text-pink-400" />, 
      amount: budgetResult?.wants_amount, 
      note: budgetResult?.wants_note || "Buat seneng-seneng tapi tetep terkontrol."
    },
    { 
      title: "Saving", 
      icon: <PiggyBank className="text-amber-400" />, 
      amount: budgetResult?.saving_amount, 
      note: budgetResult?.saving_note || "Tabungan biar masa depan gak suram."
    },
    { 
      title: "Daily Limit", 
      icon: <Coffee className="text-cyan-400" />, 
      amount: budgetResult?.daily_snack_limit, 
      note: budgetResult ? "Batas maksimal jajan per hari biar gak boncos." : "Limit jajan harian bakal diitungin AI."
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 rounded-[2rem] border border-slate-800 shadow-2xl text-slate-200">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Budget Assistant AI
          </h1>
          <p className="text-slate-400 text-sm mt-1">Atur duit kamu pake AI, biar gak jajan mulu.</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {/* Input Income */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
            <input
              type="text"
              value={income}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setIncome(val ? Number(val).toLocaleString('id-ID') : '');
              }}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
              placeholder="Masukkan Income"
            />
          </div>

          <div className="relative min-w-[160px]">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 flex justify-between items-center hover:bg-slate-800 transition-all"
            >
              <span className="text-sm font-medium">{profile}</span>
              <ChevronDown size={18} className={`text-emerald-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden z-20 shadow-2xl">
                {profileOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => { setProfile(opt); setIsOpen(false); }}
                    className="px-4 py-2.5 text-sm hover:bg-emerald-500 hover:text-white cursor-pointer transition-colors"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cardsData.map((card, i) => (
          <div 
            key={i} 
            className={`group p-6 rounded-2xl border transition-all duration-300 ${
              budgetResult 
              ? 'bg-slate-800/40 border-slate-700 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
              : 'bg-slate-900/20 border-slate-800 opacity-60'
            }`}
          >
            <div className="p-2 w-fit rounded-lg bg-slate-900 mb-4 group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{card.title}</h3>
            <p className="text-xl font-bold mt-1 text-white">
              {card.amount ? formatIDR(card.amount) : "Rp 0"}
            </p>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
              {card.note}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-[1.5rem] border border-slate-700/50">
        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 rounded-full bg-emerald-500/10 text-emerald-400">
            <Info size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">AI Analysis Note</h4>
            <div className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
              {budgetResult 
                ? (
                  <p>
                    {budgetResult.general_note}. Estimasi sisa saldo kamu setelah 30 hari itu sekitar <span className="text-emerald-400 font-bold">{formatIDR(budgetResult.estimated_balance_30_days)}</span>.
                  </p>
                )
                : "Masukin income dulu terus klik generate. AI bakal bantu pecah budget biar kamu gak pusing di akhir bulan."
              }
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !income}
          className="relative overflow-hidden group flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-950 font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span>Generate With AI</span>
              <Sparkles size={20} className="fill-current" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BudgetAssistant;