import type { DashboardResponse } from '../types/dashboard';
import apiInstance from './apiInstance';

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardResponse> => {
    try {
      const response = await apiInstance.get<DashboardResponse>('/finance/dashboard');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal narik data dashboard, server lagi narik napas!';
    }
  }
};