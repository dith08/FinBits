import type { DashboardResponse, DashboardData } from '../types/dashboard';
import apiInstance from './apiInstance';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    return data?.message || data?.error || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

const createFallbackData = (): DashboardData => ({
  productivity: {
    score: 0,
    trend: '0%',
    graphData: [],
  },
  finance: {
    score: 0,
    pemasukan: 0,
    pengeluaran: 0,
    tabungan: 0,
    graphData: {
      income: [],
      expense: [],
    },
  },
  habit: {
    consistency: 0,
    graphData: [],
  },
  goals: {
    totalGoalsMessage: 'No goals set',
    averageProgress: 0,
    activeGoals: [],
    graphData: [],
  },
  multiLineChart: [],
});

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardResponse> => {
    try {
      const response = await apiInstance.get<DashboardResponse>('/finance/dashboard');
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Error fetching dashboard data:', error);
      
      const fallbackData: DashboardResponse = {
        message: 'Using cached data',
        data: createFallbackData(),
      };
      
      console.warn('⚠️ Using fallback dashboard data due to server error');
      return fallbackData;
    }
  }
};