import apiInstance from './apiInstance';

export interface ScoringData {
  financeScore?: number;
  productivityScore?: number;
  timestamp?: string;
}

export interface ScoringBreakdown {
  finance: {
    totalIncome: number;
    totalExpense: number;
    totalSaving: number;
    savingRate: number;
    expenseRate: number;
    savingRateTarget: number;
    expenseRateTarget: number;
  };
  productivity: {
    habitCompletionRate: number;
    activeHabits: number;
    activeGoals: number;
    avgGoalsProgress: number;
  };
}

export const scoringService = {
  recalculateFinance: async (): Promise<ScoringData> => {
    try {
      const response = await apiInstance.post('/scoring/finance/recalculate');
      console.log('✅ Finance score recalculated:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error recalculating finance score:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  recalculateProductivity: async (date?: string): Promise<ScoringData> => {
    try {
      const payload = date ? { date } : {};
      const response = await apiInstance.post('/scoring/productivity/recalculate', payload);
      console.log('✅ Productivity score recalculated:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error recalculating productivity score:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  recalculateAll: async (date?: string): Promise<ScoringData> => {
    try {
      const payload = date ? { date } : {};
      const response = await apiInstance.post('/scoring/all/recalculate', payload);
      console.log('✅ All scores recalculated:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error recalculating all scores:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  getBreakdown: async (): Promise<ScoringBreakdown> => {
    try {
      const response = await apiInstance.get('/scoring/breakdown');
      console.log('✅ Scoring breakdown retrieved:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error getting scoring breakdown:', error.response?.data?.message || error.message);
      throw error;
    }
  },
};

export default scoringService;
