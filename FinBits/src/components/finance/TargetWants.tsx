// components/TargetWants.tsx (update dengan tambahan EditWants)
import React, { useState } from 'react';
import { Eye } from "lucide-react";
import AddWants from './AddWants';
import AddBudget from './AddBudget';
import DetailBudget from './DetailBudget';
import EditBudget from './EditBudget';
import EditWants from './EditWants';


interface WantItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

interface BudgetItem {
  id: number;
  amount: number;
  date: string;
}

export const TargetWants: React.FC = () => {
  const [showAddWants, setShowAddWants] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showDetailBudget, setShowDetailBudget] = useState(false);
  const [showEditBudget, setShowEditBudget] = useState(false);
  const [showEditWants, setShowEditWants] = useState(false);
  
  const [currentWant, setCurrentWant] = useState<WantItem>({
    id: 1,
    name: "Laptop ROG Strix G15",
    price: 30000000,
    imageUrl: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&q=80&w=300"
  });

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: 1, amount: 2000000, date: '2024-01-15' },
    { id: 2, amount: 1500000, date: '2024-01-20' },
    { id: 3, amount: 1500000, date: '2024-02-01' },
  ]);

  const [currentBudget, setCurrentBudget] = useState(5000000);
  const [editingBudgetItem, setEditingBudgetItem] = useState<BudgetItem | null>(null);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount).replace('Rp', 'Rp ');
  };

  const handleAddBudget = (amount: number, date: string) => {
    const newItem: BudgetItem = {
      id: Date.now(),
      amount,
      date
    };
    setBudgetItems(prev => [...prev, newItem]);
    setCurrentBudget(prev => prev + amount);
    setShowAddBudget(false);
  };

  const handleAddWant = (name: string, price: number, imageUrl: string) => {
    const newWant: WantItem = {
      id: Date.now(),
      name,
      price,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=300"
    };
    setCurrentWant(newWant);
    setShowAddWants(false);
  };

  const handleEditWant = (name: string, price: number, imageUrl: string) => {
    setCurrentWant(prev => ({
      ...prev,
      name,
      price,
      imageUrl
    }));
    setShowEditWants(false);
    // Tidak menutup detail budget, biarkan user tetap di detail
  };

  const handleEditBudgetClick = (item: BudgetItem) => {
    setEditingBudgetItem(item);
    setShowEditBudget(true);
  };

  const handleSaveEditBudget = (amount: number, date: string) => {
    if (editingBudgetItem) {
      const oldAmount = editingBudgetItem.amount;
      const updatedItem = { ...editingBudgetItem, amount, date };
      
      const newItems = budgetItems.map(item => 
        item.id === editingBudgetItem.id ? updatedItem : item
      );
      
      setBudgetItems(newItems);
      setCurrentBudget(prev => prev - oldAmount + amount);
      setShowEditBudget(false);
      setEditingBudgetItem(null);
    }
  };

  const handleDeleteBudget = (id: number) => {
    const itemToDelete = budgetItems.find(item => item.id === id);
    if (itemToDelete) {
      setBudgetItems(prev => prev.filter(item => item.id !== id));
      setCurrentBudget(prev => prev - itemToDelete.amount);
    }
  };

  const progress = (currentBudget / currentWant.price) * 100;

  return (
    <div className="text-white p-6 rounded-lg border border-gray-800 relative">
      <div className="absolute top-4 right-4">
        <button 
          onClick={() => setShowDetailBudget(true)}
          className="p-1.5 border border-gray-700 rounded-lg text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors"
        >
          <Eye size={16} />
        </button>
      </div>

      <h1 className="text-[#00b894] text-xl font-bold text-center mb-4 mt-2">
        Target Wants
      </h1>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-300">Progress</span>
          <span className="text-[#00b894] font-bold">{Math.min(100, progress).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-[#00b894] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, progress)}%` }}
          ></div>
        </div>
      </div>

      <div className="w-full flex justify-center mb-4">
        <div className="w-32 h-32 bg-white rounded-lg overflow-hidden flex items-center justify-center p-2">
          <img 
            src={currentWant.imageUrl}
            alt={currentWant.name}
            className="object-contain w-full h-full max-h-full"
          />
        </div>
      </div>

      <h2 className="text-center font-semibold mb-4 text-sm">
        {currentWant.name}
      </h2>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Harga :</span>
          <span className="font-semibold">{formatIDR(currentWant.price)}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Budget saat ini:</span>
          <span className="font-semibold">{formatIDR(currentBudget)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => setShowAddBudget(true)}
          className="flex-1 border border-gray-600 hover:bg-gray-800 hover:border-[#00b894] py-2 px-3 rounded-lg transition-all text-xs font-semibold"
        >
          Add Budget
        </button>
        
        <button 
          onClick={() => setShowAddWants(true)}
          className="flex-1 border border-gray-600 hover:bg-gray-800 hover:border-[#00b894] py-2 px-3 rounded-lg transition-all text-xs font-semibold"
        >
          Add Wants
        </button>
      </div>

      {/* Modals */}
      {showAddWants && (
        <AddWants 
          onClose={() => setShowAddWants(false)}
          onAdd={handleAddWant}
        />
      )}

      {showAddBudget && (
        <AddBudget 
          onClose={() => setShowAddBudget(false)}
          onAdd={handleAddBudget}
        />
      )}

      {showDetailBudget && (
        <DetailBudget 
          onClose={() => setShowDetailBudget(false)}
          wantItem={currentWant}
          budgetItems={budgetItems}
          currentBudget={currentBudget}
          onEditClick={handleEditBudgetClick}
          onDelete={handleDeleteBudget}
          onEditWant={handleEditWant}
        />
      )}

      {showEditBudget && editingBudgetItem && (
        <EditBudget 
          onClose={() => {
            setShowEditBudget(false);
            setEditingBudgetItem(null);
          }}
          onAdd={handleSaveEditBudget}
        />
      )}

      {showEditWants && (
        <EditWants 
          onClose={() => setShowEditWants(false)}
          onSave={handleEditWant}
          initialData={currentWant}
        />
      )}
    </div>
  );
};

export default TargetWants;