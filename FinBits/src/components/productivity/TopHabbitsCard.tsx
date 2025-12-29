
const TopHabbitsCard = () => {
  return (
    <div className="flex items-center justify-center p-6 font-sans">
      {/* Container Utama */}
      <div className="w-full max-w-sm bg-[#1e1e1e] rounded-2xl p-6 border border-gray-800 shadow-xl">
        
        {/* Header Title */}
        <h2 className="text-2xl font-bold text-[#00b894] mb-6">
          Top Habbits
        </h2>

        {/* Highlight Section */}
        <div className="space-y-1 mb-6">
          <p className="text-gray-100 text-lg font-medium leading-tight">
            Habit paling ngaruh minggu ini:
          </p>
          <p className="text-white text-xl font-bold tracking-wide">
            Bangun pagi jam 04.00
          </p>
        </div>

        {/* Description / Insight Section */}
        <div className="bg-[#1e1e1e]">
          <p className="text-gray-400 text-base leading-relaxed text-justify">
            Bangun pagi memberikan banyak manfaat, baik bagi kesehatan fisik 
            seperti meningkatkan aktivitas fisik dan metabolisme, maupun 
            kesehatan mental seperti mengurangi stres dan risiko depresi.
          </p>
        </div>

      </div>
    </div>
  );
};

export default TopHabbitsCard;