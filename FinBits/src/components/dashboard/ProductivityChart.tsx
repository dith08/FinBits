// ProductivityChart.tsx - UPDATED DATA SERIES
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const data = [
  { name: '0', productivity: 20, financeBalance: 10, goalsProgress: 5, habitCompletion: 15 },
  { name: '4', productivity: 40, financeBalance: 25, goalsProgress: 15, habitCompletion: 30 },
  { name: '8', productivity: 30, financeBalance: 40, goalsProgress: 25, habitCompletion: 45 },
  { name: '12', productivity: 70, financeBalance: 30, goalsProgress: 60, habitCompletion: 50 },
  { name: '16', productivity: 50, financeBalance: 60, goalsProgress: 40, habitCompletion: 70 },
  { name: '20', productivity: 90, financeBalance: 45, goalsProgress: 80, habitCompletion: 85 },
  { name: '24', productivity: 60, financeBalance: 20, goalsProgress: 50, habitCompletion: 65 },
];

const ProductivityChart = () => {
  return (
    <div className="bg-[#121212] p-6 rounded-3xl border border-white/5 w-full h-[400px] flex flex-col">
      <h2 className="text-white font-semibold mb-4 text-center text-lg">Daily Performance Analysis</h2>
      
      <div className="flex-1 w-full"> 
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* Productivity - Emerald */}
              <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              {/* Finance - Blue */}
              <linearGradient id="colorFinance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              {/* Goals - Purple */}
              <linearGradient id="colorGoals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
              {/* Habits - Orange */}
              <linearGradient id="colorHabits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 12 }}
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ fontSize: '12px', padding: '2px 0' }}
            />

            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingBottom: '20px' }} />

            {/* Productivity Area */}
            <Area 
              type="monotone" 
              dataKey="productivity" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorProd)"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            {/* Finance Balance Area */}
            <Area 
              type="monotone" 
              dataKey="financeBalance" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorFinance)"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            {/* Goals Progress Area */}
            <Area 
              type="monotone" 
              dataKey="goalsProgress" 
              stroke="#a855f7" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorGoals)"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            {/* Habit Completion Area */}
            <Area 
              type="monotone" 
              dataKey="habitCompletion" 
              stroke="#f59e0b" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorHabits)"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductivityChart;