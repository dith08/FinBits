import CardDashboard from '../components/dashboard/CardDashboard';
import FinanceCardDashboard from '../components/dashboard/FinanceCardDashboard';
import GoalsCardDashboard from '../components/dashboard/GoalsCardDashboard';
import ProductivityChart from '../components/dashboard/ProductivityChart';

export default function DashboardPage() {
  return (
    <>
      {/* BARIS 1: Top Stats Cards */}
      <section>
        <CardDashboard />
      </section>

      {/* BARIS 2: Chart & Finance Score */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductivityChart />
        </div>
        <div className="lg:col-span-1">
          <FinanceCardDashboard />
        </div>
      </section>

      {/* BARIS 3: Goals Card */}
      <section className="w-full">
        <GoalsCardDashboard />
      </section>
    </>
  );
}