// Update ExpenseCard.tsx
import React, { useState } from 'react';
import AddExpense from './AddExpense';
import DetailExpense from './DetailExpense';


interface ExpenseItem {
  label: string;
  value: string;
}

export const ExpenseCard: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expenseData, setExpenseData] = useState<ExpenseItem[]>([
    { label: 'Langganan + Domain', value: 'Rp 1.000.000' },
    { label: 'Hosting + Domain', value: 'Rp 1.500.000' },
    { label: 'Jajan', value: 'Rp 100.000' },
    { label: 'Beli Peralatan', value: 'Rp 3.500.000' },
    { label: 'Self Reward', value: 'Rp 1.000.000' },
  ]);

  const handleAddExpense = (amount: string, purpose: string, date: string) => {
    const newExpense: ExpenseItem = {
      label: purpose,
      value: `Rp ${parseInt(amount).toLocaleString('id-ID')}`
    };
    setExpenseData([...expenseData, newExpense]);
    setShowAddModal(false);
  };

  const handleUpdateItems = (updatedItems: ExpenseItem[]) => {
    setExpenseData(updatedItems);
  };

  const totalExpense = expenseData.reduce((total, item) => {
    const amount = parseInt(item.value.replace(/[^0-9]/g, ''));
    return total + amount;
  }, 0);

  return (
    <div className="text-white p-6 rounded-lg border border-gray-800">
      <h2 className="text-xl font-bold text-[#ff4757] mb-4">Expense</h2>
      
      <div className="space-y-3 mb-6">
        {expenseData.slice(0, 6).map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-gray-300">{item.label} :</span>
            <span className="text-[#ff4757] font-semibold">{item.value}</span>
          </div>
        ))}
        {expenseData.length > 6 && (
          <div className="text-gray-400 text-sm text-center">
            +{expenseData.length - 6} more items...
          </div>
        )}
      </div>

      <div className="flex justify-between items-center border-t border-gray-700 pt-4 mb-6">
        <span className="font-semibold">Total :</span>
        <span className="text-[#ff4757] text-lg font-bold">
          Rp {totalExpense.toLocaleString('id-ID')}
        </span>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex-1 py-2 px-3 border border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-800 hover:border-[#ff4757] transition-all"
        >
          Add Expense
        </button>
        <button 
          onClick={() => setShowDetailModal(true)}
          className="flex-1 py-2 px-3 border border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-800 hover:border-[#ff4757] transition-all"
        >
          Detail
        </button>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <AddExpense 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddExpense}
        />
      )}

      {/* Detail Expense Modal */}
      {showDetailModal && (
        <DetailExpense
          onClose={() => setShowDetailModal(false)}
          expenseItems={expenseData}
          onUpdateItems={handleUpdateItems}
        />
      )}
    </div>
  );
};

export default ExpenseCard;