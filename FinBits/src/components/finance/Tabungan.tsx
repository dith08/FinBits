// components/Tabungan.tsx
import React, { useState } from 'react';
import AddTabungan from './AddTabungan';
import DetailTabungan from './DetailTabungan';


interface TabunganItem {
  id: number;
  amount: number;
  date: string;
}

export const Tabungan: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const [targetSaving] = useState(100000000);
  const [currentSaving, setCurrentSaving] = useState(5000000);
  const [tabunganItems, setTabunganItems] = useState<TabunganItem[]>([
    { id: 1, amount: 2000000, date: '2024-01-15' },
    { id: 2, amount: 1500000, date: '2024-01-20' },
    { id: 3, amount: 1500000, date: '2024-02-01' },
  ]);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount).replace('Rp', 'Rp ');
  };

  const handleAddTabungan = (amount: number, date: string) => {
    const newItem: TabunganItem = {
      id: Date.now(),
      amount,
      date
    };
    const newItems = [...tabunganItems, newItem];
    setTabunganItems(newItems);
    setCurrentSaving(prev => prev + amount);
  };

  const handleUpdateItems = (updatedItems: TabunganItem[]) => {
    setTabunganItems(updatedItems);
    // Recalculate current saving
    const total = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    setCurrentSaving(total);
  };

  const calculateProgress = () => {
    return Math.min(100, (currentSaving / targetSaving) * 100);
  };

  return (
    <div className="text-white p-6 rounded-lg border border-gray-800 ">
      <h1 className="text-[#00b894] text-xl font-bold mb-4">
        Tabungan / Saving Goal
      </h1>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Progress</span>
          <span className="text-[#00b894] font-bold">{calculateProgress().toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-[#00b894] h-2 rounded-full transition-all duration-300"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Target Tabungan :</span>
          <span className="font-semibold">{formatIDR(targetSaving)}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Tabungan saat ini :</span>
          <span className="font-semibold">{formatIDR(currentSaving)}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Sisa target :</span>
          <span className="font-semibold text-[#00b894]">
            {formatIDR(Math.max(0, targetSaving - currentSaving))}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex-1 border border-gray-600 hover:bg-gray-800 hover:border-[#00b894] py-2 px-3 rounded-lg transition-colors text-sm font-medium"
        >
          Add Tabungan
        </button>
        
        <button 
          onClick={() => setShowDetailModal(true)}
          className="flex-1 border border-gray-600 hover:bg-gray-800 hover:border-[#00b894] py-2 px-3 rounded-lg transition-colors text-sm font-medium"
        >
          Detail Tabungan
        </button>
      </div>

      {/* Add Tabungan Modal */}
      {showAddModal && (
        <AddTabungan 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddTabungan}
        />
      )}

      {/* Detail Tabungan Modal */}
      {showDetailModal && (
        <DetailTabungan 
          onClose={() => setShowDetailModal(false)}
          tabunganItems={tabunganItems}
          currentSaving={currentSaving}
          targetSaving={targetSaving}
          onUpdateItems={handleUpdateItems}
        />
      )}
    </div>
  );
};

export default Tabungan;