import { AiScannerMutasi } from "../components/finance/AiScannerMutasi";
import { BudgetAssistant } from "../components/finance/BudgetAssistant";
import { ExpenseCard } from "../components/finance/Expanse";
import IncomeCard from "../components/finance/Income";
import { Tabungan } from "../components/finance/Tabungan";
import { TargetWants } from "../components/finance/TargetWants";

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#10B981] mb-8">Finance</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-6">
            <IncomeCard />
            <Tabungan />
            <TargetWants />
          </div>

          <div className="space-y-6">
            <ExpenseCard />
            <AiScannerMutasi />
          </div>

          <div className="md:col-span-2 mt-4">
            <BudgetAssistant />
          </div>
        </div>
      </div>
    </div>
  );
}