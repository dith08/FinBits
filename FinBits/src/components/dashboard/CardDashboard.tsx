import { 
  ProductivityScoreCard, 
  FinanceScoreCard, 
  HabitCard, 
  GoalsStatCard 
} from './cards';

const CardDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductivityScoreCard />
      <FinanceScoreCard />
      <HabitCard />
      <GoalsStatCard />
    </div>
  );
};

export default CardDashboard;