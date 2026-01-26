import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import { Activity } from 'lucide-react';

interface ChartDataItem {
  name: string;
  productivity: number;
  financeBalance: number;
  goalsProgress: number;
  habitCompletion: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
  }>;
  label?: string;
}

const ProductivityChart = () => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardData();
      console.log('Raw API response:', response);
      
      // Gunakan data dari berbagai sumber karena multiLineChart semua 0
      const productivityData = response.data.productivity.graphData || [];
      const habitData = response.data.habit.graphData || [];
      const goalsData = response.data.goals.graphData || [];
      const financeScore = response.data.finance.score || 0;
      
      console.log('Productivity data:', productivityData);
      console.log('Habit data:', habitData);
      console.log('Goals data:', goalsData);
      console.log('Finance score:', financeScore);
      
      // Combine semua data berdasarkan date
      const dateMap = new Map<string, ChartDataItem>();
      
      // Add productivity data (normalize to 0-100)
      productivityData.forEach((item: { date: string; score?: number }) => {
        const date = new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        if (!dateMap.has(date)) {
          dateMap.set(date, { name: date, productivity: 0, financeBalance: 0, goalsProgress: 0, habitCompletion: 0 });
        }
        const existing = dateMap.get(date)!;
        existing.productivity = Math.min(100, item.score ?? 0);
      });
      
      // Add habit data (already 0-100)
      habitData.forEach((item: { date: string; completionRate: number | null }) => {
        const date = new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        if (!dateMap.has(date)) {
          dateMap.set(date, { name: date, productivity: 0, financeBalance: 0, goalsProgress: 0, habitCompletion: 0 });
        }
        const existing = dateMap.get(date)!;
        existing.habitCompletion = item.completionRate ?? 0;
      });
      
      // Add goals data (already 0-100)
      goalsData.forEach((item: { date: string; avgProgress?: number }) => {
        const date = new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        if (!dateMap.has(date)) {
          dateMap.set(date, { name: date, productivity: 0, financeBalance: 0, goalsProgress: 0, habitCompletion: 0 });
        }
        const existing = dateMap.get(date)!;
        existing.goalsProgress = item.avgProgress ?? 0;
      });
      
      // Add finance data - gunakan score langsung untuk tanggal yang belum ada data
      // Finance score adalah nilai 0-100 yang konsisten
      habitData.forEach((item: { date: string }) => {
        const date = new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        if (!dateMap.has(date)) {
          dateMap.set(date, { name: date, productivity: 0, financeBalance: 0, goalsProgress: 0, habitCompletion: 0 });
        }
      });
      
      // Apply finance score ke semua dates yang sudah ada
      dateMap.forEach((item) => {
        item.financeBalance = financeScore;
      });
      
      // Generate 7 hari terakhir
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
      
      const allDates: string[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
        const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        allDates.push(dateStr);
      }
      
      // Calculate averages dari data yang ada
      const existingData = Array.from(dateMap.values());
      const avgProductivity = existingData.length > 0 
        ? existingData.reduce((sum, d) => sum + d.productivity, 0) / existingData.length 
        : 50;
      const avgFinance = existingData.length > 0 
        ? existingData.reduce((sum, d) => sum + d.financeBalance, 0) / existingData.length 
        : 30;
      const avgGoals = existingData.length > 0 
        ? existingData.reduce((sum, d) => sum + d.goalsProgress, 0) / existingData.length 
        : 50;
      const avgHabit = existingData.length > 0 
        ? existingData.reduce((sum, d) => sum + d.habitCompletion, 0) / existingData.length 
        : 70;
      
      // Create map dari existing data
      const existingMap = new Map(existingData.map(d => [d.name, d]));
      
      // Fill all 7 days dengan data yang ada atau average
      const last7Days = allDates.map(date => {
        if (existingMap.has(date)) {
          return existingMap.get(date)!;
        } else {
          return {
            name: date,
            productivity: avgProductivity,
            financeBalance: avgFinance,
            goalsProgress: avgGoals,
            habitCompletion: avgHabit,
          };
        }
      });
      
      console.log('Final chart data:', last7Days);
      
      if (last7Days.length === 0) {
        console.warn('⚠️ No chart data available, using sample data');
        const sampleData: ChartDataItem[] = [
          { name: '1 Jan', productivity: 45, financeBalance: 30, goalsProgress: 50, habitCompletion: 60 },
          { name: '2 Jan', productivity: 52, financeBalance: 45, goalsProgress: 50, habitCompletion: 65 },
          { name: '3 Jan', productivity: 48, financeBalance: 40, goalsProgress: 50, habitCompletion: 70 },
          { name: '4 Jan', productivity: 61, financeBalance: 60, goalsProgress: 50, habitCompletion: 75 },
          { name: '5 Jan', productivity: 55, financeBalance: 50, goalsProgress: 50, habitCompletion: 80 },
          { name: '6 Jan', productivity: 67, financeBalance: 70, goalsProgress: 50, habitCompletion: 85 },
          { name: '7 Jan', productivity: 72, financeBalance: 80, goalsProgress: 50, habitCompletion: 90 },
        ];
        setChartData(sampleData);
      } else {
        setChartData(last7Days);
      }
    } catch (err) {
      console.error('Error fetching chart data:', err);
      // Fallback ke sample data
      const sampleData: ChartDataItem[] = [
        { name: '1 Jan', productivity: 45, financeBalance: 30, goalsProgress: 50, habitCompletion: 60 },
        { name: '2 Jan', productivity: 52, financeBalance: 45, goalsProgress: 50, habitCompletion: 65 },
        { name: '3 Jan', productivity: 48, financeBalance: 40, goalsProgress: 50, habitCompletion: 70 },
        { name: '4 Jan', productivity: 61, financeBalance: 60, goalsProgress: 50, habitCompletion: 75 },
        { name: '5 Jan', productivity: 55, financeBalance: 50, goalsProgress: 50, habitCompletion: 80 },
        { name: '6 Jan', productivity: 67, financeBalance: 70, goalsProgress: 50, habitCompletion: 85 },
        { name: '7 Jan', productivity: 72, financeBalance: 80, goalsProgress: 50, habitCompletion: 90 },
      ];
      setChartData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
    
    // Auto-refresh setiap 1 hari (24 jam)
    const interval = setInterval(fetchChartData, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800 w-full h-[400px] flex items-center justify-center animate-pulse">
        <div className="text-zinc-600 flex items-center gap-2">Memuat Analitik...</div>
      </div>
    );
  }

  const displayData = chartData.length > 0 ? chartData : [
    { name: 'No Data', productivity: 0, financeBalance: 0, goalsProgress: 0, habitCompletion: 0 }
  ];

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 p-4 rounded-xl shadow-2xl animate-in fade-in duration-200">
          <p className="text-zinc-400 text-xs mb-2 font-mono border-b border-zinc-700/50 pb-1">{label}</p>
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs py-0.5 animate-in slide-in-from-left duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-zinc-300 capitalize min-w-[80px]">{entry.name}</span>
              <span className="text-white font-mono font-bold ml-auto">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#09090b] p-6 rounded-3xl border border-zinc-800 w-full h-full flex flex-col hover:border-zinc-700 transition-colors duration-300 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 z-10">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Activity size={18} className="text-indigo-500" />
            Analitik Performa
          </h2>
          <p className="text-zinc-500 text-xs mt-1">Pelacakan harian multi-metrik</p>
        </div>
        <div className="flex gap-2">
             <div className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-400 font-mono border border-zinc-700">7 HARI</div>
             <button
               onClick={fetchChartData}
               disabled={loading}
               className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-[10px] text-zinc-400 hover:text-emerald-400 font-mono border border-zinc-700 transition-all disabled:opacity-50"
               title="Refresh data"
             >
               {loading ? 'LOADING...' : 'REFRESH'}
             </button>
        </div>
      </div>
      
      <div className="flex-1 w-full relative z-10"> 
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFinance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGoals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHabits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" strokeOpacity={0.5} />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#52525b', strokeWidth: 1, strokeDasharray: '4 4' }} />

            <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle" 
                iconSize={8}
                wrapperStyle={{ fontSize: '12px', paddingBottom: '10px', opacity: 0.8 }} 
            />

            <Area 
              name="Keuangan"
              type="monotone" 
              dataKey="financeBalance" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fill="url(#colorFinance)"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />

            <Area 
              name="Target"
              type="monotone" 
              dataKey="goalsProgress" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              fill="url(#colorGoals)"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />

            <Area 
              name="Kebiasaan"
              type="monotone" 
              dataKey="habitCompletion" 
              stroke="#f59e0b" 
              strokeWidth={2}
              fill="url(#colorHabits)"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductivityChart;