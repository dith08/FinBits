
const FinanceCard = () => {
  return (
    <div className="bg-[#181818] p-6 rounded-2xl flex flex-col items-center justify-between w-82 h-82 border border-gray-800">
      <h3 className="text-white font-bold text-lg mb-6">Finance Score</h3>
      
      <div className="relative flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border-8 border-[#10b981] flex items-center justify-center">
          <span className="text-2xl font-bold text-white">100%</span>
        </div>
      </div>

      <p className="text-gray-500 text-sm font-medium">Financial Health Kamu</p>
    </div>
  );
};

export default FinanceCard;