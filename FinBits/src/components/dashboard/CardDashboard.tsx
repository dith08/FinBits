import FinanceCard from "../../ui/FinanceCard";
import GoalsCard from "../../ui/GoalsCard";
import HabitCard from "../../ui/HabitCard";
import ProductivityCard from "../../ui/ProductivityCard";

const CardDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductivityCard />
      <FinanceCard />
      <HabitCard />
      <GoalsCard />
    </div>
  );
};

export default CardDashboard;