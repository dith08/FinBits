import { LineChart } from 'lucide-react';

const HabitCard = () => {
  return (
    <div className="bg-[#181818] p-6 rounded-2xl flex flex-col items-center justify-between w-82 h-82 border border-gray-800">
      <h3 className="text-white font-bold text-lg text-center leading-tight">Habbit Consistance</h3>
      
      <div className="text-[#10b981] flex items-center justify-center">
        <LineChart size={80} strokeWidth={2.5} />
      </div>

      <p className="text-gray-500 text-sm font-medium">Consistency: 73%</p>
    </div>
  );
};

export default HabitCard;