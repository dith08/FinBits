
const HealthCheck = () => {
  const stats = [
    {
      title: "Consistency",
      desc: "Kamu konsisten 72% minggu ini ritme lu mulai kebentuk, tinggal dijaga biar gak drop.",
      status: "Good",
      color: "bg-green-800 text-white"
    },
    {
      title: "New Skill",
      desc: "Skill baru yang Kamu unlock minggu ini: API Security ini bakal naikin value lu sebagai developer.",
      status: "Bad",
      color: "bg-red-900 text-white"
    },
    {
      title: "Finish Goal",
      desc: "Kamu nyelesain 2 goal minggu ini: Refactor backend & Routine saving plan. Nice, Kamu lagi di track yang bener.",
      status: "Normal",
      color: "bg-yellow-700 text-white"
    },
    {
      title: "Skill Boost",
      desc: "Skill yang paling banyak Kamu push: SQL Optimization keep going, ini skill berdampak besar buat karier.",
      status: "Good",
      color: "bg-green-800 text-white"
    }
  ];

  return (
    <div>
      {/* Main Title */}
      <h1 className="text-3xl font-bold text-[#10B981] mb-12 tracking-tight">
        Goal Health Check
      </h1>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {stats.map((item, index) => (
          <div 
            key={index} 
            className="bg-black border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center shadow-lg h-full"
          >
            {/* Card Title */}
            <h3 className="text-white text-xl font-bold mb-6 italic tracking-wide">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-8 flex-grow">
              {item.desc}
            </p>

            {/* Status Badge */}
            <div className={`w-full py-2 rounded-lg font-bold text-sm ${item.color}`}>
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthCheck;