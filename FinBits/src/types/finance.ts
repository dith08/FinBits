export interface IncomeRequest {
    amount: number;
    description: string;
    category: string;
    date: string;
    notes?: string;
    source: string;
  }
  
  export interface IncomeResponse {
    message: string;
    data: {
      income_id: number;
      user_id: number;
      source: string;
      amount: number;
      date: string;
    };
  }

  export interface ExpenseRequest {
    amount: number;
    source: string;
    date: string;
    category: string;
  }
  
  export interface ExpenseResponse {
    message: string;
    data: {
      expense_id: number;
      user_id: number;
      source: string;
      amount: number;
      date: string;
      category: string;
    };
  }

  export interface WantRequest {
    item_name: string;
    price: number;
    budget_set: number;
    item_image?: File | string; 
  }
  
  export interface WantResponse {
    message: string;
    data: {
      want_id: number;
      user_id: number;
      item_name: string;
      image_url: string | null;
      price: string;
      budget_set: string;
      is_purchased: boolean;
      priority: number;
    };
  }
  export interface SavingRequest {
    goal_name: string;
    target_amount: number;
    target_date: string;
  }
  
  export interface SavingResponse {
    message: string;
    data: {
      saving_id: number;
      user_id: number;
      goal_name: string;
      target_amount: number;
      target_date: string;
      current_amount: number;
      is_active: boolean;
    };
  }

  export interface BudgetAssistanceRequest {
    income: number;
    role: string;
  }
  
  export interface BudgetAssistanceResponse {
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
  export interface ScanMutasiRequest {
    mutasi_rekening: File;
  }
  
  export interface ScanMutasiResponse {
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