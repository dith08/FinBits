import apiInstance from './apiInstance';

interface IncomeRequest {
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
  source: string;
}

interface ExpenseRequest {
  amount: number;
  source: string;
  date: string;
  category: string;
}

interface WantRequest {
  item_name: string;
  price: number;
  budget_set: number;
  item_image?: File | string;
  image_url?: string;
}

interface SavingRequest {
  goal_name: string;
  target_amount: number;
  target_date: string;
}

interface TopupRequest {
  amount: number;
  topup_date: string;
}

interface BudgetAssistanceRequest {
  income: number;
  role: string;
}

interface BudgetAssistanceResponse {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    month_year: string;
    income: number;
    needs_amount: number;
    wants_amount: number;
    saving_amount: number;
    daily_snack_limit: number;
    estimated_balance_30_days: number;
    needs_note: string;
    wants_note: string;
    saving_note: string;
    general_note: string;
  };
}

interface ScanMutasiResponse {
  success: boolean;
  message: string;
  analysis_report: {
    pola_boros: string;
    kebiasaan: string;
    kategori_bocor: string;
    saran_hemat: string;
    prediksi_saldo: string;
  };
  raw_text_detected: string;
}

export const incomeService = {
  getAll: async () => {
    const response = await apiInstance.get('/finance/income/all');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiInstance.get(`/finance/income/${id}`);
    return response.data;
  },

  add: async (data: IncomeRequest) => {
    const response = await apiInstance.post('/finance/income/add', data);
    return response.data;
  },

  edit: async (id: number, data: IncomeRequest) => {
    const response = await apiInstance.put(`/finance/income/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiInstance.delete(`/finance/income/delete/${id}`);
    return response.data;
  },
};

export const expenseService = {
  getAll: async () => {
    const response = await apiInstance.get('/finance/expense/all');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiInstance.get(`/finance/expense/${id}`);
    return response.data;
  },

  add: async (data: ExpenseRequest) => {
    const response = await apiInstance.post('/finance/expense/add', data);
    return response.data;
  },

  edit: async (id: number, data: ExpenseRequest) => {
    const response = await apiInstance.put(`/finance/expense/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiInstance.delete(`/finance/expense/delete/${id}`);
    return response.data;
  },
};

export const wantsService = {
  getAll: async () => {
    const response = await apiInstance.get('/finance/wants/all');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiInstance.get(`/finance/wants/${id}`);
    return response.data;
  },

  add: async (data: WantRequest) => {
    const formData = new FormData();
    formData.append('item_name', data.item_name);
    formData.append('price', data.price.toString());
    formData.append('budget_set', data.budget_set.toString());
    
    if (data.item_image && data.item_image instanceof File) {
      formData.append('item_image', data.item_image);
    }
    
    const response = await apiInstance.post('/finance/wants/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  edit: async (id: number, data: WantRequest) => {
    const formData = new FormData();
    formData.append('item_name', data.item_name);
    formData.append('price', data.price.toString());
    formData.append('budget_set', data.budget_set.toString());
    
    if (data.item_image && data.item_image instanceof File) {
      formData.append('item_image', data.item_image);
    }
    
    const response = await apiInstance.put(`/finance/wants/edit/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiInstance.delete(`/finance/wants/delete/${id}`);
    return response.data;
  },
};

export const savingService = {
  getAll: async () => {
    const response = await apiInstance.get('/finance/goal/all');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiInstance.get(`/finance/goal/${id}`);
    return response.data;
  },

  add: async (data: SavingRequest) => {
    const response = await apiInstance.post('/finance/goal', data);
    return response.data;
  },

  edit: async (id: number, data: SavingRequest) => {
    const response = await apiInstance.put(`/finance/goal/edit/${id}`, data);
    return response.data;
  },

  topup: async (id: number, data: TopupRequest) => {
    const response = await apiInstance.post(`/finance/goal/${id}/topup`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiInstance.delete(`/finance/goal/delete/${id}`);
    return response.data;
  },
};

export const aiFinanceService = {
  scanMutasi: async (file: File): Promise<ScanMutasiResponse> => {
    const formData = new FormData();
    formData.append('mutasi_rekening', file);
    
    const response = await apiInstance.post('/finance/scan/mutasi', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  generateBudget: async (data: BudgetAssistanceRequest): Promise<BudgetAssistanceResponse> => {
    const response = await apiInstance.post('/finance/generate', data);
    return response.data;
  },
};

export default {
  income: incomeService,
  expense: expenseService,
  wants: wantsService,
  saving: savingService,
  ai: aiFinanceService,
};
