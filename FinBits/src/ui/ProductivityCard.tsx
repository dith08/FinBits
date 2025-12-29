
const ProductivityCard = () => {
  const percentage = 80;
  const strokeDasharray = 251.2; // 2 * PI * r (r=40)
  const offset = strokeDasharray - (percentage / 100) * strokeDasharray;

  return (
    <div className="bg-[#181818] p-6 rounded-2xl flex flex-col items-center justify-between w-82 h-82 border border-gray-800">
      <h3 className="text-white font-bold text-lg">Productivity Score</h3>
      
      <div className="relative flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64" cy="64" r="40"
            stroke="currentColor" strokeWidth="8"
            fill="transparent" className="text-gray-700"
          />
          <circle
            cx="64" cy="64" r="40"
            stroke="#10b981" strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-2xl font-bold text-white">{percentage}%</span>
      </div>

      <p className="text-gray-500 text-sm font-medium">+12% dari kemarin</p>
    </div>
  );
};

export default ProductivityCard;