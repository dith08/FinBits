
export default function NotificationPage() {
  return (
    <div className="min-h-screen bg-[#121212] p-8 text-white font-sans">
      <div className="w-full mx-auto">
        {/* Header Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <button className="px-8 py-2 border border-zinc-700 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors">
            Read All
          </button>
          <button className="px-8 py-2 border border-zinc-700 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors">
            Clear All
          </button>
        </div>

        {/* Notification Card */}
        <div className="relative bg-black border border-zinc-800/50 rounded-lg p-6 flex justify-between items-center group cursor-pointer hover:bg-[#1a1a1a] transition-all">
          <h3 className="text-base font-bold tracking-wide">
            Kerjakan habbits Belajar coding
          </h3>
          
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 font-semibold text-sm">09.00</span>
          </div>

          {/* Red Dot Indicator */}
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}