import apiInstance from './apiInstance';
import type { BudgetAssistanceRequest, BudgetAssistanceResponse, ExpenseRequest, ExpenseResponse, IncomeRequest, IncomeResponse, SavingRequest, SavingResponse, ScanMutasiResponse, WantRequest, WantResponse } from '../types/finance';

export const financeService = {
  addIncome: async (data: IncomeRequest): Promise<IncomeResponse> => {
    try {
      const response = await apiInstance.post<IncomeResponse>('/finance/income/add', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal nambahin pemasukan nih!';
    }
  },

  getIncomes: async () => {
    try {
      const response = await apiInstance.get('/finance/income/all');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal ambil semua data!';
    }
  },

  getIncomeById: async (id: number) => {
    try {
      const response = await apiInstance.get(`/finance/income/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Data nggak ketemu nih!';
    }
  },

  updateIncome: async (id: number, data: Partial<IncomeRequest>) => {
    try {
      const response = await apiInstance.put(`/finance/income/edit/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal update data!';
    }
  },

  deleteIncome: async (id: number) => {
    try {
      const response = await apiInstance.delete(`/finance/income/delete/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal hapus data!';
    }
  },

  addExpense: async (data: ExpenseRequest): Promise<ExpenseResponse> => {
    try {
      const response = await apiInstance.post<ExpenseResponse>('/finance/expense/add', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal nambahin pengeluaran!';
    }
  },

  getExpenses: async () => {
    try {
      const response = await apiInstance.get('/finance/expense/all');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal ambil list pengeluaran!';
    }
  },

  getExpenseById: async (id: number) => {
    try {
      const response = await apiInstance.get(`/finance/expense/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Detail pengeluaran nggak ketemu!';
    }
  },

  updateExpense: async (id: number, data: Partial<ExpenseRequest>) => {
    try {
      const response = await apiInstance.put(`/finance/expense/edit/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal update pengeluaran!';
    }
  },

  deleteExpense: async (id: number) => {
    try {
      const response = await apiInstance.delete(`/finance/expense/delete/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal hapus pengeluaran!';
    }
  },

  addWant: async (data: WantRequest): Promise<WantResponse> => {
    try {
      const formData = new FormData();
      formData.append('item_name', data.item_name);
      formData.append('price', data.price.toString());
      formData.append('budget_set', data.budget_set.toString());
      if (data.item_image) {
        formData.append('item_image', data.item_image);
      }

      const response = await apiInstance.post<WantResponse>('finance/wants/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal nambahin barang impian!';
    }
  },

  getWants: async (id: number) => {
    try {
      const response = await apiInstance.get(`/finance/wants/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'data wants nggak ketemu!';
    }
  },

  updateWant: async (id: number, data: Partial<WantRequest>) => {
    try {
      const response = await apiInstance.put(`/finance/wants/edit/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal update wishlist!';
    }
  },

  deleteWant: async (id: number) => {
    try {
      const response = await apiInstance.delete(`/finance/wants/delete/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal hapus data!';
    }
  },
  addSavingGoal: async (data: SavingRequest): Promise<SavingResponse> => {
    try {
      const response = await apiInstance.post<SavingResponse>('/finance/goal', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal bikin target tabungan!';
    }
  },

  getSavingGoals: async () => {
    try {
      const response = await apiInstance.get('/finance/goal/all');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal ambil data tabungan!';
    }
  },

  getSavingGoalById: async (id: number) => {
    try {
      const response = await apiInstance.get(`/finance/goal/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Data tabungan nggak ketemu!';
    }
  },

  updateSavingGoal: async (id: number, data: Partial<SavingRequest>) => {
    try {
      const response = await apiInstance.put(`/finance/goal/edit/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal update tabungan!';
    }
  },

  deleteSavingGoal: async (id: number) => {
    try {
      const response = await apiInstance.delete(`/finance/goal/delete/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal hapus data!';
    }
  },
  
  addBudgetAssistance: async (data: BudgetAssistanceRequest): Promise<BudgetAssistanceResponse> => {
    try {
      const response = await apiInstance.post<BudgetAssistanceResponse>('/finance/generate', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal bikin rencana anggaran nih!';
    }
  },

  scanMutasi: async (file: File): Promise<ScanMutasiResponse> => {
    try {
      const formData = new FormData();
      formData.append('mutasi_rekening', file);

      const response = await apiInstance.post<ScanMutasiResponse>('/finance/scan/mutasi', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal nganalisis foto mutasi lu, coba pastiin fotonya jelas ya!';
    }
  }
};