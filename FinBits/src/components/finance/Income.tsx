// components/IncomeCard.tsx
import React, { useState } from 'react';
import DetailIncome from './DetailIncome';
import AddIncome from './AddIncome';


interface IncomeItem {
  label: string;
  value: string;
}

const IncomeCard: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [incomeData, setIncomeData] = useState<IncomeItem[]>([
    { label: 'Freelance Website', value: 'Rp 2.000.000' },
    { label: 'Freelance App', value: 'Rp 3.000.000' },
    { label: 'Freelance UI UX', value: 'Rp 1.000.000' },
    { label: 'Uang Saku', value: 'Rp 250.000' },
    { label: 'Side Hustle', value: 'Rp 2.000.000' },
  ]);

  const handleAddIncome = (amount: string, source: string, date: string) => {
    const newIncome: IncomeItem = {
      label: source,
      value: `Rp ${parseInt(amount).toLocaleString('id-ID')}`
    };
    setIncomeData([...incomeData, newIncome]);
    setShowAddModal(false);
  };

  const totalIncome = incomeData.reduce((total, item) => {
    const amount = parseInt(item.value.replace(/[^0-9]/g, ''));
    return total + amount;
  }, 0);

  return (
    <div className="text-white p-6 rounded-lg border border-gray-800">
      <h2 className="text-xl font-bold text-[#00b894] mb-4">Income</h2>
      
      <div className="space-y-3 mb-6">
        {incomeData.slice(0, 6).map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-gray-300">{item.label} :</span>
            <span className="text-[#00b894] font-semibold">{item.value}</span>
          </div>
        ))}
        {incomeData.length > 6 && (
          <div className="text-gray-400 text-sm text-center">
            +{incomeData.length - 6} more items...
          </div>
        )}
      </div>

      <div className="flex justify-between items-center border-t border-gray-700 pt-4 mb-6">
        <span className="font-semibold">Total :</span>
        <span className="text-[#00b894] text-lg font-bold">
          Rp {totalIncome.toLocaleString('id-ID')}
        </span>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex-1 py-2 px-3 border border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-800 hover:border-[#00b894] transition-all"
        >
          Add Income
        </button>
        <button 
          onClick={() => setShowDetailModal(true)}
          className="flex-1 py-2 px-3 border border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-800 hover:border-[#00b894] transition-all"
        >
          Detail
        </button>
      </div>

      {/* Add Income Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50">
          <AddIncome 
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddIncome}
          />
        </div>
      )}

      {/* Detail Income Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50">
          <DetailIncome
            onClose={() => setShowDetailModal(false)}
            incomeItems={incomeData}
          />
        </div>
      )}
    </div>
  );
};

export default IncomeCard;