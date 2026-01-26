import CardDashboard from '../components/dashboard/CardDashboard';
import FinanceCardDashboard from '../components/dashboard/FinanceCardDashboard';
import GoalsCardDashboard from '../components/dashboard/GoalsCardDashboard';
import ProductivityChart from '../components/dashboard/ProductivityChart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-12 lg:pt-0">
        <h1 className="text-2xl md:text-3xl font-bold text-[#10B981]">Dashboard</h1>
        <div className="text-sm text-zinc-400 bg-zinc-800/50 px-3 py-1.5 rounded-full">
          {new Date().toLocaleDateString('id-ID', { 
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      </div>

      <section>
        <CardDashboard />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <div className="h-full">
            <ProductivityChart />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="h-full">
            <FinanceCardDashboard />
          </div>
        </div>
      </section>

      <section className="w-full">
        <GoalsCardDashboard />
      </section>
    </div>
  );
}