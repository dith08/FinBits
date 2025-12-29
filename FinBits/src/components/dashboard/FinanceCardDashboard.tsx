const FinanceCardDashboard = () => {
  return (
    <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 w-full h-full flex flex-col justify-between">
      <h3 className="text-emerald-400 font-semibold mb-6 text-center text-lg">Finance Score</h3>
      
      <div className="space-y-6 flex-1 flex flex-col justify-center">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <p className="text-zinc-400 text-sm">Pemasukan Bulan Ini :</p>
          <span className="text-emerald-400 font-bold text-sm ml-2">Rp 4.000.000</span>
        </div>

        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <p className="text-zinc-400 text-sm">Pengeluaran Bulan Ini :</p>
          <span className="text-red-500 font-bold text-sm ml-2">Rp 2.000.000</span>
        </div>

        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <p className="text-zinc-400 text-sm">Tabungan Bulan Ini :</p>
          <span className="text-amber-600 font-bold text-sm ml-2">Rp 2.000.000</span>
        </div>
      </div>
    </div>
  );
};

export default FinanceCardDashboard;