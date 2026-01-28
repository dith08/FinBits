import React, { useState, useEffect } from 'react';
import { Eye, Loader2, Plus, RefreshCw, Target } from "lucide-react";
import AddWants from './AddWants';
import AddBudget from './AddBudget';
import DetailBudget from './DetailBudget';
import EditBudget from './EditBudget';
import EditWants from './EditWants';
import { wantsService } from '../../services/financeService';
import { AlertModal } from '../common';
import { useAlert } from '../../hooks';

interface WantItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  budgetSet: number;
  isPurchased: boolean;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { alert, showError, closeAlert } = useAlert();

  const [currentWant, setCurrentWant] = useState<WantItem | null>(null);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [editingBudgetItem, setEditingBudgetItem] = useState<BudgetItem | null>(null);

  const fetchWantsData = async () => {
    try {
      setLoading(true);
      const response = await wantsService.getAll();

      const BASE_URL = 'https://api-finbits.rplrus.com';

      const transformedData: WantItem[] = (response.data || []).map((item: Record<string, unknown>) => {
        let imageUrl = (item.image_url as string) || '';

        if (imageUrl && imageUrl.trim()) {
          imageUrl = imageUrl.replace(/^\/home\/[^/]+\/[^/]+\//, '');

          if (!imageUrl.startsWith('http')) {
            imageUrl = imageUrl.replace(/^\/+/, '');
            imageUrl = `${BASE_URL}/${imageUrl}`;
          }
        } else {
          imageUrl = "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=300";
        }

        return {
          id: item.want_id as number,
          name: item.item_name as string,
          price: Number(item.price),
          imageUrl: imageUrl,
          budgetSet: Number(item.budget_set),
          isPurchased: item.is_purchased as boolean,
        };
      });

      if (transformedData.length > 0) setCurrentWant(transformedData[0]);
    } catch (err: unknown) {
      let message = 'Gagal memuat data';
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as Record<string, unknown>).response;
        if (response && typeof response === 'object' && 'data' in response) {
          const data = (response as Record<string, unknown>).data;
          if (data && typeof data === 'object' && 'message' in data) {
            message = (data as Record<string, unknown>).message as string;
          }
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWantsData();
  }, []);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount).replace('Rp', 'Rp ');
  };

  const handleAddBudget = async (amount: number, date: string) => {
    if (!currentWant) return;

    try {
      const newBudgetSet = currentWant.budgetSet + amount;
      await wantsService.edit(currentWant.id, {
        item_name: currentWant.name,
        price: currentWant.price,
        budget_set: newBudgetSet,
      });

      const newItem: BudgetItem = {
        id: Date.now(),
        amount,
        date
      };
      setBudgetItems(prev => [...prev, newItem]);

      await fetchWantsData();
      setShowAddBudget(false);
    } catch (err: unknown) {
      let message = 'Gagal menambah budget';
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as Record<string, unknown>).response;
        if (response && typeof response === 'object' && 'data' in response) {
          const data = (response as Record<string, unknown>).data;
          if (data && typeof data === 'object' && 'message' in data) {
            message = (data as Record<string, unknown>).message as string;
          }
        }
      }
      console.error('Error adding budget:', err);
      showError(message);
    }
  };

  const handleAddWant = async (name: string, price: number, _imageUrl: string, imageFile?: File) => {
    try {
      await wantsService.add({
        item_name: name,
        price: Number(price),
        budget_set: 0.01,
        item_image: imageFile
      });

      await fetchWantsData();
      setShowAddWants(false);
    } catch (err: unknown) {
      let message = 'Gagal menambah wants';
      console.error('Full error object:', err);
      
      if (err && typeof err === 'object') {
        if ('response' in err) {
          const response = (err as Record<string, unknown>).response;
          if (response && typeof response === 'object') {
            console.error('Response data:', (response as Record<string, unknown>).data);
            if ('data' in response) {
              const data = (response as Record<string, unknown>).data;
              if (data && typeof data === 'object' && 'message' in data) {
                message = (data as Record<string, unknown>).message as string;
              }
            }
          }
        }
        if ('message' in err) {
          message = (err as Record<string, unknown>).message as string;
        }
      }
      console.error('Error adding want:', err);
      showError(message);
    }
  };

  const handleEditWant = async (name: string, price: number, _imageUrl: string, imageFile?: File | null) => {
    if (!currentWant) return;

    try {
      await wantsService.edit(currentWant.id, {
        item_name: name,
        price: Number(price),
        budget_set: currentWant.budgetSet,
        item_image: imageFile || undefined
      });

      await fetchWantsData();
      setShowEditWants(false);
    } catch (err: unknown) {
      let message = 'Gagal mengupdate wants';
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as Record<string, unknown>).response;
        if (response && typeof response === 'object' && 'data' in response) {
          const data = (response as Record<string, unknown>).data;
          if (data && typeof data === 'object' && 'message' in data) {
            message = (data as Record<string, unknown>).message as string;
          }
        }
      }
      console.error('Error editing want:', err);
      showError(message);
    }
  };

  const handleEditBudgetClick = (item: BudgetItem) => {
    setEditingBudgetItem(item);
    setShowEditBudget(true);
  };

  const handleSaveEditBudget = (amount: number, date: string) => {
    if (editingBudgetItem) {
      const updatedItem = { ...editingBudgetItem, amount, date };

      const newItems = budgetItems.map(item =>
        item.id === editingBudgetItem.id ? updatedItem : item
      );

      setBudgetItems(newItems);
      setShowEditBudget(false);
      setEditingBudgetItem(null);
    }
  };

  const handleDeleteBudget = (id: number) => {
    const itemToDelete = budgetItems.find(item => item.id === id);
    if (itemToDelete) {
      setBudgetItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleDeleteWant = async (id: number) => {
    try {
      await wantsService.delete(id);
      await fetchWantsData();
    } catch (err: unknown) {
      let message = 'Gagal menghapus wants';
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as Record<string, unknown>).response;
        if (response && typeof response === 'object' && 'data' in response) {
          const data = (response as Record<string, unknown>).data;
          if (data && typeof data === 'object' && 'message' in data) {
            message = (data as Record<string, unknown>).message as string;
          }
        }
      }
      console.error('Error deleting want:', err);
      showError(message);
    }
  };

  if (loading) {
    return (
      <div className="text-white p-6 rounded-lg border border-gray-800 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#00b894]" />
      </div>
    );
  }

  const progress = currentWant ? (currentWant.budgetSet / currentWant.price) * 100 : 0;

  return (
    <div className="relative overflow-hidden text-white p-8 rounded-[2rem] border border-gray-800 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-gray-700">

      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00b894]/10 rounded-full blur-[80px]"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]"></div>

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#00b894]/10 rounded-lg">
            <Target size={20} className="text-[#00b894]" />
          </div>
          <h1 className="bg-gradient-to-r from-[#00b894] to-[#55efc4] bg-clip-text text-transparent text-xl font-black uppercase tracking-widest">
            Target Keinginan
          </h1>
        </div>

        <button
          onClick={() => setShowDetailBudget(true)}
          className="p-2.5 bg-gray-800/40 border border-gray-700 rounded-xl text-gray-400 hover:text-[#00b894] hover:border-[#00b894]/50 transition-all duration-300 group shadow-lg"
        >
          <Eye size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {error && (
        <div className="relative z-10 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 text-red-400 text-sm flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span>{error}</span>
          </div>
          <button
            onClick={fetchWantsData}
            className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-lg transition-all font-bold"
          >
            <RefreshCw size={14} /> Coba lagi
          </button>
        </div>
      )}

      <div className="relative z-10">
        {!currentWant ? (
          <div className="text-center py-12 bg-gray-900/30 rounded-3xl border border-dashed border-gray-700">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-700 shadow-inner">
              <Plus size={32} className="text-gray-500" />
            </div>
            <p className="text-gray-400 mb-6 font-medium italic">Belum ada wishlist yang aktif.</p>
            <button
              onClick={() => setShowAddWants(true)}
              className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-[#00b894] hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-xl"
            >
              Mulai Tambah Target
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <span className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">Progres Menabung</span>
                <span className="text-[#00b894] text-2xl font-black tracking-tighter">
                  {Math.min(100, progress).toFixed(1)}<span className="text-xs ml-0.5">%</span>
                </span>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-4 p-1 border border-gray-700/30">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00b894] via-[#55efc4] to-blue-400 shadow-[0_0_20px_rgba(0,184,148,0.3)] transition-all duration-[1500ms] ease-out"
                  style={{ width: `${Math.min(100, progress)}%` }}
                ></div>
              </div>
            </div>

            <div className="w-full flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#00b894] to-blue-500 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-25 transition duration-500"></div>
                <div className="relative w-44 h-44 bg-white rounded-[2rem] overflow-hidden flex items-center justify-center p-4 shadow-2xl transform group-hover:rotate-2 transition duration-500">
                  <img
                    src={currentWant.imageUrl}
                    alt={currentWant.name}
                    className="object-contain w-full h-full transform group-hover:scale-110 transition duration-500"
                  />
                </div>
              </div>
            </div>

            <h2 className="text-center font-black text-xl mb-8 tracking-tight text-white drop-shadow-md">
              {currentWant.name}
            </h2>

            <div className="grid grid-cols-1 gap-4 mb-10">
              <div className="group bg-white/5 border border-gray-800 hover:border-gray-700 p-4 rounded-2xl flex justify-between items-center transition-all">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-[10px] uppercase font-bold">Harga</span>
                  <span className="font-mono font-black text-lg text-gray-200">{formatIDR(currentWant.price)}</span>
                </div>
                <div className="text-gray-600 group-hover:text-[#00b894] transition-colors">
                  💰
                </div>
              </div>

              <div className="group bg-white/5 border border-gray-800 hover:border-gray-700 p-4 rounded-2xl flex justify-between items-center transition-all">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-[10px] uppercase font-bold">Terkumpul</span>
                  <span className="font-mono font-black text-lg text-blue-400">{formatIDR(currentWant.budgetSet)}</span>
                </div>
                <div className="text-gray-600 group-hover:text-blue-400 transition-colors">
                  🏦
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowAddBudget(true)}
                className="flex-[2] bg-[#00b894] hover:bg-[#00a383] text-white py-4 rounded-2xl transition-all duration-300 text-xs  font-black uppercase tracking-tighter shadow-[0_10px_20px_rgba(0,184,148,0.2)] active:scale-95"
              >
                + Tambah Budget
              </button>

              <button
                onClick={() => setShowAddWants(true)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 py-3 sm:py-4 px-4 rounded-2xl transition-all duration-300 active:scale-95 group"
              >
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-tighter text-gray-400 group-hover:text-emerald-400 transition-colors">
                    Tambah
                  </span>
                  <span className="text-[12px] sm:text-sm font-black uppercase tracking-tighter text-white leading-none">
                    Target Baru
                  </span>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      {showAddWants && <AddWants onClose={() => setShowAddWants(false)} onAdd={handleAddWant} />}
      {showAddBudget && <AddBudget onClose={() => setShowAddBudget(false)} onAdd={handleAddBudget} />}
      {showDetailBudget && currentWant && (
        <DetailBudget
          onClose={() => setShowDetailBudget(false)}
          wantItem={currentWant}
          budgetItems={budgetItems}
          currentBudget={currentWant.budgetSet}
          onEditClick={handleEditBudgetClick}
          onDelete={handleDeleteBudget}
          onEditWant={handleEditWant}
          onDeleteWant={handleDeleteWant}
        />
      )}
      {showEditBudget && editingBudgetItem && (
        <EditBudget
          onClose={() => { setShowEditBudget(false); setEditingBudgetItem(null); }}
          onAdd={handleSaveEditBudget}
        />
      )}
      {showEditWants && currentWant && (
        <EditWants
          onClose={() => setShowEditWants(false)}
          onSave={handleEditWant}
          initialData={currentWant}
        />
      )}

      <AlertModal
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
    </div>
  );
};

export default TargetWants;
